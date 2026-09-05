import { chromium } from 'playwright';

const BASE=process.env.PRIOLENS_V04_BASE||'https://omesg360.eu/priolens-open14-v04/';
const RESULT='priolens.open14.v041.last-result.lt';
const browser=await chromium.launch({headless:true});
try{
  const context=await browser.newContext({viewport:{width:390,height:844}});
  const page=await context.newPage();
  await page.goto(BASE+'?lang=lt&from=lt&systemSmoke=1',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.querySelector('#start')&&!document.querySelector('#start').disabled);
  await page.click('#start');
  await page.waitForSelector('#trial.active');

  for(let i=0;i<14;i++){
    await page.click('.stim[data-slot="0"]');
    await page.waitForFunction(()=>document.querySelector('#tieLeast')&&!document.querySelector('#tieLeast').classList.contains('hidden'));
    await page.click('.stim[data-slot="1"]');
    if(i<13){
      const next=`${i+2} / 14`;
      await page.waitForFunction(next=>document.querySelector('#counter')?.textContent?.trim()===next,next);
    }
  }

  await page.waitForFunction(()=>{
    return document.querySelector('#aplus')?.classList.contains('active') ||
           document.querySelector('#suff')?.classList.contains('active');
  });
  if(await page.locator('#aplus').evaluate(el=>el.classList.contains('active'))){
    const cards=page.locator('#aPlusMount .clarifyCard');
    if(await cards.count()<2) throw new Error('A+ active but multiple cards missing');
    await cards.first().click();
    await page.waitForSelector('#suff.active');
  }

  for(let d=1;d<=6;d++){
    const ranges=page.locator('#domainMount input[type="range"]');
    if(await ranges.count()!==2) throw new Error('Channel B page must have 2 items');
    for(let i=0;i<2;i++){
      await ranges.nth(i).evaluate(el=>{
        el.value='5';
        el.dispatchEvent(new Event('input',{bubbles:true}));
        el.dispatchEvent(new Event('change',{bubbles:true}));
      });
    }
    await page.click('#suffNext');
    if(d<6) await page.waitForFunction(n=>document.querySelector('#suffCount')?.textContent?.trim()===`${n} / 6`,d+1);
  }

  await page.waitForSelector('#matrixResult.active');
  if(await page.locator('#matrixCanvasMount .matrixDataCell').count()!==144) throw new Error('live matrix must contain 12x12 data cells');
  if(await page.locator('#matrixCanvasMount .matrixTopStatement').count()!==12||await page.locator('#matrixCanvasMount .matrixLeftStatement').count()!==12) throw new Error('live matrix axes must contain all 12 statements');
  const liveMatrixSnapshot=JSON.parse(await page.evaluate(k=>localStorage.getItem(k),RESULT));
  const expectedMostRepeats=Object.values(liveMatrixSnapshot?.familyStats||{}).filter(x=>x&&((x.chosen===2)||(x.chosen===3))).length;
  if(await page.locator('#matrixCanvasMount .matrixFamily.focus2,#matrixCanvasMount .matrixFamily.focus3').count()!==expectedMostRepeats) throw new Error('live matrix must highlight every raw MOST 3/3 and 2/3 direction');
  if(await page.locator('#matrixFocusValue .matrixRepeatBadge').count()!==expectedMostRepeats) throw new Error('live matrix summary must list every raw MOST 3/3 and 2/3 direction');
  if(await page.locator('#matrixCanvasMount .backgroundMarker').count()!==0) throw new Error('live matrix must not render LEAST point markers');
  if(await page.locator('#matrixCanvasMount .suffMarker').count()!==0) throw new Error('live matrix must not render B point markers');
  if(await page.locator('#matrixCanvasMount .lowBandCell').count()!==0) throw new Error('orange must never spill across other need cells');
  if(await page.locator('#matrixCanvasMount .lowOwnCell').count()!==0) throw new Error('all-5 Channel B must not render orange own-diagonal cells');
  if(await page.locator('#matrixCanvasMount .routeCell').count()!==0) throw new Error('all-5 Channel B must not render an insufficiency route cell');
  if(await page.locator('#matrixBackgroundLabel').count()!==0) throw new Error('LEAST summary card must be absent in live matrix');
  const interpretationText=((await page.locator('#matrixInterpretation').textContent())||'').trim();
  if(!interpretationText.includes('Viena galima interpretacija')) throw new Error('live human interpretation title missing');
  if(!interpretationText.includes('Ne diagnozė')) throw new Error('live interpretation diagnostic boundary missing');
  for(const id of ['#matrixAttentionDetails','#matrixSufficiencyDetails','#matrixPdf','#matrixRestart','#matrixBack2rasi']){
    if(await page.locator(id).count()!==1) throw new Error('live matrix action missing: '+id);
  }
  if(await page.locator('#matrixContinue').count()) throw new Error('legacy continue-to-ship/map action still present');
  await page.waitForFunction(k=>{
    try{return JSON.parse(localStorage.getItem(k))?.submission?.ok===true}catch{return false}
  },RESULT,{timeout:15000});

  await page.click('#matrixAttentionDetails');
  await page.waitForSelector('#result.active');
  await page.waitForFunction(()=>new URLSearchParams(location.search).get('detail')==='attention');
  if(!(await page.locator('#result').evaluate(el=>el.classList.contains('detailOnlyHost')))) throw new Error('live attention detail not hosted in detail-only mode');
  if(!(await page.locator('.resultScene').evaluate(el=>getComputedStyle(el).display==='none'))) throw new Error('ship/map scene visible in live attention detail');
  if(await page.locator('#attentionDetail').evaluate(el=>el.classList.contains('hidden'))) throw new Error('live attention detail hidden');
  const attentionText=((await page.locator('#attentionDetail').textContent())||'');
  if(/\bMOST\b|\bLEAST\b|\bA\+\b/.test(attentionText)) throw new Error('technical A terminology leaked into live detail');
  const firstReason=page.locator('#compareRows .reasonOption').first();
  if(await firstReason.count()){
    const expected=((await firstReason.textContent())||'').trim();
    await firstReason.click();
    await page.waitForSelector('#compareRows .reflectionAnswerValue');
    if(((await page.locator('#compareRows .reflectionAnswerValue').textContent())||'').trim()!==expected) throw new Error('live reflection answer was not preserved');
  }
  await page.click('#attentionBack');
  await page.waitForSelector('#matrixResult.active');
  await page.waitForFunction(()=>!new URLSearchParams(location.search).has('detail'));

  await page.click('#matrixSufficiencyDetails');
  await page.waitForSelector('#matrixResult.active');
  await page.waitForFunction(()=>new URLSearchParams(location.search).get('detail')==='sufficiency');
  if(!(await page.locator('#suffDetail').evaluate(el=>el.parentElement===document.body))) throw new Error('live B detail must be portaled to document.body outside transformed matrix');
  if(await page.locator('#suffDetail').evaluate(el=>el.classList.contains('hidden'))) throw new Error('live sufficiency detail hidden');
  const liveOverlay=await page.locator('#suffDetail').evaluate(el=>{
    const r=el.getBoundingClientRect(),cs=getComputedStyle(el);
    return {top:r.top,bottom:r.bottom,left:r.left,right:r.right,viewportW:innerWidth,viewportH:innerHeight,position:cs.position,locked:document.body.classList.contains('suffSheetOpen')};
  });
  if(liveOverlay.position!=='fixed'||Math.abs(liveOverlay.top)>1||Math.abs(liveOverlay.bottom-liveOverlay.viewportH)>1||Math.abs(liveOverlay.left)>1||Math.abs(liveOverlay.right-liveOverlay.viewportW)>1||!liveOverlay.locked) throw new Error('live B detail is not a fixed visible viewport sheet: '+JSON.stringify(liveOverlay));
  if(!(await page.locator('#matrixCanvasMount').evaluate(el=>getComputedStyle(el).display!=='none'))) throw new Error('live matrix must remain visible behind B detail');
  const suffText=(await page.locator('#suffDetail').textContent())||'';
  if(/\bB\+\b|Channel B/.test(suffText)) throw new Error('technical B terminology leaked into live detail');
  if(suffText.includes('Kaip ši pakankamumo sritis buvo išskirta?')) throw new Error('no-route detail should not imply that one area was singled out');
  if(!(await page.locator('#suffResearch .researchParallel').count())) throw new Error('live B research parallels missing');
  await page.click('#suffDetailClose');
  await page.waitForSelector('#matrixResult.active');
  await page.waitForFunction(()=>!new URLSearchParams(location.search).has('detail'));
  if(await page.evaluate(()=>document.body.classList.contains('suffSheetOpen'))) throw new Error('live B detail Close left body scroll-locked');

  await page.click('#matrixSufficiencyDetails');
  await page.waitForFunction(()=>new URLSearchParams(location.search).get('detail')==='sufficiency');
  await page.goBack();
  await page.waitForFunction(()=>!new URLSearchParams(location.search).has('detail'));
  await page.waitForSelector('#matrixResult.active');
  if(!(await page.locator('#suffDetail').evaluate(el=>el.classList.contains('hidden')))) throw new Error('live browser Back left B detail visible');
  if(await page.evaluate(()=>document.body.classList.contains('suffSheetOpen'))) throw new Error('live browser Back left body scroll-locked');

  const draftKeys=await page.evaluate(()=>Object.keys(localStorage).filter(k=>k.includes('priolens.open14.v041.rank.draft')));
  if(draftKeys.length) throw new Error('v0.4 draft not cleared after successful live save');
  const storedResult=JSON.parse(await page.evaluate(k=>localStorage.getItem(k),RESULT));
  if(!storedResult?.completedAt||storedResult?.submission?.ok!==true) throw new Error('completed result snapshot missing after successful live save');
  if(storedResult?.sufficiencySchema!=='2rasi.priolens.sufficiency-v0.3') throw new Error('live result missing revised sufficiency schema');
  const focusBeforeReload=((await page.locator('#matrixFocusValue').textContent())||'').trim();
  const suffBeforeReload=((await page.locator('#matrixSuffValue').textContent())||'').trim();

  await page.reload({waitUntil:'networkidle'});
  await page.waitForSelector('#matrixResult.active');
  if(((await page.locator('#matrixFocusValue').textContent())||'').trim()!==focusBeforeReload) throw new Error('live restored matrix focus changed after reload');
  if(((await page.locator('#matrixSuffValue').textContent())||'').trim()!==suffBeforeReload) throw new Error('live restored matrix sufficiency summary changed after reload');

  console.log('PASS: deployed v0.4 matrix-primary result + hidden ship/map + preserved detail views + reload restore + isolated live API');
} finally {
  await browser.close();
}
