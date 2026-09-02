from pathlib import Path
import re

p = Path('priolens/open14-v02/index.html')
s = p.read_text()


def replace_once(old, new, label):
    global s
    n = s.count(old)
    if n != 1:
        raise SystemExit(f'{label}: expected exactly 1 match, found {n}')
    s = s.replace(old, new, 1)


replace_once(
    '<title>PrioLens Open14 v0.2 · Research</title>',
    '<title>PrioLens · 2rasi</title>',
    'document title'
)

replace_once(
    '.result h1{font-size:42px}.summaryCard{background:#fff;border:1px solid var(--line);border-radius:18px;padding:16px 16px;margin:18px 0 24px}.summaryCard h2{font-size:22px;margin:0 0 10px}.summaryText{font-size:18px;line-height:1.48;margin:0}.summaryNext{font-size:15px;line-height:1.55;color:#555;margin:12px 0 0}.resultActions{align-items:stretch}.actionLink{display:inline-flex;align-items:center;justify-content:center;text-decoration:none}.section{margin:24px 0}.section h2{font-size:19px;margin:0 0 10px}.rows{display:grid;gap:8px}.row{padding:12px 14px}.rowtop{display:flex;justify-content:space-between;gap:10px}.name{font-weight:760}.score{font-size:13px;color:#666}.cue{font-size:12px;color:#777;margin-top:3px}.bar{height:7px;background:#ecece8;border-radius:8px;margin-top:9px;overflow:hidden}.bar i{display:block;height:100%;background:#252525}.debug{font-size:12px;color:#777;white-space:pre-wrap;background:#fff;border:1px solid var(--line);border-radius:14px;padding:12px;overflow:auto}.hidden{display:none!important}@media(max-width:620px){.rangeRow{grid-template-columns:1fr}.scale button.na{justify-self:start}}',
    '.result{max-width:760px;margin:0 auto}.result h1{font-size:clamp(38px,8vw,54px);margin-bottom:12px}.resultLead{font-size:17px;line-height:1.55;color:#555;max-width:680px}.resultActions{align-items:stretch;margin-top:28px}.actionLink{display:inline-flex;align-items:center;justify-content:center;text-decoration:none}.perspective{margin:30px 0}.perspectiveLabel{font-size:12px;font-weight:800;letter-spacing:.13em;text-transform:uppercase;color:#777;margin:0 0 6px}.perspective h2{font-size:25px;letter-spacing:-.02em;margin:0 0 13px}.rows{display:grid;gap:9px}.insight{background:#fff;border:1px solid var(--line);border-radius:16px;padding:14px 15px}.insightTitle{font-size:17px;font-weight:780;line-height:1.3}.insightState{font-size:14px;font-weight:760;color:#444;margin-top:5px}.insightCue{font-size:14px;line-height:1.5;color:#666;margin-top:5px}.resultNote{font-size:14px;line-height:1.55;color:#666;margin:10px 2px 0}.bankCard.ready{display:none}.debug{font-size:12px;color:#777;white-space:pre-wrap;background:#fff;border:1px solid var(--line);border-radius:14px;padding:12px;overflow:auto}.hidden{display:none!important}@media(max-width:620px){.rangeRow{grid-template-columns:1fr}.scale button.na{justify-self:start}.perspective{margin:26px 0}.perspective h2{font-size:23px}}',
    'result css'
)

replace_once(
    '<div class="top"><div class="brand">PrioLens</div><div class="topRight"><a id="exit2rasi" class="exitLink" href="https://2rasi.lt/#experiments">Išeiti</a><div class="pill">Open14 · v0.2 research</div></div></div>',
    '<div class="top"><div class="brand">PrioLens</div><div class="topRight"><a id="exit2rasi" class="exitLink" href="https://2rasi.lt/#experiments">Išeiti</a><div id="prototypePill" class="pill">Tyrimo prototipas</div></div></div>',
    'top pill'
)

