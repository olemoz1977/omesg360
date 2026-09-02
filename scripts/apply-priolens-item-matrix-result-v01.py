from pathlib import Path

p=Path('priolens/open14-v02/index.html')
s=p.read_text()

# Human-facing hierarchy and copy.
repls={
"<p id=\"resultLead\" class=\"resultLead\">Ne verdiktas, o dvi perspektyvos į tą pačią akimirką.</p>":"<p id=\"resultLead\" class=\"resultLead\">Pirmiausia rinkaisi vaizdus. Tada pats įvertinai, ko tavo gyvenime dabar pakanka. Dabar palygink abu.</p>",
"<p id=\"firstLabel\" class=\"perspectiveLabel\">Pirma perspektyva</p>":"<p id=\"firstLabel\" class=\"perspectiveLabel\">Tavo pasirinkimai</p>",
"<h2 id=\"firstHeading\">Pirmas žvilgsnis</h2>":"<h2 id=\"firstHeading\">Kas tave traukė?</h2>",
"<p id=\"secondLabel\" class=\"perspectiveLabel\">Antra perspektyva</p>":"<p id=\"secondLabel\" class=\"perspectiveLabel\">Tavo atsakymai</p>",
"<h2 id=\"secondHeading\">Antras atsakymas</h2>":"<h2 id=\"secondHeading\">Ko dabar norėtųsi daugiau?</h2>",
"<h2 id=\"compareHeading\">Pažvelk dar kartą</h2>":"<h2 id=\"compareHeading\">Ką matai, kai palygini abu?</h2>",
"resultLead:'Ne verdiktas, o dvi perspektyvos į tą pačią akimirką.'":"resultLead:'Pirmiausia rinkaisi vaizdus. Tada pats įvertinai, ko tavo gyvenime dabar pakanka. Dabar palygink abu.'",
"firstLabel:'Pirma perspektyva',firstHeading:'Ką rinkaisi dažniausiai',secondLabel:'Antra perspektyva',secondHeading:'Kur dabar ne visai pakanka',compareLabel:'Svarbiausia',compareHeading:'Kas čia verta antro žvilgsnio?'":"firstLabel:'Tavo pasirinkimai',firstHeading:'Kas tave traukė?',secondLabel:'Tavo atsakymai',secondHeading:'Ko dabar norėtųsi daugiau?',compareLabel:'Svarbiausia',compareHeading:'Ką matai, kai palygini abu?'",
"resultLead:'Not a verdict, but two perspectives on the same moment.'":"resultLead:'First you chose images. Then you rated what feels sufficient in your life right now. Now compare the two.'",
"firstLabel:'First perspective',firstHeading:'What you chose most often',secondLabel:'Second perspective',secondHeading:'Where things do not feel quite enough',compareLabel:'Most important',compareHeading:'What deserves a second look?'":"firstLabel:'Your choices',firstHeading:'What pulled you?',secondLabel:'Your answers',secondHeading:'What would you like more of right now?',compareLabel:'Most important',compareHeading:'What do you notice when you compare the two?'"
}
for old,new in repls.items():
    if old not in s:
        raise AssertionError(f'missing replacement anchor: {old[:90]}')
    s=s.replace(old,new,1)

