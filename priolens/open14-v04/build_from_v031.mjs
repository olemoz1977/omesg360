import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import { RESULT_WORLD_CSS, RESULT_WORLD_HTML } from './result_shell_v04.mjs';
import { RESULT_MATRIX_CSS, RESULT_MATRIX_HTML } from './result_matrix_v04.mjs';

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

for(const token of ['Channel A detalė','>Eksportuoti JSON<','>Tyrimo diagnostika<']){
  if(RESULT_WORLD_HTML.includes(token))throw new Error('hidden technical label remains in static result host: '+token);
}

html=replaceOnce(
  html,
  '<div id="stage" class="stage"><button class="stim" data-slot="0"><img alt=""></button><button class="stim" data-slot="1"><img alt=""></button><button class="stim" data-slot="2"><img alt=""></button><button id="noneMost" class="none">Nė vienas aiškiai</button><button id="tieLeast" class="none hidden">Abu likę panašiai</button></div>',
  '<div id="stage" class="stage"><button class="stim" data-slot="0"><img alt=""></button><button class="stim" data-slot="1"><img alt=""></button><button class="stim" data-slot="2"><img alt=""></button><button id="noneMost" class="none">Nė vienas aiškiai</button><button id="undoMost" class="none rankAssist hidden" disabled>Keisti pirmą</button><button id="tieLeast" class="none rankAssist hidden" disabled>Abu panašiai</button></div>',
  'same-trial undo button'
);
html=replaceOnce(html,"mostQ:'Kuris pirmas patraukia?',mostHint:'Rinkis pirmą impulsą.'","mostQ:'Kuri nuotrauka pirmiausia patraukia tavo dėmesį?',mostHint:'Pažymėk vieną nuotrauką. Rinkis pirmą impulsą.'",'LT MOST instruction');
html=replaceOnce(html,"leastQ:'O kuris iš likusių traukia mažiausiai?',leastHint:'Pirmo pasirinkimo nebekeičiame. Žiūrėk tik į kitus du.'","leastQ:'Kuri iš dviejų likusių nuotraukų traukia mažiausiai?',leastHint:'Pažymėk vieną iš dviejų. Jei abu traukia panašiai, rinkis „Abu panašiai“.'",'LT LEAST instruction');
html=replaceOnce(html,"mostQ:'Which pulls you first?',mostHint:'Choose the first impulse.'","mostQ:'Which photo pulls your attention first?',mostHint:'Select one photo. Go with your first impulse.'",'EN MOST instruction');
html=replaceOnce(html,"leastQ:'And which of the other two pulls you least?',leastHint:'Your first choice is fixed. Look only at the other two.'","leastQ:'Which of the two remaining photos pulls you least?',leastHint:'Select one of the two. If they pull similarly, choose “Both feel similar”.'",'EN LEAST instruction');
html=replaceOnce(html,"noneMost:'Nė vienas aiškiai',tieLeast:'Abu likę panašiai'","noneMost:'Nė vienas aiškiai',undoMost:'Keisti pirmą',tieLeast:'Abu panašiai'",'LT undo label');
html=replaceOnce(html,"noneMost:'None clearly',tieLeast:'The other two feel similar'","noneMost:'None clearly',undoMost:'Change first',tieLeast:'Both feel similar'",'EN undo label');
html=replaceOnce(html,"$('noneMost').textContent=R.noneMost;$('tieLeast').textContent=R.tieLeast;","$('noneMost').textContent=R.noneMost;$('undoMost').textContent=R.undoMost;$('tieLeast').textContent=R.tieLeast;",'undo locale');
html=replaceOnce(html,"  $('firstLabel').textContent=T.firstLabel;$('firstHeading').textContent=T.firstHeading;$('secondLabel').textContent=T.secondLabel;$('secondHeading').textContent=T.secondHeading;$('compareLabel').textContent=T.compareLabel;$('compareHeading').textContent=T.compareHeading;","  const compareLabel=document.getElementById('compareLabel'),compareHeading=document.getElementById('compareHeading');if(compareLabel)compareLabel.textContent=T.compareLabel;if(compareHeading)compareHeading.textContent=T.compareHeading;",'decouple static language from legacy scene ids');
html=replaceOnce(html,"  $('restart').textContent=T.restart;$('back2rasi').textContent=T.back2rasi;$('export').textContent=T.export;document.querySelector('#debugDetails summary').textContent=T.debug;","  $('restart').textContent=T.restart;$('back2rasi').textContent=T.back2rasi;if(DEBUG_MODE){$('export').textContent=T.export;document.querySelector('#debugDetails summary').textContent=T.debug;}",'keep hidden technical labels empty outside debug mode');

