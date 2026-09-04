import { chromium } from 'playwright';

const BASE=process.env.PRIOLENS_V04_BASE||'https://omesg360.eu/priolens-open14-v04/';
const RESULT='priolens.open14.v04.last-result.lt';
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

  await page.waitForSelector('#result.active');
  await page.waitForFunction(()=>document.querySelector('#saveStatus')?.classList.contains('ok'),null,{timeout:15000});
  await page.waitForSelector('#shipCard');
  await page.waitForSelector('#mapCard');
  await page.waitForSelector('#shipDetailsButton');
  await page.waitForSelector('#mapDetailsButton');
  await page.waitForSelector('.resultScene');
  if(await page.locator('.worldRenderError').count()) throw new Error('result error boundary is visible');
  const continents=await page.locator('#needsMapStage .continent').count();
  if(continents!==0) throw new Error('no-route map should not render inactive continents, got: '+continents);
  const needNodes=await page.locator('#needsMapStage .needNode').count();
  if(needNodes!==0) throw new Error('no-route map should not render inactive need locations, got: '+needNodes);
  if(await page.locator('#needsMapStage .mapEmpty').count()!==1) throw new Error('no-route map should render one compact empty-state message');
  const shipFocus=((await page.locator('#shipFocus').textContent())||'').trim();
  const mapRoute=((await page.locator('#mapRoute').textContent())||'').trim();
  if(!shipFocus) throw new Error('ship focus summary is empty');
  if(mapRoute!=='Aiškaus maršruto nėra') throw new Error('all-5 Channel B should render no route, got: '+mapRoute);
  if(await page.locator('#needsMapStage .routeTarget').count()!==0) throw new Error('all-5 Channel B must not mark route targets');
  const resultText=((await page.locator('#result').textContent())||'');
  if(resultText.includes('Ką matai, kai palygini abu?')) throw new Error('legacy automatic A/B comparison still visible');
  await page.locator('#shipDetailsButton').focus();
  await page.keyboard.press('Enter');
  await page.waitForFunction(()=>new URLSearchParams(location.search).get('detail')==='attention');
  if(!(await page.locator('#result').evaluate(el=>el.classList.contains('detailMode')))) throw new Error('attention detail route did not enter detail mode');
  if(await page.locator('#attentionDetail').evaluate(el=>el.classList.contains('hidden'))) throw new Error('attention detail route hidden');
  if(!(await page.locator('.resultScene').evaluate(el=>getComputedStyle(el).display==='none'))) throw new Error('main scene still visible on attention detail route');
  const attentionText=((await page.locator('#attentionDetail').textContent())||'');
  if(await page.locator('#repeatRows img').count()) throw new Error('live focus exemplars duplicated in summary block');
  const reflectionQuestion='Kas, tavo manymu, galėjo traukti šiuose vaizduose?';
  if(attentionText.split(reflectionQuestion).length-1!==1) throw new Error('live reflection question is duplicated');
  const reflectionBeforeBackground=await page.evaluate(()=>{
    const a=document.getElementById('compareHeading'),b=document.getElementById('leastHeading');
    return Boolean(a.compareDocumentPosition(b)&Node.DOCUMENT_POSITION_FOLLOWING);
  });
  if(!reflectionBeforeBackground) throw new Error('live background detail appears before the reflection block');
  const firstReason=page.locator('#compareRows .reasonOption').first();
  if(await firstReason.count()){
    const expected=((await firstReason.textContent())||'').trim();
    await firstReason.click();
    await page.waitForSelector('#compareRows .reflectionAnswerValue');
    const actual=((await page.locator('#compareRows .reflectionAnswerValue').textContent())||'').trim();
    if(actual!==expected) throw new Error('live collapsed reflection answer missing: '+actual);
    const color=await page.locator('#compareRows .reflectionAnswerValue').evaluate(el=>getComputedStyle(el).color);
    if(color==='rgb(255, 255, 255)'||color==='white') throw new Error('live collapsed reflection answer is white on white');
  }
  await page.click('#attentionBack');
  await page.waitForFunction(()=>!new URLSearchParams(location.search).has('detail'));
  if(await page.locator('#result').evaluate(el=>el.classList.contains('detailMode'))) throw new Error('attention back did not restore result scene');

  await page.locator('#mapDetailsButton').focus();
  await page.keyboard.press('Space');
  await page.waitForFunction(()=>new URLSearchParams(location.search).get('detail')==='sufficiency');
  if(await page.locator('#suffDetail').evaluate(el=>el.classList.contains('hidden'))) throw new Error('sufficiency bottom sheet hidden');
  if(await page.locator('#result').evaluate(el=>el.classList.contains('detailMode'))) throw new Error('sufficiency detail must not replace the main result scene');
  if(await page.locator('.resultScene').evaluate(el=>getComputedStyle(el).display==='none')) throw new Error('main result scene hidden behind sufficiency bottom sheet');
  const suffText=(await page.locator('#suffDetail').textContent())||'';
  if(/\bB\+\b|Channel B/.test(suffText)) throw new Error('technical B terminology leaked into participant detail');
  if(suffText.includes('Kodėl ši kryptis?')) throw new Error('live old direction wording remains');
  if(mapRoute!=='Aiškaus maršruto nėra'&&!suffText.includes('Kaip ši poreikio sritis buvo išskirta?')) throw new Error('live need-area provenance heading missing for a concrete route');
  if(mapRoute==='Aiškaus maršruto nėra'&&suffText.includes('Kaip ši poreikio sritis buvo išskirta?')) throw new Error('no-route detail should not imply that one need area was singled out');
  await page.goBack();
  await page.waitForFunction(()=>!new URLSearchParams(location.search).has('detail'));
  if(await page.locator('#result').evaluate(el=>el.classList.contains('detailMode'))) throw new Error('browser Back did not restore result scene');
  const draftKeys=await page.evaluate(()=>Object.keys(localStorage).filter(k=>k.includes('priolens.open14.v04.rank.draft')));
  if(draftKeys.length) throw new Error('v0.4 draft not cleared after successful live save');
  const storedResult=JSON.parse(await page.evaluate(k=>localStorage.getItem(k),RESULT));
  if(!storedResult?.completedAt||storedResult?.submission?.ok!==true) throw new Error('completed result snapshot missing after successful live save');
  const focusBeforeReload=((await page.locator('#shipFocus').textContent())||'').trim();
  const routeBeforeReload=((await page.locator('#mapRoute').textContent())||'').trim();

  await page.reload({waitUntil:'networkidle'});
  await page.waitForSelector('#result.active');
  if(((await page.locator('#shipFocus').textContent())||'').trim()!==focusBeforeReload) throw new Error('live restored focus changed after reload');
  if(((await page.locator('#mapRoute').textContent())||'').trim()!==routeBeforeReload) throw new Error('live restored route changed after reload');
  const restoredStatus=((await page.locator('#saveStatus').textContent())||'').trim();
  if(!restoredStatus.includes('atkurta')) throw new Error('live result did not restore after reload: '+restoredStatus);

  console.log('PASS: deployed v0.4 final IA candidate + no duplicate focus images + need-area wording + reflection hierarchy + reload restore + isolated live API');
} finally {
  await browser.close();
}
