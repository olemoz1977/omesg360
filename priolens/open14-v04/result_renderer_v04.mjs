import { buildResultWorldModel } from './result_world_v04.mjs?v=scene4';

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
    aPlus3:'Šią kryptį pasirinkai 3 iš 3 kartų. Kadangi tokių krypčių buvo kelios, papildomame palyginime išskyrei būtent šią.',
    aPlus2:'Ši kryptis kartojosi 2 iš 3 pasirodymų. Tarp kitų taip pat pasikartojusių krypčių papildomame palyginime išskyrei būtent šią.',
    aNoClear:'Papildomame palyginime vienos krypties neišskyrei.',
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
    bHard:'Kelios sritys turėjo tą patį žemiausią įvertinimą, bet papildomame klausime vienos krypties neišskyrei. Todėl maršrutas nebrėžiamas.',
    bNoLow:'Pagal tavo atsakymus aiški mažesnio pakankamumo kryptis neišsiskyrė. Žemėlapis jos neforsuoja.',
    bNoNumeric:'Pakankamai aiškių skaitinių atsakymų maršrutui nėra.',
    routePrefix:'Maršrutas',backToResult:'← Grįžti į rezultatą',close:'Uždaryti',why:'Kaip ši poreikio sritis buvo išskirta?',whyMany:'Kaip šios poreikio sritys buvo išskirtos?',suffMethodSingle:'Tai rodo, kuri poreikio sritis šiuose atsakymuose išsiskyrė kaip mažiausiai pakankama, ne poreikio stiprumą.',suffMethodMany:'Tai rodo santykinį šių poreikio sričių pakankamumą dabartiniuose atsakymuose, ne poreikių stiprumą.',answerLabel:'Tavo atsakymas',
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
    aPlus3:'You chose this direction 3 out of 3 times. Because several directions did so, you singled out this one in an additional comparison.',
    aPlus2:'This direction repeated 2 out of 3 times. Among the other repeated directions, you singled out this one in an additional comparison.',
    aNoClear:'In the additional comparison, you did not single out one direction.',
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
    bHard:'Several areas had the same lowest rating, but in the additional question you did not single out one. No route is drawn.',
    bNoLow:'Your answers did not produce a clear lower-sufficiency direction. The map does not force one.',
    bNoNumeric:'There were not enough clear numeric answers to draw a route.',
    routePrefix:'Route',backToResult:'← Back to result',close:'Close',why:'How was this need area singled out?',whyMany:'How were these need areas singled out?',suffMethodSingle:'This shows which need area stood out as least sufficient in these answers, not the strength of a need.',suffMethodMany:'This shows the relative sufficiency of these need areas in your current answers, not the strength of needs.',answerLabel:'Your answer',
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
const ITEM_DETAIL={
  lt:{
    RESTORATION_ENERGY:'Poilsio ir energijos kasdienybei.',
    MATERIAL_RESOURCES:'Kasdienių resursų tam, ko realiai reikia.',
    SAFETY_STABILITY:'Saugumo ir stabilumo.',
    CLARITY_PREDICTABILITY:'Aiškumo ir nuspėjamumo kasdienybėje.',
    CONNECTION_BELONGING:'Artimo ryšio ir priklausymo.',
    CARE_SUPPORT_PRESENT:'Rūpesčio, paramos ir žmogiško dėmesio.',
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
    CARE_SUPPORT_PRESENT:'Care, support and human attention.',
    AUTONOMY_AGENCY:'Freedom to decide and act for yourself.',
    RECOGNITION_ESTEEM:'A sense that your efforts, opinions or contribution are noticed and valued.',
    LEARNING_GROWTH:'Opportunities to learn, discover and grow.',
    CAPABILITY_MASTERY:'Opportunities to use and develop your abilities.',
    MEANING_PURPOSE:'Meaning in what you do.',
    CONTRIBUTION:'Opportunities to contribute to something important beyond yourself.'
  }
};
let routeResizeStage=null;
let routeResizeBound=false;
function drawNeedsMapRoutes(stage){
  const svg=stage?.querySelector?.('.mapRoutes');
  if(!svg)return;
  while(svg.firstChild)svg.removeChild(svg.firstChild);
  const width=Math.max(1,stage.clientWidth||0),height=Math.max(1,stage.clientHeight||0);
  svg.setAttribute('viewBox','0 0 '+width+' '+height);
  const stageRect=stage.getBoundingClientRect();
  const targets=[...stage.querySelectorAll('.mapPin')];
  if(!targets.length)return;
  const ns='http://www.w3.org/2000/svg';
  const originX=Math.max(18,width*0.31),originY=height+3;
  targets.forEach((target,index)=>{
    const r=target.getBoundingClientRect();
    const x=r.left-stageRect.left+r.width/2;
    const y=r.top-stageRect.top+r.height/2;
    const spread=(index-(targets.length-1)/2)*14;
    const c1x=originX+width*0.05+spread;
    const c1y=height*0.86;
    const c2x=x-width*0.06+spread*0.28;
    const c2y=y+Math.max(20,(originY-y)*0.2);
    const path=document.createElementNS(ns,'path');
    path.setAttribute('class','routePath');
    path.setAttribute('d','M '+originX+' '+originY+' C '+c1x+' '+c1y+' '+c2x+' '+c2y+' '+x+' '+y);
    svg.appendChild(path);
  });
}
function scheduleNeedsMapRoutes(stage){
  routeResizeStage=stage;
  const run=()=>drawNeedsMapRoutes(stage);
  if(typeof requestAnimationFrame==='function')requestAnimationFrame(run);else run();
  if(!routeResizeBound&&typeof window!=='undefined'){
    routeResizeBound=true;
    window.addEventListener('resize',()=>{if(routeResizeStage)scheduleNeedsMapRoutes(routeResizeStage)},{passive:true});
  }
}
const LAND_SHAPES=[
  {
    coast:'M25 91 L36 78 L52 74 L48 61 L61 51 L77 55 L86 39 L101 44 L113 29 L128 36 L141 24 L155 40 L171 35 L181 50 L198 45 L208 61 L226 64 L221 79 L238 90 L228 103 L235 117 L217 123 L220 138 L202 140 L193 151 L177 146 L164 156 L149 145 L136 153 L124 139 L111 146 L101 132 L87 138 L75 126 L58 130 L54 115 L39 112 L43 100 Z',
    detail:'M49 69 Q65 61 83 65 M172 55 Q188 58 202 70 M67 116 Q84 122 103 115',
    mountain:'M119 91 L132 73 L141 83 L151 67 L165 91',
    river:'M92 52 Q98 66 95 78 Q92 92 102 104 Q108 112 108 124',
    lake:'M78 109 Q87 101 99 104 Q107 108 102 116 Q91 121 81 117 Q76 114 78 109 Z',
    grove:'M51 94 Q58 87 65 91 Q72 84 79 91 Q83 95 77 99 Q62 101 51 94 Z M180 96 Q187 88 194 93 Q201 88 207 95 Q209 100 201 103 Q189 103 180 96 Z',
    islets:'M17 78 L23 72 L30 76 L29 83 L22 87 L16 84 Z M231 132 L238 127 L244 131 L243 138 L236 142 L230 138 Z'
  },
  {
    coast:'M28 84 L40 70 L54 68 L52 55 L67 47 L80 51 L91 36 L107 42 L120 28 L135 35 L149 26 L161 42 L177 39 L187 53 L203 50 L211 66 L226 71 L220 86 L234 97 L225 110 L231 123 L214 129 L214 142 L196 143 L186 154 L171 148 L157 156 L143 145 L130 152 L119 138 L106 144 L95 131 L81 136 L69 124 L53 126 L49 112 L37 109 L41 96 Z',
    detail:'M52 64 Q68 58 84 63 M160 51 Q176 54 190 64 M77 114 Q91 120 108 114',
    mountain:'M111 92 L124 75 L134 84 L145 68 L159 93',
    river:'M103 50 Q99 66 104 78 Q110 91 104 103 Q100 113 110 123',
    lake:'M72 104 Q81 97 91 99 Q99 103 96 111 Q86 116 77 113 Q71 111 72 104 Z',
    grove:'M50 86 Q57 80 64 84 Q71 78 78 85 Q80 90 74 93 Q60 94 50 86 Z M169 88 Q176 81 183 86 Q190 80 197 88 Q199 93 193 96 Q179 97 169 88 Z',
    islets:'M18 111 L24 106 L31 109 L30 116 L24 120 L18 117 Z M216 47 L222 42 L229 46 L228 53 L221 57 L215 53 Z'
  },
  {
    coast:'M26 93 L38 80 L53 77 L49 64 L64 54 L79 58 L88 43 L103 47 L116 32 L131 39 L145 27 L159 43 L175 38 L185 54 L202 49 L211 65 L228 68 L223 83 L239 94 L229 107 L236 121 L218 127 L221 141 L203 143 L194 154 L178 149 L165 158 L150 147 L137 154 L125 141 L112 148 L102 134 L88 140 L76 128 L59 132 L55 117 L40 114 L44 102 Z',
    detail:'M50 72 Q66 65 84 69 M173 57 Q187 60 201 71 M70 119 Q86 124 105 117',
    mountain:'M116 94 L129 77 L139 86 L150 70 L164 95',
    river:'M95 55 Q102 68 99 81 Q96 94 105 106 Q111 114 111 126',
    lake:'M80 107 Q89 100 100 102 Q108 107 104 115 Q94 120 84 116 Q78 114 80 107 Z',
    grove:'M50 92 Q57 86 65 90 Q72 84 79 91 Q81 96 75 99 Q61 100 50 92 Z M176 94 Q183 87 190 92 Q197 86 204 94 Q206 99 199 102 Q186 102 176 94 Z',
    islets:'M17 64 L23 59 L30 62 L29 69 L23 73 L17 70 Z M224 121 L231 116 L238 120 L237 127 L230 131 L224 127 Z'
  }
];
function landShapeHtml(index){
  const shape=LAND_SHAPES[index%LAND_SHAPES.length];
  return '<svg class="landShape" viewBox="0 0 250 150" preserveAspectRatio="xMidYMid meet" aria-hidden="true">'+
    '<path class="landShoreHaloOuter" d="'+shape.coast+'"></path>'+
    '<path class="landShoreHaloInner" d="'+shape.coast+'"></path>'+
    '<path class="landFill" d="'+shape.coast+'"></path>'+
    '<path class="landIslet" d="'+shape.islets+'"></path>'+
    '<path class="landCoastDetail" d="'+shape.detail+'"></path>'+
    '<path class="landTerrain" d="'+shape.mountain+'"></path>'+
    '<path class="landTerrain" d="'+shape.river+'"></path>'+
    '<path class="landWater" d="'+shape.lake+'"></path>'+
    '<path class="landTerrainFill" d="'+shape.grove+'"></path>'+
    '</svg>';
}
function renderNeedsMap(stage,lang,routeIds,itemLabels,emptyText){
  const routeSet=new Set(routeIds);
  const lands=(NEED_MAP[lang]||NEED_MAP.lt)
    .map(land=>({...land,items:land.items.filter(id=>routeSet.has(id))}))
    .filter(land=>land.items.length);
  stage.innerHTML='';
  stage.className='mapStage '+(lands.length===0?'routeLands0':lands.length===1?'routeLands1':lands.length===2?'routeLands2':'routeLandsMany');
  if(!lands.length){
    stage.innerHTML='<span class="mapEmpty">'+escapeHtml(emptyText)+'</span>';
    routeResizeStage=null;
    return;
  }
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('class','mapRoutes');
  svg.setAttribute('aria-hidden','true');
  stage.appendChild(svg);
  lands.forEach((land,index)=>{
    const continent=document.createElement('span');
    continent.className='continent'+(land.items.length>1?' multiTargets':'');
    continent.innerHTML=landShapeHtml(index)+
      '<span class="continentTitle">'+escapeHtml(land.title)+'</span>'+
      land.items.map(id=>'<span class="needNode routeTarget" data-need-id="'+escapeHtml(id)+'"><span class="mapPin" aria-hidden="true"></span><span class="needText">'+escapeHtml(capFirst(itemLabels[id]||id))+'</span></span>').join('');
    stage.appendChild(continent);
  });
  scheduleNeedsMapRoutes(stage);
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
  return Object.entries(counts).filter(([,n])=>n===3).sort((a,b)=>a[0].localeCompare(b[0])).map(([familyId,count])=>({familyId,count,paths:paths[familyId]||[]}));
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
function detailRoute(){
  const x=new URLSearchParams(location.search).get('detail');
  return x==='attention'||x==='sufficiency'?x:null;
}
function applyDetailRoute(){
  const kind=detailRoute();
  const result=q('result');
  const a=q('attentionDetail'),b=q('suffDetail');
  const aButton=q('shipDetailsButton'),bButton=q('mapDetailsButton');
  const attention=kind==='attention',sufficiency=kind==='sufficiency';
  result.classList.toggle('detailMode',attention);
  a.classList.toggle('hidden',!attention);
  b.classList.toggle('hidden',!sufficiency);
  document.body.classList.toggle('suffSheetOpen',sufficiency);
  aButton.setAttribute('aria-expanded',attention?'true':'false');
  bButton.setAttribute('aria-expanded',sufficiency?'true':'false');
  if(attention)scrollTo(0,0);
}
function openDetailRoute(kind){
  const url=new URL(location.href);
  url.searchParams.set('detail',kind);
  history.pushState({priolensDetail:kind},'',url);
  applyDetailRoute();
}
function closeDetailRoute(){
  if(history.state?.priolensDetail){history.back();return}
  const url=new URL(location.href);
  url.searchParams.delete('detail');
  history.replaceState({priolensDetail:null},'',url);
  applyDetailRoute();
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
  q('mapRoute').textContent=routeLabels.length===1?'':(routeLabels.length>1?C.multiRoute:C.noRoute);
  q('mapRoute').classList.toggle('hidden',routeLabels.length===1);
  q('mapTap').textContent=C.mapTap;
  renderNeedsMap(q('needsMapStage'),lang,model.sufficiency.itemIds,itemLabels,C.noRoute);
  q('worldSeparationNote').textContent=C.separate;

  const aDetail=q('attentionDetail'),bDetail=q('suffDetail');
  const shipButton=q('shipDetailsButton'),mapButton=q('mapDetailsButton');
  shipButton.setAttribute('aria-expanded','false');
  shipButton.setAttribute('aria-label',C.aLabel+': '+shipLabel+'. '+C.shipTap);
  shipButton.onclick=()=>openDetailRoute('attention');
  mapButton.setAttribute('aria-expanded','false');
  mapButton.setAttribute('aria-label',C.bLabel+': '+(routeLabels.length?routeLabels.join(', '):C.noRoute)+'. '+C.mapTap);
  mapButton.onclick=()=>openDetailRoute('sufficiency');
  q('attentionBack').textContent=C.backToResult;
  q('suffDetailClose').textContent=C.close;
  q('attentionBack').onclick=closeDetailRoute;
  q('suffDetailClose').onclick=closeDetailRoute;
  q('suffDetail').onclick=e=>{if(e.target===q('suffDetail'))closeDetailRoute()};
  window.onpopstate=applyDetailRoute;
  window.onkeydown=e=>{if(e.key==='Escape'&&detailRoute()==='sufficiency')closeDetailRoute()};

  q('attentionDetailTitle').textContent=C.aDetail;
  const rep=q('repeatRows');rep.innerHTML='';
  const aBox=document.createElement('div');aBox.className='worldDetailBlock';
  aBox.innerHTML='<div class="worldDetailName">'+escapeHtml(shipLabel)+'</div><div class="worldDetailText">'+escapeHtml(attentionExplanation(model.attention,C))+'</div>';
  rep.appendChild(aBox);
  q('attentionNote').textContent=model.attention.hasFocus
    ?(lang==='en'?'The number is shown only here in the detail layer. It describes how often this direction repeated in the first choice, not need strength.':'Skaičius rodomas tik detalėse. Jis aprašo, kiek kartų ši kryptis pasikartojo pirmajame pasirinkime, ne poreikio stiprumą.')
    :'';
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
  }else{
    cr.innerHTML='<div class="worldDetailBlock"><div class="worldDetailText">'+escapeHtml(attentionExplanation(model.attention,C))+'</div></div>';
  }

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

  applyDetailRoute();
  return model;
}