const clarifierCss=`
.trialhead{height:auto;min-height:62px;align-items:flex-start;gap:12px;padding:2px 0 7px}.trialhead>div:first-child{min-width:0;flex:1}.trialhead .count{flex:0 0 auto;padding-top:2px}.q{line-height:1.18}.rankHint{line-height:1.3}.progress{flex:0 0 3px;margin-top:2px}.stage{grid-template-columns:repeat(2,minmax(0,1fr))}.stim{grid-column:1/-1}.stim.most img{opacity:.38;filter:grayscale(.32) saturate(.7);transform:scale(.9)}.stim.most::after{opacity:1}.none{grid-column:1/-1}#undoMost{grid-column:1;font-size:13px;padding:8px 10px;white-space:nowrap;background:transparent;border-color:#d6d6d0;color:#77776f;font-weight:550}#tieLeast{grid-column:2;font-size:13px;padding:8px 10px;white-space:nowrap;border-color:#8f8f88;color:#242424}.rankAssist{font-weight:600}
.clarify{padding:18px 4px 42px;max-width:620px;margin:0 auto}.clarifyHead h2{font-size:28px;margin:0 0 8px}.clarifyGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:18px 0}.clarifyCard{border:1px solid var(--line);background:#fff;border-radius:16px;padding:8px;min-height:44px}.clarifyCard.on{outline:3px solid #181818}.clarifyPics{display:grid;gap:5px}.clarifyPics.two{grid-template-columns:repeat(2,minmax(0,1fr))}.clarifyPics.three{grid-template-columns:repeat(3,minmax(0,1fr))}.clarifyPics img{display:block;width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:10px;background:#eee}.clarifyNeed{width:100%;text-align:left;border:1px solid var(--line);background:#fff;border-radius:14px;padding:13px 14px;min-height:48px;font-weight:720;line-height:1.35}.clarifyActions{display:grid;gap:8px;margin-top:14px}.clarifyMeta{font-size:13px;color:#666;line-height:1.5}@media(max-width:620px){.clarifyGrid{grid-template-columns:1fr;gap:12px}.clarifyCard{padding:9px}}
`;
html=replaceOnce(html,'</style>',clarifierCss+RESULT_WORLD_CSS+RESULT_MATRIX_CSS+'</style>','style close');

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
html=replaceOnce(html,'  <section id="result" class="screen result">',bPlusHtml+RESULT_MATRIX_HTML+'  <section id="result" class="screen result">','result section');

const resultHtml=RESULT_WORLD_HTML;
const resultStart=html.indexOf('  <section id="result" class="screen result">');
const resultEndMarker='  </section>\n</div>\n<script type="module">';
const resultEnd=html.indexOf(resultEndMarker,resultStart);
if(resultStart<0||resultEnd<0)throw new Error('result section anchors missing');
html=html.slice(0,resultStart)+resultHtml+html.slice(resultEnd+'  </section>\n'.length);