replace_once(
    '''  <section id="intro" class="screen active intro">
    <h1>Kurį renkiesi?</h1>
    <p class="lead">Trys vaizdai vienu metu. Pasirink tą, kuris pirmas patraukia.</p>
    <p class="note">14 trumpų pasirinkimų. Po jų bus kita, atskira perspektyva apie tai, kiek skirtingų dalykų šiuo metu tavo gyvenime pakanka.</p>
    <p class="note">Formative pilotui sesijos duomenys išsaugomi atskirai iki 90 dienų. Rezultatas nėra asmenybės profilis ar diagnozė.</p>
    <div class="card"><b id="bankTitle">Tikrinamas tyrimo bankas…</b><p id="bankStatus" class="note">Open14 paleidžiamas tik tada, kai visi reikalingi vaizdai turi realius runtime adresus.</p></div>
    <div class="actions"><button id="start" class="primary" disabled>Pradėti</button></div>
  </section>''',
    '''  <section id="intro" class="screen active intro">
    <h1>Kuris pirmas patraukia?</h1>
    <p class="lead">Trys vaizdai vienu metu. Nesvarstyk, kuris „geresnis“. Pasirink tą, į kurį pirmiausia krypsta dėmesys.</p>
    <p class="note">14 trumpų pasirinkimų · apie 2 min. Po jų į tą pačią situaciją pažvelgsi iš kitos perspektyvos.</p>
    <p class="note">Formuojamojo tyrimo prototipas. Sesijos duomenys saugomi tyrimo duomenų bazėje; numatyta saugojimo trukmė – iki 90 dienų. Tai nėra asmenybės testas ar diagnozė.</p>
    <div id="bankCard" class="card bankCard"><b id="bankTitle">Tikrinamas vaizdų rinkinys…</b><p id="bankStatus" class="note">PrioLens startuos, kai bus patvirtinta, kad visi vaizdai pasiekiami.</p></div>
    <div class="actions"><button id="start" class="primary" disabled>Pradėti</button></div>
  </section>''',
    'intro html'
)

old_result = '''  <section id="result" class="screen result">
    <h1>Dvi perspektyvos.</h1>
    <p class="note">Tai šios sesijos pasirinkimų ir tavo dabartinio įsivertinimo aprašymas, ne asmenybės profilis ar diagnozė.</p>
    <p id="saveStatus" class="note">Sesijos išsaugojimas tikrinamas…</p>
    <div class="summaryCard"><h2>Trumpai</h2><p id="summaryText" class="summaryText"></p><p id="summaryNext" class="summaryNext"></p></div>
    <div class="section"><h2>Kas kartojosi</h2><div id="repeatRows" class="rows"></div></div>
    <div class="section"><h2>Kaip pats vertini dabartinę situaciją</h2><div id="suffRows" class="rows"></div></div>
    <div class="section"><h2>Kur verta pažvelgti dar kartą</h2><div id="compareRows" class="rows"></div></div>
    <div class="actions resultActions"><button id="restart" class="primary">Atlikti dar kartą</button><a id="back2rasi" class="secondary actionLink" href="https://2rasi.lt/#experiments">Grįžti į 2rasi</a><button id="export" class="secondary hidden">Eksportuoti JSON</button></div>
    <p id="exportStatus" class="note hidden"></p>
    <details id="debugDetails" class="section hidden"><summary>Tyrimo diagnostika</summary><pre id="debug" class="debug"></pre></details>
  </section>'''
