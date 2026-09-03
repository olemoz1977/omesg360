export const SESSION_SCHEMA_V04='2rasi.priolens.open14.rank-session-v0.4';
export const DRAFT_KEY_BASE_V04='priolens.open14.v04.rank.draft';
export const ATTENTION_RESOLUTION_SCHEMA_V04='2rasi.priolens.open14.attention-resolution-v0.4';
export const SUFFICIENCY_RESOLUTION_SCHEMA_V04='2rasi.priolens.open14.sufficiency-resolution-v0.4';

export const FAMILY_IDS=[
  'REST','MASTERY','CONNECTION','EXPLORATION','BELONGING','RESOURCE','AUTONOMY',
  'SAFETY','KNOWLEDGE','CARE','OPPORTUNITY','CONTROL','ORDER','RECOGNITION'
];

export const CHANNEL_B_ITEM_IDS=[
  'RESTORATION_ENERGY','MATERIAL_RESOURCES','SAFETY_STABILITY','CLARITY_PREDICTABILITY',
  'CONNECTION_BELONGING','CARE_SUPPORT_PRESENT','AUTONOMY_AGENCY','RECOGNITION_ESTEEM',
  'LEARNING_GROWTH','CAPABILITY_MASTERY','MEANING_PURPOSE','CONTRIBUTION'
];

const FAMILY_SET=new Set(FAMILY_IDS);
const B_ITEM_SET=new Set(CHANNEL_B_ITEM_IDS);

function unique(xs){return [...new Set(xs)]}
function byFamilyOrder(a,b){return FAMILY_IDS.indexOf(a)-FAMILY_IDS.indexOf(b)}
function byItemOrder(a,b){return CHANNEL_B_ITEM_IDS.indexOf(a)-CHANNEL_B_ITEM_IDS.indexOf(b)}

function candidateCard(familyId,rawMostCount,selectedExemplars){
  const exemplarIds=unique(selectedExemplars[familyId]||[]);
  if(exemplarIds.length!==rawMostCount){
    throw new Error(`${familyId} raw MOST count ${rawMostCount} but ${exemplarIds.length} distinct selected exemplars`);
  }
  return {familyId,rawMostCount,exemplarIds};
}

export function resolveAttentionFromChoices(choices){
  if(!Array.isArray(choices))throw new Error('choices must be an array');
  const counts=Object.fromEntries(FAMILY_IDS.map(id=>[id,0]));
  const selectedExemplars=Object.fromEntries(FAMILY_IDS.map(id=>[id,[]]));

  for(const c of choices){
    if(!c?.choice)continue;
    const familyId=c.choice.familyId;
    if(!FAMILY_SET.has(familyId))throw new Error(`Unknown Channel-A family: ${familyId}`);
    counts[familyId]++;
    if(counts[familyId]>3)throw new Error(`${familyId} raw MOST count exceeds 3`);
    const exemplarId=c.choice.exemplarId;
    if(typeof exemplarId!=='string'||!exemplarId)throw new Error(`Missing exemplarId for ${familyId} MOST choice`);
    selectedExemplars[familyId].push(exemplarId);
  }

  const at3=FAMILY_IDS.filter(id=>counts[id]===3);
  const at2=FAMILY_IDS.filter(id=>counts[id]===2);

  let source='A_NO_REPEATED_FOCUS';
  let focus=null;
  let clarifierRequired=false;
  let candidates=[];

  if(at3.length===1){
    source='A_DIRECT_UNIQUE_3_OF_3';
    focus={familyId:at3[0],source,rawMostCount:3};
  }else if(at3.length>=2){
    source='A_PLUS_RUNOFF_3_OF_3';
    clarifierRequired=true;
    candidates=at3.sort(byFamilyOrder).map(id=>candidateCard(id,3,selectedExemplars));
  }else if(at2.length===1){
    source='A_DIRECT_UNIQUE_2_OF_3';
    focus={familyId:at2[0],source,rawMostCount:2};
  }else if(at2.length>=2){
    source='A_PLUS_RUNOFF_2_OF_3';
    clarifierRequired=true;
    candidates=at2.sort(byFamilyOrder).map(id=>candidateCard(id,2,selectedExemplars));
  }

  return {
    schema:ATTENTION_RESOLUTION_SCHEMA_V04,
    counts,
    source,
    focus,
    clarifierRequired,
    candidates
  };
}

