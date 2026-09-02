from pathlib import Path

p=Path('priolens/open14-v02/index.html')
s=p.read_text()

old_css='.insightCue{font-size:14px;line-height:1.5;color:#666;margin-top:5px}.reflectionQuestion{font-size:17px;font-weight:780;line-height:1.45;margin-top:12px;color:#222}.resultNote{font-size:14px;line-height:1.55;color:#666;margin:10px 2px 0}'
new_css='.insightCue{font-size:14px;line-height:1.5;color:#666;margin-top:5px}.choiceInsight{background:#fff;border:1px solid var(--line);border-radius:16px;padding:12px}.choiceVisuals{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-bottom:12px}.choiceVisuals img{display:block;width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:12px;border:1px solid #e4e4df;background:#eee}.choiceMeta{display:flex;align-items:center;justify-content:space-between;gap:10px}.choiceCount{flex:0 0 auto;font-size:13px;font-weight:800;border:1px solid #cfcfca;border-radius:999px;padding:5px 8px;color:#444}.choiceMeaning{font-size:14px;line-height:1.5;color:#5e5e5e;margin-top:7px}.reflectionPerspective{margin-top:42px}.reflectionPerspective .perspectiveLabel{color:#181818}.reflectionHero{background:#181818;color:#fff;border-radius:20px;padding:22px 20px}.reflectionHero .insightCue{color:#d8d8d2;font-size:15px;line-height:1.55;margin:0}.reflectionImages{display:grid;grid-template-columns:repeat(2,minmax(0,120px));gap:8px;margin-bottom:16px}.reflectionImages img{width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:12px;border:1px solid #454545}.reflectionQuestion{font-size:clamp(22px,5vw,29px);font-weight:820;letter-spacing:-.02em;line-height:1.2;margin-top:16px;color:#fff}.resultNote{font-size:14px;line-height:1.55;color:#666;margin:10px 2px 0}'
assert old_css in s
s=s.replace(old_css,new_css,1)

old_third='    <div class="perspective">\n      <p id="compareLabel" class="perspectiveLabel">Sugretinimas</p>'
new_third='    <div class="perspective reflectionPerspective">\n      <p id="compareLabel" class="perspectiveLabel">Svarbiausia</p>'
assert old_third in s
s=s.replace(old_third,new_third,1)

old_lt="firstLabel:'Pirma perspektyva',firstHeading:'Kas patraukė tavo dėmesį',secondLabel:'Antra perspektyva',secondHeading:'Kur šiuo metu mažiau pakanka',compareLabel:'Refleksija',compareHeading:'Pažvelk dar kartą'"
new_lt="firstLabel:'Pirma perspektyva',firstHeading:'Ką rinkaisi dažniausiai',secondLabel:'Antra perspektyva',secondHeading:'Kur dabar ne visai pakanka',compareLabel:'Svarbiausia',compareHeading:'Kas čia verta antro žvilgsnio?'"
assert old_lt in s
s=s.replace(old_lt,new_lt,1)
old_en="firstLabel:'First perspective',firstHeading:'What pulled your attention',secondLabel:'Second perspective',secondHeading:'Where less feels sufficient right now',compareLabel:'Reflection',compareHeading:'Look again'"
new_en="firstLabel:'First perspective',firstHeading:'What you chose most often',secondLabel:'Second perspective',secondHeading:'Where things do not feel quite enough',compareLabel:'Most important',compareHeading:'What deserves a second look?'"
assert old_en in s
s=s.replace(old_en,new_en,1)