new_result = '''  <section id="result" class="screen result">
    <h1>Pirmas žvilgsnis. Antras atsakymas.</h1>
    <p id="resultLead" class="resultLead">Ne verdiktas, o dvi perspektyvos į tą pačią akimirką.</p>
    <p id="saveStatus" class="note">Sesijos išsaugojimas tikrinamas…</p>

    <div class="perspective">
      <p id="firstLabel" class="perspectiveLabel">Pirma perspektyva</p>
      <h2 id="firstHeading">Pirmas žvilgsnis</h2>
      <div id="repeatRows" class="rows"></div>
    </div>

    <div class="perspective">
      <p id="secondLabel" class="perspectiveLabel">Antra perspektyva</p>
      <h2 id="secondHeading">Antras atsakymas</h2>
      <div id="suffRows" class="rows"></div>
      <p id="suffResultNote" class="resultNote hidden"></p>
    </div>

    <div class="perspective">
      <p id="compareLabel" class="perspectiveLabel">Sugretinimas</p>
      <h2 id="compareHeading">Pažvelk dar kartą</h2>
      <div id="compareRows" class="rows"></div>
    </div>

    <div class="actions resultActions"><button id="restart" class="primary">Atlikti dar kartą</button><a id="back2rasi" class="secondary actionLink" href="https://2rasi.lt/#experiments">Grįžti į 2rasi</a><button id="export" class="secondary hidden">Eksportuoti JSON</button></div>
    <p id="exportStatus" class="note hidden"></p>
    <details id="debugDetails" class="perspective hidden"><summary>Tyrimo diagnostika</summary><pre id="debug" class="debug"></pre></details>
  </section>'''
replace_once(old_result, new_result, 'result html')

replace_once(
    "introTitle:'Kurį renkiesi?',introLead:'Trys vaizdai vienu metu. Pasirink tą, kuris pirmas patraukia.',introNote1:'14 trumpų pasirinkimų. Po jų bus kita, atskira perspektyva apie tai, kiek skirtingų dalykų šiuo metu tavo gyvenime pakanka.',introNote2:'Formuojamojo piloto metu sesijos duomenys išsaugomi tyrimo duomenų bazėje. Numatyta saugojimo trukmė – iki 90 dienų. Rezultatas nėra asmenybės profilis ar diagnozė.',",
    "introTitle:'Kuris pirmas patraukia?',introLead:'Trys vaizdai vienu metu. Nesvarstyk, kuris „geresnis“. Pasirink tą, į kurį pirmiausia krypsta dėmesys.',introNote1:'14 trumpų pasirinkimų · apie 2 min. Po jų į tą pačią situaciją pažvelgsi iš kitos perspektyvos.',introNote2:'Formuojamojo tyrimo prototipas. Sesijos duomenys saugomi tyrimo duomenų bazėje; numatyta saugojimo trukmė – iki 90 dienų. Tai nėra asmenybės testas ar diagnozė.',prototypeLabel:'Tyrimo prototipas',",
    'lt intro copy'
)
replace_once(
    "bankChecking:'Tikrinamas tyrimo bankas…',bankCheckingStatus:'Open14 paleidžiamas tik tada, kai visi reikalingi vaizdai turi realius runtime adresus.'",
    "bankChecking:'Tikrinamas vaizdų rinkinys…',bankCheckingStatus:'PrioLens startuos, kai bus patvirtinta, kad visi vaizdai pasiekiami.'",
    'lt bank checking'
)
replace_once(
    "resultTitle:'Dvi perspektyvos.',resultLead:'Tai šios sesijos pasirinkimų ir tavo dabartinio įsivertinimo aprašymas, ne asmenybės profilis ar diagnozė.',saveChecking:'Sesijos išsaugojimas tikrinamas…',short:'Trumpai',repeatedHeading:'Kas kartojosi',suffHeading:'Kaip pats vertini dabartinę situaciją',compareHeading:'Kur verta pažvelgti dar kartą',restart:'Atlikti dar kartą',back2rasi:'Grįžti į 2rasi',export:'Eksportuoti JSON',debug:'Tyrimo diagnostika',",
    "resultTitle:'Pirmas žvilgsnis. Antras atsakymas.',resultLead:'Ne verdiktas, o dvi perspektyvos į tą pačią akimirką.',saveChecking:'Sesijos išsaugojimas tikrinamas…',firstLabel:'Pirma perspektyva',firstHeading:'Pirmas žvilgsnis',secondLabel:'Antra perspektyva',secondHeading:'Antras atsakymas',compareLabel:'Sugretinimas',compareHeading:'Pažvelk dar kartą',restart:'Atlikti dar kartą',back2rasi:'Grįžti į 2rasi',export:'Eksportuoti JSON',debug:'Tyrimo diagnostika',",
    'lt result headings'
)
replace_once(
    "bankIncomplete:'Open14 bankas dar nepilnas',missingAssets:n=>`Trūksta realių runtime assetų: ${n}. Startas užblokuotas pagal fail-closed taisyklę.`,bankReady:'Open14 bankas paruoštas',assetsReady:'Visi assetai turi runtime adresus.',bankError:'Banko klaida',",
    "bankIncomplete:'Vaizdų rinkinys dar nepilnas',missingAssets:n=>`Trūksta vaizdų: ${n}. Bandyk dar kartą vėliau.`,bankReady:'Vaizdų rinkinys paruoštas',assetsReady:'Visi vaizdai pasiekiami.',bankError:'Vaizdų rinkinio klaida',",
    'lt bank states'
)
replace_once(
    "answered0:'0/2 atsakyta',partial:n=>`${n}/2 atsakyta`,partialCue:'Dalinė informacija. Vieno atsakymo nepakanka pilnam šios srities įvertinimui.',completeCue:'2/2 atsakyta · 1 = visai nepakanka · 5 = visiškai pakanka',",
    "answered0:'Sunku pasakyti',partial:n=>'Nepakanka atsakymų',partialCue:'Šios srities šį kartą nevertiname.',completeCue:'',suffLow:'Šiuo metu labiau trūksta',suffMid:'Per vidurį',suffHigh:'Šiuo metu labiau pakanka',suffIncomplete:n=>n===1?'Vienos srities čia nerodome, nes jai nepakako aiškių atsakymų.':`${n} sričių čia nerodome, nes joms nepakako aiškių atsakymų.`,suffNone:'Šios perspektyvos šį kartą nevertiname.',suffNoneCue:'Visose srityse pasirinkai „Sunku pasakyti“ arba nepakako aiškių atsakymų.',",
    'lt suff result copy'
)
replace_once(
    "noCompare:'Ryškaus sugretinimo šioje sesijoje nėra',noCompareCue:'Tai nėra problema: abi perspektyvos neprivalo sudaryti tvarkingo vieno profilio.',",
    "noCompare:'Aiškaus sugretinimo šį kartą nėra',noCompareCue:'Abi perspektyvos neprivalo parodyti to paties. Tai irgi galimas rezultatas.',noCompareNoRepeat:'Pirmame žvilgsnyje nebuvo pakankamo pasikartojimo, todėl dviejų perspektyvų šį kartą nesugretiname.',noCompareNoSuff:'Antram atsakymui nepakako aiškių įverčių, todėl dviejų perspektyvų šį kartą nesugretiname.',",
    'lt compare copy'
)