html=replaceOnce(html,"import { buildOpen14Plan, FAMILY_SET } from './p3_open14_planner_v02.mjs';","import { buildOpen14Plan, FAMILY_SET } from './p3_open14_planner_v02.mjs?v=boot20260905b';",'planner cache bust');
const importAnchor="import { assignOpen14ThreeExemplars, listThreeExemplarBankProblems } from './open14_no_repeat_assigner_v03.mjs';";
html=replaceOnce(html,importAnchor,"import { assignOpen14ThreeExemplars, listThreeExemplarBankProblems } from './open14_no_repeat_assigner_v03.mjs?v=boot20260905b';\nimport { SESSION_SCHEMA_V04, DRAFT_KEY_BASE_V04, SUFFICIENCY_SCHEMA_V04, resolveAttentionFromChoices, applyAttentionClarifier, resolveSufficiencyRoute, applySufficiencyClarifier } from './adaptive_clarifiers_v04.mjs?v=boot20260905b';",'core module cache bust');
html=replaceOnce(html,"const DRAFT_KEY_BASE='priolens.open14.v031.rank.draft';","const DRAFT_KEY_BASE=DRAFT_KEY_BASE_V04;",'draft key');
html=replaceOnce(html,'const DRAFT_KEY=`${DRAFT_KEY_BASE}.${LANG}`;','const DRAFT_KEY=`${DRAFT_KEY_BASE}.${LANG}`;\nconst RESULT_KEY_BASE=\'priolens.open14.v041.last-result\';\nconst RESULT_KEY=`${RESULT_KEY_BASE}.${LANG}`;\nconst RESULT_MAX_AGE_MS=90*24*60*60*1000;','completed result key');
html=html.replaceAll("'2rasi.priolens.open14.rank-session-v0.3'","SESSION_SCHEMA_V04");
html=replaceOnce(html,"const API_PATH='/priolens-open14-v03-api/api.php';","const API_PATH='/priolens-open14-v04-api/api.php';",'v0.4 API path');
html=replaceOnce(html,"const PROGRESS_PATH='/priolens-open14-v03-api/progress.php';","const PROGRESS_PATH='/priolens-open14-v04-api/progress.php';",'v0.4 progress path');
html=replaceOnce(html,'<p class="lead">Trys vaizdai vienu metu. Nesvarstyk, kuris „geresnis“. Pasirink tą, į kurį pirmiausia krypsta dėmesys.</p>','<p class="lead">Trys vaizdai vienu metu. Pirmiausia pasirink, kuris patraukia. Tada iš likusių dviejų pažymėk, kuris traukia mažiausiai.</p>','static LT MOST-LEAST lead');
html=replaceOnce(html,'<p class="note">14 trumpų pasirinkimų · apie 2 min. Po jų į tą pačią situaciją pažvelgsi iš kitos perspektyvos.</p>','<p class="note">14 trumpų trijulių · apie 3 min. Po jų į tą pačią situaciją pažvelgsi iš kitos perspektyvos.</p>','static LT duration note');
html=replaceOnce(html,"async function init(){try{bank=await fetch('./bank.json',{cache:'no-store'})","async function init(){window.__priolensBootReady=true;try{bank=await fetch('./bank.json',{cache:'no-store'})",'boot ready flag');
const bootWatchdogHtml=`<script>
window.__priolensBootReady=false;
setTimeout(function(){
  if(window.__priolensBootReady)return;
  var title=document.getElementById('bankTitle'),status=document.getElementById('bankStatus');
  if(title)title.textContent='Nepavyko paleisti PrioLens';
  if(status)status.innerHTML='Puslapio logika neužsikrovė. <button type="button" onclick="location.reload()">Bandyti dar kartą</button>';
},8000);
<\/script>
`;
html=replaceOnce(html,'<script type="module">',bootWatchdogHtml+'<script type="module">','boot watchdog');