needle='const FAMILY_LABEL=FAMILY_LABELS[LANG];\n'
assert needle in s
meaning=r'''const FAMILY_MEANINGS={
  lt:{
    REST:'Gali būti susiję su noru atsikvėpti, atgauti jėgas ar turėti daugiau ramybės.',
    RESOURCE:'Gali būti susiję su tuo, kas tau atrodo vertinga, prieinama ir verta panaudoti.',
    SAFETY:'Gali būti susiję su saugumu, apsauga ir noru jaustis užtikrinčiau.',
    ORDER:'Gali būti susiję su aiškumu, tvarka ir noru žinoti, kur kas yra ir ko tikėtis.',
    CONNECTION:'Gali būti susiję su tiesioginiu ryšiu, abipusiu kontaktu ir buvimu su kitu žmogumi.',
    BELONGING:'Gali būti susiję su jausmu būti savu tarp kitų, dalyvauti ir priklausyti grupei.',
    CARE:'Gali būti susiję su polinkiu pastebėti kitą ir pasirūpinti juo.',
    AUTONOMY:'Gali būti susiję su laisve rinktis savo kryptį ir daryti savaip.',
    CONTROL:'Gali būti susiję su noru pačiam veikti situaciją, valdyti ar keisti tai, kas vyksta.',
    RECOGNITION:'Gali būti susiję su tuo, kad tavo indėlis, nuomonė ar gebėjimai būtų pastebėti ir vertinami.',
    MASTERY:'Gali būti susiję su noru gerai mokėti, tiksliai atlikti ir jausti savo meistriškumą.',
    EXPLORATION:'Gali būti susiję su smalsumu, atradimu ir noru pažiūrėti, kas dar nežinoma.',
    KNOWLEDGE:'Gali būti susiję su noru suprasti, išmokti ir susidėlioti, kaip kas veikia.',
    OPPORTUNITY:'Gali būti susiję su matoma galimybe, kurią norisi pastebėti ir išnaudoti.'
  },
  en:{
    REST:'This may relate to wanting to pause, recover energy or have more calm.',
    RESOURCE:'This may relate to what feels valuable, available and worth making use of.',
    SAFETY:'This may relate to safety, protection and wanting to feel more secure.',
    ORDER:'This may relate to clarity, order and wanting to know where things stand and what to expect.',
    CONNECTION:'This may relate to direct connection, mutual contact and being with another person.',
    BELONGING:'This may relate to feeling part of a group, included and at home with others.',
    CARE:'This may relate to noticing another person and wanting to care for them.',
    AUTONOMY:'This may relate to freedom to choose your own direction and do things your way.',
    CONTROL:'This may relate to wanting to influence a situation directly, steer it or change what is happening.',
    RECOGNITION:'This may relate to having your contribution, opinion or ability noticed and valued.',
    MASTERY:'This may relate to wanting to do something well, precisely and with a sense of competence.',
    EXPLORATION:'This may relate to curiosity, discovery and wanting to see what is still unknown.',
    KNOWLEDGE:'This may relate to wanting to understand, learn and make sense of how something works.',
    OPPORTUNITY:'This may relate to noticing an opening or possibility that feels worth using.'
  }
};
const FAMILY_MEANING=FAMILY_MEANINGS[LANG];
'''
s=s.replace(needle,needle+meaning,1)