replace_once(
    "introTitle:'Which one do you choose?',introLead:'Three images at a time. Choose the one that pulls you first.',introNote1:'14 quick choices. After them, you will see a separate perspective on how sufficient different areas of your life feel right now.',introNote2:'During the formative pilot, session data is stored in the research database. The intended retention period is up to 90 days. The result is not a personality profile or diagnosis.',",
    "introTitle:'Which one pulls you first?',introLead:'Three images at a time. Do not decide which one is “better”. Choose the one your attention goes to first.',introNote1:'14 quick choices · about 2 min. After them, you will look at the same moment from a different perspective.',introNote2:'Formative research prototype. Session data is stored in the research database; the intended retention period is up to 90 days. This is not a personality test or diagnosis.',prototypeLabel:'Research prototype',",
    'en intro copy'
)
replace_once(
    "bankChecking:'Checking the research image set…',bankCheckingStatus:'Open14 starts only when every required image has a valid runtime address.'",
    "bankChecking:'Checking the image set…',bankCheckingStatus:'PrioLens will start after confirming that all images are available.'",
    'en bank checking'
)
replace_once(
    "resultTitle:'Two perspectives.',resultLead:'This describes this session’s choices and your current self-assessment. It is not a personality profile or diagnosis.',saveChecking:'Checking session save…',short:'In short',repeatedHeading:'What repeated',suffHeading:'How you rate your current situation',compareHeading:'Where it may be worth looking again',restart:'Do it again',back2rasi:'Back to 2rasi',export:'Export JSON',debug:'Research diagnostics',",
    "resultTitle:'First glance. Second answer.',resultLead:'Not a verdict, but two perspectives on the same moment.',saveChecking:'Checking session save…',firstLabel:'First perspective',firstHeading:'First glance',secondLabel:'Second perspective',secondHeading:'Second answer',compareLabel:'Comparison',compareHeading:'Look again',restart:'Do it again',back2rasi:'Back to 2rasi',export:'Export JSON',debug:'Research diagnostics',",
    'en result headings'
)
replace_once(
    "bankIncomplete:'Open14 image set is incomplete',missingAssets:n=>`Missing runtime assets: ${n}. Start is blocked by the fail-closed rule.`,bankReady:'Open14 image set is ready',assetsReady:'All images have valid runtime addresses.',bankError:'Image-set error',",
    "bankIncomplete:'The image set is incomplete',missingAssets:n=>`Missing images: ${n}. Please try again later.`,bankReady:'Image set ready',assetsReady:'All images are available.',bankError:'Image-set error',",
    'en bank states'
)
replace_once(
    "answered0:'0/2 answered',partial:n=>`${n}/2 answered`,partialCue:'Partial information. One answer is not enough for a full reading of this area.',completeCue:'2/2 answered · 1 = not enough at all · 5 = enough',",
    "answered0:'Hard to say',partial:n=>'Not enough answers',partialCue:'This area is not interpreted in this session.',completeCue:'',suffLow:'Currently feels less sufficient',suffMid:'In between',suffHigh:'Currently feels more sufficient',suffIncomplete:n=>n===1?'One area is not shown here because it did not have enough clear answers.':`${n} areas are not shown here because they did not have enough clear answers.`,suffNone:'This perspective is not interpreted in this session.',suffNoneCue:'Across all areas, you chose “Hard to say” or there were not enough clear answers.',",
    'en suff result copy'
)
replace_once(
    "noCompare:'No strong comparison in this session',noCompareCue:'That is not a problem: the two perspectives do not have to form one neat profile.',",
    "noCompare:'No clear comparison this time',noCompareCue:'The two perspectives do not have to point to the same thing. That is also a possible result.',noCompareNoRepeat:'There was not enough repetition in the first glance to compare the two perspectives this time.',noCompareNoSuff:'The second answer did not contain enough clear ratings to compare the two perspectives this time.',",
    'en compare copy'
)

