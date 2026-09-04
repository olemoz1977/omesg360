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
.clarify{padding:18px 4px 42px;max-width:620px;margin:0 auto}.clarifyHead h2{font-size:28px;margin:0 0 8px}.clarifyGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:18px 0}.clarifyCard{border:1px solid var(--line);background:#fff;border-radius:16px;padding:8px;min-height:44px}.clarifyCard.on{outline:3px solid #181818}.clarifyPics{display:grid;gap:5px}.clarifyPics.two{grid-template-columns:repeat(2,minmax(0,1fr))}.clarifyPics.three{grid-template-columns:repeat(3,minmax(0,1fr))}.clarifyPics img{display:block;width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:10px;background:#eee}.clarifyNeed{width:100%;text-align:left;border:1px solid var(--line);background:#fff;border-radius:14px;padding:13px 14px;min-height:48px;font-weight:720;line-height:1.35}.clarifyActions{display:grid;gap:8px;margin-top:14px}.clarifyMeta{font-size:13px;color:#666;line-height:1.5}@media(max-width:620px){.clarifyGrid{grid-template-columns:1fr;gap:12px}.clarifyCard{padding:9px}}
.result{padding-top:22px}.result h1{font-size:clamp(32px,8.7vw,46px);line-height:1.01;margin-bottom:8px}.resultLead{font-size:15px;line-height:1.45;max-width:620px;margin:0 0 6px;color:#696965}.result #saveStatus{font-size:12px;margin:7px 0 14px}
.resultWorld{margin-top:8px}.resultScene{position:relative;overflow:hidden;border:1px solid var(--line);border-radius:26px;background:#fff;min-height:660px}.sceneZone{width:100%;border:0;color:#181818;text-align:left;display:block;position:relative}.sceneDetailButton{position:absolute;z-index:4;border:1px solid rgba(24,24,24,.18);background:rgba(255,255,255,.9);color:#181818;border-radius:999px;padding:9px 13px;font-size:12px;font-weight:780;line-height:1;box-shadow:0 3px 12px rgba(0,0,0,.06)}.sceneDetailButton:focus-visible{outline:3px solid #181818;outline-offset:2px}.shipDetailButton{right:2px;bottom:0}.mapDetailButton{left:0;bottom:0}.shipZone{height:285px;padding:18px 18px 0;background:linear-gradient(#f9faf9 0%,#f5f7f6 58%,#eef4f5 100%)}.sceneEyebrow{font-size:11px;font-weight:850;letter-spacing:.15em;text-transform:uppercase;color:#72726e}.shipStage{position:absolute;left:15px;right:15px;bottom:12px;height:208px}.shipGhost{position:absolute;left:50%;bottom:18px;transform:translateX(-50%);width:min(82%,330px);height:132px}.shipHull{position:absolute;left:9%;right:7%;bottom:0;height:47px;border:1.5px dashed #9ea7a6;border-radius:9px 9px 52% 52% / 8px 8px 28px 28px;background:rgba(255,255,255,.54)}.shipMast{position:absolute;width:1.5px;height:116px;left:49%;bottom:40px;border-left:1.5px dashed #9ea7a6}.shipSail{position:absolute;left:50%;bottom:57px;width:44%;height:91px;border:1.5px dashed #9ea7a6;border-radius:50% 8px 8px 50%;background:rgba(255,255,255,.54);display:flex;align-items:center;justify-content:center;padding:12px}.shipFocus{font-size:clamp(18px,5.8vw,25px);font-weight:850;letter-spacing:-.03em;line-height:1.04;text-align:center}.shipHint{position:absolute;right:4px;bottom:1px;font-size:11px;color:#72726e}
.waterBand{height:62px;position:relative;background:linear-gradient(#dcecef,#c4e0e5 48%,#eef2ee 49%,#f6f3eb 100%)}.waterBand:before,.waterBand:after{content:"";position:absolute;left:-5%;width:110%;border-top:1px solid rgba(70,115,125,.25);border-radius:50%}.waterBand:before{top:16px;height:18px}.waterBand:after{top:24px;height:20px}.waterlineLabel{position:absolute;left:18px;top:10px;font-size:10px;font-weight:800;letter-spacing:.13em;color:#5e7b80;text-transform:uppercase}
.mapZone{min-height:313px;padding:20px 16px 18px;background:#f6f3eb}.mapTop{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:12px}.mapRouteSummary{max-width:70%;font-size:17px;font-weight:830;line-height:1.14;letter-spacing:-.02em;text-align:right}.mapStage{position:relative;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;min-height:180px}.mapStage.routeLands1{grid-template-columns:minmax(0,1fr);max-width:230px;margin:10px auto 0}.mapStage.routeLands2{grid-template-columns:repeat(2,minmax(0,1fr));max-width:430px;margin:10px auto 0}.mapStage.routeLandsMany{grid-template-columns:repeat(2,minmax(0,1fr));margin-top:10px}.mapStage.routeLands0{display:flex;align-items:center;justify-content:center;min-height:150px}.mapEmpty{max-width:250px;text-align:center;font-size:14px;line-height:1.45;color:#77726a}.continent{position:relative;min-height:93px;border:1px solid #d5d0c4;border-radius:46% 54% 50% 42% / 44% 44% 56% 56%;background:#fbfaf6;padding:12px 8px 9px;display:flex;flex-direction:column;justify-content:center;gap:5px;text-align:center}.continent:nth-child(2n){border-radius:54% 46% 42% 58% / 51% 39% 61% 49%}.continentTitle{font-size:9px;font-weight:840;line-height:1.2;letter-spacing:.07em;text-transform:uppercase;color:#8a8479}.needNode{font-size:10px;line-height:1.15;color:#4d4a45}.needNode.routeTarget{font-weight:850;color:#181818;text-decoration-line:underline;text-decoration-style:dotted;text-decoration-thickness:2px;text-underline-offset:3px}.needNode.routeTarget:before{content:"● ";font-size:8px}.mapHint{font-size:11px;color:#77726a;margin-top:8px;text-align:right}.routeKey{display:none}
.worldDetail{border-left:2px solid #d7d7d1;padding:4px 0 2px 12px;margin:16px 2px 0}.worldDetail h3{font-size:20px;margin:10px 0}.worldDetailBlock{background:#fff;border:1px solid var(--line);border-radius:15px;padding:12px;margin:8px 0}.worldDetailName{font-size:17px;font-weight:800;line-height:1.3}.worldDetailText{font-size:14px;line-height:1.5;color:#5f5f5f;margin-top:5px}.worldDetailImages{display:grid;grid-template-columns:repeat(auto-fit,minmax(78px,1fr));gap:7px;margin-bottom:10px;max-width:360px}.worldDetailImages img{display:block;width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:11px;border:1px solid #e2e2dd}.worldSeparation{font-size:11px;line-height:1.45;color:#77736d;margin:11px 5px 0}.compactReflection{margin-top:8px}.compactReflection .reflectionQuestion{margin-top:8px}.reflectionAnswer{border:1px solid var(--line);background:#fff;border-radius:14px;padding:12px 14px}.reflectionAnswerLabel{font-size:11px;font-weight:820;letter-spacing:.08em;text-transform:uppercase;color:#77736d;margin-bottom:4px}.reflectionAnswerValue{font-size:16px;font-weight:780;line-height:1.35}.worldDetail .perspectiveLabel{margin-top:18px}.detailBack{border:0;background:transparent;padding:0;margin:0 0 18px;color:#555;font-size:14px;font-weight:760;cursor:pointer}.detailBack:focus-visible{outline:2px solid #181818;outline-offset:4px}.result.detailMode>h1,.result.detailMode>#resultLead,.result.detailMode>#saveStatus,.result.detailMode .resultScene,.result.detailMode #worldSeparationNote,.result.detailMode .resultActions{display:none!important}.result.detailMode .resultWorld{margin-top:0}.result.detailMode .worldDetail{border-left:0;padding:0;margin:0}.worldRenderError{margin:18px 0;padding:16px;border:1px solid #c9c7c1;border-radius:16px;background:#fff7f2;font-size:14px;line-height:1.5;color:#4f433d}.suffSheetBackdrop{position:fixed;inset:0;z-index:40;background:rgba(24,24,24,.28);display:flex;align-items:flex-end;justify-content:center;padding:0}.suffSheetBackdrop.hidden{display:none}.suffSheet{width:min(100%,620px);max-height:78vh;overflow:auto;background:#fff;border-radius:24px 24px 0 0;padding:18px 18px 26px;box-shadow:0 -10px 34px rgba(0,0,0,.14)}.suffSheetHead{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-bottom:6px}.suffSheetHead h3{margin:0;font-size:22px}.suffSheetClose{border:1px solid var(--line);background:#fff;border-radius:999px;padding:8px 12px;font-weight:760}.suffSheet .worldDetailBlock{margin-top:12px}.detailWhy{margin-top:12px;padding-top:12px;border-top:1px solid var(--line)}body.suffSheetOpen{overflow:hidden}
@media(max-width:420px){.resultScene{min-height:630px}.shipZone{height:270px}.shipStage{height:196px}.waterBand{height:58px}.mapZone{min-height:302px}.mapStage{gap:7px}.continent{min-height:88px;padding:9px 6px}.continentTitle{font-size:8px}.needNode{font-size:9.5px}}

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
      <div class="resultScene">
        <div id="shipCard" class="sceneZone shipZone">
          <span id="firstLabel" class="sceneEyebrow">Pirmas žvilgsnis</span>
          <span id="firstHeading" class="hidden">Kas iškilo?</span>
          <span class="shipStage">
            <span class="shipGhost" aria-hidden="true">
              <span class="shipMast"></span>
              <span class="shipSail"><span id="shipFocus" class="shipFocus"></span></span>
              <span class="shipHull"></span>
            </span>
            <span id="shipPlaceholder" class="hidden">LAIVAS</span>
            <button id="shipDetailsButton" class="sceneDetailButton shipDetailButton" type="button" aria-controls="attentionDetail" aria-expanded="false"><span id="shipTap">Detalės</span></button>
          </span>
        </div>

        <div class="waterBand" aria-hidden="true"></div>

        <div id="mapCard" class="sceneZone mapZone">
          <span class="mapTop">
            <span id="secondLabel" class="sceneEyebrow">Antras atsakymas</span>
            <span id="mapRoute" class="mapRouteSummary"></span>
          </span>
          <span id="secondHeading" class="hidden">Kur dabar mažiausiai pakanka?</span>
          <span id="mapPlaceholder" class="hidden">ŽEMĖLAPIS</span>
          <span id="needsMapStage" class="mapStage"></span>
          <button id="mapDetailsButton" class="sceneDetailButton mapDetailButton" type="button" aria-controls="suffDetail" aria-expanded="false"><span id="mapTap">Detalės</span></button>
        </div>
      </div>

      <div id="attentionDetail" class="worldDetail detailPagePanel hidden">
        <button id="attentionBack" class="detailBack" type="button">← Grįžti į rezultatą</button>
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

      <div id="suffDetail" class="suffSheetBackdrop hidden" role="presentation">
        <section class="suffSheet" role="dialog" aria-modal="true" aria-labelledby="suffDetailTitle">
          <div class="suffSheetHead"><h3 id="suffDetailTitle"></h3><button id="suffDetailClose" class="suffSheetClose" type="button">Uždaryti</button></div>
          <div id="suffRows" class="rows"></div>
          <p id="suffResultNote" class="resultNote hidden"></p>
        </section>
      </div>

      <p id="worldSeparationNote" class="worldSeparation"></p>
    </div>

    <div class="actions resultActions"><button id="restart" class="primary">Atlikti dar kartą</button><a id="back2rasi" class="secondary actionLink" href="https://2rasi.lt/#experiments">Grįžti į 2rasi</a><button id="export" class="secondary hidden">Eksportuoti JSON</button></div>
    <p id="exportStatus" class="note hidden"></p>
    <details id="debugDetails" class="perspective hidden"><summary>Tyrimo diagnostika</summary><pre id="debug" class="debug"></pre></details>
  </section>
`
const resultStart=html.indexOf('  <section id="result" class="screen result">');
const resultEndMarker='  </section>\n</div>\n<script type="module">';
const resultEnd=html.indexOf(resultEndMarker,resultStart);
if(resultStart<0||resultEnd<0)throw new Error('result section anchors missing');
html=html.slice(0,resultStart)+resultHtml+html.slice(resultEnd+'  </section>\n'.length);


const importAnchor="import { assignOpen14ThreeExemplars, listThreeExemplarBankProblems } from './open14_no_repeat_assigner_v03.mjs';";
html=replaceOnce(html,importAnchor,importAnchor+"\nimport { SESSION_SCHEMA_V04, DRAFT_KEY_BASE_V04, resolveAttentionFromChoices, applyAttentionClarifier, resolveSufficiencyRoute, applySufficiencyClarifier } from './adaptive_clarifiers_v04.mjs';\nimport { renderResultWorldV04 } from './result_renderer_v04.mjs?v=scene4';",'assigner import');
html=replaceOnce(html,"const DRAFT_KEY_BASE='priolens.open14.v031.rank.draft';","const DRAFT_KEY_BASE=DRAFT_KEY_BASE_V04;",'draft key');
html=replaceOnce(html,'const DRAFT_KEY=`${DRAFT_KEY_BASE}.${LANG}`;','const DRAFT_KEY=`${DRAFT_KEY_BASE}.${LANG}`;\nconst RESULT_KEY_BASE=\'priolens.open14.v04.last-result\';\nconst RESULT_KEY=`${RESULT_KEY_BASE}.${LANG}`;\nconst RESULT_MAX_AGE_MS=90*24*60*60*1000;','completed result key');
html=html.replaceAll("'2rasi.priolens.open14.rank-session-v0.3'","SESSION_SCHEMA_V04");
html=replaceOnce(html,"const API_PATH='/priolens-open14-v03-api/api.php';","const API_PATH='/priolens-open14-v04-api/api.php';",'v0.4 API path');
html=replaceOnce(html,"const PROGRESS_PATH='/priolens-open14-v03-api/progress.php';","const PROGRESS_PATH='/priolens-open14-v04-api/progress.php';",'v0.4 progress path');

const stateNeedle="sufficiencySchema:'2rasi.priolens.sufficiency-v0.2',sufficiency:{},selfExplanation:null,pendingMost:null,completedAt:null";
const stateReplacement="sufficiencySchema:'2rasi.priolens.sufficiency-v0.2',sufficiency:{},attentionResolution:null,attentionClarifier:null,attentionFocus:null,sufficiencyResolution:null,sufficiencyClarifier:null,sufficiencyRoute:null,selfExplanation:null,pendingMost:null,systemSmoke:new URLSearchParams(location.search).get('systemSmoke')==='1',completedAt:null";
html=replaceOnce(html,stateNeedle,stateReplacement,'startSession state fields');
const localDraftClearAnchor="function clearLocalDraft(){try{localStorage.removeItem(DRAFT_KEY);if(LANG==='lt')localStorage.removeItem(DRAFT_KEY_BASE)}catch(err){console.warn('local draft clear failed',err)}}";
const completedResultHelpers=`function saveLocalResult(){if(!state?.completedAt)return;try{localStorage.setItem(RESULT_KEY,JSON.stringify(state))}catch(err){console.warn('local result save failed',err)}}
function clearLocalResult(){try{localStorage.removeItem(RESULT_KEY)}catch(err){console.warn('local result clear failed',err)}}
function loadLocalResult(){try{const raw=localStorage.getItem(RESULT_KEY);if(!raw)return null;const x=JSON.parse(raw);if(!x||x.schema!==SESSION_SCHEMA_V04||!x.completedAt||!Array.isArray(x.choices)||x.choices.length!==14||!x.sufficiency){clearLocalResult();return null}if(x.language&&x.language!==LANG)return null;if(bank&&x.bankSchema!==bank.schema){clearLocalResult();return null}const completedAt=Date.parse(x.completedAt);if(!Number.isFinite(completedAt)||Date.now()-completedAt>RESULT_MAX_AGE_MS){clearLocalResult();return null}return x}catch(err){console.warn('local result load failed',err);return null}}
function restoreLastResultIfAvailable(){if(loadLocalDraft())return false;const x=loadLocalResult();if(!x)return false;state=x;ensureV04StateFields();show('result');renderResult();const el=$('saveStatus');if(state.submission?.ok===true){el.textContent=LANG==='en'?'Previous anonymous research session restored.':'Ankstesnė anoniminė tyrimo sesija atkurta.';el.className='note ok'}else if(state.submission?.ok===false){el.textContent=LANG==='en'?'Result restored. The previous automatic save failed.':'Rezultatas atkurtas. Ankstesnis automatinis išsaugojimas nepavyko.';el.className='note bad'}else{el.textContent=LANG==='en'?'Previous result restored on this device.':'Ankstesnis rezultatas atkurtas šiame įrenginyje.';el.className='note'}return true}`;
html=replaceOnce(html,localDraftClearAnchor,localDraftClearAnchor+'\n'+completedResultHelpers,'completed result storage');
html=replaceOnce(html,"$('start').disabled=false;$('bankCard').classList.add('ready');offerResumeIfAvailable()","$('start').disabled=false;$('bankCard').classList.add('ready');if(!restoreLastResultIfAvailable())offerResumeIfAvailable()",'restore completed result on init');
html=replaceOnce(html,"state.submission={ok:true,inserted:Boolean(data.inserted),submissionId:data.submissionId||null};clearLocalDraft();","state.submission={ok:true,inserted:Boolean(data.inserted),submissionId:data.submissionId||null};saveLocalResult();clearLocalDraft();",'completed result after submit success');
html=replaceOnce(html,"state.submission={ok:false,error:String(err)};el.textContent=T.saveFailed;","state.submission={ok:false,error:String(err)};saveLocalResult();el.textContent=T.saveFailed;",'completed result after submit failure');
html=replaceOnce(html,"state.rankProtocol='most+least+a-plus+b-plus-v0.4';show('result');renderResult();finalSubmitPromise=submitSession()","state.rankProtocol='most+least+a-plus+b-plus-v0.4';saveLocalResult();show('result');renderResult();finalSubmitPromise=submitSession()",'snapshot completed result before submit');
html=replaceOnce(html,"state.selfExplanationSave={ok:true,at:new Date().toISOString()};","state.selfExplanationSave={ok:true,at:new Date().toISOString()};saveLocalResult();",'persist restored self explanation success');
html=replaceOnce(html,"state.selfExplanationSave={ok:false,error:String(err)};","state.selfExplanationSave={ok:false,error:String(err)};saveLocalResult();",'persist restored self explanation failure');
html=replaceOnce(html,"$('restart').onclick=()=>{clearLocalDraft();location.reload()}","$('restart').onclick=()=>{clearLocalDraft();clearLocalResult();location.reload()}",'restart clears completed result');


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
  try{
    renderResultWorldV04({
      state,
      lang:LANG,
      familyLabels:FAMILY_LABEL,
      itemLabels:ITEM_RESULT_LABEL,
      reasonOptions:SELF_REASON_OPTIONS[LANG],
      onSelfExplanation:async ({familyId,reasonCode,statusEl})=>{
        state.selfExplanation={schema:'2rasi.priolens.self-explanation-v0.1',familyId,scenario:'ATTENTION_DETAIL_V04',reasonCode,answeredAt:new Date().toISOString()};
        saveLocalResult();
        await persistSelfExplanation(statusEl);
      }
    });
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
for(const name of ['bank.json','p3_open14_planner_v02.mjs','open14_no_repeat_assigner_v03.mjs','stimulus-bank.html'])write(name,read(name));
if(!fs.existsSync(path.join(outDir,'result_world_v04.mjs'))||!fs.existsSync(path.join(outDir,'result_renderer_v04.mjs')))throw new Error('v0.4 result modules missing');
if(!html.includes('id="needsMapStage"')||!html.includes('class="resultScene"'))throw new Error('unified result scene missing');
if(!html.includes('id="shipDetailsButton"')||!html.includes('id="mapDetailsButton"')||!html.includes('id="attentionBack"')||!html.includes('id="suffDetailClose"'))throw new Error('result detail navigation missing');
console.log('open14-v04 build: PASS');