export function applyAttentionClarifier(resolution,answer){
  if(!resolution?.clarifierRequired)throw new Error('A+ is not required for this resolution');
  if(!Array.isArray(resolution.candidates)||resolution.candidates.length<2)throw new Error('A+ requires at least two candidates');
  const candidateIds=resolution.candidates.map(x=>x.familyId);
  const selected=answer?.selectedFamilyId??null;
  const noClear=answer?.noClear===true;
  if(Boolean(selected)===noClear)throw new Error('A+ answer must contain exactly one of selectedFamilyId or noClear=true');
  if(selected&&!candidateIds.includes(selected))throw new Error(`A+ selected family is not a candidate: ${selected}`);
  const rawMostCount=selected?resolution.candidates.find(x=>x.familyId===selected).rawMostCount:null;
  return {
    ...resolution,
    clarifierRequired:false,
    clarifier:{
      schema:'2rasi.priolens.open14.attention-clarifier-v0.4',
      trigger:resolution.source,
      candidateFamilies:candidateIds,
      candidateCards:resolution.candidates.map(x=>({familyId:x.familyId,rawMostCount:x.rawMostCount,exemplarIds:[...x.exemplarIds]})),
      selectedFamilyId:selected,
      noClear,
      rtMs:Number.isFinite(answer?.rtMs)?Math.max(0,Math.round(answer.rtMs)):null,
      answeredAt:answer?.answeredAt||null
    },
    focus:selected?{familyId:selected,source:resolution.source,rawMostCount}:null,
    source:selected?resolution.source:'A_PLUS_NO_CLEAR'
  };
}

function validateBValue(itemId,value){
  if(value===null)return;
  if(!Number.isInteger(value)||value<1||value>5)throw new Error(`Invalid Channel-B value for ${itemId}: ${value}`);
}

export function resolveSufficiencyRoute(sufficiency){
  if(!sufficiency||typeof sufficiency!=='object'||Array.isArray(sufficiency))throw new Error('sufficiency must be an object');
  const numeric=[];
  for(const itemId of CHANNEL_B_ITEM_IDS){
    if(!Object.prototype.hasOwnProperty.call(sufficiency,itemId))continue;
    const value=sufficiency[itemId];
    validateBValue(itemId,value);
    if(Number.isFinite(value))numeric.push({itemId,value});
  }

  if(!numeric.length){
    return {schema:SUFFICIENCY_RESOLUTION_SCHEMA_V04,source:'B_NO_NUMERIC',minimumValue:null,clarifierRequired:false,candidates:[],routeItemIds:[]};
  }

  const minimumValue=Math.min(...numeric.map(x=>x.value));
  if(minimumValue>=4){
    return {schema:SUFFICIENCY_RESOLUTION_SCHEMA_V04,source:'B_NO_LOW_ROUTE',minimumValue,clarifierRequired:false,candidates:[],routeItemIds:[]};
  }

  const minima=numeric.filter(x=>x.value===minimumValue).map(x=>x.itemId).sort(byItemOrder);
  if(minima.length===1){
    return {schema:SUFFICIENCY_RESOLUTION_SCHEMA_V04,source:'B_DIRECT_UNIQUE_MIN',minimumValue,clarifierRequired:false,candidates:minima,routeItemIds:minima};
  }

  return {schema:SUFFICIENCY_RESOLUTION_SCHEMA_V04,source:'B_PLUS_TIED_MIN',minimumValue,clarifierRequired:true,candidates:minima,routeItemIds:[]};
}

export function applySufficiencyClarifier(resolution,answer){
  if(!resolution?.clarifierRequired)throw new Error('B+ is not required for this resolution');
  const candidateIds=[...(resolution.candidates||[])];
  if(candidateIds.length<2)throw new Error('B+ requires at least two candidates');
  for(const id of candidateIds)if(!B_ITEM_SET.has(id))throw new Error(`Unknown B+ candidate: ${id}`);

  const selected=answer?.selectedItemId??null;
  const similar=answer?.similar===true;
  const hardToSay=answer?.hardToSay===true;
  const modeCount=Number(Boolean(selected))+Number(similar)+Number(hardToSay);
  if(modeCount!==1)throw new Error('B+ answer must contain exactly one of selectedItemId, similar=true, or hardToSay=true');
  if(selected&&!candidateIds.includes(selected))throw new Error(`B+ selected item is not a candidate: ${selected}`);

  let routeItemIds=[];
  let source='B_PLUS_HARD_TO_SAY';
  if(selected){routeItemIds=[selected];source='B_PLUS_SELECTED'}
  else if(similar){routeItemIds=[...candidateIds];source='B_PLUS_SIMILAR'}

  return {
    ...resolution,
    clarifierRequired:false,
    source,
    routeItemIds,
    clarifier:{
      schema:'2rasi.priolens.open14.sufficiency-clarifier-v0.4',
      minimumValue:resolution.minimumValue,
      candidateItems:candidateIds,
      selectedItemId:selected,
      similar,
      hardToSay,
      answeredAt:answer?.answeredAt||null
    }
  };
}

export function validateCompleteChannelB(sufficiency){
  if(!sufficiency||typeof sufficiency!=='object'||Array.isArray(sufficiency))return {complete:false,missing:[...CHANNEL_B_ITEM_IDS],invalid:[]};
  const missing=[],invalid=[];
  for(const id of CHANNEL_B_ITEM_IDS){
    if(!Object.prototype.hasOwnProperty.call(sufficiency,id)){missing.push(id);continue}
    try{validateBValue(id,sufficiency[id])}catch{invalid.push(id)}
  }
  return {complete:missing.length===0&&invalid.length===0,missing,invalid};
}
