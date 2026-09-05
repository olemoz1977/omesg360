import assert from 'node:assert/strict';
import { buildResultMatrixModelV04, RESULT_MATRIX_SCHEMA_V04, RESULT_MATRIX_HTML } from './result_matrix_v04.mjs';

const state={
  attentionResolution:{source:'A_DIRECT_UNIQUE_2_OF_3'},
  attentionFocus:{familyId:'AUTONOMY',rawMostCount:2,source:'A_DIRECT_UNIQUE_2_OF_3'},
  sufficiencyResolution:{source:'B_PLUS_SIMILAR'},
  sufficiencyRoute:{itemIds:['CLARITY_PREDICTABILITY','RESTORATION_ENERGY'],source:'B_PLUS_SIMILAR',minimumValue:2},
  choices:[
    {leastChoice:{familyId:'CARE'}},
    {leastChoice:{familyId:'CARE'}},
    {leastChoice:{familyId:'CARE'}},
    {leastChoice:{familyId:'ORDER'}},
    {leastChoice:{familyId:'ORDER'}}
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

const focus=m.markers.find(x=>x.kind==='FOCUS');
assert.deepEqual({row:focus.row,col:focus.col,type:focus.type},{row:5,col:5,type:'DIRECT'});
const bg=m.markers.find(x=>x.kind==='BACKGROUND');
assert.deepEqual({row:bg.row,col:bg.col,type:bg.type},{row:2,col:8,type:'BRIDGE'});
const suff=m.markers.filter(x=>x.kind==='SUFFICIENCY').map(x=>[x.itemId,x.row,x.col]);
assert.deepEqual(suff,[['CLARITY_PREDICTABILITY',10,10],['RESTORATION_ENERGY',11,11]]);

const state2={
  attentionResolution:{source:'A_PLUS_RUNOFF_2_OF_3'},
  attentionFocus:{familyId:'OPPORTUNITY',rawMostCount:2,source:'A_PLUS_RUNOFF_2_OF_3'},
  sufficiencyResolution:{source:'B_NO_LOW_ROUTE'},
  sufficiencyRoute:{itemIds:[],source:'B_NO_LOW_ROUTE',minimumValue:4},
  choices:[]
};
const m2=buildResultMatrixModelV04(state2,'en');
const focus2=m2.markers.find(x=>x.kind==='FOCUS');
assert.deepEqual({row:focus2.row,col:focus2.col,type:focus2.type},{row:3,col:5,type:'BRIDGE'});
assert.equal(m2.sufficiencyItemIds.length,0);

console.log('result_matrix_v04: PASS');
