import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const sourcePath=path.resolve(here,'../open14-v02/index.html');
const outputPath=path.resolve(here,'index.html');

function countOf(text,needle){
  if(!needle) throw new Error('Empty replacement needle');
  return text.split(needle).length-1;
}

function replaceN(text,from,to,expected=1,label=from.slice(0,60)){
  const count=countOf(text,from);
  if(count!==expected){
    throw new Error(`Patch guard failed for ${label}: expected ${expected}, found ${count}`);
  }
  return text.split(from).join(to);
}

let html=fs.readFileSync(sourcePath,'utf8');

html=replaceN(
  html,
  "import { assignOpen14Exemplars, listMissingRuntimeAssets } from './p3_open14_exemplar_assigner_v01.mjs';",
  "import { assignOpen14ThreeExemplars, listThreeExemplarBankProblems } from './open14_no_repeat_assigner_v03.mjs';",
  1,
  'assigner import'
);
html=replaceN(html,"const API_PATH='/priolens-open14-api/api.php';","const API_PATH='/priolens-open14-v03-api/api.php';",1,'final API path');
html=replaceN(html,"const PROGRESS_PATH='/priolens-open14-api/progress.php';","const PROGRESS_PATH='/priolens-open14-v03-api/progress.php';",1,'progress API path');
html=replaceN(html,"const DRAFT_KEY_BASE='priolens.open14.v02.draft';","const DRAFT_KEY_BASE='priolens.open14.v03.draft';",1,'draft key');

html=replaceN(
  html,
  "2rasi.priolens.open14.session-v0.2",
  "2rasi.priolens.open14.session-v0.3",
  2,
  'session schema occurrences'
);
html=replaceN(html,'assignOpen14Exemplars(plan,bank,','assignOpen14ThreeExemplars(plan,bank,',2,'assigner calls');

html=replaceN(
  html,
  'const missing=listMissingRuntimeAssets(bank);',
  "if(bank.runtimeReady!==true){$('bankTitle').textContent=LANG==='en'?'Next image bank not deployed':'Kitas vaizdų bankas dar neįdiegtas';$('bankStatus').textContent=LANG==='en'?'Runtime remains locked until the new assets pass deployment checks.':'Runtime lieka užrakintas, kol nauji vaizdai nepraeina diegimo patikrų.';return}const missing=listThreeExemplarBankProblems(bank);",
  1,
  'fail-closed runtimeReady gate'
);

html=replaceN(
  html,
  'exemplarPlan:assignment.exemplarPlan,',
  'exemplarPlan:{familyOrder:assignment.familyOrder,patternBase:assignment.patternBase,patternCounts:assignment.patternCounts,patternByFamily:assignment.patternByFamily},',
  1,
  'v0.3 exemplar plan metadata'
);

const oldFamilyStats="function familyStats(){const out=Object.fromEntries(FAMILY_SET.map(f=>[f.id,{shown:0,chosen:0,shownA:0,shownB:0,chosenA:0,chosenB:0,crossExemplar:false}]));for(const c of state.choices){for(const s of c.stimuli){const x=out[s.familyId];x.shown++;if(s.exemplarId.endsWith('-A'))x.shownA++;else if(s.exemplarId.endsWith('-B'))x.shownB++}if(c.choice){const x=out[c.choice.familyId];x.chosen++;if(c.choice.exemplarId.endsWith('-A'))x.chosenA++;else if(c.choice.exemplarId.endsWith('-B'))x.chosenB++}}for(const x of Object.values(out)){x.crossExemplar=x.chosenA>0&&x.chosenB>0;x.rate=x.shown?x.chosen/x.shown:0;x.exemplarConcentrated=x.chosen>=2&&!x.crossExemplar}return out}";
const newFamilyStats="function familyStats(){const out=Object.fromEntries(FAMILY_SET.map(f=>[f.id,{shown:0,chosen:0,shownExemplarIds:[],chosenExemplarIds:[],crossExemplar:false}]));const shownSets=Object.fromEntries(FAMILY_SET.map(f=>[f.id,new Set()]));const chosenSets=Object.fromEntries(FAMILY_SET.map(f=>[f.id,new Set()]));for(const c of state.choices){for(const s of c.stimuli){const x=out[s.familyId];x.shown++;shownSets[s.familyId].add(s.exemplarId)}if(c.choice){const x=out[c.choice.familyId];x.chosen++;chosenSets[c.choice.familyId].add(c.choice.exemplarId)}}for(const [id,x] of Object.entries(out)){x.shownExemplarIds=[...shownSets[id]];x.chosenExemplarIds=[...chosenSets[id]];x.crossExemplar=x.chosenExemplarIds.length>=2;x.rate=x.shown?x.chosen/x.shown:0;x.exemplarConcentrated=x.chosen>=2&&!x.crossExemplar}return out}";
html=replaceN(html,oldFamilyStats,newFamilyStats,1,'familyStats canonical exemplar-set logic');

const copyReplacements=[
  ["noRepeated:'Nė viena tema nepasikartojo per abu savo vaizdus'","noRepeated:'Nė viena tema nepasikartojo per skirtingus savo vaizdus'",1,'LT noRepeated'],
  ["repeatAcross:'Kartojosi per du skirtingus šios temos vaizdus.'","repeatAcross:'Kartojosi per skirtingus šios temos vaizdus.'",1,'LT repeatAcross'],
  ["summaryNone:'Šioje sesijoje neatsirado tema, kuri pasikartotų per abu savo vaizdus. Pasirinkimai buvo labiau išsisklaidę.'","summaryNone:'Šioje sesijoje neatsirado tema, kuri pasikartotų per skirtingus savo vaizdus. Pasirinkimai buvo labiau išsisklaidę.'",1,'LT summaryNone'],
  ["noRepeated:'No theme repeated across both of its images'","noRepeated:'No theme repeated across different images'",1,'EN noRepeated'],
  ["repeatAcross:'Repeated across two different images of this theme.'","repeatAcross:'Repeated across different images of this theme.'",1,'EN repeatAcross'],
  ["summaryNone:'This session did not produce a theme that repeated across both of its images. Your choices were more spread out.'","summaryNone:'This session did not produce a theme that repeated across different images. Your choices were more spread out.'",1,'EN summaryNone']
];
for(const [from,to,n,label] of copyReplacements) html=replaceN(html,from,to,n,label);

const forbidden=[
  "assignOpen14Exemplars",
  "listMissingRuntimeAssets",
  "priolens.open14.v02.draft",
  "2rasi.priolens.open14.session-v0.2",
  "shownA:","shownB:","chosenA:","chosenB:"
];
for(const token of forbidden){
  if(html.includes(token)) throw new Error(`v0.3 build still contains forbidden legacy token: ${token}`);
}
if(!html.includes("assignOpen14ThreeExemplars")) throw new Error('v0.3 assigner call missing');
if(!html.includes("bank.runtimeReady!==true")) throw new Error('runtimeReady fail-closed gate missing');
if(!html.includes("chosenExemplarIds.length>=2")) throw new Error('canonical cross-exemplar logic missing');

fs.writeFileSync(outputPath,html,'utf8');
console.log(JSON.stringify({ok:true,sourcePath,outputPath,bytes:Buffer.byteLength(html),sessionSchema:'2rasi.priolens.open14.session-v0.3',assigner:'balanced-3x1-no-repeat-slot-v0.3'},null,2));
