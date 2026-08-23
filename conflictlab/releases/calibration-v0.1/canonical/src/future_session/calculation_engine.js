export const NOT_ESTIMABLE = 'NOT_ESTIMABLE';

function assertDirection(value, field) {
  if (value !== 1 && value !== -1) {
    throw new Error(`${field} must be +1 or -1 for VALIDATED mapping`);
  }
}

function assertStableAssets(mapping) {
  if (typeof mapping.asset_a_id !== 'string' || !mapping.asset_a_id ||
      typeof mapping.asset_b_id !== 'string' || !mapping.asset_b_id) {
    throw new Error(`Gate D stable asset identities are required for ${mapping.pair_id}`);
  }
  if (mapping.asset_a_id === mapping.asset_b_id) {
    throw new Error(`Gate D asset identities must differ for ${mapping.pair_id}`);
  }
}

export function indexGateD(gateDConfig) {
  if (!gateDConfig || !Array.isArray(gateDConfig.mappings)) {
    throw new Error('gateDConfig.mappings must be an array');
  }
  if (gateDConfig.mappings.length > 0 && !gateDConfig.stimulus_set_version) {
    throw new Error('Gate D stimulus_set_version is required when mappings exist');
  }

  const index = new Map();

  for (const mapping of gateDConfig.mappings) {
    if (!mapping?.pair_id) throw new Error('Gate D mapping pair_id is required');
    if (index.has(mapping.pair_id)) {
      throw new Error(`duplicate Gate D mapping for ${mapping.pair_id}`);
    }
    if (!gateDConfig.allowed_mapping_status?.includes(mapping.mapping_status)) {
      throw new Error(`unsupported Gate D mapping_status for ${mapping.pair_id}`);
    }

    assertStableAssets(mapping);

    if (mapping.mapping_status === 'VALIDATED') {
      assertDirection(mapping.asset_a_direction, 'asset_a_direction');
      assertDirection(mapping.asset_b_direction, 'asset_b_direction');
      if (mapping.asset_a_direction === mapping.asset_b_direction) {
        throw new Error(`VALIDATED mapping directions must be opposite for ${mapping.pair_id}`);
      }
    } else if (mapping.asset_a_direction !== null || mapping.asset_b_direction !== null) {
      throw new Error(`non-VALIDATED mapping directions must be null for ${mapping.pair_id}`);
    }

    index.set(mapping.pair_id, mapping);
  }

  return index;
}

function assertEventMatchesMapping(event, mapping, gateDConfig) {
  if (event.stimulusSetVersion !== gateDConfig.stimulus_set_version) {
    throw new Error(
      `Gate D stimulus-set mismatch for ${event.pairId}: event=${event.stimulusSetVersion}, mapping=${gateDConfig.stimulus_set_version}`
    );
  }
  if (event.assetAId !== mapping.asset_a_id || event.assetBId !== mapping.asset_b_id) {
    throw new Error(`Gate D asset identity mismatch for ${event.pairId}`);
  }
}

export function calculateDirectionalBalance({ events, gateDConfig, domain }) {
  if (!Array.isArray(events)) throw new Error('events must be an array');
  if (!domain || !gateDConfig?.allowed_domains?.includes(domain)) {
    throw new Error(`unsupported domain: ${domain}`);
  }

  const mappings = indexGateD(gateDConfig);
  const primaryEvents = events.filter(
    event => event.blockAttemptNumber === 1 && !event.isTraining
  );

  const perPair = [];
  let nEligiblePresentations = 0;
  let nPos = 0;
  let nNeg = 0;

  for (const event of primaryEvents) {
    const mapping = mappings.get(event.pairId);
    if (!mapping || mapping.mapping_status !== 'VALIDATED' || mapping.domain !== domain) continue;
    assertEventMatchesMapping(event, mapping, gateDConfig);
    const presented = event.pairPresented === true;
    if (presented) nEligiblePresentations += 1;
    let direction = null;
    if (presented && (event.choice === 'A' || event.choice === 'B')) {
      direction = event.choice === 'A' ? mapping.asset_a_direction : mapping.asset_b_direction;
      if (direction === 1) nPos += 1;
      else if (direction === -1) nNeg += 1;
    }
    perPair.push({eventId:event.eventId,pairId:event.pairId,stimulusSetVersion:event.stimulusSetVersion,assetAId:event.assetAId,assetBId:event.assetBId,choice:event.choice,pairPresented:presented,direction,gateDStatus:mapping.mapping_status,domain:mapping.domain});
  }

  const nDirectionalChoices = nPos + nNeg;
  const coverage = nEligiblePresentations === 0 ? NOT_ESTIMABLE : nDirectionalChoices / nEligiblePresentations;
  if (nDirectionalChoices === 0) return {mappingVersion:gateDConfig.mapping_version,stimulusSetVersion:gateDConfig.stimulus_set_version,domain,nPos:0,nNeg:0,nDirectionalChoices:0,nEligiblePresentations,directionBalance:NOT_ESTIMABLE,coverage,evidenceStatus:'INSUFFICIENT',perPair};
  const directionBalance = (nPos - nNeg) / nDirectionalChoices;
  return {mappingVersion:gateDConfig.mapping_version,stimulusSetVersion:gateDConfig.stimulus_set_version,domain,nPos,nNeg,nDirectionalChoices,nEligiblePresentations,directionBalance,coverage,evidenceStatus:'DESCRIPTIVE_ONLY',perPair};
}