anchor='const FAMILY_MEANING=FAMILY_MEANINGS[LANG];\n'
assert anchor in s
matrix=r'''const ITEM_ORDER=['RESTORATION_ENERGY','MATERIAL_RESOURCES','SAFETY_STABILITY','CLARITY_PREDICTABILITY','CONNECTION_BELONGING','CARE_SUPPORT_PRESENT','AUTONOMY_AGENCY','RECOGNITION_ESTEEM','LEARNING_GROWTH','CAPABILITY_MASTERY','MEANING_PURPOSE','CONTRIBUTION'];
const ITEM_RESULT_LABELS={
  lt:{
    RESTORATION_ENERGY:'poilsio ir energijos',MATERIAL_RESOURCES:'kasdienių resursų',SAFETY_STABILITY:'saugumo ir stabilumo',CLARITY_PREDICTABILITY:'aiškumo ir nuspėjamumo',CONNECTION_BELONGING:'artimo ryšio ir priklausymo',CARE_SUPPORT_PRESENT:'rūpesčio, paramos ir žmogiško dėmesio',AUTONOMY_AGENCY:'laisvės pačiam spręsti ir veikti',RECOGNITION_ESTEEM:'jausmo, kad tavo pastangos ir nuomonė yra pastebimos ir vertinamos',LEARNING_GROWTH:'galimybių mokytis, atrasti ir augti',CAPABILITY_MASTERY:'galimybių naudoti ir tobulinti savo gebėjimus',MEANING_PURPOSE:'prasmės tame, ką darai',CONTRIBUTION:'galimybių prisidėti prie kažko svarbaus'
  },
  en:{
    RESTORATION_ENERGY:'rest and energy',MATERIAL_RESOURCES:'everyday resources',SAFETY_STABILITY:'safety and stability',CLARITY_PREDICTABILITY:'clarity and predictability',CONNECTION_BELONGING:'close connection and belonging',CARE_SUPPORT_PRESENT:'care, support and human attention',AUTONOMY_AGENCY:'freedom to decide and act for yourself',RECOGNITION_ESTEEM:'feeling that your effort and opinion are noticed and valued',LEARNING_GROWTH:'opportunities to learn, discover and grow',CAPABILITY_MASTERY:'opportunities to use and improve your abilities',MEANING_PURPOSE:'meaning in what you do',CONTRIBUTION:'opportunities to contribute to something important'
  }
};
const ITEM_ABOUT={
  lt:{
    RESTORATION_ENERGY:'poilsį ir energiją',MATERIAL_RESOURCES:'kasdienius resursus',SAFETY_STABILITY:'saugumą ir stabilumą',CLARITY_PREDICTABILITY:'aiškumą ir nuspėjamumą',CONNECTION_BELONGING:'artimą ryšį ir priklausymą',CARE_SUPPORT_PRESENT:'rūpestį, paramą ir žmogišką dėmesį',AUTONOMY_AGENCY:'laisvę pačiam spręsti ir veikti',RECOGNITION_ESTEEM:'tai, ar jautiesi pastebėtas ir vertinamas',LEARNING_GROWTH:'galimybes mokytis, atrasti ir augti',CAPABILITY_MASTERY:'galimybes naudoti ir tobulinti savo gebėjimus',MEANING_PURPOSE:'prasmę tame, ką darai',CONTRIBUTION:'galimybes prisidėti prie kažko svarbaus'
  },
  en:{
    RESTORATION_ENERGY:'rest and energy',MATERIAL_RESOURCES:'everyday resources',SAFETY_STABILITY:'safety and stability',CLARITY_PREDICTABILITY:'clarity and predictability',CONNECTION_BELONGING:'close connection and belonging',CARE_SUPPORT_PRESENT:'care, support and human attention',AUTONOMY_AGENCY:'freedom to decide and act for yourself',RECOGNITION_ESTEEM:'whether you feel noticed and valued',LEARNING_GROWTH:'opportunities to learn, discover and grow',CAPABILITY_MASTERY:'opportunities to use and improve your abilities',MEANING_PURPOSE:'meaning in what you do',CONTRIBUTION:'opportunities to contribute to something important'
  }
};
const ITEM_RESULT_LABEL=ITEM_RESULT_LABELS[LANG];
const ITEM_ABOUT_TEXT=ITEM_ABOUT[LANG];
const FAMILY_ITEM_LINKS={
  REST:{item:'RESTORATION_ENERGY',strength:'DIRECT'},
  RESOURCE:{item:'MATERIAL_RESOURCES',strength:'DIRECT'},
  SAFETY:{item:'SAFETY_STABILITY',strength:'DIRECT'},
  ORDER:{item:'CLARITY_PREDICTABILITY',strength:'DIRECT'},
  CONNECTION:{item:'CONNECTION_BELONGING',strength:'RELATED'},
  BELONGING:{item:'CONNECTION_BELONGING',strength:'DIRECT'},
  AUTONOMY:{item:'AUTONOMY_AGENCY',strength:'DIRECT'},
  CONTROL:{item:'AUTONOMY_AGENCY',strength:'RELATED'},
  RECOGNITION:{item:'RECOGNITION_ESTEEM',strength:'DIRECT'},
  MASTERY:{item:'CAPABILITY_MASTERY',strength:'DIRECT'},
  EXPLORATION:{item:'LEARNING_GROWTH',strength:'RELATED'},
  KNOWLEDGE:{item:'LEARNING_GROWTH',strength:'DIRECT'},
  OPPORTUNITY:{item:'LEARNING_GROWTH',strength:'RELATED'}
};
// CARE intentionally has no direct Channel B pair in v0.2.
'''
if 'const FAMILY_ITEM_LINKS=' not in s:
    s=s.replace(anchor,anchor+matrix,1)

