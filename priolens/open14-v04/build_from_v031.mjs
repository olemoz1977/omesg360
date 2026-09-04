import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const srcDir=path.resolve(here,'../open14-v03');
const outDir=here;

function read(name){return fs.readFileSync(path.join(srcDir,name),'utf8')}
function write(name,content){fs.writeFileSync(path.join(outDir,name),content)}
function replaceOnce(text,needle,replacement,label=needle.slice(0,60)){
  const first=text.indexOf(needle);
  if(first<0)throw new Error(`Missing patch anchor: ${label}`);
  if(text.indexOf(needle,first+needle.length)>=0)throw new Error(`Patch anchor not unique: ${label}`);
  return text.slice(0,first)+replacement+text.slice(first+needle.length);
}

let html=read('index.html');

const css=`
.clarify{padding:18px 4px 42px;max-width:760px;margin:0 auto}.clarifyHead h2{font-size:28px;margin:0 0 8px}.clarifyGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:18px 0}.clarifyCard{border:1px solid var(--line);background:#fff;border-radius:16px;padding:8px;min-height:44px}.clarifyCard.on{outline:3px solid #181818}.clarifyPics{display:grid;gap:5px}.clarifyPics.two{grid-template-columns:repeat(2,minmax(0,1fr))}.clarifyPics.three{grid-template-columns:repeat(3,minmax(0,1fr))}.clarifyPics img{display:block;width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:10px;background:#eee}.clarifyNeed{width:100%;text-align:left;border:1px solid var(--line);background:#fff;border-radius:14px;padding:13px 14px;min-height:48px;font-weight:720;line-height:1.35}.clarifyActions{display:grid;gap:8px;margin-top:14px}.clarifyMeta{font-size:13px;color:#666;line-height:1.5}@media(max-width:420px){.clarifyGrid{gap:8px}.clarifyCard{padding:6px}}
.resultWorld{display:grid;gap:28px;margin-top:24px}.worldSection{display:grid;gap:9px}.worldSection .perspectiveLabel{margin:0}.worldSection h2{font-size:25px;letter-spacing:-.02em;margin:0 0 3px}.worldCard{width:100%;border:1px solid var(--line);background:#fff;color:#181818;border-radius:20px;padding:12px;text-align:left;min-height:230px;display:flex;flex-direction:column;gap:10px}.worldCard:focus-visible{outline:3px solid #181818;outline-offset:2px}.worldPlaceholder{min-height:128px;border:1.5px dashed #b8b8b2;border-radius:15px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:850;letter-spacing:.16em;color:#888;background:#fafaf8}.worldFocus{font-size:25px;font-weight:850;letter-spacing:-.025em;line-height:1.08}.worldTap{font-size:13px;color:#6b6b67;font-weight:680}.worldDetail{border-left:2px solid #d7d7d1;padding:4px 0 2px 12px;margin-top:3px}.worldDetail h3{font-size:20px;margin:10px 0 10px}.worldDetailBlock{background:#fff;border:1px solid var(--line);border-radius:15px;padding:12px;margin:8px 0}.worldDetailName{font-size:17px;font-weight:800;line-height:1.3}.worldDetailText{font-size:14px;line-height:1.5;color:#5f5f5f;margin-top:5px}.worldDetailImages{display:grid;grid-template-columns:repeat(auto-fit,minmax(78px,1fr));gap:7px;margin-bottom:10px;max-width:360px}.worldDetailImages img{display:block;width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:11px;border:1px solid #e2e2dd}.worldSeparation{font-size:13px;line-height:1.5;color:#686864;border-top:1px solid var(--line);padding-top:14px;margin-top:2px}.compactReflection{margin-top:8px}.compactReflection .reflectionQuestion{margin-top:8px}.worldDetail .perspectiveLabel{margin-top:18px}@media(max-width:420px){.worldCard{min-height:210px}.worldPlaceholder{min-height:112px}.worldFocus{font-size:23px}}

`;
html=replaceOnce(html,'</style>',css+'</style>','style close');