html=replaceOnce(html,"['CARE_SUPPORT_PRESENT','Mano gyvenime pakanka rūpesčio, paramos ir žmogiško dėmesio.']","['CARE_SUPPORT_PRESENT','Jaučiu, kad iš kitų sulaukiu pakankamai rūpesčio, paramos ir žmogiško dėmesio.']",'received-support LT item');
html=replaceOnce(html,"['CARE_SUPPORT_PRESENT','There is enough care, support and human attention in my life.']","['CARE_SUPPORT_PRESENT','I feel that I receive enough care, support and human attention from others.']",'received-support EN item');
html=replaceOnce(html,"RESOURCE:'Resursai'","RESOURCE:'Resursų prieinamumas'",'RESOURCE LT family label');
html=replaceOnce(html,"RESOURCE:'Resources'","RESOURCE:'Resource availability'",'RESOURCE EN family label');
html=replaceOnce(html,"ORDER:'Tvarka / aiškumas'","ORDER:'Tvarka / struktūra'",'ORDER LT family label');
html=replaceOnce(html,"ORDER:'Order / clarity'","ORDER:'Order / structure'",'ORDER EN family label');
html=replaceOnce(html,"CARE:'Rūpinimasis kitu'","CARE:'Rūpestis / pagalba'",'CARE LT family label');
html=replaceOnce(html,"CARE:'Caring for others'","CARE:'Care / helping'",'CARE EN family label');
html=replaceOnce(html,"CONTROL:'Kontrolė / valdymas'","CONTROL:'Tiesioginis valdymas'",'CONTROL LT family label');
html=replaceOnce(html,"CONTROL:'Control'","CONTROL:'Direct control'",'CONTROL EN family label');
html=replaceOnce(html,"RESOURCE:'Gali būti susiję su tuo, kas tau atrodo vertinga, prieinama ir verta panaudoti.'","RESOURCE:'Gali būti susiję su prieinamų ir panaudojamų resursų pastebėjimu.'",'RESOURCE LT meaning');
html=replaceOnce(html,"RESOURCE:'This may relate to what feels valuable, available and worth making use of.'","RESOURCE:'This may relate to noticing resources that are available and usable.'",'RESOURCE EN meaning');
html=replaceOnce(html,"ORDER:'Gali būti susiję su aiškumu, tvarka ir noru žinoti, kur kas yra ir ko tikėtis.'","ORDER:'Gali būti susiję su matoma tvarka, struktūra ir aiškiu daiktų išdėstymu.'",'ORDER LT meaning');
html=replaceOnce(html,"ORDER:'This may relate to clarity, order and wanting to know where things stand and what to expect.'","ORDER:'This may relate to visible order, structure and clearly arranged objects.'",'ORDER EN meaning');
html=replaceOnce(html,"CARE:'Gali būti susiję su polinkiu pastebėti kitą ir pasirūpinti juo.'","CARE:'Gali būti susiję su tuo, kad dėmesį patraukė rūpesčio ar pagalbos situacija. Vien iš pasirinkimo neaišku, su kuria role ją siejai.'",'CARE LT meaning');
html=replaceOnce(html,"CARE:'This may relate to noticing another person and wanting to care for them.'","CARE:'This may relate to a care or helping situation catching your attention. The choice alone does not show which role you identified with.'",'CARE EN meaning');
html=replaceOnce(html,"CONTROL:'Gali būti susiję su noru pačiam veikti situaciją, valdyti ar keisti tai, kas vyksta.'","CONTROL:'Gali būti susiję su situacijomis, kuriose veiksmas tiesiogiai pakeičia sistemos ar aplinkos būseną.'",'CONTROL LT meaning');
html=replaceOnce(html,"CONTROL:'This may relate to wanting to influence a situation directly, steer it or change what is happening.'","CONTROL:'This may relate to situations where an action directly changes the state of a system or environment.'",'CONTROL EN meaning');
html=replaceOnce(html,"OPPORTUNITY:'Gali būti susiję su matoma galimybe, kurią norisi pastebėti ir išnaudoti.'","OPPORTUNITY:'Gali būti susiję su matoma ir prieinama galimybe veikti ar kažkuo pasinaudoti.'",'OPPORTUNITY LT meaning');
html=replaceOnce(html,"OPPORTUNITY:'This may relate to noticing an opening or possibility that feels worth using.'","OPPORTUNITY:'This may relate to noticing an available possibility for action or use.'",'OPPORTUNITY EN meaning');
html=replaceOnce(html,"CARE_SUPPORT_PRESENT:'rūpesčio, paramos ir žmogiško dėmesio'","CARE_SUPPORT_PRESENT:'rūpesčio, paramos ir žmogiško dėmesio iš kitų'",'CARE LT result label');
const careEnNeedle="CARE_SUPPORT_PRESENT:'care, support and human attention'";
if(html.split(careEnNeedle).length-1!==2)throw new Error('Expected exactly two CARE EN label/about anchors');
html=html.replace(careEnNeedle,"CARE_SUPPORT_PRESENT:'care, support and human attention from others'");
html=replaceOnce(html,"CARE_SUPPORT_PRESENT:'rūpestį, paramą ir žmogišką dėmesį'","CARE_SUPPORT_PRESENT:'tai, ar iš kitų sulauki pakankamai rūpesčio, paramos ir žmogiško dėmesio'",'CARE LT about text');
html=html.replace(careEnNeedle,"CARE_SUPPORT_PRESENT:'whether you receive enough care, support and human attention from others'");

