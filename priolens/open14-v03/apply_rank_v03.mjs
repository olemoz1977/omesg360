import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const indexPath=path.resolve(here,'index.html');

function countOf(text,needle){
  if(!needle) throw new Error('Empty replacement needle');
  return text.split(needle).length-1;
}
function replaceN(text,from,to,expected=1,label=from.slice(0,60)){
  const count=countOf(text,from);
  if(count!==expected) throw new Error(`Rank patch guard failed for ${label}: expected ${expected}, found ${count}`);
  return text.split(from).join(to);
}
function replaceRegexOne(text,re,to,label){
  const matches=[...text.matchAll(new RegExp(re.source,re.flags.includes('g')?re.flags:re.flags+'g'))];
  if(matches.length!==1) throw new Error(`Rank regex guard failed for ${label}: expected 1, found ${matches.length}`);
  return text.replace(re,to);
}

let html=fs.readFileSync(indexPath,'utf8');

html=replaceN(html,"const DRAFT_KEY_BASE='priolens.open14.v03.draft';","const DRAFT_KEY_BASE='priolens.open14.v03.rank.draft';",1,'rank draft key');
html=replaceN(html,'2rasi.priolens.open14.session-v0.3','2rasi.priolens.open14.rank-session-v0.3',2,'rank session schema');

html=replaceN(html,
  "introLead:'Trys vaizdai vienu metu. Nesvarstyk, kuris „geresnis“. Pasirink tą, į kurį pirmiausia krypsta dėmesys.',introNote1:'14 trumpų pasirinkimų · apie 2 min. Po jų į tą pačią situaciją pažvelgsi iš kitos perspektyvos.'",
  "introLead:'Trys vaizdai vienu metu. Pirmiausia pasirink, kuris patraukia. Tada iš likusių dviejų pažymėk, kuris traukia mažiausiai.',introNote1:'14 trumpų trijulių · apie 3 min. Po jų į tą pačią situaciją pažvelgsi iš kitos perspektyvos.'",1,'LT rank intro');
html=replaceN(html,
  "introLead:'Three images at a time. Do not decide which one is “better”. Choose the one your attention goes to first.',introNote1:'14 quick choices · about 2 min. After them, you will look at the same moment from a different perspective.'",
  "introLead:'Three images at a time. First choose which one pulls you. Then, from the other two, mark which one pulls you least.',introNote1:'14 quick triads · about 3 min. After them, you will look at the same moment from a different perspective.'",1,'EN rank intro');

html=replaceN(html,'\n#suff.active{',"\n.stim.most img{border:4px solid #181818}.stim.most::after{content:'PIRMAS';position:absolute;left:12px;top:8px;background:#181818;color:#fff;font-size:10px;font-weight:850;letter-spacing:.07em;padding:5px 7px;border-radius:999px}.stim{position:relative}.stim:disabled{cursor:default}.rankHint{font-size:12px;color:#666;margin-top:2px}.rankLeastNote{font-size:14px;line-height:1.5;color:#666;margin:8px 2px 0}\n#suff.active{",1,'rank CSS');
html=replaceN(html,
  '<div class="trialhead"><div class="q">Kuris pirmas patraukia?</div><div id="counter" class="count">1 / 14</div></div>',
  '<div class="trialhead"><div><div id="trialQuestion" class="q">Kuris pirmas patraukia?</div><div id="trialHint" class="rankHint">Rinkis pirmą impulsą.</div></div><div id="counter" class="count">1 / 14</div></div>',1,'rank trial head');
html=replaceN(html,'<button id="none" class="none">Nė vienas aiškiai</button>','<button id="noneMost" class="none">Nė vienas aiškiai</button><button id="tieLeast" class="none hidden">Abu likę panašiai</button>',1,'rank actions');