const aPlusHtml=`  <section id="aplus" class="screen clarify">
    <div class="clarifyHead"><h2 id="aPlusTitle">Dar vienas žvilgsnis.</h2><p id="aPlusLead" class="note">Pažiūrėk į tas vaizdų grupes, kurios tavo pasirinkimuose kartojosi. Kuri grupė dabar pirmiausia patraukia dėmesį?</p></div>
    <div id="aPlusMount" class="clarifyGrid"></div>
    <div class="clarifyActions"><button id="aPlusNone" class="secondary">Nė viena aiškiai</button></div>
  </section>
`;
html=replaceOnce(html,'  <section id="suff" class="screen">',aPlusHtml+'  <section id="suff" class="screen">','suff section');

const bPlusHtml=`  <section id="bplus" class="screen clarify">
    <div class="clarifyHead"><h2 id="bPlusTitle">Patikslink vieną dalyką.</h2><p id="bPlusLead" class="note">Šias sritis įvertinai vienodai žemai. Jei viena dabar vis dėlto atrodo mažiausiai pakankama, kuri?</p></div>
    <div id="bPlusMount" class="clarifyActions"></div>
    <div class="clarifyActions"><button id="bPlusSimilar" class="secondary">Jos dabar panašiai</button><button id="bPlusHard" class="secondary">Sunku pasakyti</button></div>
  </section>
`;
html=replaceOnce(html,'  <section id="result" class="screen result">',bPlusHtml+'  <section id="result" class="screen result">','result section');

const resultHtml=`  <section id="result" class="screen result">
    <h1>Pirmas žvilgsnis. Antras atsakymas.</h1>
    <p id="resultLead" class="resultLead"></p>
    <p id="saveStatus" class="note">Sesijos išsaugojimas tikrinamas…</p>

    <div class="resultWorld">
      <div class="worldSection">
        <p id="firstLabel" class="perspectiveLabel">Pirmas žvilgsnis</p>
        <h2 id="firstHeading">Kas iškilo?</h2>
        <button id="shipCard" class="worldCard" type="button" aria-controls="attentionDetail" aria-expanded="false">
          <div id="shipPlaceholder" class="worldPlaceholder">LAIVAS</div>
          <div id="shipFocus" class="worldFocus"></div>
          <div id="shipTap" class="worldTap"></div>
        </button>
        <div id="attentionDetail" class="worldDetail hidden">
          <h3 id="attentionDetailTitle"></h3>
          <div id="repeatRows" class="rows"></div>
          <p id="attentionNote" class="resultNote hidden"></p>

          <p id="leastLabel" class="perspectiveLabel">Channel A detalė</p>
          <h3 id="leastHeading">Kas liko antrame plane?</h3>
          <div id="leastRows" class="rows"></div>
          <p id="leastNote" class="rankLeastNote"></p>

          <p id="compareLabel" class="perspectiveLabel">Pažiūrėk atidžiau</p>
          <h3 id="compareHeading"></h3>
          <div id="compareRows" class="rows"></div>
        </div>
      </div>

      <div class="worldSection">
        <p id="secondLabel" class="perspectiveLabel">Antras atsakymas</p>
        <h2 id="secondHeading">Kur dabar mažiausiai pakanka?</h2>
        <button id="mapCard" class="worldCard" type="button" aria-controls="suffDetail" aria-expanded="false">
          <div id="mapPlaceholder" class="worldPlaceholder">ŽEMĖLAPIS</div>
          <div id="mapRoute" class="worldFocus"></div>
          <div id="mapTap" class="worldTap"></div>
        </button>
        <div id="suffDetail" class="worldDetail hidden">
          <h3 id="suffDetailTitle"></h3>
          <div id="suffRows" class="rows"></div>
          <p id="suffResultNote" class="resultNote hidden"></p>
        </div>
      </div>

      <p id="worldSeparationNote" class="worldSeparation"></p>
    </div>

    <div class="actions resultActions"><button id="restart" class="primary">Atlikti dar kartą</button><a id="back2rasi" class="secondary actionLink" href="https://2rasi.lt/#experiments">Grįžti į 2rasi</a><button id="export" class="secondary hidden">Eksportuoti JSON</button></div>
    <p id="exportStatus" class="note hidden"></p>
    <details id="debugDetails" class="perspective hidden"><summary>Tyrimo diagnostika</summary><pre id="debug" class="debug"></pre></details>
  </section>
`;
const resultStart=html.indexOf('  <section id="result" class="screen result">');
const resultEndMarker='  </section>\n</div>\n<script type="module">';
const resultEnd=html.indexOf(resultEndMarker,resultStart);
if(resultStart<0||resultEnd<0)throw new Error('result section anchors missing');
html=html.slice(0,resultStart)+resultHtml+html.slice(resultEnd+'  </section>\n'.length);