const stateNeedle="sufficiencySchema:'2rasi.priolens.sufficiency-v0.2',sufficiency:{},selfExplanation:null,pendingMost:null,completedAt:null";
const stateReplacement="sufficiencySchema:SUFFICIENCY_SCHEMA_V04,constructDefinitionVersion:bank.constructDefinitionVersion||null,sufficiency:{},attentionResolution:null,attentionClarifier:null,attentionFocus:null,sufficiencyResolution:null,sufficiencyClarifier:null,sufficiencyRoute:null,selfExplanation:null,pendingMost:null,attentionRevisions:[],systemSmoke:new URLSearchParams(location.search).get('systemSmoke')==='1',completedAt:null";
html=replaceOnce(html,stateNeedle,stateReplacement,'startSession state fields');
const localDraftClearAnchor="function clearLocalDraft(){try{localStorage.removeItem(DRAFT_KEY);if(LANG==='lt')localStorage.removeItem(DRAFT_KEY_BASE)}catch(err){console.warn('local draft clear failed',err)}}";
const completedResultHelpers=`function saveLocalResult(){if(!state?.completedAt)return;try{localStorage.setItem(RESULT_KEY,JSON.stringify(state))}catch(err){console.warn('local result save failed',err)}}
function clearLocalResult(){try{localStorage.removeItem(RESULT_KEY)}catch(err){console.warn('local result clear failed',err)}}
function loadLocalResult(){try{const raw=localStorage.getItem(RESULT_KEY);if(!raw)return null;const x=JSON.parse(raw);if(!x||x.schema!==SESSION_SCHEMA_V04||x.sufficiencySchema!==SUFFICIENCY_SCHEMA_V04||!x.completedAt||!Array.isArray(x.choices)||x.choices.length!==14||!x.sufficiency){clearLocalResult();return null}if(x.language&&x.language!==LANG)return null;if(bank&&x.bankSchema!==bank.schema){clearLocalResult();return null}const completedAt=Date.parse(x.completedAt);if(!Number.isFinite(completedAt)||Date.now()-completedAt>RESULT_MAX_AGE_MS){clearLocalResult();return null}return x}catch(err){console.warn('local result load failed',err);return null}}
function restoreLastResultIfAvailable(){if(loadLocalDraft())return false;const x=loadLocalResult();if(!x)return false;state=x;ensureV04StateFields();showPreResultMatrix();return true}`;
html=replaceOnce(html,localDraftClearAnchor,localDraftClearAnchor+'\n'+completedResultHelpers,'completed result storage');
html=replaceOnce(html,"$('start').disabled=false;$('bankCard').classList.add('ready');offerResumeIfAvailable()","$('start').disabled=false;$('bankCard').classList.add('ready');if(!restoreLastResultIfAvailable())offerResumeIfAvailable()",'restore completed result on init');
html=replaceOnce(html,"state.submission={ok:true,inserted:Boolean(data.inserted),submissionId:data.submissionId||null};clearLocalDraft();","state.submission={ok:true,inserted:Boolean(data.inserted),submissionId:data.submissionId||null};saveLocalResult();clearLocalDraft();",'completed result after submit success');
html=replaceOnce(html,"state.submission={ok:false,error:String(err)};el.textContent=T.saveFailed;","state.submission={ok:false,error:String(err)};saveLocalResult();el.textContent=T.saveFailed;",'completed result after submit failure');
html=replaceOnce(html,"state.selfExplanationSave={ok:true,at:new Date().toISOString()};","state.selfExplanationSave={ok:true,at:new Date().toISOString()};saveLocalResult();",'persist restored self explanation success');
html=replaceOnce(html,"state.selfExplanationSave={ok:false,error:String(err)};","state.selfExplanationSave={ok:false,error:String(err)};saveLocalResult();",'persist restored self explanation failure');
html=replaceOnce(html,"$('restart').onclick=()=>{clearLocalDraft();location.reload()}","$('restart').onclick=()=>{clearLocalDraft();clearLocalResult();location.reload()}",'restart clears completed result');