const resultNeedle='      <div id="repeatRows" class="rows"></div>\n      <p id="attentionNote" class="resultNote hidden"></p>\n    </div>\n\n    <div class="perspective">';
const resultReplacement='      <div id="repeatRows" class="rows"></div>\n      <p id="attentionNote" class="resultNote hidden"></p>\n    </div>\n\n    <div class="perspective">\n      <p id="leastLabel" class="perspectiveLabel">Tavo pasirinkimai</p>\n      <h2 id="leastHeading">Kas liko antrame plane?</h2>\n      <div id="leastRows" class="rows"></div>\n      <p id="leastNote" class="rankLeastNote">Tai nereiškia, kad šie dalykai tau nesvarbūs. Tik tiek, kad jų vaizdai šį kartą dažniau traukė mažiau nei kiti.</p>\n    </div>\n\n    <div class="perspective">';
html=replaceN(html,resultNeedle,resultReplacement,1,'rank result least section');

const rankCopy="const T=TXT[LANG];\nconst RANK_TXT={\n  lt:{mostQ:'Kuris pirmas patraukia?',mostHint:'Rinkis pirmą impulsą.',leastQ:'O kuris iš likusių traukia mažiausiai?',leastHint:'Pirmo pasirinkimo nebekeičiame. Žiūrėk tik į kitus du.',noneMost:'Nė vienas aiškiai',tieLeast:'Abu likę panašiai',leastLabel:'Tavo pasirinkimai',leastHeading:'Kas liko antrame plane?',leastNote:'Tai nereiškia, kad šie dalykai tau nesvarbūs. Tik tiek, kad jų vaizdai šį kartą dažniau traukė mažiau nei kiti.',noLeast:'Aiškaus 2/3 ar 3/3 pasikartojimo tarp mažiausiai traukusių nebuvo.'},\n  en:{mostQ:'Which pulls you first?',mostHint:'Choose the first impulse.',leastQ:'And which of the other two pulls you least?',leastHint:'Your first choice is fixed. Look only at the other two.',noneMost:'None clearly',tieLeast:'The other two feel similar',leastLabel:'Your choices',leastHeading:'What stayed in the background?',leastNote:'This does not mean these things are unimportant to you. It only means their images pulled you less often than the others in this session.',noLeast:'There was no clear 2/3 or 3/3 repetition among the least-pulling images.'}\n};\nconst R=RANK_TXT[LANG];";
html=replaceN(html,'const T=TXT[LANG];',rankCopy,1,'rank bilingual copy');
html=replaceN(html,
  "$('prototypePill').textContent=T.prototypeLabel;$('bankTitle').textContent=T.bankChecking;$('bankStatus').textContent=T.bankCheckingStatus;$('start').textContent=T.start;$('exit2rasi').textContent=T.exit;",
  "$('prototypePill').textContent=T.prototypeLabel;$('bankTitle').textContent=T.bankChecking;$('bankStatus').textContent=T.bankCheckingStatus;$('start').textContent=T.start;$('exit2rasi').textContent=T.exit;$('noneMost').textContent=R.noneMost;$('tieLeast').textContent=R.tieLeast;$('leastLabel').textContent=R.leastLabel;$('leastHeading').textContent=R.leastHeading;$('leastNote').textContent=R.leastNote;",1,'rank language application');
html=replaceN(html,"document.querySelector('.trialhead .q').textContent=T.trialQuestion;$('none').textContent=T.none;","$('trialQuestion').textContent=R.mostQ;$('trialHint').textContent=R.mostHint;",1,'rank trial language legacy cleanup');
html=replaceN(html,'selfExplanation:null,completedAt:null};','selfExplanation:null,pendingMost:null,completedAt:null};',1,'pendingMost');