start=s.index('function addReflection(')
end=s.index("\n$('start').onclick=",start)
new_block=r'''function chosenImagePaths(id){const seen=new Set(),paths=[];for(const c of state.choices){if(c.choice?.familyId!==id)continue;const stim=c.stimuli.find(x=>x.exemplarId===c.choice.exemplarId);if(stim?.runtimePath&&!seen.has(stim.runtimePath)){seen.add(stim.runtimePath);paths.push(stim.runtimePath)}}return paths}
function addChoiceInsight(mount,id,x){const r=document.createElement('div');r.className='choiceInsight';const images=chosenImagePaths(id).slice(0,2).map(src=>`<img src="${src}" alt="">`).join('');r.innerHTML=`<div class="choiceVisuals">${images}</div><div class="choiceMeta"><div class="insightTitle">${FAMILY_LABEL[id]}</div><span class="choiceCount">${x.chosen}/3</span></div><div class="choiceMeaning">${FAMILY_MEANING[id]}</div>`;mount.appendChild(r)}
function countPhrase(n){return LANG==='en'?`${n} out of 3 times`:`${n} iš 3 kartų`}
function addReflection(mount,cue,question,images=[]){const r=document.createElement('div');r.className='reflectionHero';const pics=images.slice(0,2).map(src=>`<img src="${src}" alt="">`).join('');r.innerHTML=`${pics?`<div class="reflectionImages">${pics}</div>`:''}${cue?`<div class="insightCue">${cue}</div>`:''}<div class="reflectionQuestion">${question}</div>`;mount.appendChild(r)}
function renderResult(){
  const C=LANG==='en'?{
    attentionNote:'This does not mean you lack these things. It only shows which themes your attention returned to more than once.',
    noLowTitle:'Nothing clearly stood out here',
    noLowCue:'From your answers, these areas currently feel more sufficient than lacking.',
    lowState:'less sufficient',midState:'somewhere in the middle',highState:'fairly sufficient',
    mappedCue:(f,n,d,stateText)=>`The theme “${f}” was your choice ${countPhrase(n)}. You currently describe “${d}” as ${stateText}.`,
    lowQuestion:'Does that repetition feel connected to how things are for you right now, or not at all?',
    highQuestion:'If this area already feels fairly sufficient, what about those images still caught you?',
    visualOnlyCue:(f,n)=>`The theme “${f}” was your choice ${countPhrase(n)}. In this version, we cannot directly compare it with the second part without stretching the meaning.`,
    visualOnlyQuestion:'What was it about those images that caught you?',
    lowOnlyCue:n=>`No single visual theme repeated, but in your own answers “${n}” stood out as not quite enough right now.`,
    lowOnlyQuestion:'What about this area matters most to you right now?',
    quietCue:'This time, neither your image choices nor your answers produced one clearly dominant point.',
    quietQuestion:'Was there still anything you found yourself thinking about afterwards?'
  }:{
    attentionNote:'Tai nereiškia, kad tau šito trūksta. Tik tiek, kad prie šių temų tavo dėmesys grįžo daugiau nei kartą.',
    noLowTitle:'Nieko aiškiai neišsiskyrė',
    noLowCue:'Pagal tavo atsakymus, šiose srityse dabar labiau jauti pakankamumą nei trūkumą.',
    lowState:'labiau trūksta',midState:'per vidurį',highState:'gana pakankamai',
    mappedCue:(f,n,d,stateText)=>`Tema „${f}“ buvo tavo pasirinkimas ${countPhrase(n)}. Sritį „${d}“ dabar vertini kaip ${stateText}.`,
    lowQuestion:'Ar šitas pasikartojimas turi ką nors bendro su tuo, kaip dabar jautiesi šioje srityje, ar visai ne?',
    highQuestion:'Jei šioje srityje tau gana pakanka, kas tuose vaizduose vis tiek užkabino?',
    visualOnlyCue:(f,n)=>`Tema „${f}“ buvo tavo pasirinkimas ${countPhrase(n)}. Su antra dalimi jos tiesiogiai lyginti negalime, nepertempdami prasmės.`,
    visualOnlyQuestion:'Kas tuose vaizduose tave užkabino?',
    lowOnlyCue:n=>`Vaizduose viena tema nepasikartojo, bet tavo pačio atsakymuose išsiskyrė „${n}“.`,
    lowOnlyQuestion:'Kas šioje srityje tau dabar labiausiai rūpi?',
    quietCue:'Šį kartą nei vaizduose, nei tavo atsakymuose viena vieta aiškiai neišsiskyrė.',
    quietQuestion:'Ar vis tiek buvo kas nors, prie ko norisi grįžti mintimis?'
  };

  const coverage=state.domainCoverage||domainCoverage();
  const rep=$('repeatRows');rep.innerHTML='';
  const repeated=Object.entries(state.familyStats).filter(([,x])=>x.chosen>=2&&x.crossExemplar).sort((a,b)=>b[1].chosen-a[1].chosen);
  if(!repeated.length)addInsight(rep,T.noRepeated,'',T.noRepeatedCue);
  else repeated.forEach(([id,x])=>addChoiceInsight(rep,id,x));
  const attentionNote=$('attentionNote');
  if(repeated.length){attentionNote.textContent=C.attentionNote;attentionNote.classList.remove('hidden')}else{attentionNote.textContent='';attentionNote.classList.add('hidden')}

  const sr=$('suffRows');sr.innerHTML='';
  const completeDomains=DOMAINS.filter(d=>coverage[d.id].complete);
  const lowDomains=completeDomains.filter(d=>coverage[d.id].value<=3);
  const incompleteCount=DOMAINS.length-completeDomains.length;
  if(!completeDomains.length){
    addInsight(sr,T.suffNone,'',T.suffNoneCue);
  }else if(!lowDomains.length){
    addInsight(sr,C.noLowTitle,'',C.noLowCue);
  }else{
    for(const d of lowDomains){
      const v=coverage[d.id].value;
      addInsight(sr,d.title,v<=2.5?T.suffLow:T.suffMid,'');
    }
  }
  const suffNote=$('suffResultNote');
  if(incompleteCount>0&&completeDomains.length){suffNote.textContent=T.suffIncomplete(incompleteCount);suffNote.classList.remove('hidden')}else{suffNote.textContent='';suffNote.classList.add('hidden')}

  const cr=$('compareRows');cr.innerHTML='';
  const mapped=[];
  for(const d of DOMAINS){
    if(!d.families.length||!coverage[d.id].complete)continue;
    for(const f of d.families){
      const stat=state.familyStats[f];
      if(stat?.chosen>=2&&stat?.crossExemplar)mapped.push({domain:d,family:f,value:coverage[d.id].value,chosen:stat.chosen});
    }
  }
  mapped.sort((a,b)=>((a.value<=3?0:1)-(b.value<=3?0:1))||(b.chosen-a.chosen));

  if(mapped.length){
    const m=mapped[0],fName=FAMILY_LABEL[m.family];
    const stateText=m.value<=2.5?C.lowState:m.value<=3?C.midState:C.highState;
    addReflection(cr,C.mappedCue(fName,m.chosen,m.domain.title,stateText),m.value<=3?C.lowQuestion:C.highQuestion,chosenImagePaths(m.family));
  }else if(repeated.length){
    const [id,x]=repeated[0],name=FAMILY_LABEL[id];
    addReflection(cr,C.visualOnlyCue(name,x.chosen),C.visualOnlyQuestion,chosenImagePaths(id));
  }else if(lowDomains.length){
    const names=joinNatural(lowDomains.map(d=>d.title));
    addReflection(cr,C.lowOnlyCue(names),C.lowOnlyQuestion);
  }else{
    addReflection(cr,C.quietCue,C.quietQuestion);
  }

  $('debug').textContent=JSON.stringify(state,null,2)
}'''
s=s[:start]+new_block+s[end:]

for needle in [
  "firstHeading:'Ką rinkaisi dažniausiai'",
  "secondHeading:'Kur dabar ne visai pakanka'",
  "compareLabel:'Svarbiausia'",
  "compareHeading:'Kas čia verta antro žvilgsnio?'",
  'const FAMILY_MEANINGS=',
  'function addChoiceInsight(',
  'className=\'reflectionHero\'',
  '2 iš 3 kartų',
  'kas tuose vaizduose vis tiek užkabino?',
  'What deserves a second look?'
]:
  assert needle in s, needle

p.write_text(s)
