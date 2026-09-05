import { buildResultWorldModel } from './result_world_v04.mjs?v=scene4';

export const RESULT_MATRIX_SCHEMA_V04='2rasi.priolens.open14.result-matrix-v0.5';

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
const DEFICIENCY_LABELS={
  lt:{
    MEANING_PURPOSE:'Prasmingumo tame, ką šiuo metu darai.',
    CONTRIBUTION:'Galimybių prisidėti prie kažko svarbaus ne tik sau.',
    LEARNING_GROWTH:'Galimybių mokytis, atrasti ir augti.',
    CAPABILITY_MASTERY:'Galimybių naudoti ir tobulinti savo gebėjimus.',
    AUTONOMY_AGENCY:'Laisvės pačiam spręsti ir veikti tau svarbiose srityse.',
    RECOGNITION_ESTEEM:'Tavo pastangų, nuomonės ar indėlio pastebėjimo ir įvertinimo.',
    CONNECTION_BELONGING:'Artimo ryšio ir jausmo, kad priklausai kitiems.',
    CARE_SUPPORT_PRESENT:'Rūpesčio, paramos ir žmogiško dėmesio iš kitų.',
    SAFETY_STABILITY:'Saugumo ir stabilumo.',
    CLARITY_PREDICTABILITY:'Aiškumo ir nuspėjamumo kasdienybėje.',
    RESTORATION_ENERGY:'Poilsio ir energijos kasdienybei.',
    MATERIAL_RESOURCES:'Kasdienių resursų tam, ko tau realiai reikia.'
  },
  en:{
    MEANING_PURPOSE:'Meaning in what you are doing right now.',
    CONTRIBUTION:'Opportunities to contribute to something important beyond yourself.',
    LEARNING_GROWTH:'Opportunities to learn, discover and grow.',
    CAPABILITY_MASTERY:'Opportunities to use and develop your abilities.',
    AUTONOMY_AGENCY:'Freedom to decide and act for yourself in areas that matter to you.',
    RECOGNITION_ESTEEM:'Your effort, opinion or contribution being noticed and valued.',
    CONNECTION_BELONGING:'Close connection and a sense of belonging with others.',
    CARE_SUPPORT_PRESENT:'Care, support and human attention from others.',
    SAFETY_STABILITY:'Safety and stability.',
    CLARITY_PREDICTABILITY:'Clarity and predictability in everyday life.',
    RESTORATION_ENERGY:'Rest and energy for everyday life.',
    MATERIAL_RESOURCES:'Everyday resources for what you realistically need.'
  }
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
    title:'Du žvilgsniai vienoje matricoje.',
    lead:'Matrica padeda sugretinti pirmo žvilgsnio kryptį ir tavo dabartinio pakankamumo atsakymus. Ji rodo santykį, ne priežastį ir ne srities svarbumą.',
    focus:'Pirmo žvilgsnio kryptis',noFocus:'Viena kryptis aiškiai neišsiskyrė',
    suff:'Šiuo metu nepakanka',noSuff:'Aiški nepakankamumo sritis neišsiskyrė',
    matrixTitle:'Santykių matrica',
    matrixHint:'Slink į šoną. Abiejose ašyse matai tuos pačius teiginius, į kuriuos atsakei.',
    attentionDetails:'Pirmo žvilgsnio detalės',sufficiencyDetails:'Antro atsakymo detalės',pdf:'Išsaugoti PDF',restart:'Atlikti dar kartą',back:'Grįžti į 2rasi',
    bridge:'Jungia kelias sritis',noDirect:'Be tiesioginės vaizdinės krypties',
    focus3Legend:'Pirmo žvilgsnio kryptis · 3/3',
    focus2Legend:'Pirmo žvilgsnio kryptis · 2/3',
    lowLegend:'Tavo įvertinimas 3 ar mažiau',
    routeLegend:'Išskirta nepakankamumo sritis',
    printStatementsTitle:'Tavo vertinti teiginiai',
    printLeastLabel:'Pirmo žvilgsnio detalė · nuosekliai liko antrame plane',
    relationNote:'Oranžinė spalva žymi tik tas konkrečias sritis, kurias įvertinai 3 ar mažiau: jų ašis ir tos pačios srities diagonalę. Ji neperžengia į kitų sričių langelius. Žalia rodo, kiek kartų pasikartojo išskirta pirmo žvilgsnio kryptis. Abi perspektyvos lieka atskiros.'
  },
  en:{
    eyebrow:'Result overview',
    title:'Two perspectives in one matrix.',
    lead:'The matrix helps place your first-glance direction beside your current sufficiency answers. It shows relationships, not causes or importance.',
    focus:'First-glance direction',noFocus:'No single direction clearly stood out',
    suff:'Currently insufficient',noSuff:'No clear insufficiency area stood out',
    matrixTitle:'Relationship matrix',
    matrixHint:'Scroll sideways. Both axes use the same statements you answered.',
    attentionDetails:'First-glance details',sufficiencyDetails:'Second-answer details',pdf:'Save PDF',restart:'Do it again',back:'Back to 2rasi',
    bridge:'Connects several areas',noDirect:'No direct visual counterpart',
    focus3Legend:'First-glance direction · 3/3',
    focus2Legend:'First-glance direction · 2/3',
    lowLegend:'Your rating is 3 or lower',
    routeLegend:'Selected insufficiency area',
    printStatementsTitle:'Statements you rated',
    printLeastLabel:'First-glance detail · consistently stayed in the background',
    relationNote:'Orange marks only the specific areas you rated 3 or lower: their axes and the same-area diagonal cell. It does not spill into other areas. Green shows how often the selected first-glance direction repeated. The two perspectives remain separate.'
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
  const focusRawMostCount=world.attention.hasFocus?world.attention.rawMostCount:null;
  const backgroundFamilyIds=least3Families(state);
  const sufficiencyItemIds=world.sufficiency.itemIds.slice();
  const lowSufficiencyItemIds=items.filter(function(item){
    const v=state&&state.sufficiency?state.sufficiency[item.id]:null;
    return Number.isInteger(v)&&v<=3;
  }).map(function(item){return item.id});
  return {
    schema:RESULT_MATRIX_SCHEMA_V04,
    items:items,
    groups:GROUPS[lang]||GROUPS.lt,
    focusFamilyId:focusFamilyId,
    focusRawMostCount:focusRawMostCount,
    backgroundFamilyIds:backgroundFamilyIds,
    sufficiencyItemIds:sufficiencyItemIds,
    lowSufficiencyItemIds:lowSufficiencyItemIds
  }
}
function summaryValue(kind,model,lang,familyLabels){
  const C=COPY[lang]||COPY.lt;
  if(kind==='FOCUS'){
    if(!model.focusFamilyId)return C.noFocus;
    const label=familyLabels[model.focusFamilyId]||model.focusFamilyId;
    return label+(model.focusRawMostCount?' · '+model.focusRawMostCount+'/3':'');
  }
  if(kind==='SUFFICIENCY'){
    if(!model.sufficiencyItemIds.length)return C.noSuff;
    const labels=DEFICIENCY_LABELS[lang]||DEFICIENCY_LABELS.lt;
    return model.sufficiencyItemIds.map(function(id){return labels[id]||id}).join(' · ')
  }
  return ''
}
function chipHtml(familyId,familyLabels,model){
  const p=A_PLACEMENTS[familyId],label=familyLabels[familyId]||familyId;
  let cls=p.type==='DIRECT'?'matrixFamily direct':p.type==='RELATED'?'matrixFamily related':'matrixFamily bridge';
  if(model.focusFamilyId===familyId)cls+=model.focusRawMostCount===3?' focus3':model.focusRawMostCount===2?' focus2':'';
  return '<span class="'+cls+'" data-family-id="'+esc(familyId)+'">'+esc(label)+'</span>'
}
function buildMatrixCanvas(model,lang,familyLabels){
  const C=COPY[lang]||COPY.lt,familyByCell=new Map();
  const lowIndexes=new Set(model.lowSufficiencyItemIds.map(function(id){return itemIndex(model.items,id)}).filter(Boolean));
  const routeIndexes=new Set(model.sufficiencyItemIds.map(function(id){return itemIndex(model.items,id)}).filter(Boolean));
  for(const familyId of Object.keys(A_PLACEMENTS)){
    const p=A_PLACEMENTS[familyId],key=p.row+'|'+p.col;
    if(!familyByCell.has(key))familyByCell.set(key,[]);
    familyByCell.get(key).push(familyId)
  }
  let html='<div class="matrixCanvas" role="table" aria-label="'+esc(C.matrixTitle)+'">';
  model.groups.forEach(function(title,g){html+='<div class="matrixGroupHeader" style="grid-column:'+(2+g*2)+' / span 2;grid-row:1">'+esc(title)+'</div>'});
  model.items.forEach(function(item,i){
    const n=i+1,axisCls=(lowIndexes.has(n)?' lowAxis':'')+(routeIndexes.has(n)?' routeAxis':'');
    html+='<div class="matrixTopStatement'+axisCls+'" style="grid-column:'+(i+2)+';grid-row:2"><b>'+n+'</b><span>'+esc(item.statement)+'</span></div>';
    html+='<div class="matrixLeftStatement'+axisCls+'" style="grid-column:1;grid-row:'+(i+3)+'"><b>'+n+'</b><span>'+esc(item.statement)+'</span></div>'
  });
  for(let r=1;r<=12;r++)for(let col=1;col<=12;col++){
    const key=r+'|'+col;
    const mirror=r>col?' mirrorCell':'';
    const diagonal=r===col?' diagonalCell':'';
    const bridge=(familyByCell.get(key)||[]).some(function(id){return A_PLACEMENTS[id].type==='BRIDGE'})?' bridgeCell':'';
    const lowOwnCell=(r===col&&lowIndexes.has(r))?' lowOwnCell':'';
    const routeCell=(r===col&&routeIndexes.has(r))?' routeCell':'';
    html+='<div class="matrixDataCell'+mirror+diagonal+bridge+lowOwnCell+routeCell+'" style="grid-column:'+(col+1)+';grid-row:'+(r+2)+'">';
    if(r===col&&NO_DIRECT_B.has(r))html+='<span class="matrixNoDirect">'+esc(C.noDirect)+'</span>';
    const families=familyByCell.get(key)||[];
    if(families.length)html+='<span class="matrixFamilyStack">'+families.map(function(id){return chipHtml(id,familyLabels,model)}).join('')+'</span>';
    html+='</div>'
  }
  return html+'</div>'
}
function bridgeNote(model,lang,familyLabels){
  const C=COPY[lang]||COPY.lt,ids=[model.focusFamilyId].filter(function(id){return A_PLACEMENTS[id]&&A_PLACEMENTS[id].type==='BRIDGE'});
  const seen=Array.from(new Set(ids));if(!seen.length)return '';
  return '<div class="matrixBridgeNote">'+seen.map(function(id){const p=A_PLACEMENTS[id],name=familyLabels[id]||id;return '<div><strong>'+esc(name)+'</strong> · '+esc(C.bridge)+' · '+esc((p.related||[]).join(', '))+'</div>'}).join('')+'</div>'
}
function centerMatrixOnResult(){
  const viewport=document.querySelector('.matrixViewport');
  if(!viewport)return;
  const targets=Array.from(viewport.querySelectorAll('.matrixDataCell')).filter(function(cell){
    return cell.classList.contains('routeCell')||Boolean(cell.querySelector('.matrixFamily.focus3,.matrixFamily.focus2'));
  });
  if(!targets.length){viewport.scrollLeft=0;return}
  const centers=targets.map(function(cell){return cell.offsetLeft+cell.offsetWidth/2});
  const target=centers.reduce(function(a,b){return a+b},0)/centers.length;
  viewport.scrollLeft=Math.max(0,target-viewport.clientWidth/2);
}
export function renderResultMatrixV04(args){
  const state=args.state,lang=args.lang||'lt',familyLabels=args.familyLabels||{},onAttentionDetails=args.onAttentionDetails,onSufficiencyDetails=args.onSufficiencyDetails,onPrint=args.onPrint,onRestart=args.onRestart,backHref=args.backHref||'https://2rasi.lt/#experiments',C=COPY[lang]||COPY.lt,model=buildResultMatrixModelV04(state,lang);
  const q=function(id){const el=document.getElementById(id);if(!el)throw new Error('PrioLens matrix DOM missing #'+id);return el};
  q('matrixEyebrow').textContent=C.eyebrow;q('matrixTitle').textContent=C.title;q('matrixLead').textContent=C.lead;
  q('matrixFocusLabel').textContent=C.focus;q('matrixFocusValue').textContent=summaryValue('FOCUS',model,lang,familyLabels);
  q('matrixSuffLabel').textContent=C.suff;q('matrixSuffValue').textContent=summaryValue('SUFFICIENCY',model,lang,familyLabels);
  const focusCard=q('matrixFocusCard');
  focusCard.classList.toggle('focus3',model.focusRawMostCount===3);
  focusCard.classList.toggle('focus2',model.focusRawMostCount===2);
  q('matrixSectionTitle').textContent=C.matrixTitle;q('matrixHint').textContent=C.matrixHint;
  q('matrixLegendFocus3').textContent=C.focus3Legend;q('matrixLegendFocus2').textContent=C.focus2Legend;q('matrixLegendLow').textContent=C.lowLegend;q('matrixLegendRoute').textContent=C.routeLegend;q('matrixRelationNote').textContent=C.relationNote;
  q('matrixCanvasMount').innerHTML=buildMatrixCanvas(model,lang,familyLabels);q('matrixBridgeNote').innerHTML=bridgeNote(model,lang,familyLabels);
  q('matrixPrintTitle').textContent=C.printStatementsTitle;
  q('matrixPrintStatementList').innerHTML=model.items.map(function(item,i){return '<div class="matrixPrintStatement"><b>'+(i+1)+'</b><span>'+esc(item.statement)+'</span></div>'}).join('');
  q('matrixPrintLeast').innerHTML=model.backgroundFamilyIds.length?'<strong>'+esc(C.printLeastLabel)+':</strong> '+esc(model.backgroundFamilyIds.map(function(id){return familyLabels[id]||id}).join(' · ')):'';
  q('matrixAttentionDetails').textContent=C.attentionDetails;q('matrixSufficiencyDetails').textContent=C.sufficiencyDetails;
  q('matrixPdf').textContent=C.pdf;q('matrixRestart').textContent=C.restart;q('matrixBack2rasi').textContent=C.back;q('matrixBack2rasi').href=backHref;
  q('matrixAttentionDetails').onclick=function(){if(typeof onAttentionDetails==='function')onAttentionDetails()};
  q('matrixSufficiencyDetails').onclick=function(){if(typeof onSufficiencyDetails==='function')onSufficiencyDetails()};
  q('matrixPdf').onclick=function(){if(typeof onPrint==='function')onPrint()};
  q('matrixRestart').onclick=function(){if(typeof onRestart==='function')onRestart()};
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
'      <div id="matrixFocusCard" class="matrixSummaryCard focusSummary"><div><div id="matrixFocusLabel" class="matrixSummaryLabel"></div><div id="matrixFocusValue" class="matrixSummaryValue"></div></div></div>',
'      <div id="matrixSuffCard" class="matrixSummaryCard suffSummary"><div><div id="matrixSuffLabel" class="matrixSummaryLabel"></div><div id="matrixSuffValue" class="matrixSummaryValue"></div></div></div>',
'    </div>',
'    <div class="matrixHeadRow"><h2 id="matrixSectionTitle"></h2><p id="matrixHint"></p></div>',
'    <div class="matrixViewport" tabindex="0" aria-label="PrioLens result matrix"><div id="matrixCanvasMount"></div></div>',
'    <div id="matrixBridgeNote"></div>',
'    <div class="matrixLegend">',
'      <span><i class="matrixLegendSwatch focus3Swatch"></i><span id="matrixLegendFocus3"></span></span>',
'      <span><i class="matrixLegendSwatch focus2Swatch"></i><span id="matrixLegendFocus2"></span></span>',
'      <span><i class="matrixLegendSwatch lowSwatch"></i><span id="matrixLegendLow"></span></span>',
'      <span><i class="matrixLegendSwatch routeSwatch"></i><span id="matrixLegendRoute"></span></span>',
'    </div>',
'    <p id="matrixRelationNote" class="matrixRelationNote"></p>',
'    <section class="matrixPrintAppendix"><h2 id="matrixPrintTitle"></h2><div id="matrixPrintStatementList" class="matrixPrintStatementList"></div><p id="matrixPrintLeast" class="matrixPrintLeast"></p></section>',
'    <div class="matrixDetailActions"><button id="matrixAttentionDetails" class="primary" type="button">Pirmo žvilgsnio detalės</button><button id="matrixSufficiencyDetails" class="secondary" type="button">Antro atsakymo detalės</button></div>',
'    <div class="actions matrixActions"><button id="matrixPdf" class="secondary" type="button">Išsaugoti PDF</button><button id="matrixRestart" class="secondary" type="button">Atlikti dar kartą</button><a id="matrixBack2rasi" class="secondary actionLink" href="https://2rasi.lt/#experiments">Grįžti į 2rasi</a></div>',
'  </section>',
''
].join('\n');

