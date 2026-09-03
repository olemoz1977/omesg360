import assert from 'node:assert/strict';
import {
  SESSION_SCHEMA_V04,DRAFT_KEY_BASE_V04,FAMILY_IDS,CHANNEL_B_ITEM_IDS,
  resolveAttentionFromChoices,applyAttentionClarifier,
  resolveSufficiencyRoute,applySufficiencyClarifier,validateCompleteChannelB
} from './adaptive_clarifiers_v04.mjs';

const choice=(familyId,n)=>({choice:{familyId,exemplarId:`${familyId}-${n}`}});
const noClear=()=>({choice:null,noClearChoice:true});
const choicesFor=(spec)=>{
  const out=[];
  for(const [id,count] of Object.entries(spec))for(let i=1;i<=count;i++)out.push(choice(id,i));
  return out;
};

assert.equal(SESSION_SCHEMA_V04,'2rasi.priolens.open14.rank-session-v0.4');
assert.equal(DRAFT_KEY_BASE_V04,'priolens.open14.v04.rank.draft');
assert.equal(FAMILY_IDS.length,14);
assert.equal(CHANNEL_B_ITEM_IDS.length,12);

{
  const r=resolveAttentionFromChoices(choicesFor({REST:3,SAFETY:1}));
  assert.equal(r.source,'A_DIRECT_UNIQUE_3_OF_3');
  assert.deepEqual(r.focus,{familyId:'REST',source:'A_DIRECT_UNIQUE_3_OF_3',rawMostCount:3});
  assert.equal(r.clarifierRequired,false);
}
{
  const r=resolveAttentionFromChoices(choicesFor({REST:3,SAFETY:3,ORDER:1}));
  assert.equal(r.source,'A_PLUS_RUNOFF_3_OF_3');
  assert.equal(r.clarifierRequired,true);
  assert.deepEqual(r.candidates.map(x=>x.familyId),['REST','SAFETY']);
  assert.equal(r.candidates[0].exemplarIds.length,3);
  const selected=applyAttentionClarifier(r,{selectedFamilyId:'SAFETY',rtMs:432.4});
  assert.equal(selected.focus.familyId,'SAFETY');
  assert.equal(selected.focus.rawMostCount,3);
  assert.equal(selected.clarifier.rtMs,432);
}
{
  const r=resolveAttentionFromChoices(choicesFor({REST:2,SAFETY:1,ORDER:1}));
  assert.equal(r.source,'A_DIRECT_UNIQUE_2_OF_3');
  assert.equal(r.focus.familyId,'REST');
  assert.equal(r.focus.rawMostCount,2);
}
{
  const r=resolveAttentionFromChoices([...choicesFor({REST:2,SAFETY:2,ORDER:1}),noClear(),noClear()]);
  assert.equal(r.source,'A_PLUS_RUNOFF_2_OF_3');
  assert.deepEqual(r.candidates.map(x=>x.familyId),['REST','SAFETY']);
  assert.equal(r.candidates.every(x=>x.exemplarIds.length===2),true);
  const none=applyAttentionClarifier(r,{noClear:true});
  assert.equal(none.focus,null);
  assert.equal(none.source,'A_PLUS_NO_CLEAR');
}
{
  const r=resolveAttentionFromChoices(choicesFor({REST:1,SAFETY:1,ORDER:1,CARE:1}));
  assert.equal(r.source,'A_NO_REPEATED_FOCUS');
  assert.equal(r.focus,null);
  assert.equal(r.clarifierRequired,false);
}
{
  const r=resolveAttentionFromChoices(choicesFor({REST:2,SAFETY:2}));
  assert.throws(()=>applyAttentionClarifier(r,{selectedFamilyId:'CARE'}),/not a candidate/);
}

const suff=(overrides={})=>Object.fromEntries(CHANNEL_B_ITEM_IDS.map(id=>[id,Object.prototype.hasOwnProperty.call(overrides,id)?overrides[id]:5]));

{
  const s=suff({RESTORATION_ENERGY:2});
  const r=resolveSufficiencyRoute(s);
  assert.equal(r.source,'B_DIRECT_UNIQUE_MIN');
  assert.deepEqual(r.routeItemIds,['RESTORATION_ENERGY']);
}
{
  const s=suff({RESTORATION_ENERGY:2,MATERIAL_RESOURCES:2});
  const r=resolveSufficiencyRoute(s);
  assert.equal(r.source,'B_PLUS_TIED_MIN');
  assert.equal(r.clarifierRequired,true);
  assert.deepEqual(r.candidates,['RESTORATION_ENERGY','MATERIAL_RESOURCES']);
  assert.deepEqual(applySufficiencyClarifier(r,{selectedItemId:'MATERIAL_RESOURCES'}).routeItemIds,['MATERIAL_RESOURCES']);
  assert.deepEqual(applySufficiencyClarifier(r,{similar:true}).routeItemIds,['RESTORATION_ENERGY','MATERIAL_RESOURCES']);
  assert.deepEqual(applySufficiencyClarifier(r,{hardToSay:true}).routeItemIds,[]);
}
{
  const s=suff();
  const r=resolveSufficiencyRoute(s);
  assert.equal(r.source,'B_NO_LOW_ROUTE');
  assert.deepEqual(r.routeItemIds,[]);
}
{
  const s=Object.fromEntries(CHANNEL_B_ITEM_IDS.map(id=>[id,null]));
  const r=resolveSufficiencyRoute(s);
  assert.equal(r.source,'B_NO_NUMERIC');
}
{
  const s=suff({RESTORATION_ENERGY:null,MATERIAL_RESOURCES:3,SAFETY_STABILITY:3});
  const r=resolveSufficiencyRoute(s);
  assert.equal(r.source,'B_PLUS_TIED_MIN');
  assert.deepEqual(r.candidates,['MATERIAL_RESOURCES','SAFETY_STABILITY']);
}
{
  const s=suff();
  assert.equal(validateCompleteChannelB(s).complete,true);
  delete s.CONTRIBUTION;
  assert.deepEqual(validateCompleteChannelB(s).missing,['CONTRIBUTION']);
}
{
  const s=suff({RESTORATION_ENERGY:0});
  assert.throws(()=>resolveSufficiencyRoute(s),/Invalid Channel-B value/);
}

console.log('adaptive_clarifiers_v04: PASS');
