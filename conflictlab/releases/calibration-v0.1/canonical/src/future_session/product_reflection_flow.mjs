import { createLocalReflectionSelection } from './reflection_model.mjs';

function requireItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('at least one reflection item is required');
  }
}

function requireTime(value, name) {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${name} must be a non-negative finite number`);
  }
}

function elapsedMs(start, end) {
  requireTime(start, 'start');
  requireTime(end, 'end');
  if (end < start) throw new Error('response time cannot move backwards');
  return Math.floor(end - start);
}

function createRecord(item) {
  return {
    pairId: item.pairId,
    rapidEventId: item.rapidEventId,
    anchorChoice: item.anchorChoice,
    anchorSource: item.anchorSource,
    reasonMapVersion: item.reasonMapVersion,
    reasonStatus: 'NOT_REACHED',
    reasonId: null,
    localFreeText: null,
    reasonResponseLatencyMs: null,
    intensityStatus: 'NOT_REACHED',
    intensity: null,
    intensityResponseLatencyMs: null,
  };
}

export function createProductReflectionController(items, {
  now = () => performance.now(),
} = {}) {
  requireItems(items);
  if (typeof now !== 'function') throw new Error('now must be a function');

  let index = 0;
  let stage = 'REASON';
  let stageReadyAt = null;
  let reflectionStartedAt = null;
  let reflectionCompletedAt = null;
  const records = new Map(items.map(item => [item.pairId, createRecord(item)]));

  function currentItem() {
    return stage === 'COMPLETE' ? null : items[index];
  }

  function currentRecord() {
    const item = currentItem();
    return item ? records.get(item.pairId) : null;
  }

  function requireStage(expected) {
    if (stage !== expected) throw new Error(`expected ${expected} stage, got ${stage}`);
  }

  function requireReady() {
    if (stageReadyAt === null) throw new Error(`${stage} stage is not visually ready`);
  }

  function advanceItem(atMs) {
    requireTime(atMs, 'atMs');
    stageReadyAt = null;
    if (index >= items.length - 1) {
      stage = 'COMPLETE';
      reflectionCompletedAt = atMs;
      return;
    }
    index += 1;
    stage = 'REASON';
  }

  function snapshot() {
    const total = reflectionStartedAt !== null && reflectionCompletedAt !== null
      ? elapsedMs(reflectionStartedAt, reflectionCompletedAt)
      : null;

    return {
      stage,
      index,
      total: items.length,
      reflectionTotalElapsedMs: total,
      responses: items.map(item => ({ ...records.get(item.pairId) })),
    };
  }

  return {
    get stage() { return stage; },
    get index() { return index; },
    get total() { return items.length; },

    current() {
      return currentItem();
    },

    currentResponse() {
      const record = currentRecord();
      return record ? { ...record } : null;
    },

    markStageReady(atMs = now()) {
      if (stage === 'COMPLETE') throw new Error('reflection is already complete');
      requireTime(atMs, 'atMs');
      if (stageReadyAt === null) stageReadyAt = atMs;
      if (reflectionStartedAt === null) reflectionStartedAt = atMs;
      return { stage, pairId: currentItem().pairId };
    },

    selectReason(reasonId, freeText = '', atMs = now()) {
      requireStage('REASON');
      requireReady();
      requireTime(atMs, 'atMs');
      const item = currentItem();
      const selection = createLocalReflectionSelection({ item, reasonId, freeText });
      const record = currentRecord();
      record.reasonStatus = 'ANSWERED';
      record.reasonId = selection.reasonId;
      record.localFreeText = selection.localFreeText;
      record.reasonResponseLatencyMs = elapsedMs(stageReadyAt, atMs);
      stage = 'INTENSITY';
      stageReadyAt = null;
      return { ...record };
    },

    skipReason(atMs = now()) {
      requireStage('REASON');
      requireReady();
      requireTime(atMs, 'atMs');
      const record = currentRecord();
      record.reasonStatus = 'SKIPPED';
      record.intensityStatus = 'NOT_REACHED';
      advanceItem(atMs);
      return snapshot();
    },

    selectIntensity(value, atMs = now()) {
      requireStage('INTENSITY');
      requireReady();
      requireTime(atMs, 'atMs');
      if (!Number.isInteger(value) || value < 1 || value > 5) {
        throw new Error('intensity must be an integer from 1 to 5');
      }
      const record = currentRecord();
      record.intensityStatus = 'ANSWERED';
      record.intensity = value;
      record.intensityResponseLatencyMs = elapsedMs(stageReadyAt, atMs);
      advanceItem(atMs);
      return snapshot();
    },

    skipIntensity(atMs = now()) {
      requireStage('INTENSITY');
      requireReady();
      requireTime(atMs, 'atMs');
      const record = currentRecord();
      record.intensityStatus = 'SKIPPED';
      advanceItem(atMs);
      return snapshot();
    },

    isComplete() {
      return stage === 'COMPLETE';
    },

    snapshot,

    complete() {
      if (stage !== 'COMPLETE') throw new Error('reflection is not complete');
      return snapshot();
    },
  };
}
