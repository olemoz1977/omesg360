import { calculateDirectionalBalance, NOT_ESTIMABLE } from './calculation_engine.js';
import { buildEvidenceContext, evaluateEvidenceStatus } from './evidence_engine.js';

export function deriveProductResultState({ events, gateDConfig, gateEConfig, reflectionAnchors = [] } = {}) {
  if (!Array.isArray(events)) throw new Error('events must be an array');
  if (!Array.isArray(reflectionAnchors)) throw new Error('reflectionAnchors must be an array');
  const context = buildEvidenceContext({ events, reflectionAnchors });
  const domains = {};
  for (const domain of ['CS', 'CR']) {
    const calculation = calculateDirectionalBalance({ events, gateDConfig, domain });
    const evidence = evaluateEvidenceStatus({ calcResult: calculation, gateEConfig, context });
    domains[domain] = { calculation, evidence };
  }
  const directionalResultAvailable = ['CS', 'CR'].some(domain => domains[domain].calculation.directionBalance !== NOT_ESTIMABLE && domains[domain].evidence.allowedClaimLevel > 0);
  const gateDReady = Array.isArray(gateDConfig?.mappings) && gateDConfig.mappings.some(mapping => mapping.mapping_status === 'VALIDATED');
  const gateEReady = ['CS', 'CR'].some(domain => gateEConfig?.domains?.[domain]?.status === 'VALID');
  return {resultStatus:directionalResultAvailable?'LIMITED_RESULT_AVAILABLE':'NOT_ESTIMABLE',directionalResultAvailable,gateDReady,gateEReady,context,domains};
}
