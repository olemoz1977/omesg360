import { buildResultWorldModel } from './result_world_v04.mjs?v=scene3';

function q(id){const el=document.getElementById(id);if(!el)throw new Error('PrioLens result DOM missing #'+id);return el}
function capFirst(x){return x?x.charAt(0).toUpperCase()+x.slice(1):x}
function escapeHtml(x){return String(x??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}

const COPY={
  lt:{
    title:'Pirmas žvilgsnis. Antras atsakymas.',
    lead:'Tas pats momentas iš dviejų perspektyvų. Paspausk sceną, jei nori pamatyti detales.',
    aLabel:'Pirmas žvilgsnis',aHeading:'Kas iškilo?',ship:'LAIVAS',shipTap:'Detalės',
    noAFocus:'Viena kryptis aiškiai neišsiskyrė',
    bLabel:'Antras atsakymas',bHeading:'Kur dabar mažiausiai pakanka?',map:'ŽEMĖLAPIS',mapTap:'Detalės',
    noRoute:'Aiškaus maršruto nėra',multiRoute:'Kelios kryptys',
    aDetail:'Pirmo žvilgsnio detalės',bDetail:'Antro atsakymo detalės',
    aDirect3:'Šią kryptį pasirinkai kiekvieną kartą, kai ji pasirodė: 3 iš 3.',
    aDirect2:'Ši kryptis kartojosi 2 iš 3 pasirodymų ir buvo vienintelė taip pasikartojusi.',
    aPlus3:'Šią kryptį pasirinkai 3 iš 3 kartų. Kadangi tokių krypčių buvo kelios, ją dar pasirinkai papildomame A+ palyginime.',
    aPlus2:'Ši kryptis kartojosi 2 iš 3 pasirodymų. Tarp kitų taip pat pasikartojusių krypčių ją pasirinkai papildomame A+ palyginime.',
    aNoClear:'Papildomame A+ palyginime vienos krypties neišskyrei.',
    aNoRepeated:'Šį kartą nė viena kryptis nepasikartojo pakankamai, kad būtų išskirta viena fokusinė kryptis.',
    leastTitle:'Kas liko antrame plane?',leastNone:'Nė viena kryptis bent 2 kartus nepateko tarp mažiausiai traukusių vaizdų.',
    leastNote:'Tai nereiškia, kad šios kryptys tau nesvarbios. Čia rodomas tik santykinis pasirinkimas tarp konkrečių vaizdų.',
    reflectionTitle:'Pažiūrėk atidžiau',
    reflectionQ:'Kas, tavo manymu, galėjo traukti šiuose vaizduose?',
    reflectionNote:'Šis atsakymas yra tavo paaiškinimas apie vaizdus. Jis nekeičia antroje dalyje pateikto pakankamumo įvertinimo.',
    selected:'Pasirinkta.',
    bDirect:'Tai vienintelė sritis, kurią savo atsakymuose įvertinai žemiausiai pagal dabartinį pakankamumą.',
    bSelected:'Kelios sritys turėjo tą patį žemiausią įvertinimą. Papildomame B+ klausime išskyrei šią.',
    bSimilar:'Kelios sritys turėjo tą patį žemiausią įvertinimą ir B+ pažymėjai, kad jos dabar panašios.',
    bHard:'Kelios sritys turėjo tą patį žemiausią įvertinimą, bet B+ vienos krypties neišskyrei. Todėl maršrutas nebrėžiamas.',
    bNoLow:'Pagal tavo atsakymus aiški mažesnio pakankamumo kryptis neišsiskyrė. Žemėlapis jos neforsuoja.',
    bNoNumeric:'Pakankamai aiškių skaitinių atsakymų maršrutui nėra.',
    routePrefix:'Maršrutas',
    separate:'Laivas rodo pirmo žvilgsnio fokusą. Žemėlapis remiasi tik tavo pakankamumo atsakymais.'
  },
  en:{
    title:'First glance. Second answer.',
    lead:'The same moment from two perspectives. Tap the scene to see the details.',
    aLabel:'First glance',aHeading:'What surfaced?',ship:'SHIP',shipTap:'Details',
    noAFocus:'No single direction clearly stood out',
    bLabel:'Second answer',bHeading:'Where does sufficiency feel lowest now?',map:'MAP',mapTap:'Details',
    noRoute:'No clear route',multiRoute:'Several directions',
    aDetail:'First-glance details',bDetail:'Second-answer details',
    aDirect3:'You chose this direction every time it appeared: 3 out of 3.',
    aDirect2:'This direction repeated 2 out of 3 times and was the only direction to repeat that often.',
    aPlus3:'You chose this direction 3 out of 3 times. Because several directions did so, you selected this one again in the A+ comparison.',
    aPlus2:'This direction repeated 2 out of 3 times. Among the other repeated directions, you selected this one in the A+ comparison.',
    aNoClear:'In the A+ comparison, you did not single out one direction.',
    aNoRepeated:'No direction repeated enough this time to produce one focus direction.',
    leastTitle:'What stayed in the background?',leastNone:'No direction appeared among the least-pulling images at least twice.',
    leastNote:'This does not mean these directions are unimportant to you. It only reflects relative choices among the specific images shown.',
    reflectionTitle:'Look closer',
    reflectionQ:'What, in your view, may have been pulling you in these images?',
    reflectionNote:'This is your explanation of the images. It does not change the sufficiency rating you gave in the second part.',
    selected:'Selected.',
    bDirect:'This was the only area you rated lowest for current sufficiency.',
    bSelected:'Several areas had the same lowest rating. In B+, you singled out this one.',
    bSimilar:'Several areas had the same lowest rating and in B+ you said they feel similar right now.',
    bHard:'Several areas had the same lowest rating, but in B+ you did not single out one. No route is drawn.',
    bNoLow:'Your answers did not produce a clear lower-sufficiency direction. The map does not force one.',
    bNoNumeric:'There were not enough clear numeric answers to draw a route.',
    routePrefix:'Route',
    separate:'The ship shows the first-glance focus. The map is based only on your sufficiency answers.'
  }
};

const NEED_MAP={
  lt:[
    {title:'Poilsis ir resursai',items:['RESTORATION_ENERGY','MATERIAL_RESOURCES']},
    {title:'Saugumas ir stabilumas',items:['SAFETY_STABILITY','CLARITY_PREDICTABILITY']},
    {title:'Ryšys ir parama',items:['CONNECTION_BELONGING','CARE_SUPPORT_PRESENT']},
    {title:'Autonomija ir pripažinimas',items:['AUTONOMY_AGENCY','RECOGNITION_ESTEEM']},
    {title:'Augimas ir gebėjimai',items:['LEARNING_GROWTH','CAPABILITY_MASTERY']},
    {title:'Prasmė ir indėlis',items:['MEANING_PURPOSE','CONTRIBUTION']}
  ],
  en:[
    {title:'Rest and resources',items:['RESTORATION_ENERGY','MATERIAL_RESOURCES']},
    {title:'Safety and stability',items:['SAFETY_STABILITY','CLARITY_PREDICTABILITY']},
    {title:'Connection and support',items:['CONNECTION_BELONGING','CARE_SUPPORT_PRESENT']},
    {title:'Autonomy and recognition',items:['AUTONOMY_AGENCY','RECOGNITION_ESTEEM']},
    {title:'Growth and capability',items:['LEARNING_GROWTH','CAPABILITY_MASTERY']},
    {title:'Meaning and contribution',items:['MEANING_PURPOSE','CONTRIBUTION']}
  ]
};
function renderNeedsMap(stage,lang,routeIds,itemLabels){
  const routeSet=new Set(routeIds);
  stage.innerHTML='';
  for(const land of NEED_MAP[lang]||NEED_MAP.lt){
    const continent=document.createElement('span');
    continent.className='continent';
    continent.innerHTML='<span class="continentTitle">'+escapeHtml(land.title)+'</span>'+
      land.items.map(id=>'<span class="needNode '+(routeSet.has(id)?'routeTarget':'')+'" data-need-id="'+escapeHtml(id)+'">'+escapeHtml(capFirst(itemLabels[id]||id))+'</span>').join('');
    stage.appendChild(continent);
  }
}
function chosenPaths(state,familyId){
  const seen=new Set(),out=[];
  for(const c of state.choices||[]){
    if(c.choice?.familyId!==familyId)continue;
    const s=c.stimuli?.find(x=>x.exemplarId===c.choice.exemplarId);
    if(s?.runtimePath&&!seen.has(s.runtimePath)){seen.add(s.runtimePath);out.push(s.runtimePath)}
  }
  return out;
}
function leastRows(state){
  const counts={};
  const paths={};
  for(const c of state.choices||[]){
    const f=c.leastChoice?.familyId;
    if(!f)continue;
    counts[f]=(counts[f]||0)+1;
    const s=c.stimuli?.find(x=>x.exemplarId===c.leastChoice.exemplarId);
    if(s?.runtimePath){if(!paths[f])paths[f]=[];if(!paths[f].includes(s.runtimePath))paths[f].push(s.runtimePath)}
  }
  return Object.entries(counts).filter(([,n])=>n>=2).sort((a,b)=>b[1]-a[1]).map(([familyId,count])=>({familyId,count,paths:paths[familyId]||[]}));
}

function attentionExplanation(a,C){
  if(!a.hasFocus){
    return a.clarifierNoClear?C.aNoClear:C.aNoRepeated;
  }
  if(a.source==='A_DIRECT_UNIQUE_3_OF_3')return C.aDirect3;
  if(a.source==='A_DIRECT_UNIQUE_2_OF_3')return C.aDirect2;
  if(a.source==='A_PLUS_RUNOFF_3_OF_3')return C.aPlus3;
  if(a.source==='A_PLUS_RUNOFF_2_OF_3')return C.aPlus2;
  return '';
}
function routeExplanation(b,C){
  if(b.source==='B_DIRECT_UNIQUE_MIN')return C.bDirect;
  if(b.source==='B_PLUS_SELECTED')return C.bSelected;
  if(b.source==='B_PLUS_SIMILAR')return C.bSimilar;
  if(b.source==='B_PLUS_HARD_TO_SAY')return C.bHard;
  if(b.source==='B_NO_LOW_ROUTE')return C.bNoLow;
  return C.bNoNumeric;
}
function setExpanded(button,detail,open){
  detail.classList.toggle('hidden',!open);
  button.setAttribute('aria-expanded',open?'true':'false');
}
function imagesHtml(paths,klass='worldDetailImages'){
  if(!paths.length)return '';
  return '<div class="'+klass+'">'+paths.map(src=>'<img src="'+escapeHtml(src)+'" alt="">').join('')+'</div>';
}

export function renderResultWorldV04({state,lang='lt',familyLabels,itemLabels,reasonOptions=[],onSelfExplanation}){
  const C=COPY[lang]||COPY.lt;
  const model=buildResultWorldModel(state);

  document.querySelector('#result h1').textContent=C.title;
  q('resultLead').textContent=C.lead;
  q('firstLabel').textContent=C.aLabel;
  q('firstHeading').textContent=C.aHeading;
  q('secondLabel').textContent=C.bLabel;
  q('secondHeading').textContent=C.bHeading;

  const shipLabel=model.attention.hasFocus?(familyLabels[model.attention.familyId]||model.attention.familyId):C.noAFocus;
  q('shipFocus').textContent=shipLabel;
  q('shipPlaceholder').textContent=C.ship;
  q('shipTap').textContent=C.shipTap;

  const routeLabels=model.sufficiency.itemIds.map(id=>capFirst(itemLabels[id]||id));
  q('mapPlaceholder').textContent=C.map;
  q('mapRoute').textContent=routeLabels.length===1?routeLabels[0]:(routeLabels.length>1?C.multiRoute:C.noRoute);
  q('mapTap').textContent=C.mapTap;
  renderNeedsMap(q('needsMapStage'),lang,model.sufficiency.itemIds,itemLabels);
  q('worldSeparationNote').textContent=C.separate;

  const ship=q('shipCard'),aDetail=q('attentionDetail');
  ship.setAttribute('aria-expanded','false');
  ship.setAttribute('aria-label',C.aLabel+': '+shipLabel+'. '+C.shipTap);
  ship.onclick=()=>setExpanded(ship,aDetail,aDetail.classList.contains('hidden'));

  const map=q('mapCard'),bDetail=q('suffDetail');
  map.setAttribute('aria-expanded','false');
  map.setAttribute('aria-label',C.bLabel+': '+(routeLabels.length?routeLabels.join(', '):C.noRoute)+'. '+C.mapTap);
  map.onclick=()=>setExpanded(map,bDetail,bDetail.classList.contains('hidden'));

  q('attentionDetailTitle').textContent=C.aDetail;
  const rep=q('repeatRows');rep.innerHTML='';
  const aBox=document.createElement('div');aBox.className='worldDetailBlock';
  aBox.innerHTML='<div class="worldDetailName">'+escapeHtml(shipLabel)+'</div><div class="worldDetailText">'+escapeHtml(attentionExplanation(model.attention,C))+'</div>';
  if(model.attention.hasFocus)aBox.insertAdjacentHTML('afterbegin',imagesHtml(chosenPaths(state,model.attention.familyId)));
  rep.appendChild(aBox);
  q('attentionNote').textContent=model.attention.hasFocus
    ?(lang==='en'?'The number is shown only here in the detail layer. It describes repeated MOST choices, not need strength.':'Skaičius rodomas tik detalėse. Jis aprašo pasikartojusius MOST pasirinkimus, ne poreikio stiprumą.')
    :'';
  q('attentionNote').classList.toggle('hidden',!q('attentionNote').textContent);

  q('leastLabel').textContent=lang==='en'?'Channel A detail':'Channel A detalė';
  q('leastHeading').textContent=C.leastTitle;
  q('leastNote').textContent=C.leastNote;
  const lm=q('leastRows');lm.innerHTML='';
  const least=leastRows(state);
  if(!least.length){
    lm.innerHTML='<div class="worldDetailBlock"><div class="worldDetailText">'+escapeHtml(C.leastNone)+'</div></div>';
  }else{
    for(const row of least){
      const d=document.createElement('div');d.className='worldDetailBlock';
      d.innerHTML=imagesHtml(row.paths)+'<div class="worldDetailName">'+escapeHtml(familyLabels[row.familyId]||row.familyId)+'</div><div class="worldDetailText">'+row.count+'/3 LEAST</div>';
      lm.appendChild(d);
    }
  }

  q('compareLabel').textContent=C.reflectionTitle;
  q('compareHeading').textContent=C.reflectionQ;
  const cr=q('compareRows');cr.innerHTML='';
  if(model.attention.hasFocus){
    const reflection=document.createElement('div');reflection.className='reflectionHero compactReflection';
    reflection.innerHTML=imagesHtml(chosenPaths(state,model.attention.familyId),'reflectionImages')+
      '<div class="reflectionQuestion">'+escapeHtml(C.reflectionQ)+'</div>'+
      '<div class="reasonOptions">'+reasonOptions.map(([code,label])=>'<button type="button" class="reasonOption" data-reason="'+escapeHtml(code)+'">'+escapeHtml(label)+'</button>').join('')+'</div>'+
      '<div class="reasonFeedback hidden">'+escapeHtml(C.reflectionNote)+'</div><div class="reasonSave hidden"></div>';
    cr.appendChild(reflection);
    const feedback=reflection.querySelector('.reasonFeedback'),save=reflection.querySelector('.reasonSave');
    reflection.querySelectorAll('.reasonOption').forEach(btn=>btn.onclick=async()=>{
      reflection.querySelectorAll('.reasonOption').forEach(x=>x.classList.toggle('on',x===btn));
      feedback.textContent=C.reflectionNote;feedback.classList.remove('hidden');
      save.textContent=C.selected;save.classList.remove('hidden');
      if(typeof onSelfExplanation==='function'){
        await onSelfExplanation({familyId:model.attention.familyId,reasonCode:btn.dataset.reason,statusEl:save});
      }
    });
  }else{
    cr.innerHTML='<div class="worldDetailBlock"><div class="worldDetailText">'+escapeHtml(attentionExplanation(model.attention,C))+'</div></div>';
  }

  q('suffDetailTitle').textContent=C.bDetail;
  const sr=q('suffRows');sr.innerHTML='';
  const bBox=document.createElement('div');bBox.className='worldDetailBlock';
  if(routeLabels.length){
    bBox.innerHTML='<div class="worldDetailName">'+escapeHtml(C.routePrefix)+': '+routeLabels.map(escapeHtml).join(' · ')+'</div><div class="worldDetailText">'+escapeHtml(routeExplanation(model.sufficiency,C))+'</div>';
  }else{
    bBox.innerHTML='<div class="worldDetailName">'+escapeHtml(C.noRoute)+'</div><div class="worldDetailText">'+escapeHtml(routeExplanation(model.sufficiency,C))+'</div>';
  }
  sr.appendChild(bBox);
  q('suffResultNote').textContent=lang==='en'
    ?'This route comes only from your Channel-B sufficiency answers and B+ clarification.'
    :'Šis maršrutas remiasi tik Channel B pakankamumo atsakymais ir B+ patikslinimu.';
  q('suffResultNote').classList.remove('hidden');

  return model;
}