html=replaceOnce(html,"$('noneMost').classList.toggle('hidden',leastPhase);$('tieLeast').classList.toggle('hidden',!leastPhase);","$('noneMost').classList.toggle('hidden',leastPhase);$('undoMost').classList.toggle('hidden',!leastPhase);$('tieLeast').classList.toggle('hidden',!leastPhase);$('undoMost').disabled=!leastPhase;$('tieLeast').disabled=!leastPhase;",'disable assist actions until MOST');
html=replaceOnce(html,"rtMs:pm?.rtMs??null,pointerType:pm?.pointerType??null,leastChoice:","rtMs:pm?.rtMs??null,pointerType:pm?.pointerType??null,mostRevised:Array.isArray(state.attentionRevisions)&&state.attentionRevisions.some(x=>x.trialIndex===i+1),leastChoice:",'mark revised MOST trial');
html=replaceOnce(html,"function chooseLeast(slot){if(locked||!state.pendingMost||state.pendingMost.slot===slot)return;finishVisualTrial(slot,false)}","function chooseLeast(slot){if(locked||!state.pendingMost||state.pendingMost.slot===slot)return;finishVisualTrial(slot,false)}\nfunction undoMost(){if(locked||!state.pendingMost)return;ensureV04StateFields();const i=state.choices.length,trial=assignment.trials[i],pm=state.pendingMost;state.attentionRevisions.push({trialId:trial.trialId,trialIndex:i+1,originalChoice:{familyId:pm.familyId,exemplarId:pm.exemplarId,slot:pm.slot},originalRtMs:pm.rtMs??null,originalPointerType:pm.pointerType??null,undoneAfterMs:Math.max(0,Math.round(performance.now()-t0)),undoneAt:new Date().toISOString()});state.pendingMost=null;checkpointProgress();renderTrial()}",'same-trial undo logic');
html=replaceOnce(html,"$('tieLeast').addEventListener('pointerdown',e=>lastPointerType=e.pointerType);$('tieLeast').addEventListener('click',()=>{if(!state.pendingMost)return;finishVisualTrial(null,true)});","$('undoMost').addEventListener('click',undoMost);$('tieLeast').addEventListener('pointerdown',e=>lastPointerType=e.pointerType);$('tieLeast').addEventListener('click',()=>{if(!state.pendingMost)return;finishVisualTrial(null,true)});",'same-trial undo handler');
html=replaceOnce(html,"state.rtMedianMs=median(state.choices.map(x=>x.rtMs));state.leastRtMedianMs=median(state.choices.map(x=>x.leastRtMs));","state.rtMedianMs=median(state.choices.filter(x=>!x.mostRevised).map(x=>x.rtMs));state.revisedMostCount=state.choices.filter(x=>x.mostRevised).length;state.leastRtMedianMs=median(state.choices.map(x=>x.leastRtMs));",'exclude revised trials from spontaneous RT aggregate');

