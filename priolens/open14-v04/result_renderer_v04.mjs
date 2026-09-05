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
    bHard:'Kelios sritys turėjo tą patį žemiausią įvertinimą, bet papildomame klausime vienos krypties neišskyrei. Todėl maršrutas nebrėžiamas.',
    bNoLow:'Pagal tavo atsakymus aiški mažesnio pakankamumo kryptis neišsiskyrė. Žemėlapis jos neforsuoja.',
    bNoNumeric:'Pakankamai aiškių skaitinių atsakymų maršrutui nėra.',
    routePrefix:'Maršrutas',backToResult:'← Grįžti į rezultatą',close:'Uždaryti',why:'Kaip ši pakankamumo sritis buvo išskirta?',whyMany:'Kaip šios pakankamumo sritys buvo išskirtos?',suffMethodSingle:'Tai rodo, kuri sritis šiuose atsakymuose išsiskyrė kaip mažiausiai pakankama, o ne tai, kiek ji tau svarbi.',suffMethodMany:'Tai rodo santykinį šių sričių pakankamumą dabartiniuose atsakymuose, o ne jų svarbumą.',answerLabel:'Tavo atsakymas',
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
    bHard:'Several areas had the same lowest rating, but in the additional question you did not single out one. No route is drawn.',
    bNoLow:'Your answers did not produce a clear lower-sufficiency direction. The map does not force one.',
    bNoNumeric:'There were not enough clear numeric answers to draw a route.',
    routePrefix:'Route',backToResult:'← Back to result',close:'Close',why:'How was this sufficiency area singled out?',whyMany:'How were these sufficiency areas singled out?',suffMethodSingle:'This shows which area stood out as least sufficient in these answers, not how important it is to you.',suffMethodMany:'This shows the relative sufficiency of these areas in your current answers, not their importance.',answerLabel:'Your answer',
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
  const originX=Math.max(14,width*0.22),originY=height+4;
  targets.forEach((target,index)=>{
    const r=target.getBoundingClientRect();
    const x=r.left-stageRect.left+r.width/2;
    const y=r.top-stageRect.top+r.height/2;
    const spread=(index-(targets.length-1)/2)*14;
    const c1x=originX+width*0.03+spread;
    const c1y=height*0.82;
    const c2x=x-width*0.10+spread*0.25;
    const c2y=y+Math.max(24,(originY-y)*0.23);
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
    coast:'M42 92 C30 81 30 66 42 58 C52 51 66 51 72 41 C79 29 91 24 103 29 C113 20 127 17 139 24 C148 14 164 13 175 22 C187 16 202 20 208 32 C222 30 237 37 241 50 C256 50 269 59 270 72 C284 77 292 91 286 104 C298 116 295 132 283 141 C286 156 277 170 263 174 C259 188 246 197 232 194 C225 208 210 214 198 207 C188 219 171 220 160 211 C149 219 133 216 126 204 C113 210 97 205 92 193 C78 196 65 187 63 174 C49 171 39 160 42 146 C29 139 25 124 34 113 C28 104 31 97 42 92 Z',
    detail:'M60 63 C75 53 92 52 106 57 M210 59 C224 63 237 72 246 83 M67 163 C87 170 105 167 119 158',
    mountain:'M138 101 C146 90 154 83 162 91 C169 79 179 77 185 88 C193 82 203 87 211 102',
    mountain2:'M143 112 C153 101 161 94 169 101 C177 92 185 92 193 101',
    river:'M116 58 C122 76 116 91 122 106 C129 123 120 142 128 160 C133 171 131 182 126 194',
    lake:'M84 149 C94 140 108 140 117 147 C122 153 119 161 109 166 C96 170 84 165 80 159 C78 155 80 152 84 149 Z',
    grove:'M73 126 C78 119 85 117 90 121 C95 115 103 116 107 123 C112 121 118 125 118 131 C106 136 86 137 73 126 Z M213 128 C219 120 227 119 232 125 C238 120 246 122 249 129 C252 135 244 139 236 139 C226 139 218 136 213 128 Z',
    islets:'M25 99 C20 93 21 85 27 80 C34 76 41 79 43 86 C44 93 39 100 32 102 C29 103 27 102 25 99 Z M287 173 C282 166 284 158 291 154 C298 152 304 156 305 163 C306 170 301 176 294 178 C291 179 289 177 287 173 Z',
    contour:'M34 82 C50 65 68 56 86 51 M231 47 C251 55 266 69 274 86 M48 183 C68 194 91 199 114 198 M205 203 C227 201 247 192 263 178'
  },
  {
    coast:'M40 86 C31 76 32 63 43 56 C52 49 63 49 70 39 C78 28 90 25 102 31 C113 22 127 19 138 27 C149 17 164 17 175 25 C188 18 202 22 210 34 C224 32 238 39 243 52 C257 53 268 61 270 74 C283 80 290 92 285 105 C296 116 293 131 281 139 C285 153 276 167 262 171 C257 184 244 193 230 190 C223 203 209 210 197 204 C186 215 171 216 160 207 C149 216 133 213 126 201 C113 207 98 202 92 190 C78 193 65 185 63 171 C49 168 39 158 42 144 C29 137 25 122 34 111 C27 102 29 94 40 86 Z',
    detail:'M59 59 C75 50 91 50 106 56 M211 57 C226 61 239 70 247 82 M66 160 C87 166 105 164 119 156',
    mountain:'M136 100 C145 89 153 82 161 90 C169 78 179 76 186 87 C194 81 204 86 211 101',
    mountain2:'M143 111 C152 101 160 94 168 101 C176 92 185 92 193 100',
    river:'M117 56 C123 74 117 89 123 104 C130 121 121 140 129 158 C134 169 132 180 127 191',
    lake:'M84 146 C94 138 108 138 117 145 C123 151 119 159 109 164 C96 168 84 163 80 157 C78 153 80 149 84 146 Z',
    grove:'M72 123 C78 116 85 115 90 119 C95 113 103 114 107 121 C112 119 118 123 118 129 C106 134 86 134 72 123 Z M212 125 C219 118 227 117 232 123 C238 118 246 120 249 127 C252 133 244 137 236 137 C226 137 218 133 212 125 Z',
    islets:'M23 106 C18 100 19 92 25 87 C32 83 39 86 41 93 C42 100 37 107 30 109 C27 110 25 109 23 106 Z M288 158 C283 151 285 143 292 139 C299 137 305 141 306 148 C307 155 302 161 295 163 C292 164 290 162 288 158 Z',
    contour:'M33 78 C50 62 67 53 85 48 M232 45 C252 54 267 68 275 84 M47 180 C69 191 91 196 114 195 M204 200 C226 198 247 189 263 175'
  },
  {
    coast:'M43 90 C33 80 33 67 44 59 C53 52 65 52 72 42 C80 30 92 26 104 32 C115 23 129 20 140 28 C151 18 166 18 177 27 C190 20 204 24 212 36 C226 34 240 41 245 54 C259 55 270 63 272 76 C285 82 292 95 287 108 C298 120 295 135 283 143 C287 158 278 172 264 176 C259 190 246 199 232 196 C225 210 211 216 199 210 C188 221 173 222 162 213 C151 221 135 218 128 206 C115 212 99 207 94 195 C80 198 67 189 65 176 C51 173 41 162 44 148 C31 141 27 126 36 115 C29 106 31 98 43 90 Z',
    detail:'M61 62 C76 53 93 52 108 58 M214 60 C229 64 242 73 250 85 M69 165 C89 171 107 168 121 159',
    mountain:'M140 103 C149 92 157 85 165 93 C173 81 183 79 190 90 C198 84 208 89 215 104',
    mountain2:'M147 114 C156 104 164 97 172 104 C180 95 189 95 197 103',
    river:'M119 60 C125 78 119 93 125 108 C132 125 123 144 131 162 C136 173 134 184 129 195',
    lake:'M86 151 C96 142 110 142 119 149 C125 155 121 163 111 168 C98 172 86 167 82 161 C80 157 82 154 86 151 Z',
    grove:'M75 128 C80 121 87 119 92 123 C97 117 105 118 109 125 C114 123 120 127 120 133 C108 138 88 139 75 128 Z M215 130 C221 122 229 121 234 127 C240 122 248 124 251 131 C254 137 246 141 238 141 C228 141 220 138 215 130 Z',
    islets:'M27 92 C22 86 23 78 29 73 C36 69 43 72 45 79 C46 86 41 93 34 95 C31 96 29 95 27 92 Z M290 181 C285 174 287 166 294 162 C301 160 307 164 308 171 C309 178 304 184 297 186 C294 187 292 185 290 181 Z',
    contour:'M36 84 C52 67 70 58 88 53 M235 50 C255 58 270 72 278 89 M50 187 C71 198 94 203 117 202 M208 207 C230 205 251 196 267 182'
  }
];
function landShapeHtml(index){
  const shape=LAND_SHAPES[index%LAND_SHAPES.length];
  return '<svg class="landShape" viewBox="0 0 330 230" preserveAspectRatio="xMidYMid meet" aria-hidden="true">'+
    '<defs><linearGradient id="landFillGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f2f0e3"/><stop offset="58%" stop-color="#ece9d8"/><stop offset="100%" stop-color="#e7e4d2"/></linearGradient></defs>'+
    '<path class="landShoreHaloOuter" d="'+shape.coast+'"></path>'+
    '<path class="landShoreHaloInner" d="'+shape.coast+'"></path>'+
    '<path class="landFill" d="'+shape.coast+'"></path>'+
    '<path class="landIslet" d="'+shape.islets+'"></path>'+
    '<path class="landCoastDetail" d="'+shape.detail+'"></path>'+
    '<path class="landTerrainSoft" d="'+shape.contour+'"></path>'+
    '<path class="landTerrain" d="'+shape.mountain+'"></path>'+
    '<path class="landTerrainSoft" d="'+shape.mountain2+'"></path>'+
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
  const aButton=q('shipDetailsButton'),bButton=q('mapDetailsButton');
  const attention=kind==='attention',sufficiency=kind==='sufficiency';
  result.classList.toggle('detailOnlyHost',detailOnlyHost);
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
    aBox.innerHTML='<div class="worldDetailName">'+escapeHtml(shipLabel)+'</div><div class="worldDetailText">'+escapeHtml(attentionExplanation(model.attention,C))+'</div>';
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