old_apply = '''function applyStaticLanguage(){
  document.documentElement.lang=LANG;
  document.title=LANG==='en'?'PrioLens Open14 v0.2 · Research':'PrioLens Open14 v0.2 · Tyrimas';
  const introNotes=document.querySelectorAll('#intro > p.note');
  document.querySelector('#intro h1').textContent=T.introTitle;document.querySelector('#intro .lead').textContent=T.introLead;
  if(introNotes[0])introNotes[0].textContent=T.introNote1;if(introNotes[1])introNotes[1].textContent=T.introNote2;
  $('bankTitle').textContent=T.bankChecking;$('bankStatus').textContent=T.bankCheckingStatus;$('start').textContent=T.start;$('exit2rasi').textContent=T.exit;
  document.querySelector('.trialhead .q').textContent=T.trialQuestion;$('none').textContent=T.none;
  document.querySelector('.suffHead h2').textContent=T.suffTitle;document.querySelector('.suffHead .note').textContent=T.suffLead;$('suffError').textContent=T.validation;$('suffBack').textContent=T.back;$('suffNext').textContent=T.next;
  document.querySelector('#result h1').textContent=T.resultTitle;document.querySelector('#result > p.note').textContent=T.resultLead;$('saveStatus').textContent=T.saveChecking;document.querySelector('.summaryCard h2').textContent=T.short;
  const heads=document.querySelectorAll('#result .section > h2');if(heads[0])heads[0].textContent=T.repeatedHeading;if(heads[1])heads[1].textContent=T.suffHeading;if(heads[2])heads[2].textContent=T.compareHeading;
  $('restart').textContent=T.restart;$('back2rasi').textContent=T.back2rasi;$('export').textContent=T.export;document.querySelector('#debugDetails summary').textContent=T.debug;
  const target=(FROM_2RASI==='com'||(FROM_2RASI!=='lt'&&LANG==='en'))?'https://2rasi.com/#experiments':'https://2rasi.lt/#experiments';$('back2rasi').href=target;$('exit2rasi').href=target;
}'''
new_apply = '''function applyStaticLanguage(){
  document.documentElement.lang=LANG;
  document.title='PrioLens · 2rasi';
  const introNotes=document.querySelectorAll('#intro > p.note');
  document.querySelector('#intro h1').textContent=T.introTitle;document.querySelector('#intro .lead').textContent=T.introLead;
  if(introNotes[0])introNotes[0].textContent=T.introNote1;if(introNotes[1])introNotes[1].textContent=T.introNote2;
  $('prototypePill').textContent=T.prototypeLabel;$('bankTitle').textContent=T.bankChecking;$('bankStatus').textContent=T.bankCheckingStatus;$('start').textContent=T.start;$('exit2rasi').textContent=T.exit;
  document.querySelector('.trialhead .q').textContent=T.trialQuestion;$('none').textContent=T.none;
  document.querySelector('.suffHead h2').textContent=T.suffTitle;document.querySelector('.suffHead .note').textContent=T.suffLead;$('suffError').textContent=T.validation;$('suffBack').textContent=T.back;$('suffNext').textContent=T.next;
  document.querySelector('#result h1').textContent=T.resultTitle;$('resultLead').textContent=T.resultLead;$('saveStatus').textContent=T.saveChecking;
  $('firstLabel').textContent=T.firstLabel;$('firstHeading').textContent=T.firstHeading;$('secondLabel').textContent=T.secondLabel;$('secondHeading').textContent=T.secondHeading;$('compareLabel').textContent=T.compareLabel;$('compareHeading').textContent=T.compareHeading;
  $('restart').textContent=T.restart;$('back2rasi').textContent=T.back2rasi;$('export').textContent=T.export;document.querySelector('#debugDetails summary').textContent=T.debug;
  const target=(FROM_2RASI==='com'||(FROM_2RASI!=='lt'&&LANG==='en'))?'https://2rasi.com/#experiments':'https://2rasi.lt/#experiments';$('back2rasi').href=target;$('exit2rasi').href=target;
}'''
replace_once(old_apply, new_apply, 'applyStaticLanguage')

