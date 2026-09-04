export const RESULT_WORLD_SCHEMA_V04='2rasi.priolens.open14.result-world-v0.4';

const A_SOURCES=new Set([
  'A_DIRECT_UNIQUE_3_OF_3','A_DIRECT_UNIQUE_2_OF_3',
  'A_PLUS_RUNOFF_3_OF_3','A_PLUS_RUNOFF_2_OF_3','A_PLUS_NO_CLEAR',
  'A_NO_REPEATED_FOCUS'
]);
const B_SOURCES=new Set([
  'B_DIRECT_UNIQUE_MIN','B_PLUS_SELECTED','B_PLUS_SIMILAR',
  'B_PLUS_HARD_TO_SAY','B_NO_LOW_ROUTE','B_NO_NUMERIC'
]);

export function buildResultWorldModel(state){
  if(!state||typeof state!=='object'||Array.isArray(state))throw new Error('state must be an object');

  const ar=state.attentionResolution||null;
  const af=state.attentionFocus||null;
  const sr=state.sufficiencyResolution||null;
  const route=state.sufficiencyRoute||null;

  if(!ar||typeof ar!=='object')throw new Error('attentionResolution is required');
  if(!A_SOURCES.has(ar.source))throw new Error('Unknown attention source: '+ar.source);

  const hasAttentionFocus=Boolean(af?.familyId);
  if(hasAttentionFocus){
    if(!Number.isInteger(af.rawMostCount)||af.rawMostCount<2||af.rawMostCount>3)throw new Error('attentionFocus.rawMostCount must be 2 or 3');
    if(!A_SOURCES.has(af.source))throw new Error('Unknown attention focus source: '+af.source);
  }

  if(!sr||typeof sr!=='object')throw new Error('sufficiencyResolution is required');
  if(!route||typeof route!=='object'||!Array.isArray(route.itemIds))throw new Error('sufficiencyRoute is required');
  if(!B_SOURCES.has(route.source))throw new Error('Unknown sufficiency route source: '+route.source);

  const itemIds=[...route.itemIds];
  const routeMode=itemIds.length===0?'NONE':itemIds.length===1?'SINGLE':'MULTI';

  return {
    schema:RESULT_WORLD_SCHEMA_V04,
    attention:{
      hasFocus:hasAttentionFocus,
      familyId:hasAttentionFocus?af.familyId:null,
      rawMostCount:hasAttentionFocus?af.rawMostCount:null,
      source:hasAttentionFocus?af.source:ar.source,
      viaClarifier:hasAttentionFocus&&String(af.source).startsWith('A_PLUS_'),
      clarifierNoClear:ar.source==='A_PLUS_NO_CLEAR'
    },
    sufficiency:{
      routeMode,
      itemIds,
      source:route.source,
      minimumValue:Number.isInteger(route.minimumValue)?route.minimumValue:null,
      viaClarifier:String(route.source).startsWith('B_PLUS_')
    }
  };
}