const importAnchor="import { assignOpen14ThreeExemplars, listThreeExemplarBankProblems } from './open14_no_repeat_assigner_v03.mjs';";
html=replaceOnce(html,importAnchor,importAnchor+"\nimport { SESSION_SCHEMA_V04, DRAFT_KEY_BASE_V04, resolveAttentionFromChoices, applyAttentionClarifier, resolveSufficiencyRoute, applySufficiencyClarifier } from './adaptive_clarifiers_v04.mjs';\nimport { renderResultWorldV04 } from './result_renderer_v04.mjs';",'assigner import');
html=replaceOnce(html,"const DRAFT_KEY_BASE='priolens.open14.v031.rank.draft';","const DRAFT_KEY_BASE=DRAFT_KEY_BASE_V04;",'draft key');
html=html.replaceAll("'2rasi.priolens.open14.rank-session-v0.3'","SESSION_SCHEMA_V04");
html=replaceOnce(html,"const API_PATH='/priolens-open14-v03-api/api.php';","const API_PATH='/priolens-open14-v04-api/api.php';",'v0.4 API path');
html=replaceOnce(html,"const PROGRESS_PATH='/priolens-open14-v03-api/progress.php';","const PROGRESS_PATH='/priolens-open14-v04-api/progress.php';",'v0.4 progress path');

const stateNeedle="sufficiencySchema:'2rasi.priolens.sufficiency-v0.2',sufficiency:{},selfExplanation:null,pendingMost:null,completedAt:null";
const stateReplacement="sufficiencySchema:'2rasi.priolens.sufficiency-v0.2',sufficiency:{},attentionResolution:null,attentionClarifier:null,attentionFocus:null,sufficiencyResolution:null,sufficiencyClarifier:null,sufficiencyRoute:null,selfExplanation:null,pendingMost:null,systemSmoke:new URLSearchParams(location.search).get('systemSmoke')==='1',completedAt:null";
html=replaceOnce(html,stateNeedle,stateReplacement,'startSession state fields');

html=replaceOnce(html,"if(state.choices.length<14)renderTrial();else{show('suff');renderSuff()}","if(state.choices.length<14)renderTrial();else afterChannelA()",'post Channel-A transition');
html=replaceOnce(html,"if(suffIndex<5){suffIndex++;renderSuff()}else finish()","if(suffIndex<5){suffIndex++;renderSuff()}else afterChannelB()",'post Channel-B transition');
html=replaceOnce(html,"state.rankProtocol='most+least-v0.3';","state.rankProtocol='most+least+a-plus+b-plus-v0.4';",'rank protocol');

const resumeStart=html.indexOf('async function resumeSession(){');
const resumeEnd=html.indexOf('function show(id){',resumeStart);
if(resumeStart<0||resumeEnd<0)throw new Error('resumeSession anchors missing');
const resumeFn=`async function resumeSession(){
  const d=loadLocalDraft();if(!d)return startSession();
  const plan=buildOpen14Plan(d.seed);assignment=assignOpen14ThreeExemplars(plan,bank,d.seed);
  await preload(assignment.trials.flatMap(t=>t.stimuli.map(s=>s.runtimePath)));
  state=d;if(!state.language)state.language=LANG;if(!state.language&&LANG==='en')return startSession();
  ensureV04StateFields();
  if(state.choices.length<14){show('trial');renderTrial();return}
  if(!state.attentionResolution){afterChannelA();return}
  if(state.attentionResolution.clarifierRequired){show('aplus');renderAPlus();return}
  enterChannelBOrAfter();
}
`;
html=html.slice(0,resumeStart)+resumeFn+html.slice(resumeEnd);

