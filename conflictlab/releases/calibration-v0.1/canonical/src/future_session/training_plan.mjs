function requireObject(value, name) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${name} must be an object`);
  }
}

function requireString(value, name) {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`${name} is required`);
  }
}

function shuffle(items, random) {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function chooseATopPairIds(pairIds, count, random) {
  return new Set(shuffle(pairIds, random).slice(0, count));
}

export function validateTrainingSet(trainingSet) {
  requireObject(trainingSet, 'trainingSet');
  requireString(trainingSet.training_set_version, 'training_set_version');

  if (trainingSet.purpose !== 'INTERACTION_FAMILIARIZATION_ONLY') {
    throw new Error('training set purpose must be INTERACTION_FAMILIARIZATION_ONLY');
  }
  if (trainingSet.lifecycle !== 'DRAFT' && trainingSet.lifecycle !== 'RELEASED') {
    throw new Error('training set lifecycle must be DRAFT or RELEASED');
  }

  const boundary = trainingSet.data_boundary;
  requireObject(boundary, 'data_boundary');
  if (boundary.is_training !== true ||
      boundary.analysis_eligible !== false ||
      boundary.timing_calibration_eligible !== false ||
      boundary.server_upload !== false ||
      boundary.gate_d !== 'NOT_APPLICABLE' ||
      boundary.gate_e !== 'NOT_APPLICABLE') {
    throw new Error('training data boundary must fail closed for analysis/calibration/Gate D/Gate E/server');
  }

  if (!Array.isArray(trainingSet.pairs) || trainingSet.pairs.length !== 3) {
    throw new Error('training set requires exactly three pairs');
  }

  const pairIds = new Set();
  const assetIds = new Set();
  for (const [index, pair] of trainingSet.pairs.entries()) {
    requireObject(pair, `pairs[${index}]`);
    for (const field of [
      'pair_id',
      'asset_a_id',
      'asset_b_id',
      'asset_a_path',
      'asset_b_path',
      'asset_a_git_blob_sha',
      'asset_b_git_blob_sha',
    ]) {
      requireString(pair[field], `pairs[${index}].${field}`);
    }
    if (pairIds.has(pair.pair_id)) throw new Error('training pair IDs must be unique');
    if (assetIds.has(pair.asset_a_id) || assetIds.has(pair.asset_b_id)) {
      throw new Error('training asset IDs must be unique');
    }
    pairIds.add(pair.pair_id);
    assetIds.add(pair.asset_a_id);
    assetIds.add(pair.asset_b_id);
  }

  return true;
}

export function createTrainingPlan({ trainingSet, random = Math.random } = {}) {
  validateTrainingSet(trainingSet);
  if (typeof random !== 'function') throw new Error('random must be a function');

  const shuffledPairs = shuffle(trainingSet.pairs, random);
  const aTopCount = random() < 0.5 ? 1 : 2;
  const aTopPairIds = chooseATopPairIds(
    shuffledPairs.map(pair => pair.pair_id),
    aTopCount,
    random
  );

  return {
    formId: 'TRAINING-P0-001-003',
    isTraining: true,
    trainingSetVersion: trainingSet.training_set_version,
    pairs: shuffledPairs.map(pair => {
      const aIsTop = aTopPairIds.has(pair.pair_id);
      return {
        pairId: pair.pair_id,
        assetAId: pair.asset_a_id,
        assetBId: pair.asset_b_id,
        assetAPath: pair.asset_a_path,
        assetBPath: pair.asset_b_path,
        assetAPosition: aIsTop ? 'top' : 'bottom',
        assetBPosition: aIsTop ? 'bottom' : 'top',
      };
    }),
  };
}

export function preloadPathsForTraining(trainingPlan) {
  requireObject(trainingPlan, 'trainingPlan');
  if (!Array.isArray(trainingPlan.pairs) || trainingPlan.pairs.length !== 3) {
    throw new Error('trainingPlan must contain exactly three pairs');
  }

  const paths = [];
  for (const pair of trainingPlan.pairs) {
    requireString(pair.assetAPath, 'pair.assetAPath');
    requireString(pair.assetBPath, 'pair.assetBPath');
    paths.push(pair.assetAPath, pair.assetBPath);
  }
  return paths;
}
