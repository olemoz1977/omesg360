function requireCondition(condition, message) {
  if (!condition) throw new Error(message);
}

function drawIndex(length, rng) {
  requireCondition(Number.isInteger(length) && length > 0, 'length must be positive');
  const value = rng();
  requireCondition(Number.isFinite(value) && value >= 0 && value < 1, 'rng must return [0,1)');
  return Math.floor(value * length);
}

function shuffled(values, rng) {
  const out = [...values];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = drawIndex(i + 1, rng);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function indexPairs(stimulusSet) {
  requireCondition(stimulusSet?.stimulus_set_version, 'stimulus_set_version is required');
  requireCondition(Array.isArray(stimulusSet.pairs), 'stimulus pairs are required');
  return new Map(stimulusSet.pairs.map(pair => [pair.pair_id, pair]));
}

export function validatePresentationConfig(protocol, stimulusSet) {
  requireCondition(protocol?.schema === 'conflictlab.rapid-presentation.v1', 'unsupported rapid presentation schema');
  requireCondition(protocol.lifecycle === 'DRAFT' || protocol.lifecycle === 'RELEASED', 'invalid protocol lifecycle');
  requireCondition(protocol.stimulus_set_version === stimulusSet.stimulus_set_version, 'stimulus-set version mismatch');
  requireCondition(protocol.session_policy?.rapid_blocks_per_session === 1, 'F2 requires one rapid block per session');
  requireCondition(protocol.session_policy?.pairs_per_block === 3, 'F2 requires exactly three pairs per block');
  requireCondition(protocol.timing?.block_budget_ms === 6000, 'F2 pilot budget must be 6000 ms');
  requireCondition(protocol.screen_position_policy?.layout === 'VERTICAL_TOP_BOTTOM_ALL_VIEWPORTS', 'F2 requires top/bottom layout');

  const forms = protocol.forms;
  requireCondition(Array.isArray(forms) && forms.length === 2, 'F2 requires exactly two complementary forms');

  const pairIndex = indexPairs(stimulusSet);
  const seen = new Set();
  for (const form of forms) {
    requireCondition(typeof form.form_id === 'string' && form.form_id, 'form_id is required');
    requireCondition(Array.isArray(form.pair_ids) && form.pair_ids.length === 3, `${form.form_id} must contain 3 pairs`);
    for (const pairId of form.pair_ids) {
      requireCondition(pairIndex.has(pairId), `${form.form_id} references unknown pair ${pairId}`);
      requireCondition(!seen.has(pairId), `pair ${pairId} appears in more than one form`);
      seen.add(pairId);
    }
  }

  requireCondition(seen.size === stimulusSet.pairs.length, 'forms must cover every stimulus pair exactly once');
  requireCondition(seen.size === 6, 'F2 stimulus set must contain exactly six pairs');

  return { pairIndex, forms };
}

function buildSessionPlan({ form, pairIndex, aTopCount, rng }) {
  requireCondition(aTopCount === 1 || aTopCount === 2, 'aTopCount must be 1 or 2');

  const orderedIds = shuffled(form.pair_ids, rng);
  const aTopIndices = new Set(shuffled([0, 1, 2], rng).slice(0, aTopCount));

  const pairs = orderedIds.map((pairId, index) => {
    const source = pairIndex.get(pairId);
    const aTop = aTopIndices.has(index);
    return {
      pairId,
      assetAId: source.asset_a_id,
      assetBId: source.asset_b_id,
      assetAPath: source.asset_a_path,
      assetBPath: source.asset_b_path,
      assetAPosition: aTop ? 'top' : 'bottom',
      assetBPosition: aTop ? 'bottom' : 'top',
      isTraining: Boolean(source.is_training),
    };
  });

  return {
    formId: form.form_id,
    aTopCount,
    pairs,
    preloadPaths: pairs.flatMap(pair => [pair.assetAPath, pair.assetBPath]),
  };
}

export function createTwoSessionCycle({ protocol, stimulusSet, rng = Math.random }) {
  const { pairIndex, forms } = validatePresentationConfig(protocol, stimulusSet);

  const firstFormIndex = drawIndex(2, rng);
  const formOrder = [forms[firstFormIndex], forms[1 - firstFormIndex]];
  const firstATopCount = drawIndex(2, rng) === 0 ? 1 : 2;
  const secondATopCount = 3 - firstATopCount;

  const sessions = [
    buildSessionPlan({ form: formOrder[0], pairIndex, aTopCount: firstATopCount, rng }),
    buildSessionPlan({ form: formOrder[1], pairIndex, aTopCount: secondATopCount, rng }),
  ];

  return {
    protocolVersion: protocol.protocol_version,
    stimulusSetVersion: stimulusSet.stimulus_set_version,
    lifecycle: protocol.lifecycle,
    sessions,
  };
}

export function pairsForRetry(sessionPlan) {
  requireCondition(Array.isArray(sessionPlan?.pairs) && sessionPlan.pairs.length === 3, 'valid session plan required');
  return sessionPlan.pairs.map(pair => ({ ...pair }));
}

export function preloadPathsForSession(sessionPlan) {
  requireCondition(Array.isArray(sessionPlan?.preloadPaths) && sessionPlan.preloadPaths.length === 6, 'valid preload plan required');
  return [...sessionPlan.preloadPaths];
}
