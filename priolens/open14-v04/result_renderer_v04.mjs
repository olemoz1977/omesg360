import { buildResultWorldModel } from './result_world_v04.mjs?v=detail1';

function q(id){const el=document.getElementById(id);if(!el)throw new Error('PrioLens result DOM missing #'+id);return el}
function capFirst(x){return x?x.charAt(0).toUpperCase()+x.slice(1):x}
function escapeHtml(x){return String(x??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}

const COPY={
  lt:{
    title:'Pirmas žvilgsnis. Antras atsakymas.',
    lead:'Papildomos detalės apie pirmo žvilgsnio ir antro atsakymo rezultatus.',
    noAFocus:'Viena kryptis aiškiai neišsiskyrė',
    noRoute:'Aiškiai nepakankama sritis neišsiskyrė',multiRoute:'Kelios sritys išsiskyrė',
    aDetail:'Pirmo žvilgsnio detalės',bDetail:'Antro atsakymo detalės',
    aDirect3:'Šią kryptį pasirinkai kiekvieną kartą, kai ji pasirodė: 3 iš 3.',
    aDirect2:'Ši kryptis kartojosi 2 iš 3 pasirodymų ir buvo vienintelė taip pasikartojusi.',
    aPlus3:'Šią kryptį pasirinkai 3 iš 3 kartų. Kadangi tokių krypčių buvo kelios, papildomame palyginime išskyrei būtent šią.',
    aPlus2:'Ši kryptis kartojosi 2 iš 3 pasirodymų. Tarp kitų taip pat pasikartojusių krypčių papildomame palyginime išskyrei būtent šią.',
    aNoClear:'Papildomame palyginime vienos krypties neišskyrei.',aNoClearRepeats:'Todėl viena kryptis nėra paskelbiama fokusu. Žemiau paliekamos visos vizualinės kryptys, kurios pirmuose pasirinkimuose pasikartojo 3/3 arba 2/3.',aRepeatedTitle:'Kas kartojosi pirmuose pasirinkimuose?',
    aNoRepeated:'Šį kartą nė viena kryptis nepasikartojo pakankamai, kad būtų išskirta viena fokusinė kryptis.',
    leastTitle:'Kas liko antrame plane?',leastNone:'Aiškios krypties, kuri nuosekliai liko antrame plane, nebuvo.',
    leastNote:'Tai nereiškia, kad šios kryptys tau nesvarbios. Čia rodomas tik santykinis pasirinkimas tarp konkrečių vaizdų.',
    reflectionTitle:'Pažiūrėk atidžiau',
    reflectionQ:'Kas, tavo manymu, galėjo traukti šiuose vaizduose?',
    reflectionNote:'Šis atsakymas yra tavo paaiškinimas apie vaizdus. Jis nekeičia antroje dalyje pateikto pakankamumo įvertinimo.',
    selected:'Pasirinkta.',
    bDirect:'Tai vienintelė sritis, kurią savo atsakymuose įvertinai žemiausiai pagal dabartinį pakankamumą.',
    bSelected:'Kelios sritys turėjo tą patį žemiausią įvertinimą. Papildomame klausime išskyrei šią.',
    bSimilar:'Kelios sritys turėjo tą patį žemiausią įvertinimą ir papildomame klausime pažymėjai, kad jos dabar panašios.',
    bHard:'Kelios sritys turėjo tą patį žemiausią įvertinimą, bet papildomame klausime vienos srities neišskyrei. Todėl viena sritis nėra paskelbiama pagrindine.',
    bNoLow:'Pagal tavo atsakymus nė viena sritis neišsiskyrė kaip aiškiai mažiau pakankama. Todėl viena sritis nėra dirbtinai išskiriama.',
    bNoNumeric:'Pakankamai aiškių skaitinių atsakymų, kad būtų galima išskirti mažesnio pakankamumo sritį, nėra.',
    backToResult:'← Grįžti į rezultatą',close:'Uždaryti',why:'Kaip ši pakankamumo sritis buvo išskirta?',whyMany:'Kaip šios pakankamumo sritys buvo išskirtos?',suffMethodSingle:'Tai rodo, kuri sritis šiuose atsakymuose išsiskyrė kaip mažiausiai pakankama, o ne tai, kiek ji tau svarbi.',suffMethodMany:'Tai rodo santykinį šių sričių pakankamumą dabartiniuose atsakymuose, o ne jų svarbumą.',answerLabel:'Tavo atsakymas'
  },
  en:{
    title:'First glance. Second answer.',
    lead:'Additional details about the first-glance and second-answer results.',
    noAFocus:'No single direction clearly stood out',
    noRoute:'No clearly insufficient area stood out',multiRoute:'Several areas stood out',
    aDetail:'First-glance details',bDetail:'Second-answer details',
    aDirect3:'You chose this direction every time it appeared: 3 out of 3.',
    aDirect2:'This direction repeated 2 out of 3 times and was the only direction to repeat that often.',
    aPlus3:'You chose this direction 3 out of 3 times. Because several directions did so, you singled out this one in an additional comparison.',
    aPlus2:'This direction repeated 2 out of 3 times. Among the other repeated directions, you singled out this one in an additional comparison.',
    aNoClear:'In the additional comparison, you did not single out one direction.',aNoClearRepeats:'So no single direction is declared the focus. Below are all visual directions that repeated 3/3 or 2/3 in the first choices.',aRepeatedTitle:'What repeated in the first choices?',
    aNoRepeated:'No direction repeated enough this time to produce one focus direction.',
    leastTitle:'What stayed in the background?',leastNone:'No direction consistently stayed in the background.',
    leastNote:'This does not mean these directions are unimportant to you. It only reflects relative choices among the specific images shown.',
    reflectionTitle:'Look closer',
    reflectionQ:'What, in your view, may have been pulling you in these images?',
    reflectionNote:'This is your explanation of the images. It does not change the sufficiency rating you gave in the second part.',
    selected:'Selected.',
    bDirect:'This was the only area you rated lowest for current sufficiency.',
    bSelected:'Several areas had the same lowest rating. In the additional question, you singled out this one.',
    bSimilar:'Several areas had the same lowest rating and in the additional question you said they feel similar right now.',
    bHard:'Several areas had the same lowest rating, but in the additional question you did not single out one area. No single area is therefore presented as the main one.',
    bNoLow:'Your answers did not produce one clearly lower-sufficiency area. No single area is forced as the main one.',
    bNoNumeric:'There were not enough clear numeric answers to single out a lower-sufficiency area.',
    backToResult:'← Back to result',close:'Close',why:'How was this sufficiency area singled out?',whyMany:'How were these sufficiency areas singled out?',suffMethodSingle:'This shows which area stood out as least sufficient in these answers, not how important it is to you.',suffMethodMany:'This shows the relative sufficiency of these areas in your current answers, not their importance.',answerLabel:'Your answer'
  }
};

const ITEM_DETAIL={
  lt:{
    RESTORATION_ENERGY:'Poilsio ir energijos kasdienybei.',
    MATERIAL_RESOURCES:'Kasdienių resursų tam, ko realiai reikia.',
    SAFETY_STABILITY:'Saugumo ir stabilumo.',
    CLARITY_PREDICTABILITY:'Aiškumo ir nuspėjamumo kasdienybėje.',
    CONNECTION_BELONGING:'Artimo ryšio ir priklausymo.',
    CARE_SUPPORT_PRESENT:'Rūpesčio, paramos ir žmogiško dėmesio, kurio sulauki iš kitų.',
    AUTONOMY_AGENCY:'Laisvės pačiam spręsti ir veikti.',
    RECOGNITION_ESTEEM:'Jausmo, kad tavo pastangos, nuomonė ar indėlis pastebimi ir vertinami.',
    LEARNING_GROWTH:'Galimybių mokytis, atrasti ir augti.',
    CAPABILITY_MASTERY:'Galimybių naudoti ir tobulinti savo gebėjimus.',
    MEANING_PURPOSE:'Prasmės tame, ką darai.',
    CONTRIBUTION:'Galimybių prisidėti prie kažko svarbaus ne tik sau.'
  },
  en:{
    RESTORATION_ENERGY:'Rest and energy for everyday life.',
    MATERIAL_RESOURCES:'Everyday resources for what you realistically need.',
    SAFETY_STABILITY:'Safety and stability.',
    CLARITY_PREDICTABILITY:'Clarity and predictability in everyday life.',
    CONNECTION_BELONGING:'Close connection and a sense of belonging.',
    CARE_SUPPORT_PRESENT:'Care, support and human attention you receive from others.',
    AUTONOMY_AGENCY:'Freedom to decide and act for yourself.',
    RECOGNITION_ESTEEM:'A sense that your efforts, opinions or contribution are noticed and valued.',
    LEARNING_GROWTH:'Opportunities to learn, discover and grow.',
    CAPABILITY_MASTERY:'Opportunities to use and develop your abilities.',
    MEANING_PURPOSE:'Meaning in what you do.',
    CONTRIBUTION:'Opportunities to contribute to something important beyond yourself.'
  }
};

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
  return Object.entries(counts).filter(([,n])=>n===3).sort((a,b)=>a[0].localeCompare(b[0])).map(([familyId,count])=>({familyId,count,paths:paths[familyId]||[]}));
}
function mostRepeatRows(state){
  const counts={};
  const paths={};
  for(const c of state.choices||[]){
    const f=c.choice?.familyId;
    if(!f)continue;
    counts[f]=(counts[f]||0)+1;
    const s=c.stimuli?.find(x=>x.exemplarId===c.choice.exemplarId);
    if(s?.runtimePath){if(!paths[f])paths[f]=[];if(!paths[f].includes(s.runtimePath))paths[f].push(s.runtimePath)}
  }
  return Object.entries(counts)
    .filter(([,n])=>n===2||n===3)
    .sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]))
    .map(([familyId,count])=>({familyId,count,paths:paths[familyId]||[]}));
}
function researchHtml(lang,kind){
  if(kind==='attention'){
    if(lang==='en')return '<details class="researchParallel"><summary>Research parallels</summary><p>What captures attention is not a transparent readout of a hidden need. Visual salience, current goals and learned value can all influence attentional selection. PrioLens therefore treats repeated first-glance choices as an attention pattern in this image set, not as a diagnosis or proof of an unmet need.</p><div class="researchRefs"><a href="https://pubmed.ncbi.nlm.nih.gov/23589803/" target="_blank" rel="noopener">Anderson, 2013 · value-driven attentional selection</a><a href="https://pubmed.ncbi.nlm.nih.gov/17329432/" target="_blank" rel="noopener">Seeley et al., 2007 · salience processing network</a></div></details>';
    return '<details class="researchParallel"><summary>Tyrimų paralelės</summary><p>Tai, kas patraukia dėmesį, nėra tiesioginis „paslėpto poreikio“ matas. Dėmesio atranką gali veikti pats vaizdo išskirtinumas, dabartiniai tikslai ir anksčiau išmokta vertė. Todėl PrioLens pirmo žvilgsnio pasikartojimus traktuoja kaip dėmesio modelį šioje vaizdų imtyje, o ne kaip diagnozę ar įrodymą, kad konkretus poreikis nepatenkintas.</p><div class="researchRefs"><a href="https://pubmed.ncbi.nlm.nih.gov/23589803/" target="_blank" rel="noopener">Anderson, 2013 · value-driven attentional selection</a><a href="https://pubmed.ncbi.nlm.nih.gov/17329432/" target="_blank" rel="noopener">Seeley ir kt., 2007 · salience processing network</a></div></details>';
  }
  if(lang==='en')return '<details class="researchParallel"><summary>Research parallels</summary><p>Experiencing scarcity can shift attention toward what is lacking and can alter valuation or cognitive control. But this evidence is strongest for specific forms of scarcity and cannot be generalized automatically to all 12 PrioLens areas. Self-Determination Theory has a stronger evidence base for autonomy, competence and relatedness specifically.</p><div class="researchRefs"><a href="https://pubmed.ncbi.nlm.nih.gov/31123150/" target="_blank" rel="noopener">Huijsmans et al., 2019 · scarcity and consumer decision making</a><a href="https://selfdeterminationtheory.org/wp-content/uploads/2020/03/2020_VansteenkisteRyanSoenens_BPNSIntro_MOEM.pdf" target="_blank" rel="noopener">Vansteenkiste, Ryan & Soenens, 2020 · basic psychological need theory</a></div></details>';
  return '<details class="researchParallel"><summary>Tyrimų paralelės</summary><p>Patiriamas trūkumas kai kuriose situacijose gali nukreipti daugiau dėmesio į tai, ko stinga, ir keisti vertinimą ar kognityvinę kontrolę. Tačiau šie efektai geriausiai parodyti konkrečiose trūkumo situacijose, todėl jų negalima automatiškai perkelti į visas 12 PrioLens sričių. Savideterminacijos teorijoje stipresnė empirinė bazė yra autonomijai, kompetencijai ir ryšiui.</p><div class="researchRefs"><a href="https://pubmed.ncbi.nlm.nih.gov/31123150/" target="_blank" rel="noopener">Huijsmans ir kt., 2019 · scarcity ir sprendimų vertinimas</a><a href="https://selfdeterminationtheory.org/wp-content/uploads/2020/03/2020_VansteenkisteRyanSoenens_BPNSIntro_MOEM.pdf" target="_blank" rel="noopener">Vansteenkiste, Ryan & Soenens, 2020 · basic psychological need theory</a></div></details>';
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
let detailCloseCallback=null;
let detailOnlyHost=false;

function detailRoute(){
  const x=new URLSearchParams(location.search).get('detail');
  return x==='attention'||x==='sufficiency'?x:null;
}
function applyDetailRoute(){
  const kind=detailRoute();
  const result=q('result');
  const a=q('attentionDetail'),b=q('suffDetail');
  const attention=kind==='attention',sufficiency=kind==='sufficiency';
  result.classList.toggle('detailOnlyHost',detailOnlyHost);
  result.classList.toggle('detailMode',attention);
  a.classList.toggle('hidden',!attention);
  b.classList.toggle('hidden',!sufficiency);
  document.body.classList.toggle('suffSheetOpen',sufficiency);
  if(attention)scrollTo(0,0);
}
function openDetailRoute(kind){
  const url=new URL(location.href);
  url.searchParams.set('detail',kind);
  history.pushState({priolensDetail:kind},'',url);
  applyDetailRoute();
}
function closeDetailRoute(){
  const url=new URL(location.href);
  url.searchParams.delete('detail');
  history.replaceState({priolensDetail:null},'',url);
  applyDetailRoute();
  if(typeof detailCloseCallback==='function'){
    const cb=detailCloseCallback;
    detailCloseCallback=null;
    detailOnlyHost=false;
    q('result').classList.remove('detailOnlyHost','detailMode');
    cb();
  }
}
export function openResultDetailV04(kind){
  if(kind!=='attention'&&kind!=='sufficiency')throw new Error('Unknown result detail kind: '+kind);
  openDetailRoute(kind);
}
function imagesHtml(paths,klass='worldDetailImages'){
  if(!paths.length)return '';
  return '<div class="'+klass+'">'+paths.map(src=>'<img src="'+escapeHtml(src)+'" alt="">').join('')+'</div>';
}

export function renderResultWorldV04({state,lang='lt',familyLabels,itemLabels,reasonOptions=[],onSelfExplanation,detailOnly=false,onDetailClose=null}){
  detailOnlyHost=Boolean(detailOnly);
  detailCloseCallback=typeof onDetailClose==='function'?onDetailClose:null;
  q('result').classList.toggle('detailOnlyHost',detailOnlyHost);
  const C=COPY[lang]||COPY.lt;
  const model=buildResultWorldModel(state);

  document.querySelector('#result h1').textContent=C.title;
  q('resultLead').textContent=C.lead;

  const focusLabel=model.attention.hasFocus?(familyLabels[model.attention.familyId]||model.attention.familyId):C.noAFocus;
  const routeLabels=model.sufficiency.itemIds.map(id=>capFirst(itemLabels[id]||id));
  q('attentionBack').textContent=C.backToResult;
  q('suffDetailClose').textContent=C.close;
  q('attentionBack').onclick=closeDetailRoute;
  q('suffDetailClose').onclick=closeDetailRoute;
  q('suffDetail').onclick=e=>{if(e.target===q('suffDetail'))closeDetailRoute()};
  window.onpopstate=()=>{
    applyDetailRoute();
    if(detailOnlyHost&&!detailRoute()&&typeof detailCloseCallback==='function'){
      const cb=detailCloseCallback;
      detailCloseCallback=null;
      detailOnlyHost=false;
      q('result').classList.remove('detailOnlyHost','detailMode');
      cb();
    }
  };
  window.onkeydown=e=>{if(e.key==='Escape'&&detailRoute()==='sufficiency')closeDetailRoute()};

  q('attentionDetailTitle').textContent=C.aDetail;
  const rep=q('repeatRows');rep.innerHTML='';
  if(model.attention.hasFocus){
    const aBox=document.createElement('div');aBox.className='worldDetailBlock';
    aBox.innerHTML='<div class="worldDetailName">'+escapeHtml(focusLabel)+'</div><div class="worldDetailText">'+escapeHtml(attentionExplanation(model.attention,C))+'</div>';
    rep.appendChild(aBox);
    q('attentionNote').textContent=lang==='en'?'The count describes how often this direction repeated in the first choice, not need strength.':'Skaičius aprašo, kiek kartų ši kryptis pasikartojo pirmajame pasirinkime, ne poreikio stiprumą.';
  }else{
    const aBox=document.createElement('div');aBox.className='worldDetailBlock';
    aBox.innerHTML='<div class="worldDetailName">'+escapeHtml(C.noAFocus)+'</div><div class="worldDetailText">'+escapeHtml(attentionExplanation(model.attention,C))+' '+escapeHtml(C.aNoClearRepeats)+'</div>';
    rep.appendChild(aBox);
    const repeats=mostRepeatRows(state);
    if(repeats.length){
      const h=document.createElement('h4');h.className='repeatSubheading';h.textContent=C.aRepeatedTitle;rep.appendChild(h);
      for(const row of repeats){
        const d=document.createElement('div');d.className='worldDetailBlock repeatedMostDetail '+(row.count===3?'repeat3':'repeat2');
        d.innerHTML=imagesHtml(row.paths)+'<div class="worldDetailName">'+escapeHtml(familyLabels[row.familyId]||row.familyId)+' · '+row.count+'/3</div><div class="worldDetailText">'+escapeHtml(lang==='en'?'This direction repeated in your first choices. No single direction was promoted above the others after clarification.':'Ši kryptis kartojosi tavo pirmuose pasirinkimuose. Po papildomo palyginimo nė viena kryptis nebuvo iškelta aukščiau už kitas.')+'</div>';
        rep.appendChild(d);
      }
    }
    q('attentionNote').textContent='';
  }
  q('attentionNote').classList.toggle('hidden',!q('attentionNote').textContent);

  q('leastLabel').textContent='';q('leastLabel').classList.add('hidden');
  q('leastHeading').textContent=C.leastTitle;
  q('leastNote').textContent=C.leastNote;
  const lm=q('leastRows');lm.innerHTML='';
  const least=leastRows(state);
  if(!least.length){
    lm.innerHTML='<div class="worldDetailBlock"><div class="worldDetailText">'+escapeHtml(C.leastNone)+'</div></div>';
  }else{
    for(const row of least){
      const d=document.createElement('div');d.className='worldDetailBlock';
      d.innerHTML=imagesHtml(row.paths)+'<div class="worldDetailName">'+escapeHtml(familyLabels[row.familyId]||row.familyId)+'</div><div class="worldDetailText">'+escapeHtml(lang==='en'?'This direction stayed in the background all 3 times.':'Ši kryptis visus 3 kartus liko antrame plane.')+'</div>';
      lm.appendChild(d);
    }
  }

  q('compareLabel').textContent=C.reflectionTitle;
  q('compareHeading').textContent=C.reflectionQ;
  const cr=q('compareRows');cr.innerHTML='';
  q('compareLabel').classList.toggle('hidden',!model.attention.hasFocus);
  q('compareHeading').classList.toggle('hidden',!model.attention.hasFocus);
  if(model.attention.hasFocus){
    const reflection=document.createElement('div');reflection.className='reflectionHero compactReflection';
    reflection.innerHTML=imagesHtml(chosenPaths(state,model.attention.familyId),'reflectionImages')+
      '<div class="reasonOptions">'+reasonOptions.map(([code,label])=>'<button type="button" class="reasonOption" data-reason="'+escapeHtml(code)+'">'+escapeHtml(label)+'</button>').join('')+'</div>'+
      '<div class="reasonFeedback hidden">'+escapeHtml(C.reflectionNote)+'</div><div class="reasonSave hidden"></div>';
    cr.appendChild(reflection);
    const options=reflection.querySelector('.reasonOptions'),feedback=reflection.querySelector('.reasonFeedback'),save=reflection.querySelector('.reasonSave');
    const showSelected=code=>{
      const hit=reasonOptions.find(([x])=>x===code);
      if(!hit)return;
      options.innerHTML='<div class="reflectionAnswer"><div class="reflectionAnswerLabel">'+escapeHtml(C.answerLabel)+'</div><div class="reflectionAnswerValue">'+escapeHtml(hit[1])+'</div></div>';
      feedback.textContent=C.reflectionNote;feedback.classList.remove('hidden');
      save.classList.add('hidden');
    };
    const existing=state.selfExplanation?.familyId===model.attention.familyId&&state.selfExplanation?.scenario==='ATTENTION_DETAIL_V04'
      ?state.selfExplanation.reasonCode:null;
    if(existing){
      showSelected(existing);
    }else{
      reflection.querySelectorAll('.reasonOption').forEach(btn=>btn.onclick=async()=>{
        const code=btn.dataset.reason;
        reflection.querySelectorAll('.reasonOption').forEach(x=>{x.disabled=true;x.classList.toggle('on',x===btn)});
        if(typeof onSelfExplanation==='function'){
          await onSelfExplanation({familyId:model.attention.familyId,reasonCode:code,statusEl:save});
        }
        showSelected(code);
      });
    }
  }
  q('attentionResearch').innerHTML=researchHtml(lang,'attention');

  q('suffDetailTitle').textContent=C.bDetail;
  const sr=q('suffRows');sr.innerHTML='';
  const bBox=document.createElement('div');bBox.className='worldDetailBlock';
  if(routeLabels.length){
    if(routeLabels.length===1){
      const id=model.sufficiency.itemIds[0];
      bBox.innerHTML='<div class="worldDetailName">'+escapeHtml(routeLabels[0])+'</div>'+
        '<div class="worldDetailText">'+escapeHtml((ITEM_DETAIL[lang]||ITEM_DETAIL.lt)[id]||'')+'</div>'+
        '<div class="worldDetailText detailWhy"><strong>'+escapeHtml(C.why)+'</strong><br>'+escapeHtml(routeExplanation(model.sufficiency,C))+'</div>';
    }else{
      bBox.innerHTML='<div class="worldDetailName">'+escapeHtml(C.multiRoute)+'</div>'+
        model.sufficiency.itemIds.map((id,i)=>'<div class="worldDetailText"><strong>'+escapeHtml(routeLabels[i])+'</strong><br>'+escapeHtml((ITEM_DETAIL[lang]||ITEM_DETAIL.lt)[id]||'')+'</div>').join('')+
        '<div class="worldDetailText detailWhy"><strong>'+escapeHtml(C.whyMany)+'</strong><br>'+escapeHtml(routeExplanation(model.sufficiency,C))+'</div>';
    }
  }else{
    bBox.innerHTML='<div class="worldDetailName">'+escapeHtml(C.noRoute)+'</div><div class="worldDetailText">'+escapeHtml(routeExplanation(model.sufficiency,C))+'</div>';
  }
  sr.appendChild(bBox);
  q('suffResultNote').textContent=routeLabels.length===1?C.suffMethodSingle:C.suffMethodMany;
  q('suffResultNote').classList.remove('hidden');
  q('suffResearch').innerHTML=researchHtml(lang,'sufficiency');

  applyDetailRoute();
  return model;
}
