import {
  MAX_BLOCK_ATTEMPTS,
  RapidBlockAttempt,
  deriveReflectionAnchors,
  exposureCountsFromEvents,
} from './rapid_block_core.mjs';

function requireString(value, name) {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`${name} is required`);
  }
}

function defaultUuid() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  throw new Error('UUID factory is required when crypto.randomUUID is unavailable');
}

function validateSessionPlan(sessionPlan) {
  if (!sessionPlan || !Array.isArray(sessionPlan.pairs) || sessionPlan.pairs.length !== 3) {
    throw new Error('sessionPlan must contain exactly three pairs');
  }

  for (const pair of sessionPlan.pairs) {
    requireString(pair.pairId, 'pair.pairId');
    requireString(pair.assetAId, 'pair.assetAId');
    requireString(pair.assetBId, 'pair.assetBId');
    if (!['top', 'bottom'].includes(pair.assetAPosition) ||
        !['top', 'bottom'].includes(pair.assetBPosition) ||
        pair.assetAPosition === pair.assetBPosition) {
      throw new Error('sessionPlan pair positions must be distinct top/bottom values');
    }
  }
}

export class FutureSessionOrchestrator {
  constructor({
    sessionId,
    blockId,
    sessionPlan,
    blockBudgetMs,
    protocolVersion,
    stimulusSetVersion,
    isTraining = false,
    now = () => performance.now(),
    eventIdFactory = defaultUuid,
    blockAttemptIdFactory = defaultUuid,
  } = {}) {
    requireString(sessionId, 'sessionId');
    requireString(blockId, 'blockId');
    requireString(protocolVersion, 'protocolVersion');
    requireString(stimulusSetVersion, 'stimulusSetVersion');
    validateSessionPlan(sessionPlan);

    if (!Number.isInteger(blockBudgetMs) || blockBudgetMs < 1) {
      throw new Error('blockBudgetMs must be a positive integer');
    }
    if (typeof now !== 'function') throw new Error('now must be a function');
    if (typeof eventIdFactory !== 'function') throw new Error('eventIdFactory must be a function');
    if (typeof blockAttemptIdFactory !== 'function') {
      throw new Error('blockAttemptIdFactory must be a function');
    }

    this.sessionId = sessionId;
    this.blockId = blockId;
    this.sessionPlan = {
      ...sessionPlan,
      pairs: sessionPlan.pairs.map(pair => ({ ...pair })),
    };
    this.blockBudgetMs = blockBudgetMs;
    this.protocolVersion = protocolVersion;
    this.stimulusSetVersion = stimulusSetVersion;
    this.isTraining = Boolean(isTraining);
    this.now = now;
    this.eventIdFactory = eventIdFactory;
    this.blockAttemptIdFactory = blockAttemptIdFactory;

    this.phase = 'READY';
    this.activeAttempt = null;
    this.attempts = [];
    this.events = [];
    this.summaries = [];
  }

  startAttempt() {
    if (this.phase !== 'READY' && this.phase !== 'RETRY_READY') {
      throw new Error(`cannot start attempt while phase=${this.phase}`);
    }

    const attemptNumber = this.attempts.length + 1;
    if (attemptNumber > MAX_BLOCK_ATTEMPTS) {
      throw new Error('maximum block attempts reached');
    }

    const attempt = new RapidBlockAttempt({
      sessionId: this.sessionId,
      blockId: this.blockId,
      blockAttemptId: this.blockAttemptIdFactory(),
      attemptNumber,
      blockBudgetMs: this.blockBudgetMs,
      pairs: this.sessionPlan.pairs,
      protocolVersion: this.protocolVersion,
      stimulusSetVersion: this.stimulusSetVersion,
      isTraining: this.isTraining,
      priorExposureCounts: exposureCountsFromEvents(this.events),
      now: this.now,
      eventIdFactory: this.eventIdFactory,
    });

    this.activeAttempt = attempt;
    this.attempts.push(attempt);
    this.phase = 'RAPID';

    return {
      attemptNumber,
      pair: this.currentPair(),
    };
  }

  currentPair() {
    if (this.phase !== 'RAPID' || !this.activeAttempt || this.activeAttempt.done) {
      return null;
    }
    return { ...this.sessionPlan.pairs[this.activeAttempt.currentIndex] };
  }

  markPairReady(atMs = this.now()) {
    this.#requireRapid();
    const result = this.activeAttempt.markPairReady(atMs);
    return this.activeAttempt.done ? this.#settleResult(result) : result;
  }

  recordChoice(choice, atMs = this.now()) {
    this.#requireRapid();
    const result = this.activeAttempt.recordChoice(choice, atMs);
    return this.#settleResult(result);
  }

  expire(atMs = this.now()) {
    this.#requireRapid();
    const result = this.activeAttempt.expire(atMs);
    return this.#settleResult(result);
  }

  markPageHidden() {
    if (this.phase === 'RAPID' && this.activeAttempt && !this.activeAttempt.done) {
      this.activeAttempt.markPageHidden();
    }
  }

  reflectionAnchors() {
    if (this.isTraining) {
      throw new Error('training blocks do not produce reflection anchors');
    }
    if (this.phase !== 'REFLECTION_READY' && this.phase !== 'COMPLETE') {
      throw new Error('reflection anchors are available only after the rapid block is terminal');
    }
    return deriveReflectionAnchors(this.events);
  }

  markReflectionComplete() {
    if (this.isTraining) {
      throw new Error('training blocks do not have reflection');
    }
    if (this.phase !== 'REFLECTION_READY') {
      throw new Error('reflection is not ready');
    }
    this.phase = 'COMPLETE';
  }

  telemetry() {
    return {
      sessionId: this.sessionId,
      blockId: this.blockId,
      phase: this.phase,
      isTraining: this.isTraining,
      attempts: this.summaries.map(summary => ({ ...summary })),
      events: this.events.map(event => ({ ...event })),
    };
  }

  #requireRapid() {
    if (this.phase !== 'RAPID' || !this.activeAttempt || this.activeAttempt.done) {
      throw new Error('no active rapid attempt');
    }
  }

  #settleResult(result) {
    if (!this.activeAttempt.done) return result;

    const summary = this.activeAttempt.getSummary();
    this.summaries.push(summary);
    this.events.push(...this.activeAttempt.events.map(event => ({ ...event })));

    if (result.status === 'COMPLETE') {
      this.phase = this.isTraining ? 'COMPLETE' : 'REFLECTION_READY';
    } else if (result.status === 'TIMEOUT') {
      if (result.next === 'RETRY') {
        this.phase = 'RETRY_READY';
      } else {
        this.phase = this.isTraining ? 'TRAINING_RESTART_REQUIRED' : 'REFLECTION_READY';
      }
    } else {
      throw new Error(`terminal attempt returned unsupported status: ${result.status}`);
    }

    return {
      ...result,
      phase: this.phase,
    };
  }
}
