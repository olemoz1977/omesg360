from pathlib import Path


def repl(text, old, new, label):
    if old not in text:
        raise SystemExit(f"missing patch anchor: {label}")
    return text.replace(old, new, 1)

# Final API: allow an existing partial checkpoint row to be finalized.
p = Path("priolens/open14-v02/server/api.php")
api = p.read_text()
api = repl(api, "INSERT IGNORE INTO priolens_open14_sessions", "INSERT INTO priolens_open14_sessions", "api insert")
api = repl(
    api,
    'VALUES (?,?,?,?,?,?,?,?,?,?)");',
    '''VALUES (?,?,?,?,?,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE
          session_schema=VALUES(session_schema),
          bank_schema=VALUES(bank_schema),
          planner_schema=VALUES(planner_schema),
          assigner_schema=VALUES(assigner_schema),
          seed=VALUES(seed),
          started_at_client=VALUES(started_at_client),
          completed_at_client=VALUES(completed_at_client),
          payload_json=VALUES(payload_json)");''',
    "api upsert",
)
p.write_text(api)

# Runtime UI + persistence.
p = Path("priolens/open14-v02/index.html")
h = p.read_text()
old_css = ".scale{display:grid;grid-template-columns:repeat(6,1fr);gap:5px}.scale button{border:1px solid var(--line);background:#fff;border-radius:10px;min-height:38px;font-size:12px;padding:5px}.scale button.on{background:#1d1d1d;color:#fff;border-color:#1d1d1d}.scale button.na{font-size:10px;color:#777}.scale button.na.on{color:#fff}.suffNav{display:flex;justify-content:space-between;gap:8px;margin-top:14px}"
new_css = ".scale{display:grid;gap:9px}.rangeRow{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:center}.rangeBox{min-width:0}.rangeBox input[type=range]{width:100%;margin:2px 0 0;accent-color:#1d1d1d}.rangeBox input[type=range].unset{opacity:.48}.rangeLabels{display:flex;justify-content:space-between;gap:10px;font-size:11px;color:#777;margin-top:1px}.scale button.na{border:1px solid var(--line);background:#fff;border-radius:10px;min-height:38px;font-size:11px;color:#666;padding:7px 10px;white-space:nowrap}.scale button.na.on{background:#1d1d1d;color:#fff;border-color:#1d1d1d}.autosaveNote{font-size:11px;color:#777;margin-top:6px}.suffNav{display:flex;justify-content:space-between;gap:8px;margin-top:14px}"
h = repl(h, old_css, new_css, "slider css")
h = repl(h, "@media(max-width:620px){.scale{grid-template-columns:repeat(3,1fr)}}", "@media(max-width:620px){.rangeRow{grid-template-columns:1fr}.scale button.na{justify-self:start}}", "mobile slider css")
h = repl(h, "const API_PATH='/priolens-open14-api/api.php';", "const API_PATH='/priolens-open14-api/api.php';\nconst PROGRESS_PATH='/priolens-open14-api/progress.php';\nconst DRAFT_KEY='priolens.open14.v02.draft';", "progress constants")
anchor = "let bank=null,assignment=null,state=null,t0=0,locked=false,suffIndex=0,lastPointerType=null;"
helpers = r'''let bank=null,assignment=null,state=null,t0=0,locked=false,suffIndex=0,lastPointerType=null,progressTimer=null;
function saveLocalDraft(){if(!state||state.completedAt)return;try{localStorage.setItem(DRAFT_KEY,JSON.stringify(state))}catch(err){console.warn('local draft save failed',err)}}
function clearLocalDraft(){try{localStorage.removeItem(DRAFT_KEY)}catch(err){console.warn('local draft clear failed',err)}}
function loadLocalDraft(){try{const raw=localStorage.getItem(DRAFT_KEY);if(!raw)return null;const x=JSON.parse(raw);if(!x||x.schema!=='2rasi.priolens.open14.session-v0.2'||x.completedAt||!Array.isArray(x.choices)||!x.sufficiency)return null;return x}catch(err){return null}}
async function postProgress(){if(!state||state.completedAt)return;try{await fetch(PROGRESS_PATH,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(state),keepalive:true})}catch(err){console.warn('progress checkpoint failed',err)}}
function checkpointProgress(){saveLocalDraft();clearTimeout(progressTimer);progressTimer=setTimeout(()=>postProgress(),250)}
function offerResumeIfAvailable(){const d=loadLocalDraft();if(!d)return;if(bank&&d.bankSchema!==bank.schema){clearLocalDraft();return}$('bankStatus').textContent=`Rasta nebaigta sesija: ${d.choices.length}/14 vaizdinių pasirinkimų. Gali tęsti nuo tos vietos.`;$('start').textContent='Tęsti sesiją';$('start').dataset.resume='1';if(!$('newSession')){const b=document.createElement('button');b.id='newSession';b.className='secondary';b.textContent='Pradėti naują';b.onclick=()=>{clearLocalDraft();$('start').dataset.resume='';$('start').textContent='Pradėti';b.remove();startSession().catch(err=>{alert(String(err));console.error(err)})};$('start').parentElement.appendChild(b)}}
async function resumeSession(){const d=loadLocalDraft();if(!d)return startSession();const plan=buildOpen14Plan(d.seed);assignment=assignOpen14Exemplars(plan,bank,d.seed);await preload(assignment.trials.flatMap(t=>t.stimuli.map(s=>s.runtimePath)));state=d;if(state.choices.length<14){show('trial');renderTrial();return}const firstIncomplete=DOMAINS.findIndex(dom=>dom.items.some(([k])=>!Object.prototype.hasOwnProperty.call(state.sufficiency,k)));if(firstIncomplete>=0){suffIndex=firstIncomplete;show('suff');renderSuff();return}finish()}'''
h = repl(h, anchor, helpers, "persistence helpers")
h = repl(h, "$('start').disabled=false}catch(err)", "$('start').disabled=false;offerResumeIfAvailable()}catch(err)", "resume offer")
old_start = "async function startSession(){const seed=seedNow(),plan=buildOpen14Plan(seed);assignment=assignOpen14Exemplars(plan,bank,seed);await preload(assignment.trials.flatMap(t=>t.stimuli.map(s=>s.runtimePath)));state={schema:'2rasi.priolens.open14.session-v0.2',sessionUuid:crypto.randomUUID(),startedAt:new Date().toISOString(),seed,planSchema:plan.schema,bankSchema:bank.schema,assignerSchema:assignment.schema,plannerAudit:plan.audit,exemplarAudit:assignment.audit,exemplarPlan:assignment.exemplarPlan,choices:[],sufficiencySchema:'2rasi.priolens.sufficiency-v0.2',sufficiency:{},completedAt:null};suffIndex=0;show('trial');renderTrial()}"
new_start = "async function startSession(){clearLocalDraft();const seed=seedNow(),plan=buildOpen14Plan(seed);assignment=assignOpen14Exemplars(plan,bank,seed);await preload(assignment.trials.flatMap(t=>t.stimuli.map(s=>s.runtimePath)));state={schema:'2rasi.priolens.open14.session-v0.2',sessionUuid:crypto.randomUUID(),startedAt:new Date().toISOString(),seed,planSchema:plan.schema,bankSchema:bank.schema,assignerSchema:assignment.schema,plannerAudit:plan.audit,exemplarAudit:assignment.audit,exemplarPlan:assignment.exemplarPlan,choices:[],sufficiencySchema:'2rasi.priolens.sufficiency-v0.2',sufficiency:{},completedAt:null};suffIndex=0;checkpointProgress();show('trial');renderTrial()}"
h = repl(h, old_start, new_start, "start checkpoint")
h = repl(h, "pointerType:lastPointerType||null});setTimeout(()=>", "pointerType:lastPointerType||null});checkpointProgress();setTimeout(()=>", "choice checkpoint")
old_render = "function renderSuff(){const d=DOMAINS[suffIndex];$('suffCount').textContent=`${suffIndex+1} / 6`;$('suffBack').disabled=suffIndex===0;$('suffNext').textContent=suffIndex===5?'Pamatyti rezultatą':'Toliau';const mount=$('domainMount');mount.innerHTML='';const card=document.createElement('div');card.className='domainCard';card.innerHTML=`<div class=\"domainTitle\">${d.title}</div>`;d.items.forEach(([key,text])=>{const item=document.createElement('div');item.className='item';item.innerHTML=`<div class=\"statement\">${text}</div><div class=\"scale\"></div>`;const scale=item.querySelector('.scale');[1,2,3,4,5,null].forEach(v=>{const b=document.createElement('button');b.type='button';b.className=v===null?'na':'';b.textContent=v===null?'Sunku pasakyti':String(v);const current=Object.prototype.hasOwnProperty.call(state.sufficiency,key)?state.sufficiency[key]:undefined;if(current===v)b.classList.add('on');b.onclick=()=>{state.sufficiency[key]=v;renderSuff()};scale.appendChild(b)});card.appendChild(item)});mount.appendChild(card)}"
new_render = r'''function renderSuff(){const d=DOMAINS[suffIndex];$('suffCount').textContent=`${suffIndex+1} / 6`;$('suffBack').disabled=suffIndex===0;$('suffNext').textContent=suffIndex===5?'Pamatyti rezultatą':'Toliau';const mount=$('domainMount');mount.innerHTML='';const card=document.createElement('div');card.className='domainCard';card.innerHTML=`<div class="domainTitle">${d.title}</div>`;d.items.forEach(([key,text])=>{const item=document.createElement('div');item.className='item';item.innerHTML=`<div class="statement">${text}</div><div class="scale"><div class="rangeRow"><div class="rangeBox"><input type="range" min="1" max="5" step="1" aria-label="Nuo labai trūksta iki pakanka"><div class="rangeLabels"><span>Labai trūksta</span><span>Pakanka</span></div></div><button type="button" class="na">Sunku pasakyti</button></div></div>`;const current=Object.prototype.hasOwnProperty.call(state.sufficiency,key)?state.sufficiency[key]:undefined;const slider=item.querySelector('input[type=range]'),na=item.querySelector('button.na');slider.value=Number.isFinite(current)?current:3;if(!Number.isFinite(current))slider.classList.add('unset');if(current===null)na.classList.add('on');slider.oninput=()=>{slider.classList.remove('unset');na.classList.remove('on');state.sufficiency[key]=Number(slider.value);saveLocalDraft()};slider.onchange=()=>{state.sufficiency[key]=Number(slider.value);checkpointProgress()};na.onclick=()=>{state.sufficiency[key]=null;checkpointProgress();renderSuff()};card.appendChild(item)});const n=document.createElement('div');n.className='autosaveNote';n.textContent='Progresas saugomas automatiškai. Nutrūkus galėsi tęsti šiame įrenginyje.';card.appendChild(n);mount.appendChild(card)}'''
h = repl(h, old_render, new_render, "slider render")
h = repl(h, "state.submission={ok:true,inserted:Boolean(data.inserted),submissionId:data.submissionId||null};el.textContent='Anoniminė tyrimo sesija išsaugota.';", "state.submission={ok:true,inserted:Boolean(data.inserted),submissionId:data.submissionId||null};clearLocalDraft();el.textContent='Anoniminė tyrimo sesija išsaugota.';", "clear final draft")
h = repl(h, "$('start').onclick=()=>startSession().catch(err=>{alert(String(err));console.error(err)});$('restart').onclick=()=>location.reload();", "$('start').onclick=()=>($('start').dataset.resume==='1'?resumeSession():startSession()).catch(err=>{alert(String(err));console.error(err)});$('restart').onclick=()=>{clearLocalDraft();location.reload()};", "resume click")
h = repl(h, "\ninit();\n</script>", "\nwindow.addEventListener('pagehide',()=>{if(state&&!state.completedAt){saveLocalDraft();try{navigator.sendBeacon(PROGRESS_PATH,new Blob([JSON.stringify(state)],{type:'application/json'}))}catch(err){}}});\ninit();\n</script>", "pagehide checkpoint")
p.write_text(h)

print('PATCH_OK')
