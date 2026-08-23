export const MAX_BLOCK_ATTEMPTS = 3;

function defaultNow() {
  return performance.now();
}

function defaultEventId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  throw new Error('eventIdFactory is required when crypto.randomUUID is unavailable');
}

function floorMs(value) {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error('duration must be a non-negative finite number');
  }
  return Math.floor(value);
}

function assertPositiveInteger(value, name) {
  if (!Number.isInteger(value) || value < 1) {
    throw new Error(`${name} must be a positive integer`);
  }
}

function assertPair(pair, index) {
  if (!pair || typeof pair.pairId !== 'string' || !pair.pairId) {
    throw new Error(`pairs[${index}].pairId is required`);
  }
  if (typeof pair.assetAId !== 'string' || !pair.assetAId ||
      typeof pair.assetBId !== 'string' || !pair.assetBId) {
    throw new Error(`pairs[${index}] stable assetAId and assetBId are required`);
  }
  if (pair.assetAId === pair.assetBId) {
    throw new Error(`pairs[${index}] assetAId and assetBId must differ`);
  }
  if (!pair.assetAPosition || !pair.assetBPosition) {
    throw new Error(`pairs[${index}] asset positions are required`);
  }
  if (pair.assetAPosition === pair.assetBPosition) {
    throw new Error(`pairs[${index}] asset positions must differ`);
  }
}

export function exposureCountsFromEvents(events) {
  const counts = {};
  for (const event of events || []) {
    if (!event.pairPresented) continue;
    counts[event.pairId] = (counts[event.pairId] || 0) + 1;
  }
  return counts;
}

export function deriveReflectionAnchors(events) {
  const byPair = new Map();

  for (const event of events || []) {
    if (!byPair.has(event.pairId)) byPair.set(event.pairId, []);
    byPair.get(event.pairId).push(event);
  }

  const anchors = [];

  for (const [pairId, pairEvents] of byPair.entries()) {
    const completed = pairEvents
      .filter(e => e.pairPresented && (e.choice === 'A' || e.choice === 'B'))
      .sort((a, b) =>
        a.blockAttemptNumber - b.blockAttemptNumber ||
        a.blockElapsedMsAtEvent - b.blockElapsedMsAtEvent
      );

    const primary = completed.find(e => e.blockAttemptNumber === 1);
    if (primary) {
      anchors.push({
        pairId,
        rapidEventId: primary.eventId,
        anchorChoice: primary.choice,
        anchorSource: 'PRIMARY',
      });
      continue;
    }

    const retry = completed.find(e => e.blockAttemptNumber > 1);
    if (retry) {
      anchors.push({
        pairId,
        rapidEventId: retry.eventId,
        anchorChoice: retry.choice,
        anchorSource: 'FIRST_COMPLETED_RETRY',
      });
    }
  }

  return anchors;
}

export class RapidBlockAttempt {
  constructor({
    sessionId,
    blockId,
    blockAttemptId,
    attemptNumber,
    blockBudgetMs,
    pairs,
    protocolVersion,
    stimulusSetVersion,
    isTraining = false,
    priorExposureCounts = {},
    now = defaultNow,
    eventIdFactory = defaultEventId,
  }) {
    assertPositiveInteger(attemptNumber, 'attemptNumber');
    if (attemptNumber > MAX_BLOCK_ATTEMPTS) {
      throw new Error(`attemptNumber cannot exceed ${MAX_BLOCK_ATTEMPTS}`);
    }
    assertPositiveInteger(blockBudgetMs, 'blockBudgetMs');
    if (!Array.isArray(pairs) || pairs.length !== 3) {
      throw new Error('future-session rapid block requires exactly 3 pairs');
    }
    pairs.forEach(assertPair);

    this.sessionId = sessionId;
    this.blockId = blockId;
    this.blockAttemptId = blockAttemptId;
    this.attemptNumber = attemptNumber;
    this.blockBudgetMs = blockBudgetMs;
    this.pairs = pairs.map(pair => ({ ...pair }));
    this.protocolVersion = protocolVersion;
    this.stimulusSetVersion = stimulusSetVersion;
    this.isTraining = Boolean(isTraining);
    this.exposureCounts = { ...priorExposureCounts };
    this.now = now;
    this.eventIdFactory = eventIdFactory;

    this.currentIndex = 0;
    this.blockStartMs = null;
    this.currentPairReady = null;
    this.pageHiddenDuringBlock = false;
    this.events = [];
    this.done = false;
    this.timedOut = false;
    this.finalElapsedMs = null;
  }

  markPageHidden() {
    this.pageHiddenDuringBlock = true;
  }

  markPairReady(atMs = this.now()) {
    this.#assertOpen();
    if (this.currentPairReady) {
      throw new Error('current pair is already ready');
    }

    if (this.blockStartMs === null) {
      this.blockStartMs = atMs;
    }

    const elapsedPrecise = atMs - this.blockStartMs;
    if (elapsedPrecise >= this.blockBudgetMs) {
      return this.expire(atMs);
    }

    const pair = this.pairs[this.currentIndex];
    const exposureNumber = (this.exposureCounts[pair.pairId] || 0) + 1;
    this.exposureCounts[pair.pairId] = exposureNumber;

    this.currentPairReady = {
      atMs,
      elapsedPrecise,
      remainingBudgetPrecise: this.blockBudgetMs - elapsedPrecise,
      exposureNumber,
    };

    return {
      status: 'READY',
      pairId: pair.pairId,
      positionInBlock: this.currentIndex + 1,
      pairExposureNumber: exposureNumber,
      remainingBudgetMs: floorMs(this.currentPairReady.remainingBudgetPrecise),
    };
  }

