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
  const matrixText=(await page.locator('#matrixResult').textContent())||'';
  if(matrixText.split(careStatement).length-1!==2)throw new Error('exact received-support statement must appear on both matrix axes');
  if(await page.locator('#matrixCanvasMount .focusMarker').count()!==1)throw new Error('matrix must render one resolved first-glance focus marker');
  if(await page.locator('#matrixCanvasMount .suffMarker').count()!==1)throw new Error('single B+ endpoint must render one matrix sufficiency marker');
  for(const id of ['#matrixAttentionDetails','#matrixSufficiencyDetails','#matrixPdf','#matrixRestart','#matrixBack2rasi']){
    if(await page.locator(id).count()!==1)throw new Error('matrix result action missing: '+id);
  }
  if(await page.locator('#matrixContinue').count())throw new Error('legacy continue-to-ship/map action still present');
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
  if(!(await page.locator('.resultScene').evaluate(el=>getComputedStyle(el).display==='none')))throw new Error('ship/map scene visible behind matrix attention detail');
  if(await page.locator('#attentionDetail').evaluate(el=>el.classList.contains('hidden')))throw new Error('attention detail hidden');
  const attentionText=(await page.locator('#attentionDetail').textContent())||'';
  if(/\bMOST\b|\bLEAST\b|\bA\+\b/.test(attentionText))throw new Error('technical A terminology leaked into participant detail: '+attentionText);
  if(await page.locator('#repeatRows img').count())throw new Error('focus exemplars should not be duplicated in the summary block');
  if(await page.locator('#compareRows .reflectionImages img').count()!==3)throw new Error('3/3 focus exemplars must remain visible in the reflection block');
  const reflectionQuestion='Kas, tavo manymu, galėjo traukti šiuose vaizduose?';
  if(attentionText.split(reflectionQuestion).length-1!==1)throw new Error('reflection question must appear exactly once');
  const firstReason=page.locator('#compareRows .reasonOption').first();
  const expectedReason=((await firstReason.textContent())||'').trim();
  await firstReason.click();
  await page.waitForSelector('#compareRows .reflectionAnswerValue');
  if(((await page.locator('#compareRows .reflectionAnswerValue').textContent())||'').trim()!==expectedReason)throw new Error('selected reflection answer not preserved');
  await page.click('#attentionBack');
  await page.waitForSelector('#matrixResult.active');
  await page.waitForFunction(()=>!new URLSearchParams(location.search).has('detail'));

  await page.click('#matrixSufficiencyDetails');
  await page.waitForSelector('#result.active');
  await page.waitForFunction(()=>new URLSearchParams(location.search).get('detail')==='sufficiency');
  if(!(await page.locator('#result').evaluate(el=>el.classList.contains('detailOnlyHost'))))throw new Error('matrix sufficiency detail did not use detail-only host');
  if(!(await page.locator('.resultScene').evaluate(el=>getComputedStyle(el).display==='none')))throw new Error('ship/map scene visible behind matrix sufficiency detail');
  if(await page.locator('#suffDetail').evaluate(el=>el.classList.contains('hidden')))throw new Error('sufficiency detail hidden');
  const suffText=(await page.locator('#suffDetail').textContent())||'';
  if(/\bB\+\b|Channel B/.test(suffText))throw new Error('technical B terminology leaked into participant detail: '+suffText);
  if(!suffText.includes('Kaip ši pakankamumo sritis buvo išskirta?'))throw new Error('sufficiency provenance heading missing');
  if(!suffText.includes('mažiausiai pakankama'))throw new Error('single-route sufficiency-method note missing');
  await page.click('#suffDetailClose');
  await page.waitForSelector('#matrixResult.active');
  await page.waitForFunction(()=>!new URLSearchParams(location.search).has('detail'));

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

  // Synthetic restore checks now target matrix endpoint preservation, not the deactivated ship/map scene.
  await page.evaluate(k=>{
    const x=JSON.parse(localStorage.getItem(k));
    x.sufficiencyRoute={source:'B_PLUS_SIMILAR',itemIds:['MEANING_PURPOSE','CONTRIBUTION'],minimumValue:2};
    localStorage.setItem(k,JSON.stringify(x));
  },RESULT);
  await page.reload({waitUntil:'networkidle'});
  await page.waitForSelector('#matrixResult.active');
  if(await page.locator('#matrixCanvasMount .suffMarker').count()!==2)throw new Error('two valid tied B endpoints must both remain visible in matrix');

  await page.evaluate(k=>{
    const x=JSON.parse(localStorage.getItem(k));
    x.sufficiencyRoute={source:'B_PLUS_SIMILAR',itemIds:['RESTORATION_ENERGY','AUTONOMY_AGENCY','MEANING_PURPOSE'],minimumValue:2};
    localStorage.setItem(k,JSON.stringify(x));
  },RESULT);
  await page.reload({waitUntil:'networkidle'});
  await page.waitForSelector('#matrixResult.active');
  if(await page.locator('#matrixCanvasMount .suffMarker').count()!==3)throw new Error('three valid tied B endpoints must all remain visible in matrix');
  if(finalPayloads.length!==finalPostCountBeforeReload)throw new Error('visual restore-state checks must not POST final session again');

  await page.click('#matrixRestart');
  await page.waitForSelector('#intro.active');
  if(await page.evaluate(k=>localStorage.getItem(k),RESULT)!==null)throw new Error('Atlikti dar kartą did not clear completed result snapshot');

  const keys=await page.evaluate(()=>Object.keys(localStorage));
  if(keys.some(k=>k.includes('priolens.open14.v031.rank.draft')))throw new Error('v0.3.1 draft namespace leaked into v0.4');

  console.log('PASS: v0.4 local 390x844 matrix-primary result + hidden ship/map + preserved A/B details + multi-endpoint restore');
} finally {
  await browser.close();
}
