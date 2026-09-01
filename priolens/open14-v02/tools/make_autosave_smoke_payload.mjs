import fs from 'fs';
import { buildOpen14Plan } from '../p3_open14_planner_v02.mjs';
import { assignOpen14Exemplars } from '../p3_open14_exemplar_assigner_v01.mjs';

const bank = JSON.parse(fs.readFileSync(new URL('../bank.json', import.meta.url), 'utf8'));
const seed = 'SYSTEM_SMOKE_DO_NOT_ANALYZE';
const sessionUuid = '00000000-0000-4000-8000-000000000002';
const plan = buildOpen14Plan(seed);
const assignment = assignOpen14Exemplars(plan, bank, seed);
const choices = assignment.trials.map((trial, i) => {
  const choice = trial.stimuli[0];
  return {
    trialId: trial.trialId,
    trialIndex: i + 1,
    designIndex: trial.designIndex,
    positions: trial.positions,
    stimuli: trial.stimuli.map(s => ({
      familyId: s.familyId, macro: s.macro, exemplarId: s.exemplarId,
      slot: s.slot, runtimePath: s.runtimePath
    })),
    choice: { familyId: choice.familyId, macro: choice.macro, exemplarId: choice.exemplarId, slot: choice.slot },
    noClearChoice: false,
    rtMs: 1000,
    pointerType: 'system'
  };
});
const suffKeys = [
  'RESTORATION_ENERGY','MATERIAL_RESOURCES','SAFETY_STABILITY','CLARITY_PREDICTABILITY',
  'CONNECTION_BELONGING','CARE_SUPPORT_PRESENT','AUTONOMY_AGENCY','RECOGNITION_ESTEEM',
  'LEARNING_GROWTH','CAPABILITY_MASTERY','MEANING_PURPOSE','CONTRIBUTION'
];
const common = {
  schema: '2rasi.priolens.open14.session-v0.2', sessionUuid,
  startedAt: '2026-09-01T00:00:00.000Z', seed,
  planSchema: plan.schema, bankSchema: bank.schema, assignerSchema: assignment.schema,
  sufficiencySchema: '2rasi.priolens.sufficiency-v0.2'
};
fs.writeFileSync('/tmp/priolens-partial.json', JSON.stringify({ ...common, completedAt: null, choices: choices.slice(0, 3), sufficiency: {} }));
fs.writeFileSync('/tmp/priolens-final.json', JSON.stringify({ ...common, completedAt: '2026-09-01T00:03:00.000Z', choices, sufficiency: Object.fromEntries(suffKeys.map(k => [k, 3])) }));
console.log('SMOKE_PAYLOADS_OK');
