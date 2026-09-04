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
  const originX=Math.max(18,width*0.25),originY=height+3;
  targets.forEach((target,index)=>{
    const r=target.getBoundingClientRect();
    const x=r.left-stageRect.left+r.width/2;
    const y=r.top-stageRect.top+r.height/2;
    const spread=(index-(targets.length-1)/2)*15;
    const c1x=originX+width*0.09+spread;
    const c1y=height*0.82;
    const c2x=x-width*0.08+spread*0.3;
    const c2y=y+Math.max(24,(originY-y)*0.24);
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
    coast:'M30 88 C21 78 24 66 36 61 L49 58 L45 48 C51 38 63 35 74 39 L82 28 C92 22 105 24 114 31 L126 21 C140 20 153 27 158 39 L173 34 C187 36 197 45 198 57 L215 58 C225 63 230 72 226 82 L239 92 C241 101 235 109 225 112 L229 126 C224 136 214 141 202 138 L192 151 C181 156 168 151 163 141 L148 149 C137 149 127 143 124 133 L110 143 C99 143 89 136 88 125 L71 130 C60 127 54 118 57 108 L42 108 C32 104 27 97 30 88 Z',
    detail:'M48 67 C62 59 77 59 91 64 M173 52 C184 55 194 61 202 69 M67 116 C82 120 96 118 106 112',
    mountain:'M121 87 L135 68 L145 80 L156 60 L169 88',
    river:'M89 53 C94 67 91 78 99 90 C104 99 101 111 108 121',
    lake:'M79 110 C87 103 98 103 104 109 C101 117 90 121 81 117 C77 115 76 112 79 110 Z',
    grove:'M55 96 C60 89 67 88 71 93 C76 87 83 88 86 94 C81 99 65 101 55 96 Z M183 96 C188 90 194 89 198 94 C202 90 207 91 209 96 C202 101 190 101 183 96 Z',
    islets:'M18 80 C13 75 15 68 21 66 C27 67 30 73 27 79 C25 83 21 84 18 80 Z M233 133 C229 128 231 122 237 121 C243 123 245 128 242 133 C239 136 235 136 233 133 Z'
  },
  {
    coast:'M29 79 C24 68 31 58 43 55 L55 57 L58 44 C66 35 78 33 88 38 L98 28 C109 24 122 29 128 38 L143 31 C156 31 167 39 169 50 L185 47 C197 51 204 60 202 72 L219 77 C226 85 226 95 219 102 L228 115 C225 126 216 132 204 130 L194 142 C183 147 171 143 166 134 L151 143 C140 143 130 137 127 127 L112 138 C101 138 91 132 89 121 L72 126 C61 123 55 114 58 104 L42 104 C32 100 27 90 29 79 Z',
    detail:'M49 65 C63 59 76 59 87 63 M153 48 C166 51 176 57 184 65 M79 115 C91 119 103 118 114 112',
    mountain:'M112 91 L125 73 L135 83 L146 66 L160 92',
    river:'M103 49 C99 64 106 74 102 87 C98 99 105 110 111 121',
    lake:'M73 104 C81 98 91 99 96 105 C93 112 83 115 76 112 C72 110 71 107 73 104 Z',
    grove:'M53 88 C58 82 64 81 68 86 C73 80 80 82 82 88 C76 93 61 94 53 88 Z M170 88 C175 82 181 82 184 87 C189 82 195 83 197 89 C190 94 178 94 170 88 Z',
    islets:'M17 112 C13 107 15 101 21 100 C27 102 29 107 26 112 C23 115 19 115 17 112 Z M217 49 C213 44 215 38 221 37 C227 39 229 44 226 49 C223 52 219 52 217 49 Z'
  },
  {
    coast:'M31 91 C23 82 26 70 37 65 L51 62 L48 52 C54 42 67 39 78 44 L87 32 C98 27 111 29 119 38 L133 27 C147 28 158 35 161 47 L177 42 C190 45 199 54 198 66 L216 69 C225 75 229 85 224 94 L237 105 C237 115 230 122 220 124 L223 138 C216 148 204 151 194 146 L183 157 C172 160 161 154 157 145 L142 152 C130 151 122 144 120 134 L106 143 C95 142 87 135 86 124 L68 129 C57 125 51 116 55 106 L41 106 C31 102 27 96 31 91 Z',
    detail:'M50 70 C64 63 78 63 91 68 M172 57 C183 59 193 65 200 72 M72 118 C84 122 98 121 109 115',
    mountain:'M116 93 L129 75 L139 85 L150 67 L164 94',
    river:'M96 55 C103 68 99 79 106 90 C113 101 110 113 118 123',
    lake:'M80 107 C88 100 98 102 103 108 C100 115 90 118 82 115 C78 113 77 110 80 107 Z',
    grove:'M49 94 C54 88 61 87 65 92 C70 86 77 88 79 94 C73 99 58 100 49 94 Z M177 94 C182 88 189 87 193 92 C198 87 204 89 206 95 C199 100 186 100 177 94 Z',
    islets:'M18 66 C14 61 16 55 22 54 C28 56 30 61 27 66 C24 69 20 69 18 66 Z M226 122 C222 117 224 111 230 110 C236 112 238 117 235 122 C232 125 228 125 226 122 Z'
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
