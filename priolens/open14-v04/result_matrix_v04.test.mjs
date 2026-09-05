import assert from 'node:assert/strict';
import { buildResultMatrixModelV04, RESULT_MATRIX_SCHEMA_V04, RESULT_MATRIX_HTML } from './result_matrix_v04.mjs';

const state={
  attentionResolution:{source:'A_DIRECT_UNIQUE_2_OF_3'},
  attentionFocus:{familyId:'AUTONOMY',rawMostCount:2,source:'A_DIRECT_UNIQUE_2_OF_3'},
  sufficiencyResolution:{source:'B_PLUS_SIMILAR'},
  sufficiencyRoute:{itemIds:['CLARITY_PREDICTABILITY','RESTORATION_ENERGY'],source:'B_PLUS_SIMILAR',minimumValue:2},
  sufficiency:{MEANING_PURPOSE:5,CONTRIBUTION:3,LEARNING_GROWTH:4,CAPABILITY_MASTERY:5,AUTONOMY_AGENCY:4,RECOGNITION_ESTEEM:5,CONNECTION_BELONGING:4,CARE_SUPPORT_PRESENT:5,SAFETY_STABILITY:4,CLARITY_PREDICTABILITY:2,RESTORATION_ENERGY:2,MATERIAL_RESOURCES:5},
  choices:[
    {choice:{familyId:'AUTONOMY'},leastChoice:{familyId:'CARE'}},
    {choice:{familyId:'AUTONOMY'},leastChoice:{familyId:'CARE'}},
    {choice:{familyId:'RECOGNITION'},leastChoice:{familyId:'CARE'}},
    {choice:{familyId:'RECOGNITION'},leastChoice:{familyId:'ORDER'}},
    {choice:{familyId:'RECOGNITION'},leastChoice:{familyId:'ORDER'}}
  ]
};

const m=buildResultMatrixModelV04(state,'lt');
assert.equal(m.schema,RESULT_MATRIX_SCHEMA_V04);
assert.equal(RESULT_MATRIX_HTML.includes('\\n'),false,'matrix HTML must not leak literal \\n text nodes');
for(const id of ['matrixAttentionDetails','matrixSufficiencyDetails','matrixPdf','matrixRestart','matrixBack2rasi']){
  assert.equal(RESULT_MATRIX_HTML.includes('id="'+id+'"'),true,'matrix action missing: '+id);
}
assert.equal(RESULT_MATRIX_HTML.includes('matrixContinue'),false,'legacy continue-to-ship/map action must stay removed');
assert.equal(m.items.length,12);
assert.equal(m.groups.length,6);
assert.equal(m.items[0].statement,'Tai, ką šiuo metu darau, man atrodo pakankamai prasminga.');
assert.equal(m.items[7].statement,'Jaučiu, kad iš kitų sulaukiu pakankamai rūpesčio, paramos ir žmogiško dėmesio.');
assert.deepEqual(m.backgroundFamilyIds,['CARE']);
assert.deepEqual(m.sufficiencyItemIds,['CLARITY_PREDICTABILITY','RESTORATION_ENERGY']);
assert.deepEqual(m.lowSufficiencyItemIds,['CONTRIBUTION','CLARITY_PREDICTABILITY','RESTORATION_ENERGY']);
assert.equal(m.focusFamilyId,'AUTONOMY');
assert.equal(m.focusRawMostCount,2);
assert.deepEqual(m.repeatedMost,[{familyId:'RECOGNITION',count:3},{familyId:'AUTONOMY',count:2}]);
assert.deepEqual(m.repeatCountByFamily,{RECOGNITION:3,AUTONOMY:2});
assert.equal('markers' in m,false,'matrix must not expose point-marker model after signal redesign');

const state2={
  attentionResolution:{source:'A_PLUS_RUNOFF_2_OF_3'},
  attentionFocus:{familyId:'OPPORTUNITY',rawMostCount:2,source:'A_PLUS_RUNOFF_2_OF_3'},
  sufficiencyResolution:{source:'B_NO_LOW_ROUTE'},
  sufficiencyRoute:{itemIds:[],source:'B_NO_LOW_ROUTE',minimumValue:4},
  sufficiency:{MEANING_PURPOSE:4,CONTRIBUTION:5,LEARNING_GROWTH:4,CAPABILITY_MASTERY:5,AUTONOMY_AGENCY:4,RECOGNITION_ESTEEM:5,CONNECTION_BELONGING:4,CARE_SUPPORT_PRESENT:5,SAFETY_STABILITY:4,CLARITY_PREDICTABILITY:5,RESTORATION_ENERGY:4,MATERIAL_RESOURCES:5},
  choices:[
    {choice:{familyId:'OPPORTUNITY'}},
    {choice:{familyId:'OPPORTUNITY'}}
  ]
};
const m2=buildResultMatrixModelV04(state2,'en');
assert.equal(m2.focusFamilyId,'OPPORTUNITY');
assert.equal(m2.focusRawMostCount,2);
assert.deepEqual(m2.repeatedMost,[{familyId:'OPPORTUNITY',count:2}]);
assert.equal(m2.sufficiencyItemIds.length,0);
assert.equal(m2.lowSufficiencyItemIds.length,0);
assert.equal(RESULT_MATRIX_HTML.includes('matrixBackgroundLabel'),false,'LEAST must not appear in primary matrix summary');
assert.equal(RESULT_MATRIX_HTML.includes('matrixLegendBackground'),false,'LEAST must not appear in matrix legend');
assert.equal(RESULT_MATRIX_HTML.includes('matrixPrintStatementList'),true,'PDF statement appendix must be present');
assert.equal(RESULT_MATRIX_HTML.includes('matrixPrintLeast'),false,'LEAST must stay out of the general PDF report');
assert.equal(RESULT_MATRIX_HTML.includes('lowBandCell'),false,'legacy orange row/column band class must stay removed');

console.log('result_matrix_v04: PASS');