  recordChoice(choice, atMs = this.now()) {
    this.#assertOpen();
    if (choice !== 'A' && choice !== 'B') {
      throw new Error('choice must be A or B');
    }
    if (!this.currentPairReady) {
      throw new Error('pair is not ready');
    }

    const elapsedPrecise = atMs - this.blockStartMs;
    if (elapsedPrecise >= this.blockBudgetMs) {
      return this.expire(atMs);
    }

    const pair = this.pairs[this.currentIndex];
    const event = this.#buildEvent({
      pair,
      positionInBlock: this.currentIndex + 1,
      choice,
      pairPresented: true,
      exposureNumber: this.currentPairReady.exposureNumber,
      pairReadyElapsedMs: floorMs(this.currentPairReady.elapsedPrecise),
      remainingBudgetAtPairStartMs: floorMs(this.currentPairReady.remainingBudgetPrecise),
      visualChoiceLatencyMs: floorMs(atMs - this.currentPairReady.atMs),
      blockElapsedMsAtEvent: floorMs(elapsedPrecise),
    });

    this.events.push(event);
    this.currentIndex += 1;
    this.currentPairReady = null;

    if (this.currentIndex === this.pairs.length) {
      this.done = true;
      this.finalElapsedMs = floorMs(elapsedPrecise);
      return { status: 'COMPLETE', event, next: 'REFLECTION' };
    }

    return { status: 'CHOICE_RECORDED', event, next: 'PAIR' };
  }

  expire(atMs = this.now()) {
    this.#assertOpen();
    if (this.blockStartMs === null) {
      throw new Error('block clock has not started');
    }

    const elapsedPrecise = atMs - this.blockStartMs;
    if (elapsedPrecise < this.blockBudgetMs) {
      throw new Error('cannot expire block before monotonic deadline');
    }

    const timeoutEvents = [];

    for (let index = this.currentIndex; index < this.pairs.length; index += 1) {
      const pair = this.pairs[index];
      const isCurrent = index === this.currentIndex;
      const ready = isCurrent ? this.currentPairReady : null;
      const pairPresented = Boolean(ready);

      const event = this.#buildEvent({
        pair,
        positionInBlock: index + 1,
        choice: 'timeout',
        pairPresented,
        exposureNumber: pairPresented ? ready.exposureNumber : null,
        pairReadyElapsedMs: pairPresented ? floorMs(ready.elapsedPrecise) : null,
        remainingBudgetAtPairStartMs: pairPresented ? floorMs(ready.remainingBudgetPrecise) : null,
        visualChoiceLatencyMs: null,
        blockElapsedMsAtEvent: this.blockBudgetMs,
      });

      timeoutEvents.push(event);
      this.events.push(event);
    }

    this.done = true;
    this.timedOut = true;
    this.finalElapsedMs = this.blockBudgetMs;
    this.currentPairReady = null;

    return {
      status: 'TIMEOUT',
      events: timeoutEvents,
      next: this.attemptNumber < MAX_BLOCK_ATTEMPTS ? 'RETRY' : 'REFLECTION',
    };
  }

  getSummary() {
    if (!this.done) throw new Error('attempt is not complete');

    return {
      blockAttemptId: this.blockAttemptId,
      blockId: this.blockId,
      sessionId: this.sessionId,
      blockAttemptNumber: this.attemptNumber,
      blockBudgetMs: this.blockBudgetMs,
      blockElapsedMsFinal: this.finalElapsedMs,
      blockTimedOut: this.timedOut,
      pageHiddenDuringBlock: this.pageHiddenDuringBlock,
      isTraining: this.isTraining,
      protocolVersion: this.protocolVersion,
      stimulusSetVersion: this.stimulusSetVersion,
    };
  }

  #buildEvent({
    pair,
    positionInBlock,
    choice,
    pairPresented,
    exposureNumber,
    pairReadyElapsedMs,
    remainingBudgetAtPairStartMs,
    visualChoiceLatencyMs,
    blockElapsedMsAtEvent,
  }) {
    return {
      eventId: this.eventIdFactory(),
      sessionId: this.sessionId,
      blockId: this.blockId,
      blockAttemptId: this.blockAttemptId,
      blockAttemptNumber: this.attemptNumber,
      pairId: pair.pairId,
      stimulusSetVersion: this.stimulusSetVersion,
      positionInBlock,
      pairExposureNumber: exposureNumber,
      assetAId: pair.assetAId,
      assetBId: pair.assetBId,
      assetAPosition: pair.assetAPosition,
      assetBPosition: pair.assetBPosition,
      pairPresented,
      pairReadyElapsedMs,
      choice,
      visualChoiceLatencyMs,
      blockElapsedMsAtEvent,
      remainingBudgetAtPairStartMs,
      pageHiddenBeforeEvent: this.pageHiddenDuringBlock,
      isTraining: this.isTraining,
      protocolVersion: this.protocolVersion,
    };
  }

  #assertOpen() {
    if (this.done) throw new Error('attempt is already complete');
  }
}