html=replaceOnce(html,"if(state.choices.length<14)renderTrial();else{show('suff');renderSuff()}","if(state.choices.length<14)renderTrial();else afterChannelA()",'post Channel-A transition');
html=replaceOnce(html,"if(suffIndex<5){suffIndex++;renderSuff()}else finish()","if(suffIndex<5){suffIndex++;renderSuff()}else afterChannelB()",'post Channel-B transition');
html=replaceOnce(html,"state.rankProtocol='most+least-v0.3';","state.rankProtocol='most+least+a-plus+b-plus-v0.4';",'rank protocol');
html=replaceOnce(html,"state.rankProtocol='most+least+a-plus+b-plus-v0.4';show('result');renderResult();finalSubmitPromise=submitSession()","state.rankProtocol='most+least+a-plus+b-plus-v0.4';saveLocalResult();finalSubmitPromise=submitSession();showPreResultMatrix()",'snapshot completed result before submit');

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
  if(!Array.isArray(state.attentionRevisions))state.attentionRevisions=[];
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
const renderResultV04=`let resultModulesPromise=null;
function loadResultModules(){
  if(!resultModulesPromise){
    resultModulesPromise=Promise.all([
      import('./result_renderer_v04.mjs?v=detail15'),
      import('./result_matrix_v04.mjs?v=matrix8')
    ]).then(([renderer,matrix])=>({renderer,matrix}));
  }
  return resultModulesPromise;
}
async function openMatrixDetail(kind){
  try{
    const mods=await loadResultModules();
    if(kind==='sufficiency'){
      await renderResult(true);
      const sheet=document.getElementById('suffDetail');
      if(sheet&&sheet.parentElement!==document.body)document.body.appendChild(sheet);
      mods.renderer.openResultDetailV04(kind);
      return;
    }
    show('result');
    await renderResult(true);
    mods.renderer.openResultDetailV04(kind);
  }catch(err){
    console.error('PrioLens detail open failed',err);
    show('matrixResult');
  }
}
function matrixBackHref(){
  return (FROM_2RASI==='com'||(FROM_2RASI!=='lt'&&LANG==='en'))?'https://2rasi.com/#experiments':'https://2rasi.lt/#experiments';
}
function restartFromMatrix(){
  clearLocalDraft();
  clearLocalResult();
  location.reload();
}
function showMatrixFallback(err){
  console.error('PrioLens matrix load/render failed',err);
  state.matrixRenderError={message:String(err),at:new Date().toISOString()};
  const result=document.getElementById('result'),lead=document.getElementById('resultLead'),world=result?.querySelector('.resultWorld');
  show('result');
  if(result?.querySelector('h1'))result.querySelector('h1').textContent=LANG==='en'?'Result display error':'Rezultato pateikimo klaida';
  if(lead)lead.textContent=LANG==='en'?'Your session data is preserved. Refresh the page or run the session again.':'Sesijos duomenys išsaugoti. Atnaujink puslapį arba atlik sesiją dar kartą.';
  if(world)world.innerHTML='<div class="worldRenderError" role="alert">'+(LANG==='en'?'The matrix could not be displayed. Your saved session was not replaced by another result view.':'Matricos nepavyko parodyti. Išsaugota sesija nepakeista kitu rezultato vaizdu.')+'</div>';
}
async function renderMatrix(){
  const mods=await loadResultModules();
  return mods.matrix.renderResultMatrixV04({
    state,
    lang:LANG,
    familyLabels:FAMILY_LABEL,
    onAttentionDetails:()=>openMatrixDetail('attention'),
    onSufficiencyDetails:()=>openMatrixDetail('sufficiency'),
    onPrint:()=>mods.matrix.printResultReportV04(),
    onRestart:restartFromMatrix,
    backHref:matrixBackHref()
  });
}
async function showPreResultMatrix(){
  try{
    await renderMatrix();
    show('matrixResult');
  }catch(err){
    showMatrixFallback(err);
  }
}
async function renderResult(detailOnly=false){
  try{
    const mods=await loadResultModules();
    mods.renderer.renderResultWorldV04({
      state,
      lang:LANG,
      familyLabels:FAMILY_LABEL,
      itemLabels:ITEM_RESULT_LABEL,
      reasonOptions:SELF_REASON_OPTIONS[LANG],
      detailOnly,
      onDetailClose:()=>show('matrixResult'),
      onSelfExplanation:async ({familyId,reasonCode,statusEl})=>{
        state.selfExplanation={schema:'2rasi.priolens.self-explanation-v0.1',familyId,scenario:'ATTENTION_DETAIL_V04',reasonCode,answeredAt:new Date().toISOString()};
        saveLocalResult();
        await persistSelfExplanation(statusEl);
      }
    });
    const pdf=document.getElementById('resultPdf');
    if(pdf){
      pdf.textContent=LANG==='en'?'Save PDF':'Išsaugoti PDF';
      pdf.onclick=async()=>{
        try{await renderMatrix();mods.matrix.printResultReportV04()}
        catch(err){console.error('PDF matrix render failed',err);window.print()}
      };
    }
  }catch(err){
    console.error('PrioLens result render failed',err);
    state.resultRenderError={message:String(err),at:new Date().toISOString()};
    const lead=document.getElementById('resultLead');
    if(lead)lead.textContent=LANG==='en'?'The result view did not load correctly. Your session data is still being saved.':'Rezultato vaizdas neužsikrovė teisingai. Sesijos duomenys vis tiek išsaugomi.';
    const world=document.querySelector('#result .resultWorld');
    if(world)world.innerHTML='<div class="worldRenderError" role="alert">'+(LANG==='en'?'Result display error. Refresh the page or run the session again.':'Rezultato pateikimo klaida. Atnaujink puslapį arba atlik sesiją dar kartą.')+'</div>';
  }
  $('debug').textContent=JSON.stringify(state,null,2)
}
`;
html=html.slice(0,oldRenderStart)+renderResultV04+html.slice(oldRenderEnd);


