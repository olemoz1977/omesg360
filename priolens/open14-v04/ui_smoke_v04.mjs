import { chromium } from 'playwright';
import { buildOpen14Plan, FAMILY_SET } from './p3_open14_planner_v02.mjs';

const BASE=process.env.PRIOLENS_V04_BASE||'http://127.0.0.1:8765/';
const SCHEMA='2rasi.priolens.open14.rank-session-v0.4';
const BANK='2rasi.priolens.open14.bank-v0.3.1';
const SUFF='2rasi.priolens.sufficiency-v0.3';
const DRAFT='priolens.open14.v041.rank.draft.lt';
const RESULT='priolens.open14.v041.last-result.lt';
const svg='<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#ddd"/></svg>';

const browser=await chromium.launch({headless:true});
try{
  const context=await browser.newContext({viewport:{width:390,height:844}});
  const page=await context.newPage();
  const finalPayloads=[];
  const progressPayloads=[];

  await page.route('**/priolens-research-assets/**',route=>route.fulfill({status:200,contentType:'image/svg+xml',body:svg}));
  await page.route('**/priolens-open14-v04-api/progress.php',async route=>{
    const body=JSON.parse(route.request().postData()||'{}');
    if(body.schema!==SCHEMA)throw new Error('progress schema != v0.4');
    if(body.sufficiencySchema!==SUFF)throw new Error('progress sufficiency schema != v0.3');
    progressPayloads.push(body);
    await route.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"saved":true,"submissionId":"V04-LOCAL"}'});
  });
  await page.route('**/priolens-open14-v04-api/api.php',async route=>{
    const body=JSON.parse(route.request().postData()||'{}');
    if(body.schema!==SCHEMA)throw new Error('final schema != v0.4');
    if(body.sufficiencySchema!==SUFF)throw new Error('final sufficiency schema != v0.3');
    finalPayloads.push(body);
    await route.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"inserted":true,"submissionId":"V04-LOCAL"}'});
  });

  await page.goto(BASE+'?lang=lt&from=lt',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.querySelector('#start')&&!document.querySelector('#start').disabled);
  await page.click('#start');
  await page.waitForSelector('#trial.active');

  const draft0=JSON.parse(await page.evaluate(k=>localStorage.getItem(k),DRAFT));
  if(!draft0||draft0.schema!==SCHEMA)throw new Error('v0.4 draft missing after start');
  if(draft0.bankSchema!==BANK)throw new Error('bank identity changed in v0.4 draft');
  if(draft0.sufficiencySchema!==SUFF)throw new Error('revised sufficiency schema missing in v0.4 draft');
  const seed=draft0.seed;
  const plan=buildOpen14Plan(seed);

  const ids=FAMILY_SET.map(x=>x.id);
  let targets=null;
  outer: for(let a=0;a<ids.length;a++)for(let b=a+1;b<ids.length;b++){
    const x=ids[a],y=ids[b];
    if(plan.trials.every(t=>!(t.positions.includes(x)&&t.positions.includes(y)))){targets=[x,y];break outer}
  }
  if(!targets)throw new Error('could not find non-cooccurring A+ target families');
  const counts=Object.fromEntries(ids.map(id=>[id,0]));

  for(let i=0;i<14;i++){
    const positions=plan.trials[i].positions;
    let mostSlot=positions.findIndex(x=>targets.includes(x));
    if(mostSlot<0){
      mostSlot=[0,1,2].sort((a,b)=>counts[positions[a]]-counts[positions[b]])[0];
    }
    if(i===0){
      const accidentalSlot=[0,1,2].find(x=>x!==mostSlot);
      await page.click(`.stim[data-slot="${accidentalSlot}"]`);
      await page.waitForFunction(()=>document.querySelector('#undoMost')&&!document.querySelector('#undoMost').classList.contains('hidden'));
      const actionBoxes=await page.evaluate(()=>({
        undo:document.querySelector('#undoMost').getBoundingClientRect().toJSON(),
        tie:document.querySelector('#tieLeast').getBoundingClientRect().toJSON(),
        viewport:innerWidth
      }));
      if(actionBoxes.undo.right>actionBoxes.tie.left+1)throw new Error('undo and LEAST-tie actions overlap on mobile');
      if(actionBoxes.tie.right>actionBoxes.viewport+1)throw new Error('LEAST actions overflow mobile viewport');
      await page.click('#undoMost');
      await page.waitForFunction(()=>document.querySelector('#noneMost')&&!document.querySelector('#noneMost').classList.contains('hidden'));
      const undoDraft=JSON.parse(await page.evaluate(k=>localStorage.getItem(k),DRAFT));
      if(undoDraft.pendingMost!==null)throw new Error('undo must clear pending MOST before LEAST');
      if(!Array.isArray(undoDraft.attentionRevisions)||undoDraft.attentionRevisions.length!==1)throw new Error('undo must preserve the original first-choice revision record');
      if(undoDraft.attentionRevisions[0]?.originalChoice?.slot!==accidentalSlot)throw new Error('undo revision record lost original first choice');
    }
    counts[positions[mostSlot]]++;
    await page.click(`.stim[data-slot="${mostSlot}"]`);
    await page.waitForFunction(()=>document.querySelector('#tieLeast')&&!document.querySelector('#tieLeast').classList.contains('hidden'));
    const leastSlot=[0,1,2].find(x=>x!==mostSlot);
    await page.click(`.stim[data-slot="${leastSlot}"]`);
    if(i<13)await page.waitForFunction(n=>document.querySelector('#counter')?.textContent?.trim()===`${n} / 14`,i+2);
  }

  await page.waitForSelector('#aplus.active');
  const cards=page.locator('#aPlusMount .clarifyCard');
  if(await cards.count()<2)throw new Error('A+ did not show multiple candidate groups');
  const firstCardBox=await cards.first().boundingBox();
  if(!firstCardBox||firstCardBox.width<300)throw new Error('A+ mobile candidate group is still too narrow: '+(firstCardBox?.width||0));
  const aText=((await page.locator('#aPlusMount').textContent())||'').trim();
  if(aText)throw new Error('A+ leaked family labels into visual candidate cards: '+aText);

  const draftAtA=JSON.parse(await page.evaluate(k=>localStorage.getItem(k),DRAFT));
  if(!draftAtA.attentionResolution?.clarifierRequired)throw new Error('A+ unresolved local checkpoint missing');
  if(draftAtA.attentionFocus!==null)throw new Error('focus was forced before A+ answer');
  await page.waitForTimeout(400);
  if(!progressPayloads.some(x=>x.attentionResolution?.clarifierRequired===true&&x.attentionFocus===null))throw new Error('A+ unresolved server checkpoint missing');

  await page.reload({waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.querySelector('#start')&&!document.querySelector('#start').disabled);
  if(await page.locator('#start').getAttribute('data-resume')!=='1')throw new Error('A+ resume offer missing');
  await page.click('#start');
  await page.waitForSelector('#aplus.active');
  await page.locator('#aPlusMount .clarifyCard').first().click();
  await page.waitForSelector('#suff.active');

  const draftAfterA=JSON.parse(await page.evaluate(k=>localStorage.getItem(k),DRAFT));
  if(!draftAfterA.attentionClarifier?.selectedFamilyId)throw new Error('A+ answer not persisted');
  if(!draftAfterA.attentionFocus?.familyId)throw new Error('A+ focus not persisted');
  if(draftAfterA.attentionFocus.rawMostCount!==3)throw new Error('A+ 3/3 runoff lost raw count');

  for(let d=1;d<=6;d++){
    const ranges=page.locator('#domainMount input[type="range"]');
    if(await ranges.count()!==2)throw new Error('Channel B page does not contain two items');
    for(let i=0;i<2;i++){
      await ranges.nth(i).evaluate(el=>{
        el.value='2';
        el.dispatchEvent(new Event('input',{bubbles:true}));
        el.dispatchEvent(new Event('change',{bubbles:true}));
      });
    }
    await page.click('#suffNext');
    if(d<6)await page.waitForFunction(n=>document.querySelector('#suffCount')?.textContent?.trim()===`${n} / 6`,d+1);
  }

  await page.waitForSelector('#bplus.active');
  if(await page.locator('#bPlusMount .clarifyNeed').count()!==12)throw new Error('Expected 12 tied B+ minima in synthetic all-2 case');
  const draftAtB=JSON.parse(await page.evaluate(k=>localStorage.getItem(k),DRAFT));
  if(!draftAtB.sufficiencyResolution?.clarifierRequired)throw new Error('B+ unresolved local checkpoint missing');
  if(draftAtB.sufficiencyRoute?.itemIds?.length)throw new Error('route forced before B+ answer');
  await page.waitForTimeout(400);
  if(!progressPayloads.some(x=>x.sufficiencyResolution?.clarifierRequired===true&&x.sufficiencyRoute?.itemIds?.length===0))throw new Error('B+ unresolved server checkpoint missing');

  await page.reload({waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.querySelector('#start')&&!document.querySelector('#start').disabled);
  if(await page.locator('#start').getAttribute('data-resume')!=='1')throw new Error('B+ resume offer missing');
  await page.click('#start');
  await page.waitForSelector('#bplus.active');
  await page.locator('#bPlusMount .clarifyNeed').first().click();

  await page.waitForSelector('#matrixResult.active');
  if(await page.locator('#matrixCanvasMount .matrixDataCell').count()!==144)throw new Error('matrix must contain 12x12 data cells');
  if(await page.locator('#matrixCanvasMount .matrixTopStatement').count()!==12||await page.locator('#matrixCanvasMount .matrixLeftStatement').count()!==12)throw new Error('matrix axes must contain all 12 Channel-B statements');
  const careStatement='Jaučiu, kad iš kitų sulaukiu pakankamai rūpesčio, paramos ir žmogiško dėmesio.';
  const topCare=((await page.locator('#matrixCanvasMount .matrixTopStatement').nth(7).textContent())||'');
  const leftCare=((await page.locator('#matrixCanvasMount .matrixLeftStatement').nth(7).textContent())||'');
  if(!topCare.includes(careStatement)||!leftCare.includes(careStatement))throw new Error('exact received-support statement must appear on both matrix axes');
  const matrixState=JSON.parse(await page.evaluate(k=>localStorage.getItem(k),RESULT));
  if(matrixState.revisedMostCount!==1)throw new Error('completed session must count the revised MOST trial');
  if(matrixState.choices?.[0]?.mostRevised!==true)throw new Error('revised trial marker missing from completed choice');
  if(!Array.isArray(matrixState.attentionRevisions)||matrixState.attentionRevisions.length!==1)throw new Error('completed result lost first-choice revision history');
  if(matrixState.attentionRevisions[0].originalChoice.slot===matrixState.choices[0].choice.slot)throw new Error('undo smoke did not actually change the first choice');
  const expectedMostRepeats=Object.values(matrixState?.familyStats||{}).filter(x=>x&&((x.chosen===2)||(x.chosen===3))).length;
  if(await page.locator('#matrixCanvasMount .matrixFamily.focus2,#matrixCanvasMount .matrixFamily.focus3').count()!==expectedMostRepeats)throw new Error('matrix must color every raw MOST 3/3 and 2/3 direction');
  if(await page.locator('#matrixFocusValue .matrixRepeatBadge').count()!==expectedMostRepeats)throw new Error('summary must list every raw MOST 3/3 and 2/3 direction');
  if(await page.locator('#matrixCanvasMount .backgroundMarker').count()!==0)throw new Error('LEAST must not render in primary matrix');
  if(await page.locator('#matrixCanvasMount .suffMarker').count()!==0)throw new Error('B result must use orange bands/outline, not a point marker');
  if(await page.locator('#matrixCanvasMount .lowBandCell').count()!==0)throw new Error('orange must not spill across other need cells');
  if(await page.locator('#matrixCanvasMount .lowOwnCell').count()===0)throw new Error('ratings of 3 or lower must mark their own diagonal cells');
  if(await page.locator('#matrixCanvasMount .routeCell').count()!==1)throw new Error('single B+ endpoint must have one strong orange route cell');
  if(await page.locator('#matrixBackgroundLabel').count()!==0)throw new Error('LEAST summary card must be removed from matrix');
  const interpretationText=((await page.locator('#matrixInterpretation').textContent())||'').trim();
  if(!interpretationText.includes('Viena galima interpretacija'))throw new Error('human interpretation title missing');
  if(!interpretationText.includes('Ne diagnozė'))throw new Error('interpretation diagnostic boundary missing');
  if(/tikrasis poreikis|pasąmon/.test(interpretationText.toLowerCase()))throw new Error('forbidden certainty leaked into interpretation');
  const suffSummary=((await page.locator('#matrixSuffValue').textContent())||'').trim();
  if(suffSummary.includes('Jaučiu, kad turiu pakankamai'))throw new Error('B result summary still uses affirmative sufficiency sentence');
  if(!suffSummary)throw new Error('B insufficiency summary missing');
  for(const id of ['#matrixAttentionDetails','#matrixSufficiencyDetails','#matrixPdf','#matrixRestart','#matrixBack2rasi']){
    if(await page.locator(id).count()!==1)throw new Error('matrix result action missing: '+id);
  }
  if(await page.locator('#matrixContinue').count())throw new Error('obsolete matrix continue action still present');
  for(const selector of ['#shipCard','#mapCard','#shipPlaceholder','#mapPlaceholder','#needsMapStage','.resultScene']){
    if(await page.locator(selector).count())throw new Error('obsolete result visual DOM remains: '+selector);
  }

  await page.evaluate(()=>{
    document.documentElement.style.height='auto';
    document.documentElement.style.minHeight='0';
    document.documentElement.style.background='#fff';
    document.documentElement.style.overflow='visible';
    document.body.style.height='auto';
    document.body.style.minHeight='0';
    document.body.style.background='#fff';
    document.body.style.overflow='visible';
    const wrap=document.querySelector('.wrap');
    if(wrap){wrap.style.height='auto';wrap.style.minHeight='0';wrap.style.margin='0'}
    document.body.classList.add('priolensPrintMatrix');
  });
  await page.emulateMedia({media:'print'});
  if(await page.locator('.matrixPrintAppendix').evaluate(el=>getComputedStyle(el).display)==='none')throw new Error('PDF appendix must be visible in print media');
  if(await page.locator('.matrixTopStatement span').first().evaluate(el=>getComputedStyle(el).display)!=='none')throw new Error('PDF matrix must use numbered compact axes instead of repeating full statements');
  if(await page.locator('.matrixDetailActions').evaluate(el=>getComputedStyle(el).display)!=='none')throw new Error('interactive detail actions leaked into PDF');
  const pdfBytes=await page.pdf({format:'A4',landscape:false,printBackground:true,preferCSSPageSize:true});
  const pdfRaw=pdfBytes.toString('latin1');
  const pdfPages=(pdfRaw.match(/\/Type\s*\/Page\b/g)||[]).length;
  if(pdfPages!==1)throw new Error('result PDF must fit on exactly 1 A4 portrait page, got '+pdfPages);
  if(pdfBytes.length<20000)throw new Error('result PDF unexpectedly small');
  await page.emulateMedia({media:'screen'});
  await page.evaluate(()=>{
    document.body.classList.remove('priolensPrintMatrix');
    document.documentElement.removeAttribute('style');
    document.body.removeAttribute('style');
    const wrap=document.querySelector('.wrap');if(wrap)wrap.removeAttribute('style');
  });

  await page.waitForTimeout(100);
  if(!finalPayloads.length)throw new Error('final POST not attempted');
  const final=finalPayloads.at(-1);
  if(final.schema!==SCHEMA)throw new Error('final schema wrong');
  if(final.bankSchema!==BANK)throw new Error('v0.4 changed bank identity');
  if(final.rankProtocol!=='most+least+a-plus+b-plus-v0.4')throw new Error('rankProtocol wrong');
  if(final.choices?.length!==14)throw new Error('raw choices != 14');
  if(!final.attentionClarifier?.selectedFamilyId)throw new Error('final A+ missing');
  if(!final.attentionFocus?.familyId)throw new Error('final attention focus missing');
  const rawFocusCount=final.familyStats?.[final.attentionFocus.familyId]?.chosen;
  if(rawFocusCount!==final.attentionFocus.rawMostCount)throw new Error('A+ mutated raw MOST count');
  if(!final.sufficiencyClarifier?.selectedItemId)throw new Error('final B+ missing');
  if(final.sufficiencyRoute?.itemIds?.length!==1)throw new Error('final B+ route should contain one selected endpoint');
  if(Object.keys(final.sufficiency||{}).length!==12)throw new Error('Channel B item count changed');

  await page.click('#matrixAttentionDetails');
  await page.waitForSelector('#result.active');
  await page.waitForFunction(()=>new URLSearchParams(location.search).get('detail')==='attention');
  if(!(await page.locator('#result').evaluate(el=>el.classList.contains('detailOnlyHost'))))throw new Error('matrix attention detail did not use detail-only host');
  if(await page.locator('.resultScene').count())throw new Error('obsolete result scene reappeared in attention detail flow');
  if(await page.locator('#attentionDetail').evaluate(el=>el.classList.contains('hidden')))throw new Error('attention detail hidden');
  const attentionText=(await page.locator('#attentionDetail').textContent())||'';
  if(/\bMOST\b|\bLEAST\b|\bA\+\b/.test(attentionText))throw new Error('technical A terminology leaked into participant detail: '+attentionText);
  if(await page.locator('#repeatRows img').count())throw new Error('focus exemplars should not be duplicated in the summary block');
  if(await page.locator('#compareRows .reflectionImages img').count()!==3)throw new Error('3/3 focus exemplars must remain visible in the reflection block');
  const reflectionQuestion='Kas, tavo manymu, galėjo traukti šiuose vaizduose?';
  if(attentionText.split(reflectionQuestion).length-1!==1)throw new Error('reflection question must appear exactly once');
  if(!(await page.locator('#attentionResearch .researchParallel').count()))throw new Error('A research parallels missing');
  const firstReason=page.locator('#compareRows .reasonOption').first();
  const expectedReason=((await firstReason.textContent())||'').trim();
  await firstReason.click();
  await page.waitForSelector('#compareRows .reflectionAnswerValue');
  if(((await page.locator('#compareRows .reflectionAnswerValue').textContent())||'').trim()!==expectedReason)throw new Error('selected reflection answer not preserved');
  await page.click('#attentionBack');
  await page.waitForSelector('#matrixResult.active');
  await page.waitForFunction(()=>!new URLSearchParams(location.search).has('detail'));

  await page.click('#matrixSufficiencyDetails');
  await page.waitForSelector('#matrixResult.active');
  await page.waitForFunction(()=>new URLSearchParams(location.search).get('detail')==='sufficiency');
  if(!(await page.locator('#suffDetail').evaluate(el=>el.parentElement===document.body)))throw new Error('B detail must be portaled to document.body, outside the transformed matrix');
  if(await page.locator('#suffDetail').evaluate(el=>el.classList.contains('hidden')))throw new Error('sufficiency detail hidden');
  const overlayMetrics=await page.locator('#suffDetail').evaluate(el=>{
    const r=el.getBoundingClientRect(),cs=getComputedStyle(el);
    return {top:r.top,bottom:r.bottom,left:r.left,right:r.right,width:r.width,height:r.height,viewportW:innerWidth,viewportH:innerHeight,position:cs.position,display:cs.display,bodyLocked:document.body.classList.contains('suffSheetOpen')};
  });
  if(overlayMetrics.position!=='fixed'||overlayMetrics.display==='none')throw new Error('B detail overlay is not a visible fixed viewport layer: '+JSON.stringify(overlayMetrics));
  if(Math.abs(overlayMetrics.top)>1||Math.abs(overlayMetrics.bottom-overlayMetrics.viewportH)>1||Math.abs(overlayMetrics.left)>1||Math.abs(overlayMetrics.right-overlayMetrics.viewportW)>1)throw new Error('B detail overlay does not cover the visible viewport: '+JSON.stringify(overlayMetrics));
  if(!overlayMetrics.bodyLocked)throw new Error('B detail must lock background scroll while open');
  if(!(await page.locator('#matrixCanvasMount').evaluate(el=>getComputedStyle(el).display!=='none')))throw new Error('matrix must remain visible behind B detail');
  const suffText=(await page.locator('#suffDetail').textContent())||'';
  if(/\bB\+\b|Channel B/.test(suffText))throw new Error('technical B terminology leaked into participant detail: '+suffText);
  if(!suffText.includes('Kaip ši pakankamumo sritis buvo išskirta?'))throw new Error('sufficiency provenance heading missing');
  if(!suffText.includes('mažiausiai pakankama'))throw new Error('single-route sufficiency-method note missing');
  if(!(await page.locator('#suffResearch .researchParallel').count()))throw new Error('B research parallels missing');
  const sheetMetrics=await page.locator('#suffDetail .suffSheet').evaluate(el=>{
    const r=el.getBoundingClientRect(),cs=getComputedStyle(el);
    return {bottom:r.bottom,viewport:window.innerHeight,clientHeight:el.clientHeight,scrollHeight:el.scrollHeight,overflowY:cs.overflowY,paddingBottom:parseFloat(cs.paddingBottom)||0};
  });
  if(sheetMetrics.bottom>sheetMetrics.viewport+1)throw new Error('B detail sheet extends below the visible viewport: '+JSON.stringify(sheetMetrics));
  if(!['auto','scroll'].includes(sheetMetrics.overflowY))throw new Error('B detail sheet must scroll internally when content grows');
  await page.locator('#suffResearch .researchParallel summary').click();
  await page.locator('#suffDetail .suffSheet').evaluate(el=>el.scrollTo(0,el.scrollHeight));
  await page.waitForTimeout(80);
  const bottomReach=await page.locator('#suffDetail .suffSheet').evaluate(el=>{
    const sheet=el.getBoundingClientRect();
    const last=el.querySelector('#suffResearch');
    const target=last?.getBoundingClientRect();
    return {sheetBottom:sheet.bottom,targetBottom:target?.bottom??sheet.bottom,paddingBottom:parseFloat(getComputedStyle(el).paddingBottom)||0};
  });
  if(bottomReach.targetBottom>bottomReach.sheetBottom-bottomReach.paddingBottom+2)throw new Error('B detail bottom content is not fully reachable above the sheet safe padding: '+JSON.stringify(bottomReach));
  await page.click('#suffDetailClose');
  await page.waitForSelector('#matrixResult.active');
  await page.waitForFunction(()=>!new URLSearchParams(location.search).has('detail'));
  if(!(await page.locator('#suffDetail').evaluate(el=>el.classList.contains('hidden'))))throw new Error('B detail remained visible after Close');
  if(await page.evaluate(()=>document.body.classList.contains('suffSheetOpen')))throw new Error('B detail Close left the page scroll-locked');

  // Android/browser Back must close the sheet and unlock the matrix, not freeze the page.
  await page.click('#matrixSufficiencyDetails');
  await page.waitForFunction(()=>new URLSearchParams(location.search).get('detail')==='sufficiency');
  if(!(await page.evaluate(()=>document.body.classList.contains('suffSheetOpen'))))throw new Error('B detail did not lock before browser-back regression check');
  await page.goBack();
  await page.waitForFunction(()=>!new URLSearchParams(location.search).has('detail'));
  await page.waitForSelector('#matrixResult.active');
  if(!(await page.locator('#suffDetail').evaluate(el=>el.classList.contains('hidden'))))throw new Error('browser Back left B detail visible');
  if(await page.evaluate(()=>document.body.classList.contains('suffSheetOpen')))throw new Error('browser Back left the page scroll-locked');

  // An accidentally open detail must be sanitized before print and must not freeze the page after returning.
  await page.click('#matrixSufficiencyDetails');
  await page.waitForFunction(()=>new URLSearchParams(location.search).get('detail')==='sufficiency');
  await page.emulateMedia({media:'print'});
  const printRegression=await page.evaluate(async()=>{
    const originalPrint=window.print;
    let during=null;
    window.print=()=>{
      const d=document.getElementById('suffDetail');
      during={
        locked:document.body.classList.contains('suffSheetOpen'),
        detail:new URLSearchParams(location.search).get('detail'),
        hidden:d?.classList.contains('hidden')??false,
        display:d?getComputedStyle(d).display:null,
        printClass:document.body.classList.contains('priolensPrintMatrix')
      };
    };
    const mod=await import('./result_matrix_v04.mjs?print-regression=1');
    mod.printResultReportV04();
    await new Promise(r=>setTimeout(r,120));
    if(typeof window.onafterprint==='function')window.onafterprint();
    const d=document.getElementById('suffDetail');
    const after={
      locked:document.body.classList.contains('suffSheetOpen'),
      detail:new URLSearchParams(location.search).get('detail'),
      hidden:d?.classList.contains('hidden')??false,
      printClass:document.body.classList.contains('priolensPrintMatrix')
    };
    window.print=originalPrint;
    return {during,after};
  });
  if(!printRegression.during||printRegression.during.locked||printRegression.during.detail!==null||!printRegression.during.hidden||printRegression.during.display!=='none'||!printRegression.during.printClass)throw new Error('print did not sanitize open B detail before PDF: '+JSON.stringify(printRegression));
  if(printRegression.after.locked||printRegression.after.detail!==null||!printRegression.after.hidden||printRegression.after.printClass)throw new Error('return from print left stale B detail or scroll lock: '+JSON.stringify(printRegression));
  await page.emulateMedia({media:'screen'});
  await page.waitForSelector('#matrixResult.active');

  if(await page.evaluate(k=>localStorage.getItem(k),DRAFT)!==null)throw new Error('v0.4 draft not cleared after successful final save');
  const storedResult=JSON.parse(await page.evaluate(k=>localStorage.getItem(k),RESULT));
  if(!storedResult?.completedAt||storedResult?.submission?.ok!==true)throw new Error('completed result snapshot missing after successful final save');
  const finalPostCountBeforeReload=finalPayloads.length;
  const focusSummaryBefore=((await page.locator('#matrixFocusValue').textContent())||'').trim();
  const suffSummaryBefore=((await page.locator('#matrixSuffValue').textContent())||'').trim();

  await page.reload({waitUntil:'networkidle'});
  await page.waitForSelector('#matrixResult.active');
  if(((await page.locator('#matrixFocusValue').textContent())||'').trim()!==focusSummaryBefore)throw new Error('restored matrix focus changed after reload');
  if(((await page.locator('#matrixSuffValue').textContent())||'').trim()!==suffSummaryBefore)throw new Error('restored matrix sufficiency summary changed after reload');
  if(finalPayloads.length!==finalPostCountBeforeReload)throw new Error('restoring a completed result must not POST the final session again');

  // Synthetic A+ no-clear: repeated MOST must remain visible in A detail.
  await page.evaluate(k=>{
    const x=JSON.parse(localStorage.getItem(k));
    x.attentionResolution={...(x.attentionResolution||{}),source:'A_PLUS_NO_CLEAR',focus:null,clarifierRequired:false,clarifier:{...(x.attentionResolution?.clarifier||{}),selectedFamilyId:null,noClear:true}};
    x.attentionFocus=null;
    x.attentionClarifier={...(x.attentionClarifier||{}),selectedFamilyId:null,noClear:true};
    localStorage.setItem(k,JSON.stringify(x));
  },RESULT);
  await page.reload({waitUntil:'networkidle'});
  await page.waitForSelector('#matrixResult.active');
  const noClearRepeats=await page.locator('#matrixCanvasMount .matrixFamily.focus2,#matrixCanvasMount .matrixFamily.focus3').count();
  if(noClearRepeats<2)throw new Error('synthetic no-clear state must retain multiple repeated MOST directions in matrix');
  await page.click('#matrixAttentionDetails');
  await page.waitForSelector('#result.active');
  if(await page.locator('#repeatRows .repeatedMostDetail').count()!==noClearRepeats)throw new Error('A no-clear detail must preserve every 3/3 and 2/3 repeated MOST direction');
  if(await page.locator('#compareLabel').evaluate(el=>!el.classList.contains('hidden')))throw new Error('self-explanation prompt must stay hidden when A+ did not single out one direction');
  await page.click('#attentionBack');
  await page.waitForSelector('#matrixResult.active');

  // Synthetic restore checks now target matrix endpoint preservation, not the deactivated ship/map scene.
  await page.evaluate(k=>{
    const x=JSON.parse(localStorage.getItem(k));
    x.sufficiencyRoute={source:'B_PLUS_SIMILAR',itemIds:['MEANING_PURPOSE','CONTRIBUTION'],minimumValue:2};
    localStorage.setItem(k,JSON.stringify(x));
  },RESULT);
  await page.reload({waitUntil:'networkidle'});
  await page.waitForSelector('#matrixResult.active');
  if(await page.locator('#matrixCanvasMount .routeCell').count()!==2)throw new Error('two valid tied B endpoints must both remain visible as orange route cells');

  await page.evaluate(k=>{
    const x=JSON.parse(localStorage.getItem(k));
    x.sufficiencyRoute={source:'B_PLUS_SIMILAR',itemIds:['RESTORATION_ENERGY','AUTONOMY_AGENCY','MEANING_PURPOSE'],minimumValue:2};
    localStorage.setItem(k,JSON.stringify(x));
  },RESULT);
  await page.reload({waitUntil:'networkidle'});
  await page.waitForSelector('#matrixResult.active');
  if(await page.locator('#matrixCanvasMount .routeCell').count()!==3)throw new Error('three valid tied B endpoints must all remain visible as orange route cells');
  if(finalPayloads.length!==finalPostCountBeforeReload)throw new Error('visual restore-state checks must not POST final session again');

  await page.click('#matrixRestart');
  await page.waitForSelector('#intro.active');
  if(await page.evaluate(k=>localStorage.getItem(k),RESULT)!==null)throw new Error('Atlikti dar kartą did not clear completed result snapshot');

  const keys=await page.evaluate(()=>Object.keys(localStorage));
  if(keys.some(k=>k.includes('priolens.open14.v031.rank.draft')))throw new Error('v0.3.1 draft namespace leaked into v0.4');

  console.log('PASS: v0.4 local 390x844 matrix-primary result + no obsolete result scene + preserved A/B details + multi-endpoint restore');
} finally {
  await browser.close();
}
