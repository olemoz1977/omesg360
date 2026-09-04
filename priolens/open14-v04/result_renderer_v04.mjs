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
  const originX=Math.max(16,width*0.18),originY=height+4;
  targets.forEach((target,index)=>{
    const r=target.getBoundingClientRect();
    const x=r.left-stageRect.left+r.width/2;
    const y=r.top-stageRect.top+r.height/2;
    const spread=(index-(targets.length-1)/2)*18;
    const c1x=originX+width*0.08+spread;
    const c1y=height*0.78;
    const c2x=x-width*0.12+spread*0.35;
    const c2y=y+Math.max(28,(originY-y)*0.28);
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
    coast:'M27 85 C18 69 30 50 52 46 C55 29 77 20 94 27 C108 12 137 17 148 31 C165 22 189 25 198 42 C219 40 235 55 230 74 C244 87 233 105 213 108 C204 127 180 134 160 126 C144 140 116 137 104 124 C84 137 60 127 57 111 C37 111 23 100 27 85 Z',
    detail:'M52 54 C68 47 83 49 96 56 M155 42 C169 45 183 52 193 62 M79 111 C92 117 105 116 116 111',
    mountain:'M61 102 L78 79 L88 92 L98 72 L113 101 M161 109 L178 86 L187 98 L198 80 L211 109',
    river:'M116 39 C120 56 114 68 122 81 C128 92 124 104 132 117',
    lake:'M94 104 C103 97 116 98 121 105 C118 113 105 117 96 113 C91 110 91 106 94 104 Z',
    grove:'M48 90 C53 83 59 81 64 85 C69 78 77 78 80 84 C84 83 89 87 88 92 C79 96 57 97 48 90 Z M176 58 C181 51 188 50 192 55 C197 49 204 51 206 57 C212 56 216 61 214 66 C203 69 185 68 176 58 Z',
    islets:'M16 101 C11 94 14 86 22 84 C29 86 31 94 27 100 C23 104 19 104 16 101 Z M226 112 C221 105 224 98 231 97 C238 99 240 106 236 112 C233 116 229 116 226 112 Z'
  },
  {
    coast:'M25 70 C29 50 49 41 67 42 C78 23 104 21 119 34 C136 23 159 28 168 44 C188 41 208 54 210 71 C227 80 224 98 210 107 C206 124 184 132 166 126 C151 140 126 138 111 126 C92 139 68 132 61 118 C42 120 26 108 29 92 C18 86 16 77 25 70 Z',
    detail:'M51 60 C68 55 82 57 94 64 M142 46 C157 50 170 56 180 67 M88 119 C103 124 117 123 129 117',
    mountain:'M54 101 L69 82 L79 93 L91 73 L106 101 M148 105 L161 89 L171 97 L181 82 L196 106',
    river:'M112 44 C109 58 117 69 113 82 C109 94 116 105 123 117',
    lake:'M77 101 C84 95 96 96 101 102 C98 110 86 113 79 110 C75 108 75 104 77 101 Z',
    grove:'M45 82 C49 76 55 74 59 78 C65 71 72 73 75 79 C80 79 84 83 83 88 C73 91 54 91 45 82 Z M163 64 C168 57 175 57 179 61 C184 55 191 57 193 63 C198 63 202 67 201 72 C191 75 171 74 163 64 Z',
    islets:'M20 112 C15 106 18 100 24 99 C30 101 32 107 29 112 C26 115 22 115 20 112 Z M215 51 C211 45 214 39 220 38 C226 40 228 46 225 51 C222 54 218 54 215 51 Z'
  },
  {
    coast:'M22 88 C17 69 32 54 51 50 C57 31 81 24 98 34 C113 20 139 23 151 38 C171 31 192 41 196 58 C214 65 214 83 201 94 C204 113 185 127 166 124 C151 139 126 138 111 126 C91 138 68 128 63 114 C44 115 27 105 22 88 Z',
    detail:'M47 63 C62 57 77 58 89 64 M136 43 C150 46 163 52 173 61 M91 118 C106 123 119 122 130 117',
    mountain:'M49 105 L63 87 L73 96 L84 78 L99 105 M145 109 L158 91 L168 100 L179 84 L194 109',
    river:'M101 43 C110 56 105 69 113 80 C121 91 118 105 128 118',
    lake:'M83 102 C91 95 103 97 108 103 C105 111 94 114 85 111 C81 109 80 105 83 102 Z',
    grove:'M39 88 C44 82 50 80 54 84 C59 77 66 78 69 84 C74 83 79 87 78 92 C68 95 49 96 39 88 Z M160 60 C165 53 172 53 176 58 C181 52 188 54 190 60 C195 60 199 64 198 69 C188 72 169 71 160 60 Z',
    islets:'M15 70 C10 64 13 58 19 57 C25 59 27 65 24 70 C21 73 17 73 15 70 Z M206 112 C201 106 204 100 210 99 C216 101 218 107 215 112 C212 115 208 115 206 112 Z'
  }
];
function landShapeHtml(index){
  const shape=LAND_SHAPES[index%LAND_SHAPES.length];
  return '<svg class="landShape" viewBox="0 0 250 150" preserveAspectRatio="none" aria-hidden="true">'+
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