export const RESULT_MATRIX_CSS=[
'.matrixResult{--mx-ink:#071b2e;--mx-soft:#315166;--mx-mist:#eef6f8;--mx-mist2:#dfeef2;--mx-white:#fbfdfe;--mx-line:rgba(7,27,46,.14);--mx-focus3:#2f7654;--mx-focus3-soft:#dceee4;--mx-focus2:#82b89b;--mx-focus2-soft:#edf7f1;--mx-low:#d9791f;--mx-low-soft:#fff0dc;--mx-low-strong:#c86716;width:min(1180px,calc(100vw - 24px));max-width:none;margin-left:50%;transform:translateX(-50%);padding:28px 0 48px;color:var(--mx-ink)}',
'.matrixEyebrow{margin:0 0 8px;font-size:11px;font-weight:850;letter-spacing:.15em;text-transform:uppercase;color:var(--mx-soft)}',
'.matrixResult h1{font-size:clamp(34px,7vw,58px);line-height:.98;letter-spacing:-.05em;margin:0 0 14px;max-width:900px}.matrixLead{max-width:820px;font-size:16px;line-height:1.55;color:var(--mx-soft);margin:0 0 22px}',
'.matrixSummary{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:18px 0 26px}.matrixSummaryCard{display:flex;align-items:flex-start;min-height:92px;padding:14px 16px;border:1px solid var(--mx-line);border-radius:17px;background:var(--mx-white)}.matrixSummaryCard.focus3{border:2px solid var(--mx-focus3);background:var(--mx-focus3-soft)}.matrixSummaryCard.focus2{border:2px solid var(--mx-focus2);background:var(--mx-focus2-soft)}.matrixSummaryCard.suffSummary{border:2px solid var(--mx-low);background:var(--mx-low-soft)}',
'.matrixSummaryLabel{font-size:11px;font-weight:850;letter-spacing:.08em;text-transform:uppercase;color:var(--mx-soft);margin-bottom:5px}.matrixSummaryValue{font-size:15px;line-height:1.35;font-weight:760;color:var(--mx-ink)}',
'.matrixHeadRow{display:flex;align-items:end;justify-content:space-between;gap:18px;margin:4px 0 8px}.matrixHeadRow h2{font-size:24px;margin:0}.matrixHeadRow p{margin:0;max-width:520px;text-align:right;font-size:12px;line-height:1.4;color:var(--mx-soft)}',
'.matrixViewport{width:100%;overflow-x:auto;overflow-y:visible;border:1px solid var(--mx-line);border-radius:18px;background:var(--mx-white);box-shadow:0 10px 30px rgba(7,27,46,.035);scrollbar-color:var(--mx-focus2) transparent}',
'.matrixCanvas{display:grid;grid-template-columns:230px repeat(12,88px);grid-template-rows:46px 148px repeat(12,62px);width:max-content;min-width:1286px;position:relative;background:var(--mx-white)}',
'.matrixGroupHeader{display:flex;align-items:center;justify-content:center;text-align:center;padding:7px 8px;border-right:1px solid var(--mx-line);border-bottom:1px solid var(--mx-line);background:var(--mx-mist2);font-size:11px;line-height:1.2;font-weight:820;color:var(--mx-ink)}',
'.matrixTopStatement,.matrixLeftStatement{position:relative;background:var(--mx-white);border-right:1px solid var(--mx-line);border-bottom:1px solid var(--mx-line);color:var(--mx-soft)}.matrixTopStatement.lowAxis,.matrixLeftStatement.lowAxis{background:var(--mx-low-soft)}.matrixTopStatement.routeAxis,.matrixLeftStatement.routeAxis{box-shadow:inset 0 0 0 2px var(--mx-low-strong)}',
'.matrixTopStatement{padding:8px 6px;font-size:9px;line-height:1.22;overflow:hidden}.matrixTopStatement b{display:block;color:var(--mx-ink);font-size:11px;margin-bottom:4px}.matrixTopStatement span{display:block}.matrixLeftStatement{position:sticky;left:0;z-index:8;display:grid;grid-template-columns:28px minmax(0,1fr);gap:4px;align-items:center;padding:7px 8px 7px 6px;font-size:10px;line-height:1.25;box-shadow:5px 0 12px rgba(7,27,46,.025)}.matrixLeftStatement.routeAxis{box-shadow:inset 0 0 0 2px var(--mx-low-strong),5px 0 12px rgba(7,27,46,.025)}.matrixLeftStatement b{font-size:12px;text-align:center;color:var(--mx-ink)}',
'.matrixDataCell{position:relative;border-right:1px solid var(--mx-line);border-bottom:1px solid var(--mx-line);background:#fff;min-width:0;overflow:visible}.matrixDataCell.mirrorCell{background:rgba(238,246,248,.38)}.matrixDataCell.diagonalCell{background:rgba(223,238,242,.5)}.matrixDataCell.bridgeCell{background:rgba(238,246,248,.72)}.matrixDataCell.lowOwnCell{background:var(--mx-low-soft)!important}.matrixDataCell.routeCell{box-shadow:inset 0 0 0 2px var(--mx-low-strong)}',
'.matrixFamilyStack{position:absolute;inset:4px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;z-index:2}.matrixFamily{display:block;max-width:80px;padding:4px 5px;border-radius:8px;font-size:8px;line-height:1.05;text-align:center;font-weight:800;color:var(--mx-ink);background:rgba(223,238,242,.9);border:1px solid transparent}.matrixFamily.related{background:rgba(251,253,254,.9);border-color:rgba(7,27,46,.36)}.matrixFamily.bridge{background:rgba(238,246,248,.72);border:1px dashed rgba(7,27,46,.42)}.matrixFamily.focus3{background:var(--mx-focus3-soft)!important;border:2px solid var(--mx-focus3)!important;color:#173f2e}.matrixFamily.focus2{background:var(--mx-focus2-soft)!important;border:2px solid var(--mx-focus2)!important;color:#285e46}',
'.matrixNoDirect{position:absolute;inset:5px;display:flex;align-items:center;justify-content:center;text-align:center;font-size:7.5px;line-height:1.15;color:rgba(49,81,102,.68);border:1px dashed rgba(7,27,46,.2);border-radius:8px;padding:3px}',
'.matrixBridgeNote{margin:9px 2px 0;font-size:11px;line-height:1.45;color:var(--mx-soft)}.matrixBridgeNote>div+div{margin-top:3px}',
'.matrixLegend{display:flex;gap:14px;flex-wrap:wrap;margin:16px 0 8px;padding:12px 14px;border:1px solid var(--mx-line);border-radius:14px;background:rgba(238,246,248,.55);font-size:11px;color:var(--mx-soft)}.matrixLegend>span{display:inline-flex;align-items:center;gap:6px}.matrixLegendSwatch{display:inline-block;width:18px;height:12px;border-radius:4px;box-sizing:border-box}.focus3Swatch{background:var(--mx-focus3-soft);border:2px solid var(--mx-focus3)}.focus2Swatch{background:var(--mx-focus2-soft);border:2px solid var(--mx-focus2)}.lowSwatch{background:var(--mx-low-soft);border:1px solid rgba(217,121,31,.5)}.routeSwatch{background:var(--mx-low-soft);border:2px solid var(--mx-low-strong)}',
'.matrixRelationNote{font-size:12px;line-height:1.5;color:var(--mx-soft);max-width:900px;margin:8px 2px 0}.matrixPrintAppendix{display:none}.matrixDetailActions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:20px}.matrixDetailActions button{min-height:48px}.matrixDetailActions .primary{background:var(--mx-ink);color:#fff}.matrixActions{margin-top:10px}.matrixActions .secondary{border-color:var(--mx-line);color:var(--mx-ink);background:var(--mx-white)}',
'@media(max-width:760px){.matrixResult{padding-top:18px}.matrixSummary{grid-template-columns:1fr;gap:7px}.matrixSummaryCard{min-height:0;padding:12px}.matrixHeadRow{display:block}.matrixHeadRow p{text-align:left;margin-top:5px}.matrixCanvas{grid-template-columns:190px repeat(12,86px);grid-template-rows:44px 142px repeat(12,58px);min-width:1222px}.matrixLeftStatement{font-size:9.5px}.matrixTopStatement{font-size:8.5px}.matrixLegend{display:grid;gap:8px}.matrixDetailActions,.matrixActions{display:grid;grid-template-columns:1fr}.matrixDetailActions button,.matrixActions button,.matrixActions .actionLink{width:100%}}',
'@media print{@page{size:210mm 297mm;margin:6mm}*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}body.priolensPrintMatrix{background:#fff!important}body.priolensPrintMatrix .top,body.priolensPrintMatrix .screen:not(#matrixResult){display:none!important}body.priolensPrintMatrix .wrap{width:100%!important;max-width:none!important;padding:0!important}body.priolensPrintMatrix #matrixResult{display:block!important;width:100%!important;margin:0!important;transform:none!important;padding:0!important}body.priolensPrintMatrix .matrixResult h1{font-size:21px!important;margin-bottom:4px!important}body.priolensPrintMatrix .matrixEyebrow{font-size:7px!important;margin-bottom:2px!important}body.priolensPrintMatrix .matrixLead{font-size:7.5px!important;line-height:1.3!important;margin-bottom:5px!important}body.priolensPrintMatrix .matrixSummary{grid-template-columns:repeat(2,1fr)!important;gap:5px!important;margin:5px 0 6px!important}body.priolensPrintMatrix .matrixSummaryCard{padding:5px 7px!important;min-height:36px!important;border-radius:8px!important}.matrixSummaryLabel{font-size:5.8px!important;margin-bottom:2px!important}.matrixSummaryValue{font-size:7.2px!important;line-height:1.2!important}body.priolensPrintMatrix .matrixHeadRow{margin:1px 0 3px!important}.matrixHeadRow h2{font-size:11px!important}.matrixHeadRow p{display:none!important}body.priolensPrintMatrix .matrixViewport{overflow:visible!important;border:0!important;box-shadow:none!important}body.priolensPrintMatrix .matrixCanvas{width:100%!important;min-width:0!important;grid-template-columns:26px repeat(12,minmax(0,1fr))!important;grid-template-rows:19px 15px repeat(12,25px)!important}body.priolensPrintMatrix .matrixGroupHeader{font-size:5.3px!important;line-height:1.05!important;padding:1px!important}body.priolensPrintMatrix .matrixTopStatement{font-size:5px!important;padding:1px!important;display:flex!important;align-items:center!important;justify-content:center!important}body.priolensPrintMatrix .matrixTopStatement span{display:none!important}body.priolensPrintMatrix .matrixTopStatement b{font-size:6px!important;margin:0!important}body.priolensPrintMatrix .matrixLeftStatement{position:relative!important;left:auto!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:1px!important;box-shadow:none!important}body.priolensPrintMatrix .matrixLeftStatement span{display:none!important}body.priolensPrintMatrix .matrixLeftStatement b{font-size:6px!important}body.priolensPrintMatrix .matrixFamily{font-size:4.4px!important;line-height:1!important;padding:1px 2px!important;max-width:52px!important;border-width:1px!important}.matrixNoDirect{font-size:4px!important;line-height:1!important;padding:1px!important}.matrixFamilyStack{inset:1px!important;gap:1px!important}body.priolensPrintMatrix .matrixBridgeNote{font-size:5.7px!important;margin-top:2px!important;line-height:1.2!important}body.priolensPrintMatrix .matrixLegend{font-size:5.7px!important;margin:3px 0 2px!important;padding:3px 4px!important;gap:6px!important;border-radius:6px!important}body.priolensPrintMatrix .matrixLegendSwatch{width:8px!important;height:6px!important;border-width:1px!important}body.priolensPrintMatrix .matrixRelationNote{font-size:5.6px!important;line-height:1.2!important;margin:2px 0 0!important}body.priolensPrintMatrix .matrixDetailActions,body.priolensPrintMatrix .matrixActions{display:none!important}body.priolensPrintMatrix .matrixPrintAppendix{display:block!important;margin-top:4px!important;padding-top:4px!important;border-top:1px solid var(--mx-line)!important;break-before:auto!important;page-break-before:auto!important}body.priolensPrintMatrix .matrixPrintAppendix h2{font-size:10px!important;margin:0 0 4px!important}body.priolensPrintMatrix .matrixPrintStatementList{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;column-gap:6mm!important;row-gap:2px!important}body.priolensPrintMatrix .matrixPrintStatement{display:grid!important;grid-template-columns:5mm 1fr!important;gap:1mm!important;break-inside:avoid!important;font-size:5.7px!important;line-height:1.2!important;color:var(--mx-ink)!important}body.priolensPrintMatrix .matrixPrintStatement b{font-size:6px!important}body.priolensPrintMatrix .matrixPrintLeast{margin:4px 0 0!important;padding-top:3px!important;border-top:1px solid var(--mx-line)!important;font-size:5.6px!important;line-height:1.2!important;color:var(--mx-soft)!important}}'
].join('\n');