replace_once(
    "function offerResumeIfAvailable(){const d=loadLocalDraft();if(!d)return;if(bank&&d.bankSchema!==bank.schema){clearLocalDraft();return}$('bankStatus').textContent=T.resumeFound(d.choices.length);",
    "function offerResumeIfAvailable(){const d=loadLocalDraft();if(!d)return;if(bank&&d.bankSchema!==bank.schema){clearLocalDraft();return}$('bankCard').classList.remove('ready');$('bankStatus').textContent=T.resumeFound(d.choices.length);",
    'resume card visibility'
)

replace_once(
    "$('bankTitle').textContent=T.bankReady;$('bankTitle').className='ok';$('bankStatus').textContent=T.assetsReady;$('start').disabled=false;offerResumeIfAvailable()",
    "$('bankTitle').textContent=T.bankReady;$('bankTitle').className='ok';$('bankStatus').textContent=T.assetsReady;$('start').disabled=false;$('bankCard').classList.add('ready');offerResumeIfAvailable()",
    'hide successful bank check'
)

old_add = "function addRow(mount,name,score,cue,pct){const r=document.createElement('div');r.className='row';r.innerHTML=`<div class=\"rowtop\"><div class=\"name\">${name}</div><div class=\"score\">${score}</div></div><div class=\"cue\">${cue||''}</div>${pct===null?'':`<div class=\"bar\"><i style=\"width:${pct}%\"></i></div>`}`;mount.appendChild(r)}"
new_add = "function addInsight(mount,title,stateText,cue){const r=document.createElement('div');r.className='insight';r.innerHTML=`<div class=\"insightTitle\">${title}</div>${stateText?`<div class=\"insightState\">${stateText}</div>`:''}${cue?`<div class=\"insightCue\">${cue}</div>`:''}`;mount.appendChild(r)}"
replace_once(old_add, new_add, 'result card helper')