const helperAnchor='function renderSuff(){';
const helperCode=`function ensureV04StateFields(){
  if(!Object.prototype.hasOwnProperty.call(state,'attentionResolution'))state.attentionResolution=null;
  if(!Object.prototype.hasOwnProperty.call(state,'attentionClarifier'))state.attentionClarifier=null;
  if(!Object.prototype.hasOwnProperty.call(state,'attentionFocus'))state.attentionFocus=null;
  if(!Object.prototype.hasOwnProperty.call(state,'sufficiencyResolution'))state.sufficiencyResolution=null;
  if(!Object.prototype.hasOwnProperty.call(state,'sufficiencyClarifier'))state.sufficiencyClarifier=null;
  if(!Object.prototype.hasOwnProperty.call(state,'sufficiencyRoute'))state.sufficiencyRoute=null;
}
function hash32(text){let h=2166136261;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function stableOrder(xs,salt,keyFn){return [...xs].sort((a,b)=>hash32(state.seed+'|'+salt+'|'+keyFn(a))-hash32(state.seed+'|'+salt+'|'+keyFn(b)))}
function exemplarRuntimePath(exemplarId){for(const c of state.choices){const s=c.stimuli?.find(x=>x.exemplarId===exemplarId);if(s?.runtimePath)return s.runtimePath}return null}
function enterChannelBOrAfter(){
  const firstIncomplete=DOMAINS.findIndex(dom=>dom.items.some(([k])=>!Object.prototype.hasOwnProperty.call(state.sufficiency,k)));
  if(firstIncomplete>=0){suffIndex=firstIncomplete;show('suff');renderSuff();return}
  if(!state.sufficiencyResolution){afterChannelB();return}
  if(state.sufficiencyResolution.clarifierRequired){show('bplus');renderBPlus();return}
  finish();
}
function afterChannelA(){
  ensureV04StateFields();
  const r=resolveAttentionFromChoices(state.choices);state.attentionResolution=r;state.attentionFocus=r.focus;state.attentionClarifier=null;checkpointProgress();
  if(r.clarifierRequired){show('aplus');renderAPlus();return}
  enterChannelBOrAfter();
}
let clarifierT0=0;
function renderAPlus(){
  const r=state.attentionResolution;if(!r?.clarifierRequired)throw new Error('A+ render requested without candidates');
  $('aPlusTitle').textContent=LANG==='en'?'One more glance.':'Dar vienas žvilgsnis.';
  $('aPlusLead').textContent=LANG==='en'?'Look at the image groups that repeated in your choices. Which group pulls your attention first now?':'Pažiūrėk į tas vaizdų grupes, kurios tavo pasirinkimuose kartojosi. Kuri grupė dabar pirmiausia patraukia dėmesį?';
  $('aPlusNone').textContent=LANG==='en'?'None clearly':'Nė viena aiškiai';
  const mount=$('aPlusMount');mount.innerHTML='';
  const ordered=stableOrder(r.candidates,'A_PLUS',x=>x.familyId);
  ordered.forEach((candidate,index)=>{
    const b=document.createElement('button');b.type='button';b.className='clarifyCard';b.setAttribute('aria-label',(LANG==='en'?'Image group ':'Vaizdų grupė ')+(index+1));
    const ids=stableOrder(candidate.exemplarIds,'A_PLUS_'+candidate.familyId,x=>x);
    const pics=ids.map(id=>{const src=exemplarRuntimePath(id);if(!src)throw new Error('Missing runtime path for '+id);return '<img src="'+src+'" alt="">'}).join('');
    b.innerHTML='<div class="clarifyPics '+(ids.length===3?'three':'two')+'">'+pics+'</div>';
    b.onclick=()=>completeAPlus({selectedFamilyId:candidate.familyId});mount.appendChild(b)
  });
  $('aPlusNone').onclick=()=>completeAPlus({noClear:true});doublePaint(()=>{clarifierT0=performance.now()})
}
function completeAPlus(answer){
  const resolved=applyAttentionClarifier(state.attentionResolution,{...answer,rtMs:Math.round(performance.now()-clarifierT0),answeredAt:new Date().toISOString()});
  state.attentionResolution=resolved;state.attentionClarifier=resolved.clarifier;state.attentionFocus=resolved.focus;checkpointProgress();enterChannelBOrAfter();
}
function afterChannelB(){
  ensureV04StateFields();
  const r=resolveSufficiencyRoute(state.sufficiency);state.sufficiencyResolution=r;state.sufficiencyClarifier=null;state.sufficiencyRoute={itemIds:[...r.routeItemIds],source:r.source,minimumValue:r.minimumValue};checkpointProgress();
  if(r.clarifierRequired){show('bplus');renderBPlus();return}
  finish();
}
function renderBPlus(){
  const r=state.sufficiencyResolution;if(!r?.clarifierRequired)throw new Error('B+ render requested without tied minima');
  $('bPlusTitle').textContent=LANG==='en'?'Clarify one thing.':'Patikslink vieną dalyką.';
  $('bPlusLead').textContent=LANG==='en'?'You rated these areas equally low. If one still feels least sufficient right now, which one?':'Šias sritis įvertinai vienodai žemai. Jei viena dabar vis dėlto atrodo mažiausiai pakankama, kuri?';
  $('bPlusSimilar').textContent=LANG==='en'?'They feel similar right now':'Jos dabar panašiai';$('bPlusHard').textContent=T.hardToSay;
  const mount=$('bPlusMount');mount.innerHTML='';
  r.candidates.forEach(itemId=>{const b=document.createElement('button');b.type='button';b.className='clarifyNeed';b.textContent=capFirst(ITEM_RESULT_LABEL[itemId]);b.onclick=()=>completeBPlus({selectedItemId:itemId});mount.appendChild(b)});
  $('bPlusSimilar').onclick=()=>completeBPlus({similar:true});$('bPlusHard').onclick=()=>completeBPlus({hardToSay:true});
}
function completeBPlus(answer){
  const resolved=applySufficiencyClarifier(state.sufficiencyResolution,{...answer,answeredAt:new Date().toISOString()});
  state.sufficiencyResolution=resolved;state.sufficiencyClarifier=resolved.clarifier;state.sufficiencyRoute={itemIds:[...resolved.routeItemIds],source:resolved.source,minimumValue:resolved.minimumValue};checkpointProgress();finish();
}
`;
html=replaceOnce(html,helperAnchor,helperCode+helperAnchor,'renderSuff helper insertion');