const trialBlock=[
"function renderTrial(){locked=false;$('stage').classList.remove('locked');const i=state.choices.length,trial=assignment.trials[i],leastPhase=Boolean(state.pendingMost);$('counter').textContent=`${i+1} / 14`;$('prog').style.width=`${(i/14)*100}%`;$('trialQuestion').textContent=leastPhase?R.leastQ:R.mostQ;$('trialHint').textContent=leastPhase?R.leastHint:R.mostHint;$('noneMost').classList.toggle('hidden',leastPhase);$('tieLeast').classList.toggle('hidden',!leastPhase);trial.stimuli.forEach((s,slot)=>{const b=stimBtns[slot],img=b.querySelector('img');img.src=s.runtimePath;img.dataset.exemplar=s.exemplarId;img.alt='';b.disabled=false;b.classList.remove('most');if(leastPhase&&state.pendingMost?.slot===slot){b.disabled=true;b.classList.add('most')}});doublePaint(()=>{t0=performance.now()})}",
"function finishVisualTrial(leastSlot=null,leastTie=null){if(locked)return;locked=true;$('stage').classList.add('locked');const i=state.choices.length,trial=assignment.trials[i],pm=state.pendingMost,most=pm?trial.stimuli[pm.slot]:null,least=Number.isInteger(leastSlot)?trial.stimuli[leastSlot]:null,leastRt=most?Math.round(performance.now()-t0):null;state.choices.push({trialId:trial.trialId,trialIndex:i+1,designIndex:trial.designIndex,positions:trial.positions,stimuli:trial.stimuli.map(s=>({familyId:s.familyId,macro:s.macro,exemplarId:s.exemplarId,slot:s.slot,runtimePath:s.runtimePath})),choice:most?{familyId:most.familyId,macro:most.macro,exemplarId:most.exemplarId,slot:pm.slot}:null,noClearChoice:!most,rtMs:pm?.rtMs??null,pointerType:pm?.pointerType??null,leastChoice:least?{familyId:least.familyId,macro:least.macro,exemplarId:least.exemplarId,slot:leastSlot}:null,leastTie:most?Boolean(leastTie):null,leastRtMs:leastRt,leastPointerType:most?(lastPointerType||null):null});state.pendingMost=null;checkpointProgress();setTimeout(()=>{if(state.choices.length<14)renderTrial();else{show('suff');renderSuff()}},120)}",
"function chooseMost(slot){if(locked||state.pendingMost)return;locked=true;$('stage').classList.add('locked');const trial=assignment.trials[state.choices.length],stim=trial.stimuli[slot];state.pendingMost={slot,familyId:stim.familyId,exemplarId:stim.exemplarId,rtMs:Math.round(performance.now()-t0),pointerType:lastPointerType||null};checkpointProgress();setTimeout(renderTrial,90)}",
"function chooseLeast(slot){if(locked||!state.pendingMost||state.pendingMost.slot===slot)return;finishVisualTrial(slot,false)}",
"stimBtns.forEach(b=>{b.addEventListener('pointerdown',e=>lastPointerType=e.pointerType);b.addEventListener('click',()=>state.pendingMost?chooseLeast(Number(b.dataset.slot)):chooseMost(Number(b.dataset.slot)))});$('noneMost').addEventListener('pointerdown',e=>lastPointerType=e.pointerType);$('noneMost').addEventListener('click',()=>{if(locked||state.pendingMost)return;state.pendingMost=null;finishVisualTrial(null,null)});$('tieLeast').addEventListener('pointerdown',e=>lastPointerType=e.pointerType);$('tieLeast').addEventListener('click',()=>{if(!state.pendingMost)return;finishVisualTrial(null,true)});"
].join('\n');
html=replaceRegexOne(html,/function renderTrial\(\)\{[\s\S]*?\nfunction renderSuff\(\)/,trialBlock+'\nfunction renderSuff()','rank trial block');

const statsBlock="function familyStats(){const out=Object.fromEntries(FAMILY_SET.map(f=>[f.id,{shown:0,chosen:0,least:0,shownExemplarIds:[],chosenExemplarIds:[],leastExemplarIds:[],crossExemplar:false,crossLeastExemplar:false,balance:0}]));const shownSets=Object.fromEntries(FAMILY_SET.map(f=>[f.id,new Set()])),chosenSets=Object.fromEntries(FAMILY_SET.map(f=>[f.id,new Set()])),leastSets=Object.fromEntries(FAMILY_SET.map(f=>[f.id,new Set()]));for(const c of state.choices){for(const s of c.stimuli){const x=out[s.familyId];x.shown++;shownSets[s.familyId].add(s.exemplarId)}if(c.choice){const x=out[c.choice.familyId];x.chosen++;chosenSets[c.choice.familyId].add(c.choice.exemplarId)}if(c.leastChoice){const x=out[c.leastChoice.familyId];x.least++;leastSets[c.leastChoice.familyId].add(c.leastChoice.exemplarId)}}for(const [id,x] of Object.entries(out)){x.shownExemplarIds=[...shownSets[id]];x.chosenExemplarIds=[...chosenSets[id]];x.leastExemplarIds=[...leastSets[id]];x.crossExemplar=x.chosenExemplarIds.length>=2;x.crossLeastExemplar=x.leastExemplarIds.length>=2;x.strongMost=x.chosen>=2&&x.crossExemplar;x.strongLeast=x.least>=2&&x.crossLeastExemplar;x.balance=x.chosen-x.least;x.rate=x.shown?x.chosen/x.shown:0;x.exemplarConcentrated=x.chosen>=2&&!x.crossExemplar}return out}";
html=replaceRegexOne(html,/function familyStats\(\)\{[\s\S]*?return out\}\nfunction domainCoverage/,statsBlock+'\nfunction domainCoverage','rank family stats');

const leastHelpers=[
"function leastImagePaths(id){const seen=new Set(),paths=[];for(const c of state.choices){if(c.leastChoice?.familyId!==id)continue;const stim=c.stimuli.find(x=>x.exemplarId===c.leastChoice.exemplarId);if(stim?.runtimePath&&!seen.has(stim.runtimePath)){seen.add(stim.runtimePath);paths.push(stim.runtimePath)}}return paths}",
"function addLeastChoiceInsight(mount,id,x){const r=document.createElement('div');r.className='choiceInsight';const images=leastImagePaths(id).slice(0,2).map(src=>`<img src=\"${src}\" alt=\"\">`).join('');r.innerHTML=`<div class=\"choiceVisuals\">${images}</div><div class=\"choiceMeta\"><div class=\"insightTitle\">${FAMILY_LABEL[id]}</div><span class=\"choiceCount\">${x.least}/3</span></div><div class=\"choiceMeaning\">${FAMILY_MEANING[id]}</div>`;mount.appendChild(r)}"
].join('\n');
html=replaceN(html,'function countPhrase(n){',leastHelpers+'\nfunction countPhrase(n){',1,'least result helpers');

const repeatedNeedle="if(repeated.length){attentionNote.textContent=C.attentionNote;attentionNote.classList.remove('hidden')}else{attentionNote.textContent='';attentionNote.classList.add('hidden')}";
html=replaceN(html,repeatedNeedle,repeatedNeedle+"\n  const leastMount=$('leastRows');leastMount.innerHTML='';const leastRepeated=Object.entries(state.familyStats).filter(([,x])=>x.least>=2&&x.crossLeastExemplar).sort((a,b)=>b[1].least-a[1].least);if(!leastRepeated.length)addInsight(leastMount,R.noLeast,'','');else leastRepeated.forEach(([id,x])=>addLeastChoiceInsight(leastMount,id,x));",1,'least result rendering');

html=replaceN(html,
  "state.rtMedianMs=median(state.choices.map(x=>x.rtMs));state.noClearChoiceCount=state.choices.filter(x=>x.noClearChoice).length;",
  "state.rtMedianMs=median(state.choices.map(x=>x.rtMs));state.leastRtMedianMs=median(state.choices.map(x=>x.leastRtMs));state.noClearChoiceCount=state.choices.filter(x=>x.noClearChoice).length;state.leastTieCount=state.choices.filter(x=>x.leastTie===true).length;state.leastObservedCount=state.choices.filter(x=>x.leastChoice||x.leastTie===true).length;state.rankProtocol='most+least-v0.3';",1,'rank telemetry');

const forbidden=["priolens.open14.v03.draft'",'2rasi.priolens.open14.session-v0.3','id="none"',"$('none').",'function choose(slot)'];
for(const token of forbidden) if(html.includes(token)) throw new Error(`Rank build still contains forbidden positive-only token: ${token}`);
for(const token of ['2rasi.priolens.open14.rank-session-v0.3','leastChoice','crossLeastExemplar','id="tieLeast"','id="leastRows"','rankProtocol']) if(!html.includes(token)) throw new Error(`Rank build missing required token: ${token}`);

fs.writeFileSync(indexPath,html,'utf8');
console.log(JSON.stringify({ok:true,indexPath,bytes:Buffer.byteLength(html),sessionSchema:'2rasi.priolens.open14.rank-session-v0.3',protocol:'most+least-v0.3'},null,2));