start=s.index('function chosenImagePaths(')
end=s.index("\n$('start').onclick=",start)
new_block=r'''function chosenImagePaths(id){const seen=new Set(),paths=[];for(const c of state.choices){if(c.choice?.familyId!==id)continue;const stim=c.stimuli.find(x=>x.exemplarId===c.choice.exemplarId);if(stim?.runtimePath&&!seen.has(stim.runtimePath)){seen.add(stim.runtimePath);paths.push(stim.runtimePath)}}return paths}
function addChoiceInsight(mount,id,x){const r=document.createElement('div');r.className='choiceInsight';const images=chosenImagePaths(id).slice(0,2).map(src=>`<img src="${src}" alt="">`).join('');r.innerHTML=`<div class="choiceVisuals">${images}</div><div class="choiceMeta"><div class="insightTitle">${FAMILY_LABEL[id]}</div><span class="choiceCount">${x.chosen}/3</span></div><div class="choiceMeaning">${FAMILY_MEANING[id]}</div>`;mount.appendChild(r)}
function countPhrase(n){return LANG==='en'?`${n} out of 3 times`:`${n} iš 3 kartų`}
function capFirst(x){return x?x.charAt(0).toUpperCase()+x.slice(1):x}
function addReflection(mount,cue,question,images=[]){const r=document.createElement('div');r.className='reflectionHero';const pics=images.slice(0,2).map(src=>`<img src="${src}" alt="">`).join('');r.innerHTML=`${pics?`<div class="reflectionImages">${pics}</div>`:''}${cue?`<div class="insightCue">${cue}</div>`:''}<div class="reflectionQuestion">${question}</div>`;mount.appendChild(r)}
function renderResult(){
  const C=LANG==='en'?{
    attentionNote:'This does not mean you lack these things. It only shows which themes pulled your attention more than once.',
    noNeedTitle:'Nothing clearly stood out',
    noNeedCue:'From your answers, there was no area you clearly marked as wanting more of right now.',
    noNumericTitle:'Nothing to show here',
    noNumericCue:'You used “Hard to say” for these answers, so PrioLens does not guess for you.',
    alignedCue:(f,n,item,related)=>`In the images, you chose “${f}” ${countPhrase(n)}. In your answer about ${item}, you marked that you would like more.${related?' These are not the same thing, but they may be related.':''}`,
    alignedQuestion:'Do these two things feel connected to you?',
    highCue:(f,n,item,related)=>`In the images, you chose “${f}” ${countPhrase(n)}. In your answer about ${item}, you marked that you have enough right now.${related?' These are not exactly the same thing.':''}`,
    highQuestion:'What about those images still caught your attention?',
    differentCue:(need,f,n)=>`In your own answers, the clearest place where you wanted more was ${need}. In the images, the theme you chose most often was “${f}” (${n}/3). These did not point to the same place.`,
    differentQuestion:'Which of these two feels more important to you right now?',
    visualOnlyCue:(f,n)=>`In the images, you chose “${f}” ${countPhrase(n)}. There is no direct matching question in the second part that PrioLens can safely compare it with.`,
    visualOnlyQuestion:'What was it about those images that caught your attention?',
    needOnlyCue:need=>`Your image choices did not repeat around one clear theme. In your own answers, the clearest place where you wanted more was ${need}.`,
    needOnlyQuestion:'What about this matters most to you right now?',
    quietCue:'This time, neither the images nor your own answers produced one clear point to focus on.',
    quietQuestion:'Was there still anything you found yourself thinking about afterwards?'
  }:{
    attentionNote:'Tai nereiškia, kad tau šito trūksta. Tik tiek, kad prie šių temų tavo dėmesys grįžo daugiau nei kartą.',
    noNeedTitle:'Nieko aiškiai neišsiskyrė',
    noNeedCue:'Pagal tavo atsakymus, nebuvo vietos, kur aiškiai pažymėjai, kad dabar norėtųsi daugiau.',
    noNumericTitle:'Čia nieko nerodome',
    noNumericCue:'Pasirinkai „Sunku pasakyti“, todėl PrioLens už tave nespėlioja.',
    alignedCue:(f,n,item,related)=>`Vaizduose „${f}“ rinkaisi ${countPhrase(n)}. Atsakyme apie ${item} pažymėjai, kad dabar norėtųsi daugiau.${related?' Tai nėra tas pats dalykas, bet jie gali būti susiję.':''}`,
    alignedQuestion:'Ar tau šie du dalykai atrodo susiję?',
    highCue:(f,n,item,related)=>`Vaizduose „${f}“ rinkaisi ${countPhrase(n)}. Atsakyme apie ${item} pažymėjai, kad tau dabar pakanka.${related?' Tai nėra visai tas pats dalykas.':''}`,
    highQuestion:'Kas tuose vaizduose vis tiek patraukė tavo dėmesį?',
    differentCue:(need,f,n)=>`Savo atsakymuose aiškiausiai parodei, kad norėtųsi daugiau ${need}. O vaizduose dažniausiai rinkaisi „${f}“ (${n}/3). Šie du dalykai nesutapo.`,
    differentQuestion:'Kuris iš šių dviejų dalykų tau dabar atrodo svarbesnis?',
    visualOnlyCue:(f,n)=>`Vaizduose „${f}“ rinkaisi ${countPhrase(n)}. Antroje dalyje nėra tiesiogiai atitinkančio klausimo, su kuriuo PrioLens galėtų tai sąžiningai palyginti.`,
    visualOnlyQuestion:'Kas tuose vaizduose patraukė tavo dėmesį?',
    needOnlyCue:need=>`Vaizduose viena tema aiškiai nepasikartojo. O savo atsakymuose aiškiausiai parodei, kad norėtųsi daugiau ${need}.`,
    needOnlyQuestion:'Kas šioje vietoje tau dabar svarbiausia?',
    quietCue:'Šį kartą nei vaizduose, nei tavo atsakymuose viena vieta aiškiai neišsiskyrė.',
    quietQuestion:'Ar vis tiek liko kas nors, apie ką norisi pagalvoti?'
  };

  const rep=$('repeatRows');rep.innerHTML='';
  const repeated=Object.entries(state.familyStats).filter(([,x])=>x.chosen>=2&&x.crossExemplar).sort((a,b)=>b[1].chosen-a[1].chosen);
  if(!repeated.length)addInsight(rep,T.noRepeated,'',T.noRepeatedCue);
  else repeated.forEach(([id,x])=>addChoiceInsight(rep,id,x));
  const attentionNote=$('attentionNote');
  if(repeated.length){attentionNote.textContent=C.attentionNote;attentionNote.classList.remove('hidden')}else{attentionNote.textContent='';attentionNote.classList.add('hidden')}

  const numericItems=ITEM_ORDER.map((key,index)=>({key,index,value:state.sufficiency[key]})).filter(x=>Number.isFinite(x.value));
  const lowItems=numericItems.filter(x=>x.value<=3).sort((a,b)=>(a.value-b.value)||(a.index-b.index));
  const sr=$('suffRows');sr.innerHTML='';
  if(!numericItems.length){
    addInsight(sr,C.noNumericTitle,'',C.noNumericCue);
  }else if(!lowItems.length){
    addInsight(sr,C.noNeedTitle,'',C.noNeedCue);
  }else{
    for(const x of lowItems)addInsight(sr,capFirst(ITEM_RESULT_LABEL[x.key]),'','');
  }
  const suffNote=$('suffResultNote');suffNote.textContent='';suffNote.classList.add('hidden');

  const pairs=[];
  for(const [family,stat] of repeated){
    const link=FAMILY_ITEM_LINKS[family];
    if(!link)continue;
    const value=state.sufficiency[link.item];
    if(Number.isFinite(value))pairs.push({family,stat,item:link.item,strength:link.strength,value});
  }
  const strengthRank=x=>x==='DIRECT'?0:1;
  const lowPairs=pairs.filter(x=>x.value<=3).sort((a,b)=>(strengthRank(a.strength)-strengthRank(b.strength))||(b.stat.chosen-a.stat.chosen)||(a.value-b.value));
  const highPairs=pairs.filter(x=>x.value>=4).sort((a,b)=>(strengthRank(a.strength)-strengthRank(b.strength))||(b.stat.chosen-a.stat.chosen)||(b.value-a.value));

  const cr=$('compareRows');cr.innerHTML='';
  if(lowPairs.length){
    const m=lowPairs[0],related=m.strength==='RELATED';
    addReflection(cr,C.alignedCue(FAMILY_LABEL[m.family],m.stat.chosen,ITEM_ABOUT_TEXT[m.item],related),C.alignedQuestion,chosenImagePaths(m.family));
  }else if(highPairs.length){
    const m=highPairs[0],related=m.strength==='RELATED';
    addReflection(cr,C.highCue(FAMILY_LABEL[m.family],m.stat.chosen,ITEM_ABOUT_TEXT[m.item],related),C.highQuestion,chosenImagePaths(m.family));
  }else if(lowItems.length&&repeated.length){
    const need=lowItems[0];
    const contrast=repeated.find(([family])=>!(family==='CARE'&&need.key==='CARE_SUPPORT_PRESENT'));
    if(contrast){
      const [family,stat]=contrast;
      addReflection(cr,C.differentCue(ITEM_RESULT_LABEL[need.key],FAMILY_LABEL[family],stat.chosen),C.differentQuestion,chosenImagePaths(family));
    }else{
      addReflection(cr,C.needOnlyCue(ITEM_RESULT_LABEL[need.key]),C.needOnlyQuestion);
    }
  }else if(repeated.length){
    const [family,stat]=repeated[0];
    addReflection(cr,C.visualOnlyCue(FAMILY_LABEL[family],stat.chosen),C.visualOnlyQuestion,chosenImagePaths(family));
  }else if(lowItems.length){
    addReflection(cr,C.needOnlyCue(ITEM_RESULT_LABEL[lowItems[0].key]),C.needOnlyQuestion);
  }else{
    addReflection(cr,C.quietCue,C.quietQuestion);
  }

  $('debug').textContent=JSON.stringify(state,null,2)
}'''
s=s[:start]+new_block+s[end:]

for needle in [
    "secondHeading:'Ko dabar norėtųsi daugiau?'",
    "compareHeading:'Ką matai, kai palygini abu?'",
    "const FAMILY_ITEM_LINKS=",
    "CARE intentionally has no direct Channel B pair",
    "const lowItems=numericItems.filter(x=>x.value<=3)",
    "differentQuestion:'Kuris iš šių dviejų dalykų tau dabar atrodo svarbesnis?'",
    "alignedQuestion:'Ar tau šie du dalykai atrodo susiję?'",
    "highQuestion:'Kas tuose vaizduose vis tiek patraukė tavo dėmesį?'"
]:
    assert needle in s, needle

p.write_text(s)