render_pattern = re.compile(r"function renderResult\(\)\{.*?\n\}\n\$\('start'\)\.onclick=", re.S)
m = render_pattern.search(s)
if not m:
    raise SystemExit('renderResult block not found')
new_render = r'''function renderResult(){
  const coverage=state.domainCoverage||domainCoverage();
  const rep=$('repeatRows');rep.innerHTML='';
  const repeated=Object.entries(state.familyStats).filter(([,x])=>x.chosen>=2&&x.crossExemplar).sort((a,b)=>b[1].chosen-a[1].chosen);
  if(!repeated.length)addInsight(rep,T.noRepeated,'',T.noRepeatedCue);
  else repeated.forEach(([id,x])=>addInsight(rep,FAMILY_LABEL[id],'',x.chosen===3?T.repeatEvery:T.repeatAcross));

  const sr=$('suffRows');sr.innerHTML='';
  const completeDomains=DOMAINS.filter(d=>coverage[d.id].complete);
  const incompleteCount=DOMAINS.length-completeDomains.length;
  if(!completeDomains.length){
    addInsight(sr,T.suffNone,'',T.suffNoneCue);
  }else{
    for(const d of completeDomains){
      const v=coverage[d.id].value;
      const stateText=v<=2.5?T.suffLow:v>=3.5?T.suffHigh:T.suffMid;
      addInsight(sr,d.title,stateText,'');
    }
  }
  const suffNote=$('suffResultNote');
  if(incompleteCount>0&&completeDomains.length){suffNote.textContent=T.suffIncomplete(incompleteCount);suffNote.classList.remove('hidden')}else{suffNote.textContent='';suffNote.classList.add('hidden')}

  const cr=$('compareRows');cr.innerHTML='';const comps=[];
  for(const d of DOMAINS){
    if(!d.families.length||!coverage[d.id].complete)continue;
    const rel=d.families.filter(f=>state.familyStats[f]?.chosen>=2&&state.familyStats[f]?.crossExemplar);
    if(!rel.length)continue;
    const v=state.domainStats[d.id];
    const famNames=rel.map(f=>FAMILY_LABEL[f]).join(', ');
    const cue=v<=2.5?T.lowCue(famNames):v>=3.5?T.highCue(famNames):T.midCue(famNames);
    comps.push({name:d.title,cue});
  }
  if(!comps.length){
    const cue=!repeated.length?T.noCompareNoRepeat:!completeDomains.length?T.noCompareNoSuff:T.noCompareCue;
    addInsight(cr,T.noCompare,'',cue);
  }else comps.slice(0,3).forEach(c=>addInsight(cr,c.name,'',c.cue));

  $('debug').textContent=JSON.stringify(state,null,2)
}
$('start').onclick='''
s = s[:m.start()] + new_render + s[m.end():]

# No participant-facing Open14 label/title should remain. Internal schema/path names are intentionally retained.
for forbidden in [
    'Open14 · v0.2 research',
    'PrioLens Open14 v0.2 · Research',
    'PrioLens Open14 v0.2 · Tyrimas',
    'Open14 paleidžiamas',
    'Open14 starts only',
    'Open14 bankas paruoštas',
    'Open14 image set is ready'
]:
    if forbidden in s:
        raise SystemExit(f'participant-facing Open14 residue: {forbidden}')

p.write_text(s)
print('PASS: participant surface patch applied')
