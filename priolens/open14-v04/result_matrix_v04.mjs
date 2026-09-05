import { buildResultWorldModel } from './result_world_v04.mjs?v=scene4';

export const RESULT_MATRIX_SCHEMA_V04='2rasi.priolens.open14.result-matrix-v0.4';

const B_ITEMS={
  lt:[
    ['MEANING_PURPOSE','Prasmė ir indėlis','Tai, ką šiuo metu darau, man atrodo pakankamai prasminga.'],
    ['CONTRIBUTION','Prasmė ir indėlis','Jaučiu, kad turiu pakankamai galimybių prisidėti prie kažko svarbaus ne tik sau.'],
    ['LEARNING_GROWTH','Augimas ir gebėjimai','Turiu pakankamai galimybių mokytis, atrasti ir augti.'],
    ['CAPABILITY_MASTERY','Augimas ir gebėjimai','Galiu pakankamai naudoti ir tobulinti savo gebėjimus.'],
    ['AUTONOMY_AGENCY','Autonomija ir pripažinimas','Man svarbiose srityse turiu pakankamai laisvės pats spręsti ir veikti.'],
    ['RECOGNITION_ESTEEM','Autonomija ir pripažinimas','Jaučiu, kad mano pastangos, nuomonė ar indėlis yra pakankamai pastebimi ir vertinami.'],
    ['CONNECTION_BELONGING','Ryšys, priklausymas ir parama','Mano gyvenime pakanka artimo ryšio ir jausmo, kad priklausau kitiems.'],
    ['CARE_SUPPORT_PRESENT','Ryšys, priklausymas ir parama','Jaučiu, kad iš kitų sulaukiu pakankamai rūpesčio, paramos ir žmogiško dėmesio.'],
    ['SAFETY_STABILITY','Saugumas ir stabilumas','Šiuo metu jaučiu pakankamai saugumo ir stabilumo.'],
    ['CLARITY_PREDICTABILITY','Saugumas ir stabilumas','Mano kasdienybėje pakanka aiškumo ir nuspėjamumo, kad žinočiau, ko tikėtis.'],
    ['RESTORATION_ENERGY','Poilsis ir resursai','Šiuo metu turiu pakankamai poilsio ir energijos kasdienybei.'],
    ['MATERIAL_RESOURCES','Poilsis ir resursai','Šiuo metu turiu pakankamai kasdienių resursų tam, ko man realiai reikia.']
  ],
  en:[
    ['MEANING_PURPOSE','Meaning and contribution','What I am doing right now feels sufficiently meaningful to me.'],
    ['CONTRIBUTION','Meaning and contribution','I feel I have enough opportunities to contribute to something important beyond myself.'],
    ['LEARNING_GROWTH','Growth and capability','I have enough opportunities to learn, discover and grow.'],
    ['CAPABILITY_MASTERY','Growth and capability','I can sufficiently use and develop my abilities.'],
    ['AUTONOMY_AGENCY','Autonomy and recognition','In areas that matter to me, I have enough freedom to decide and act for myself.'],
    ['RECOGNITION_ESTEEM','Autonomy and recognition','I feel that my effort, opinion or contribution is sufficiently noticed and valued.'],
    ['CONNECTION_BELONGING','Connection, belonging and support','There is enough close connection and a sense of belonging in my life.'],
    ['CARE_SUPPORT_PRESENT','Connection, belonging and support','I feel that I receive enough care, support and human attention from others.'],
    ['SAFETY_STABILITY','Safety and stability','Right now I feel sufficiently safe and stable.'],
    ['CLARITY_PREDICTABILITY','Safety and stability','There is enough clarity and predictability in my everyday life for me to know what to expect.'],
    ['RESTORATION_ENERGY','Rest and resources','Right now I have enough rest and energy for everyday life.'],
    ['MATERIAL_RESOURCES','Rest and resources','Right now I have enough everyday resources for what I realistically need.']
  ]
};
const GROUPS={
  lt:['Prasmė ir indėlis','Augimas ir gebėjimai','Autonomija ir pripažinimas','Ryšys, priklausymas ir parama','Saugumas ir stabilumas','Poilsis ir resursai'],
  en:['Meaning and contribution','Growth and capability','Autonomy and recognition','Connection, belonging and support','Safety and stability','Rest and resources']
};
const A_PLACEMENTS={
  REST:{row:11,col:11,type:'DIRECT'},
  RESOURCE:{row:12,col:12,type:'DIRECT'},
  SAFETY:{row:9,col:9,type:'DIRECT'},
  ORDER:{row:10,col:10,type:'RELATED'},
  CONNECTION:{row:7,col:7,type:'RELATED'},
  BELONGING:{row:7,col:7,type:'DIRECT'},
  CARE:{row:2,col:8,type:'BRIDGE',related:[2,7,8]},
  AUTONOMY:{row:5,col:5,type:'DIRECT'},
  CONTROL:{row:5,col:10,type:'BRIDGE',related:[5,9,10]},
  RECOGNITION:{row:6,col:6,type:'DIRECT'},
  MASTERY:{row:4,col:4,type:'DIRECT'},
  EXPLORATION:{row:3,col:3,type:'RELATED'},
  KNOWLEDGE:{row:3,col:3,type:'DIRECT'},
  OPPORTUNITY:{row:3,col:5,type:'BRIDGE',related:[3,4,5,12]}
};
const NO_DIRECT_B=new Set([1,2,8]);
const COPY={
  lt:{
    eyebrow:'Rezultato apžvalga',
    title:'Du žvilgsniai viename žemėlapyje.',
    lead:'Matrica padeda sugretinti pirmo žvilgsnio kryptį ir tavo dabartinio pakankamumo atsakymus. Ji rodo santykį, ne priežastį ir ne poreikio stiprumą.',
    focus:'Pirmo žvilgsnio kryptis',noFocus:'Viena kryptis aiškiai neišsiskyrė',
    background:'Nuosekliai liko antrame plane',noBackground:'Aiškaus 3 iš 3 pasikartojimo nebuvo',
    suff:'Šiuo metu mažiausiai pakanka',noSuff:'Aiški mažesnio pakankamumo sritis neišsiskyrė',
    matrixTitle:'Santykių matrica',
    matrixHint:'Slink į šoną. Abiejose ašyse matai tuos pačius teiginius, į kuriuos atsakei.',
    continue:'Toliau į rezultatą',pdf:'Išsaugoti PDF',
    bridge:'Jungia kelias sritis',noDirect:'Be tiesioginės vaizdinės krypties',
    focusLegend:'Pirmo žvilgsnio fokusas',
    backgroundLegend:'3 iš 3 liko antrame plane',
    suffLegend:'Mažiausio pakankamumo sritis',
    relationNote:'Ženklų artumas matricoje nėra psichologinio skirtumo matas. Pirmas žvilgsnis ir antras atsakymas lieka dvi atskiros perspektyvos.'
  },
  en:{
    eyebrow:'Result overview',
    title:'Two perspectives on one map.',
    lead:'The matrix helps place your first-glance direction beside your current sufficiency answers. It shows relationships, not causes or need strength.',
    focus:'First-glance direction',noFocus:'No single direction clearly stood out',
    background:'Consistently stayed in the background',noBackground:'No clear 3-out-of-3 repetition',
    suff:'Currently least sufficient',noSuff:'No clear lower-sufficiency area stood out',
    matrixTitle:'Relationship matrix',
    matrixHint:'Scroll sideways. Both axes use the same statements you answered.',
    continue:'Continue to result',pdf:'Save PDF',
    bridge:'Connects several areas',noDirect:'No direct visual counterpart',
    focusLegend:'First-glance focus',
    backgroundLegend:'3 out of 3 stayed in the background',
    suffLegend:'Lowest-sufficiency area',
    relationNote:'Distance between markers is not a measure of psychological difference. First glance and second answer remain separate perspectives.'
  }
};
function esc(x){return String(x??'').replace(/[&<>"']/g,function(ch){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]})}
function itemsFor(lang){return (B_ITEMS[lang]||B_ITEMS.lt).map(function(x){return{id:x[0],group:x[1],statement:x[2]}})}
function least3Families(state){
  const counts={};
  for(const c of state&&state.choices||[]){const f=c.leastChoice&&c.leastChoice.familyId;if(f)counts[f]=(counts[f]||0)+1}
  return Object.entries(counts).filter(function(x){return x[1]===3}).map(function(x){return x[0]}).sort()
}
function itemIndex(items,id){const i=items.findIndex(function(x){return x.id===id});return i<0?null:i+1}
export function buildResultMatrixModelV04(state,lang='lt'){
  const items=itemsFor(lang),world=buildResultWorldModel(state);
  const focusFamilyId=world.attention.hasFocus?world.attention.familyId:null;
  const backgroundFamilyIds=least3Families(state);
  const sufficiencyItemIds=world.sufficiency.itemIds.slice();
  const markers=[];
  if(focusFamilyId&&A_PLACEMENTS[focusFamilyId])markers.push(Object.assign({kind:'FOCUS',familyId:focusFamilyId},A_PLACEMENTS[focusFamilyId]));
  for(const familyId of backgroundFamilyIds)if(A_PLACEMENTS[familyId])markers.push(Object.assign({kind:'BACKGROUND',familyId:familyId},A_PLACEMENTS[familyId]));
  for(const id of sufficiencyItemIds){const n=itemIndex(items,id);if(n)markers.push({kind:'SUFFICIENCY',itemId:id,row:n,col:n,type:'B'})}
  return {schema:RESULT_MATRIX_SCHEMA_V04,items:items,groups:GROUPS[lang]||GROUPS.lt,focusFamilyId:focusFamilyId,backgroundFamilyIds:backgroundFamilyIds,sufficiencyItemIds:sufficiencyItemIds,markers:markers}
}
function summaryValue(kind,model,lang,familyLabels){
  const C=COPY[lang]||COPY.lt;
  if(kind==='FOCUS')return model.focusFamilyId?(familyLabels[model.focusFamilyId]||model.focusFamilyId):C.noFocus;
  if(kind==='BACKGROUND')return model.backgroundFamilyIds.length?model.backgroundFamilyIds.map(function(id){return familyLabels[id]||id}).join(' · '):C.noBackground;
  if(kind==='SUFFICIENCY'){
    if(!model.sufficiencyItemIds.length)return C.noSuff;
    const byId=Object.fromEntries(model.items.map(function(x){return[x.id,x.statement]}));
    return model.sufficiencyItemIds.map(function(id){return byId[id]||id}).join(' · ')
  }
  return ''
}
function chipHtml(familyId,familyLabels){
  const p=A_PLACEMENTS[familyId],label=familyLabels[familyId]||familyId;
  const cls=p.type==='DIRECT'?'matrixFamily direct':p.type==='RELATED'?'matrixFamily related':'matrixFamily bridge';
  return '<span class="'+cls+'" data-family-id="'+esc(familyId)+'">'+esc(label)+'</span>'
}
function markerHtml(marker,familyLabels,model,lang){
  const C=COPY[lang]||COPY.lt;
  if(marker.kind==='FOCUS'){const label=familyLabels[marker.familyId]||marker.familyId;return '<span class="matrixMarker focusMarker" title="'+esc(C.focus+': '+label)+'" aria-label="'+esc(C.focus+': '+label)+'"></span>'}
  if(marker.kind==='BACKGROUND'){const label=familyLabels[marker.familyId]||marker.familyId;return '<span class="matrixMarker backgroundMarker" title="'+esc(C.background+': '+label)+'" aria-label="'+esc(C.background+': '+label)+'"></span>'}
  const item=model.items.find(function(x){return x.id===marker.itemId}),label=item?item.statement:marker.itemId;
  return '<span class="matrixMarker suffMarker" title="'+esc(C.suff+': '+label)+'" aria-label="'+esc(C.suff+': '+label)+'"></span>'
}
function buildMatrixCanvas(model,lang,familyLabels){
  const C=COPY[lang]||COPY.lt,familyByCell=new Map(),markerByCell=new Map();
  for(const familyId of Object.keys(A_PLACEMENTS)){const p=A_PLACEMENTS[familyId],key=p.row+'|'+p.col;if(!familyByCell.has(key))familyByCell.set(key,[]);familyByCell.get(key).push(familyId)}
  for(const marker of model.markers){const key=marker.row+'|'+marker.col;if(!markerByCell.has(key))markerByCell.set(key,[]);markerByCell.get(key).push(marker)}
  let html='<div class="matrixCanvas" role="table" aria-label="'+esc(C.matrixTitle)+'">';
  model.groups.forEach(function(title,g){html+='<div class="matrixGroupHeader" style="grid-column:'+(2+g*2)+' / span 2;grid-row:1">'+esc(title)+'</div>'});
  model.items.forEach(function(item,i){const n=i+1;html+='<div class="matrixTopStatement" style="grid-column:'+(i+2)+';grid-row:2"><b>'+n+'</b><span>'+esc(item.statement)+'</span></div>';html+='<div class="matrixLeftStatement" style="grid-column:1;grid-row:'+(i+3)+'"><b>'+n+'</b><span>'+esc(item.statement)+'</span></div>'});
  for(let r=1;r<=12;r++)for(let col=1;col<=12;col++){
    const key=r+'|'+col,mirror=r>col?' mirrorCell':'',diagonal=r===col?' diagonalCell':'',bridge=(familyByCell.get(key)||[]).some(function(id){return A_PLACEMENTS[id].type==='BRIDGE'})?' bridgeCell':'';
    html+='<div class="matrixDataCell'+mirror+diagonal+bridge+'" style="grid-column:'+(col+1)+';grid-row:'+(r+2)+'">';
    if(r===col&&NO_DIRECT_B.has(r))html+='<span class="matrixNoDirect">'+esc(C.noDirect)+'</span>';
    const families=familyByCell.get(key)||[];if(families.length)html+='<span class="matrixFamilyStack">'+families.map(function(id){return chipHtml(id,familyLabels)}).join('')+'</span>';
    const markers=markerByCell.get(key)||[];if(markers.length)html+='<span class="matrixMarkerStack">'+markers.map(function(m){return markerHtml(m,familyLabels,model,lang)}).join('')+'</span>';
    html+='</div>'
  }
  return html+'</div>'
}
function bridgeNote(model,lang,familyLabels){
  const C=COPY[lang]||COPY.lt,ids=[model.focusFamilyId].concat(model.backgroundFamilyIds).filter(function(id){return A_PLACEMENTS[id]&&A_PLACEMENTS[id].type==='BRIDGE'});
  const seen=Array.from(new Set(ids));if(!seen.length)return '';
  return '<div class="matrixBridgeNote">'+seen.map(function(id){const p=A_PLACEMENTS[id],name=familyLabels[id]||id;return '<div><strong>'+esc(name)+'</strong> · '+esc(C.bridge)+' · '+esc((p.related||[]).join(', '))+'</div>'}).join('')+'</div>'
}
function centerMatrixOnResult(){
  const viewport=document.querySelector('.matrixViewport');
  if(!viewport)return;
  const cells=Array.from(viewport.querySelectorAll('.matrixDataCell')).filter(function(cell){return cell.querySelector('.matrixMarker')});
  if(!cells.length){viewport.scrollLeft=0;return}
  const centers=cells.map(function(cell){return cell.offsetLeft+cell.offsetWidth/2});
  const target=centers.reduce(function(a,b){return a+b},0)/centers.length;
  viewport.scrollLeft=Math.max(0,target-viewport.clientWidth/2);
}
export function renderResultMatrixV04(args){
  const state=args.state,lang=args.lang||'lt',familyLabels=args.familyLabels||{},onContinue=args.onContinue,onPrint=args.onPrint,C=COPY[lang]||COPY.lt,model=buildResultMatrixModelV04(state,lang);
  const q=function(id){const el=document.getElementById(id);if(!el)throw new Error('PrioLens matrix DOM missing #'+id);return el};
  q('matrixEyebrow').textContent=C.eyebrow;q('matrixTitle').textContent=C.title;q('matrixLead').textContent=C.lead;
  q('matrixFocusLabel').textContent=C.focus;q('matrixFocusValue').textContent=summaryValue('FOCUS',model,lang,familyLabels);
  q('matrixBackgroundLabel').textContent=C.background;q('matrixBackgroundValue').textContent=summaryValue('BACKGROUND',model,lang,familyLabels);
  q('matrixSuffLabel').textContent=C.suff;q('matrixSuffValue').textContent=summaryValue('SUFFICIENCY',model,lang,familyLabels);
  q('matrixSectionTitle').textContent=C.matrixTitle;q('matrixHint').textContent=C.matrixHint;
  q('matrixLegendFocus').textContent=C.focusLegend;q('matrixLegendBackground').textContent=C.backgroundLegend;q('matrixLegendSuff').textContent=C.suffLegend;q('matrixRelationNote').textContent=C.relationNote;
  q('matrixCanvasMount').innerHTML=buildMatrixCanvas(model,lang,familyLabels);q('matrixBridgeNote').innerHTML=bridgeNote(model,lang,familyLabels);
  q('matrixContinue').textContent=C.continue;q('matrixPdf').textContent=C.pdf;
  q('matrixContinue').onclick=function(){if(typeof onContinue==='function')onContinue()};
  q('matrixPdf').onclick=function(){if(typeof onPrint==='function')onPrint()};
  if(typeof requestAnimationFrame==='function')requestAnimationFrame(centerMatrixOnResult);else centerMatrixOnResult();
  return model
}
export function printResultReportV04(){
  document.body.classList.add('priolensPrintMatrix');
  const cleanup=function(){document.body.classList.remove('priolensPrintMatrix')},prev=window.onafterprint;
  window.onafterprint=function(){cleanup();window.onafterprint=prev||null;if(typeof prev==='function')prev()};
  setTimeout(function(){try{window.print()}catch(err){cleanup();throw err}},40)
}

export const RESULT_MATRIX_HTML=[
'  <section id="matrixResult" class="screen matrixResult">',
'    <p id="matrixEyebrow" class="matrixEyebrow"></p>',
'    <h1 id="matrixTitle"></h1>',
'    <p id="matrixLead" class="matrixLead"></p>',
'    <div class="matrixSummary">',
'      <div class="matrixSummaryCard"><span class="matrixSummarySymbol focusMarker" aria-hidden="true"></span><div><div id="matrixFocusLabel" class="matrixSummaryLabel"></div><div id="matrixFocusValue" class="matrixSummaryValue"></div></div></div>',
'      <div class="matrixSummaryCard"><span class="matrixSummarySymbol backgroundMarker" aria-hidden="true"></span><div><div id="matrixBackgroundLabel" class="matrixSummaryLabel"></div><div id="matrixBackgroundValue" class="matrixSummaryValue"></div></div></div>',
'      <div class="matrixSummaryCard"><span class="matrixSummarySymbol suffMarker" aria-hidden="true"></span><div><div id="matrixSuffLabel" class="matrixSummaryLabel"></div><div id="matrixSuffValue" class="matrixSummaryValue"></div></div></div>',
'    </div>',
'    <div class="matrixHeadRow"><h2 id="matrixSectionTitle"></h2><p id="matrixHint"></p></div>',
'    <div class="matrixViewport" tabindex="0" aria-label="PrioLens result matrix"><div id="matrixCanvasMount"></div></div>',
'    <div id="matrixBridgeNote"></div>',
'    <div class="matrixLegend">',
'      <span><i class="matrixLegendMark focusMarker"></i><span id="matrixLegendFocus"></span></span>',
'      <span><i class="matrixLegendMark backgroundMarker"></i><span id="matrixLegendBackground"></span></span>',
'      <span><i class="matrixLegendMark suffMarker"></i><span id="matrixLegendSuff"></span></span>',
'    </div>',
'    <p id="matrixRelationNote" class="matrixRelationNote"></p>',
'    <div class="actions matrixActions"><button id="matrixContinue" class="primary" type="button">Toliau į rezultatą</button><button id="matrixPdf" class="secondary" type="button">Išsaugoti PDF</button></div>',
'  </section>',
''
].join('\n');

export const RESULT_MATRIX_CSS=[
'.matrixResult{--mx-ink:#071b2e;--mx-soft:#315166;--mx-mist:#eef6f8;--mx-mist2:#dfeef2;--mx-water:#7bb8c8;--mx-white:#fbfdfe;--mx-line:rgba(7,27,46,.14);width:min(1180px,calc(100vw - 24px));max-width:none;margin-left:50%;transform:translateX(-50%);padding:28px 0 48px;color:var(--mx-ink)}',
'.matrixEyebrow{margin:0 0 8px;font-size:11px;font-weight:850;letter-spacing:.15em;text-transform:uppercase;color:var(--mx-soft)}',
'.matrixResult h1{font-size:clamp(34px,7vw,58px);line-height:.98;letter-spacing:-.05em;margin:0 0 14px;max-width:900px}',
'.matrixLead{max-width:820px;font-size:16px;line-height:1.55;color:var(--mx-soft);margin:0 0 22px}',
'.matrixSummary{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:18px 0 26px}',
'.matrixSummaryCard{display:flex;align-items:flex-start;gap:11px;min-height:92px;padding:14px;border:1px solid var(--mx-line);border-radius:17px;background:var(--mx-white)}',
'.matrixSummarySymbol{flex:0 0 auto;margin-top:3px}.matrixSummaryLabel{font-size:11px;font-weight:850;letter-spacing:.08em;text-transform:uppercase;color:var(--mx-soft);margin-bottom:5px}.matrixSummaryValue{font-size:15px;line-height:1.35;font-weight:760;color:var(--mx-ink)}',
'.matrixHeadRow{display:flex;align-items:end;justify-content:space-between;gap:18px;margin:4px 0 8px}.matrixHeadRow h2{font-size:24px;margin:0}.matrixHeadRow p{margin:0;max-width:520px;text-align:right;font-size:12px;line-height:1.4;color:var(--mx-soft)}',
'.matrixViewport{width:100%;overflow-x:auto;overflow-y:visible;border:1px solid var(--mx-line);border-radius:18px;background:var(--mx-white);box-shadow:0 10px 30px rgba(7,27,46,.035);scrollbar-color:var(--mx-water) transparent}',
'.matrixCanvas{display:grid;grid-template-columns:230px repeat(12,88px);grid-template-rows:46px 148px repeat(12,62px);width:max-content;min-width:1286px;position:relative;background:var(--mx-white)}',
'.matrixGroupHeader{display:flex;align-items:center;justify-content:center;text-align:center;padding:7px 8px;border-right:1px solid var(--mx-line);border-bottom:1px solid var(--mx-line);background:var(--mx-mist2);font-size:11px;line-height:1.2;font-weight:820;color:var(--mx-ink)}',
'.matrixTopStatement,.matrixLeftStatement{position:relative;background:var(--mx-white);border-right:1px solid var(--mx-line);border-bottom:1px solid var(--mx-line);color:var(--mx-soft)}',
'.matrixTopStatement{padding:8px 6px;font-size:9px;line-height:1.22;overflow:hidden}.matrixTopStatement b{display:block;color:var(--mx-ink);font-size:11px;margin-bottom:4px}.matrixTopStatement span{display:block}',
'.matrixLeftStatement{position:sticky;left:0;z-index:8;display:grid;grid-template-columns:28px minmax(0,1fr);gap:4px;align-items:center;padding:7px 8px 7px 6px;font-size:10px;line-height:1.25;box-shadow:5px 0 12px rgba(7,27,46,.025)}.matrixLeftStatement b{font-size:12px;text-align:center;color:var(--mx-ink)}',
'.matrixDataCell{position:relative;border-right:1px solid var(--mx-line);border-bottom:1px solid var(--mx-line);background:#fff;min-width:0;overflow:visible}.matrixDataCell.mirrorCell{background:rgba(238,246,248,.38)}.matrixDataCell.diagonalCell{background:rgba(223,238,242,.5)}.matrixDataCell.bridgeCell{background:rgba(123,184,200,.08)}',
'.matrixFamilyStack{position:absolute;inset:4px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;z-index:2}.matrixFamily{display:block;max-width:80px;padding:4px 5px;border-radius:8px;font-size:8px;line-height:1.05;text-align:center;font-weight:800;color:var(--mx-ink);background:rgba(223,238,242,.9);border:1px solid transparent}.matrixFamily.related{background:rgba(251,253,254,.88);border-color:rgba(7,27,46,.36)}.matrixFamily.bridge{background:rgba(238,246,248,.58);border:1px dashed rgba(7,27,46,.42)}',
'.matrixNoDirect{position:absolute;inset:5px;display:flex;align-items:center;justify-content:center;text-align:center;font-size:7.5px;line-height:1.15;color:rgba(49,81,102,.68);border:1px dashed rgba(7,27,46,.2);border-radius:8px;padding:3px}',
'.matrixMarkerStack{position:absolute;right:3px;top:3px;z-index:6;display:flex;gap:3px;flex-wrap:wrap;max-width:38px;justify-content:flex-end}',
'.matrixMarker,.matrixSummarySymbol,.matrixLegendMark{display:inline-block;width:15px;height:15px;border-radius:50%;box-sizing:border-box;box-shadow:0 0 0 2px rgba(251,253,254,.92)}.focusMarker{background:var(--mx-ink);border:2px solid var(--mx-ink)}.backgroundMarker{background:var(--mx-white);border:2px solid var(--mx-ink)}.suffMarker{background:var(--mx-water);border:2px solid var(--mx-water)}.matrixSummarySymbol{width:18px;height:18px}.matrixLegendMark{width:13px;height:13px;box-shadow:none}',
'.matrixBridgeNote{margin:9px 2px 0;font-size:11px;line-height:1.45;color:var(--mx-soft)}.matrixBridgeNote>div+div{margin-top:3px}',
'.matrixLegend{display:flex;gap:14px;flex-wrap:wrap;margin:16px 0 8px;padding:12px 14px;border:1px solid var(--mx-line);border-radius:14px;background:rgba(238,246,248,.55);font-size:11px;color:var(--mx-soft)}.matrixLegend>span{display:inline-flex;align-items:center;gap:6px}',
'.matrixRelationNote{font-size:12px;line-height:1.5;color:var(--mx-soft);max-width:820px;margin:8px 2px 0}.matrixActions{margin-top:22px}.matrixActions .primary{background:var(--mx-ink);color:#fff}.matrixActions .secondary{border-color:var(--mx-line);color:var(--mx-ink);background:var(--mx-white)}',
'@media(max-width:760px){.matrixResult{padding-top:18px}.matrixSummary{grid-template-columns:1fr;gap:7px}.matrixSummaryCard{min-height:0;padding:12px}.matrixHeadRow{display:block}.matrixHeadRow p{text-align:left;margin-top:5px}.matrixCanvas{grid-template-columns:190px repeat(12,86px);grid-template-rows:44px 142px repeat(12,58px);min-width:1222px}.matrixLeftStatement{font-size:9.5px}.matrixTopStatement{font-size:8.5px}.matrixLegend{display:grid;gap:8px}.matrixActions{display:grid;grid-template-columns:1fr}.matrixActions button{width:100%}}',
'@media print{@page{size:A4 landscape;margin:8mm}body.priolensPrintMatrix{background:#fff!important}body.priolensPrintMatrix .top,body.priolensPrintMatrix .screen:not(#matrixResult){display:none!important}body.priolensPrintMatrix .wrap{width:100%!important;max-width:none!important;padding:0!important}body.priolensPrintMatrix #matrixResult{display:block!important;width:100%!important;margin:0!important;transform:none!important;padding:0!important}body.priolensPrintMatrix .matrixResult h1{font-size:25px!important;margin-bottom:6px!important}body.priolensPrintMatrix .matrixEyebrow{font-size:8px!important;margin-bottom:3px!important}body.priolensPrintMatrix .matrixLead{font-size:9px!important;margin-bottom:8px!important}body.priolensPrintMatrix .matrixSummary{grid-template-columns:repeat(3,1fr)!important;gap:5px!important;margin:7px 0 8px!important}body.priolensPrintMatrix .matrixSummaryCard{padding:6px!important;min-height:46px!important}.matrixSummaryLabel{font-size:6.5px!important}.matrixSummaryValue{font-size:8px!important}body.priolensPrintMatrix .matrixHeadRow{margin:2px 0 4px!important}.matrixHeadRow h2{font-size:12px!important}.matrixHeadRow p{font-size:7px!important}body.priolensPrintMatrix .matrixViewport{overflow:visible!important;border:0!important;box-shadow:none!important}body.priolensPrintMatrix .matrixCanvas{width:100%!important;min-width:0!important;grid-template-columns:140px repeat(12,minmax(0,1fr))!important;grid-template-rows:24px 76px repeat(12,34px)!important}body.priolensPrintMatrix .matrixGroupHeader{font-size:6px!important;padding:2px!important}.matrixTopStatement{font-size:4.8px!important;padding:3px 2px!important}.matrixTopStatement b{font-size:6px!important;margin-bottom:1px!important}.matrixLeftStatement{position:relative!important;left:auto!important;font-size:5.4px!important;padding:2px 3px!important;grid-template-columns:15px 1fr!important}.matrixLeftStatement b{font-size:6px!important}body.priolensPrintMatrix .matrixFamily{font-size:4.8px!important;padding:2px!important;max-width:55px!important}.matrixNoDirect{font-size:4.5px!important;padding:1px!important}.matrixMarker,.matrixLegendMark{width:8px!important;height:8px!important;border-width:1px!important;box-shadow:none!important}body.priolensPrintMatrix .matrixMarkerStack{right:1px!important;top:1px!important;gap:1px!important}.matrixFamilyStack{inset:2px!important;gap:1px!important}body.priolensPrintMatrix .matrixBridgeNote,body.priolensPrintMatrix .matrixLegend,body.priolensPrintMatrix .matrixRelationNote{font-size:6.5px!important;margin-top:5px!important;padding:4px!important}body.priolensPrintMatrix .matrixActions{display:none!important}}'
].join('\\n');
