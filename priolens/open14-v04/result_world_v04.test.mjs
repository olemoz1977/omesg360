import assert from 'node:assert/strict';
import { buildResultWorldModel, RESULT_WORLD_SCHEMA_V04 } from './result_world_v04.mjs';

function base(){
  return {
    attentionResolution:{source:'A_DIRECT_UNIQUE_3_OF_3'},
    attentionFocus:{familyId:'KNOWLEDGE',rawMostCount:3,source:'A_DIRECT_UNIQUE_3_OF_3'},
    sufficiencyResolution:{source:'B_DIRECT_UNIQUE_MIN'},
    sufficiencyRoute:{itemIds:['RESTORATION_ENERGY'],source:'B_DIRECT_UNIQUE_MIN',minimumValue:2}
  };
}

{
  const x=buildResultWorldModel(base());
  assert.equal(x.schema,RESULT_WORLD_SCHEMA_V04);
  assert.deepEqual(x.attention,{hasFocus:true,familyId:'KNOWLEDGE',rawMostCount:3,source:'A_DIRECT_UNIQUE_3_OF_3',viaClarifier:false,clarifierNoClear:false});
  assert.deepEqual(x.sufficiency,{routeMode:'SINGLE',itemIds:['RESTORATION_ENERGY'],source:'B_DIRECT_UNIQUE_MIN',minimumValue:2,viaClarifier:false});
}

{
  const s=base();
  s.attentionResolution={source:'A_PLUS_RUNOFF_2_OF_3'};
  s.attentionFocus={familyId:'BELONGING',rawMostCount:2,source:'A_PLUS_RUNOFF_2_OF_3'};
  s.sufficiencyResolution={source:'B_PLUS_SELECTED'};
  s.sufficiencyRoute={itemIds:['LEARNING_GROWTH'],source:'B_PLUS_SELECTED',minimumValue:1};
  const x=buildResultWorldModel(s);
  assert.equal(x.attention.viaClarifier,true);
  assert.equal(x.attention.rawMostCount,2);
  assert.equal(x.sufficiency.viaClarifier,true);
  assert.equal(x.sufficiency.routeMode,'SINGLE');
}

{
  const s=base();
  s.attentionResolution={source:'A_PLUS_NO_CLEAR'};
  s.attentionFocus=null;
  s.sufficiencyResolution={source:'B_PLUS_SIMILAR'};
  s.sufficiencyRoute={itemIds:['RESTORATION_ENERGY','MATERIAL_RESOURCES'],source:'B_PLUS_SIMILAR',minimumValue:2};
  const x=buildResultWorldModel(s);
  assert.equal(x.attention.hasFocus,false);
  assert.equal(x.attention.clarifierNoClear,true);
  assert.equal(x.sufficiency.routeMode,'MULTI');
}

{
  const s=base();
  s.attentionResolution={source:'A_NO_REPEATED_FOCUS'};
  s.attentionFocus=null;
  s.sufficiencyResolution={source:'B_NO_LOW_ROUTE'};
  s.sufficiencyRoute={itemIds:[],source:'B_NO_LOW_ROUTE',minimumValue:4};
  const x=buildResultWorldModel(s);
  assert.equal(x.attention.hasFocus,false);
  assert.equal(x.sufficiency.routeMode,'NONE');
}

{
  const s=base();
  s.sufficiencyResolution={source:'B_PLUS_HARD_TO_SAY'};
  s.sufficiencyRoute={itemIds:[],source:'B_PLUS_HARD_TO_SAY',minimumValue:1};
  const x=buildResultWorldModel(s);
  assert.equal(x.sufficiency.routeMode,'NONE');
  assert.equal(x.sufficiency.viaClarifier,true);
}

assert.throws(()=>buildResultWorldModel({}),/attentionResolution/);
console.log('result_world_v04: PASS');
