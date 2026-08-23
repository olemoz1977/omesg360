function assertObject(value, name) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${name} must be an object`);
  }
}

function assertString(value, name) {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`${name} is required`);
  }
}

function languageField(locale) {
  if (locale === 'lt') return 'text_lt';
  if (locale === 'en') return 'text_en';
  throw new Error('locale must be lt or en');
}

function shuffled(values, random) {
  if (typeof random !== 'function') throw new Error('random must be a function');
  const result = values.map(value => ({ ...value }));
  for (let i = result.length - 1; i > 0; i -= 1) {
    const draw = random();
    if (!Number.isFinite(draw) || draw < 0 || draw >= 1) {
      throw new Error('random must return a number in [0, 1)');
    }
    const j = Math.floor(draw * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function validateReflectionConfigs({ stimulusSet, reasonMap, allowDraft = false }) {
  assertObject(stimulusSet, 'stimulusSet');
  assertObject(reasonMap, 'reasonMap');

  assertString(stimulusSet.stimulus_set_version, 'stimulusSet.stimulus_set_version');
  assertString(reasonMap.reason_map_version, 'reasonMap.reason_map_version');

  if (reasonMap.stimulus_set_version !== stimulusSet.stimulus_set_version) {
    throw new Error('reason map must be bound to the exact stimulus set version');
  }

  if (!allowDraft) {
    if (stimulusSet.lifecycle !== 'RELEASED') {
      throw new Error('stimulus set is not RELEASED');
    }
    if (reasonMap.lifecycle !== 'RELEASED') {
      throw new Error('reason map is not RELEASED');
    }
  }

  if (!Array.isArray(stimulusSet.pairs) || !Array.isArray(reasonMap.items)) {
    throw new Error('stimulus pairs and reason-map items are required');
  }

  return true;
}

export function buildReflectionItems({
  anchors,
  stimulusSet,
  reasonMap,
  locale = 'lt',
  random = Math.random,
  allowDraft = false,
} = {}) {
  validateReflectionConfigs({ stimulusSet, reasonMap, allowDraft });
  if (!Array.isArray(anchors)) throw new Error('anchors must be an array');

  const textField = languageField(locale);
  const pairsById = new Map(stimulusSet.pairs.map(pair => [pair.pair_id, pair]));
  const result = [];

  for (const anchor of anchors) {
    assertObject(anchor, 'anchor');
    assertString(anchor.pairId, 'anchor.pairId');
    assertString(anchor.rapidEventId, 'anchor.rapidEventId');

    if (anchor.anchorChoice !== 'A' && anchor.anchorChoice !== 'B') {
      throw new Error('anchor.anchorChoice must be A or B');
    }
    if (anchor.anchorSource !== 'PRIMARY' && anchor.anchorSource !== 'FIRST_COMPLETED_RETRY') {
      throw new Error('anchor.anchorSource is invalid');
    }

    const pair = pairsById.get(anchor.pairId);
    if (!pair) throw new Error(`pair not found in stimulus set: ${anchor.pairId}`);

    const reasonItems = reasonMap.items.filter(item =>
      item.pair_id === anchor.pairId && item.anchor_choice === anchor.anchorChoice
    );

    if (reasonItems.length !== 4) {
      throw new Error(`${anchor.pairId}/${anchor.anchorChoice} requires exactly four reason items`);
    }

    const unresolved = reasonItems.filter(item => item.interpretability_class === 'UNRESOLVED');
    const firstThree = reasonItems.filter(item => item.interpretability_class !== 'UNRESOLVED');

    if (unresolved.length !== 1 || firstThree.length !== 3) {
      throw new Error(`${anchor.pairId}/${anchor.anchorChoice} reason order contract is invalid`);
    }

    const ordered = [...shuffled(firstThree, random), unresolved[0]];
    const choiceLower = anchor.anchorChoice.toLowerCase();
    const assetId = pair[`asset_${choiceLower}_id`];
    const assetPath = pair[`asset_${choiceLower}_path`];

    assertString(assetId, 'anchor asset id');
    assertString(assetPath, 'anchor asset path');

    result.push({
      pairId: anchor.pairId,
      rapidEventId: anchor.rapidEventId,
      anchorChoice: anchor.anchorChoice,
      anchorSource: anchor.anchorSource,
      assetId,
      assetPath,
      stimulusSetVersion: stimulusSet.stimulus_set_version,
      reasonMapVersion: reasonMap.reason_map_version,
      options: ordered.map(item => ({
        reasonId: item.reason_id,
        text: item[textField],
        allowsLocalFreeText: item.allows_local_free_text === true,
      })),
    });
  }

  return result;
}

export function createLocalReflectionSelection({ item, reasonId, freeText = '' } = {}) {
  assertObject(item, 'item');
  assertString(reasonId, 'reasonId');
  const option = item.options?.find(candidate => candidate.reasonId === reasonId);
  if (!option) throw new Error('reasonId is not valid for this reflection item');

  const normalizedFreeText = typeof freeText === 'string' ? freeText.trim() : '';
  if (normalizedFreeText && !option.allowsLocalFreeText) {
    throw new Error('free text is only allowed for the Another reason option');
  }

  return {
    pairId: item.pairId,
    rapidEventId: item.rapidEventId,
    anchorChoice: item.anchorChoice,
    anchorSource: item.anchorSource,
    reasonId,
    reasonMapVersion: item.reasonMapVersion,
    localFreeText: option.allowsLocalFreeText && normalizedFreeText
      ? normalizedFreeText
      : null,
  };
}

function defaultEventId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  throw new Error('eventIdFactory is required when crypto.randomUUID is unavailable');
}

export function buildReflectionReasonEvent({
  selection,
  sessionId,
  stimulusSetVersion,
  consentVersion,
  protocolVersion,
  eventIdFactory = defaultEventId,
} = {}) {
  assertObject(selection, 'selection');
  assertString(sessionId, 'sessionId');
  assertString(stimulusSetVersion, 'stimulusSetVersion');
  assertString(consentVersion, 'consentVersion');
  assertString(protocolVersion, 'protocolVersion');

  const eventId = eventIdFactory();
  assertString(eventId, 'eventId');

  return {
    eventId,
    sessionId,
    rapidEventId: selection.rapidEventId,
    pairId: selection.pairId,
    stimulusSetVersion,
    reflectionAnchorChoice: selection.anchorChoice,
    reflectionAnchorSource: selection.anchorSource,
    reasonId: selection.reasonId,
    reasonMapVersion: selection.reasonMapVersion,
    consentVersion,
    protocolVersion,
  };
}

export function createReflectionController(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('at least one reflection item is required');
  }

  let index = 0;
  const selections = new Map();

  return {
    get index() {
      return index;
    },

    get total() {
      return items.length;
    },

    current() {
      return items[index];
    },

    currentSelection() {
      return selections.get(items[index].pairId) || null;
    },

    select(reasonId, freeText = '') {
      const selection = createLocalReflectionSelection({
        item: items[index],
        reasonId,
        freeText,
      });
      selections.set(items[index].pairId, selection);
      return selection;
    },

    canAdvance() {
      return selections.has(items[index].pairId);
    },

    next() {
      if (!this.canAdvance()) throw new Error('select a reason before continuing');
      if (index >= items.length - 1) return false;
      index += 1;
      return true;
    },

    previous() {
      if (index === 0) return false;
      index -= 1;
      return true;
    },

    isComplete() {
      return selections.size === items.length;
    },

    complete() {
      if (!this.isComplete()) throw new Error('all reflection items must be answered');
      return items.map(item => selections.get(item.pairId));
    },
  };
}