write('index.html',html);
const bankV04=JSON.parse(read('bank.json'));
bankV04.constructDefinitionVersion='open14-construct-audit-2026-09-05';
bankV04.constructAuditStatus='FORMATIVE_VISUAL_DIRECTIONS_NOT_VALIDATED_NEEDS';
Object.assign(bankV04.families.RESOURCE,{display:'Resource access / availability',constructStatus:'PLAUSIBLE_RESOURCE_ACCESS_NOT_REWARD'});
Object.assign(bankV04.families.ORDER,{display:'Order / structure',constructStatus:'RELATED_TO_CLARITY_PREDICTABILITY_NOT_DIRECT'});
Object.assign(bankV04.families.CONNECTION,{constructStatus:'RELATEDNESS_VISUAL_SUBFAMILY'});
Object.assign(bankV04.families.BELONGING,{constructStatus:'RELATEDNESS_VISUAL_SUBFAMILY'});
Object.assign(bankV04.families.CARE,{display:'Care / helping interaction',constructStatus:'NO_DIRECT_B_MATCH_ROLE_AMBIGUITY'});
Object.assign(bankV04.families.AUTONOMY,{constructStatus:'AUTONOMY_VOLITION_DIRECT_B_MATCH'});
Object.assign(bankV04.families.CONTROL,{display:'Direct control / action-effect agency',constructStatus:'NO_DIRECT_B_MATCH_SENSE_OF_AGENCY'});
Object.assign(bankV04.families.EXPLORATION,{constructStatus:'CURIOSITY_INFORMATION_SEEKING_VISUAL_SUBFAMILY'});
Object.assign(bankV04.families.KNOWLEDGE,{constructStatus:'CURIOSITY_INFORMATION_SEEKING_VISUAL_SUBFAMILY'});
Object.assign(bankV04.families.OPPORTUNITY,{display:'Opportunity / affordance',constructStatus:'FORMATIVE_AFFORDANCE_NO_DIRECT_B_MATCH'});
write('bank.json',JSON.stringify(bankV04,null,2)+'\n');
for(const name of ['p3_open14_planner_v02.mjs','open14_no_repeat_assigner_v03.mjs','stimulus-bank.html'])write(name,read(name));
if(!fs.existsSync(path.join(outDir,'result_world_v04.mjs'))||!fs.existsSync(path.join(outDir,'result_renderer_v04.mjs'))||!fs.existsSync(path.join(outDir,'result_matrix_v04.mjs'))||!fs.existsSync(path.join(outDir,'result_interpretation_v04.mjs')))throw new Error('v0.4 result modules missing');
if(!html.includes('id="matrixResult"')||!html.includes('id="matrixCanvasMount"')||!html.includes('id="matrixInterpretation"')||!html.includes('id="matrixAttentionDetails"')||!html.includes('id="matrixSufficiencyDetails"')||!html.includes('id="matrixPdf"')||!html.includes('id="matrixRestart"')||!html.includes('id="matrixBack2rasi"')||!html.includes('id="matrixPrintStatementList"'))throw new Error('matrix result/interpretation/action/print scene missing');
if(!html.includes('id="attentionDetail"')||!html.includes('id="attentionBack"')||!html.includes('id="suffDetail"')||!html.includes('id="suffDetailClose"')||!html.includes('id="attentionResearch"')||!html.includes('id="suffResearch"'))throw new Error('result detail navigation/research mounts missing');
for(const token of ['id="shipCard"','id="mapCard"','id="shipPlaceholder"','id="mapPlaceholder"','id="needsMapStage"','class="resultScene"','LAIVAS','ŽEMĖLAPIS']){
  if(html.includes(token))throw new Error('obsolete result visual token remains in generated participant HTML: '+token);
}
const rendererSource=fs.readFileSync(path.join(outDir,'result_renderer_v04.mjs'),'utf8');
for(const token of ['shipCard','mapCard','shipPlaceholder','mapPlaceholder','needsMapStage','shipDetailsButton','mapDetailsButton','LAIVAS','ŽEMĖLAPIS','NEED_MAP','LAND_SHAPES','renderNeedsMap']){
  if(rendererSource.includes(token))throw new Error('obsolete result visual token remains in public renderer: '+token);
}
console.log('open14-v04 build: PASS');