const oldRenderStart=html.indexOf('function renderResult(){');
const oldRenderEnd=html.indexOf("$('start').onclick=",oldRenderStart);
if(oldRenderStart<0||oldRenderEnd<0)throw new Error('renderResult anchors missing');
const renderResultV04=`function renderResult(){
  renderResultWorldV04({
    state,
    lang:LANG,
    familyLabels:FAMILY_LABEL,
    itemLabels:ITEM_RESULT_LABEL,
    reasonOptions:SELF_REASON_OPTIONS[LANG],
    onSelfExplanation:async ({familyId,reasonCode,statusEl})=>{
      state.selfExplanation={schema:'2rasi.priolens.self-explanation-v0.1',familyId,scenario:'ATTENTION_DETAIL_V04',reasonCode,answeredAt:new Date().toISOString()};
      await persistSelfExplanation(statusEl);
    }
  });
  $('debug').textContent=JSON.stringify(state,null,2)
}
`;
html=html.slice(0,oldRenderStart)+renderResultV04+html.slice(oldRenderEnd);


write('index.html',html);
for(const name of ['bank.json','p3_open14_planner_v02.mjs','open14_no_repeat_assigner_v03.mjs','stimulus-bank.html'])write(name,read(name));
if(!fs.existsSync(path.join(outDir,'result_world_v04.mjs'))||!fs.existsSync(path.join(outDir,'result_renderer_v04.mjs')))throw new Error('v0.4 result modules missing');
console.log('open14-v04 build: PASS');
