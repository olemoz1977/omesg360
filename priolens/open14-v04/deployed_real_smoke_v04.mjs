import { chromium } from 'playwright';

const BASE=process.env.PRIOLENS_V04_BASE||'https://omesg360.eu/priolens-open14-v04/';
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
  await page.waitForSelector('.resultScene');
  const continents=await page.locator('#needsMapStage .continent').count();
  if(continents!==6) throw new Error('needs map must render 6 continents, got: '+continents);
  const needNodes=await page.locator('#needsMapStage .needNode').count();
  if(needNodes!==12) throw new Error('needs map must render 12 need locations, got: '+needNodes);
  const shipFocus=((await page.locator('#shipFocus').textContent())||'').trim();
  const mapRoute=((await page.locator('#mapRoute').textContent())||'').trim();
  if(!shipFocus) throw new Error('ship focus summary is empty');
  if(mapRoute!=='Aiškaus maršruto nėra') throw new Error('all-5 Channel B should render no route, got: '+mapRoute);
  if(await page.locator('#needsMapStage .routeTarget').count()!==0) throw new Error('all-5 Channel B must not mark route targets');
  const resultText=((await page.locator('#result').textContent())||'');
  if(resultText.includes('Ką matai, kai palygini abu?')) throw new Error('legacy automatic A/B comparison still visible');
  await page.click('#shipCard');
  if(await page.locator('#attentionDetail').evaluate(el=>el.classList.contains('hidden'))) throw new Error('ship detail did not open');
  await page.click('#mapCard');
  if(await page.locator('#suffDetail').evaluate(el=>el.classList.contains('hidden'))) throw new Error('map detail did not open');
  const draftKeys=await page.evaluate(()=>Object.keys(localStorage).filter(k=>k.includes('priolens.open14.v04.rank.draft')));
  if(draftKeys.length) throw new Error('v0.4 draft not cleared after successful live save');
  console.log('PASS: deployed v0.4 unified ship-water-map scene + 6x12 needs map + details + isolated live API');
} finally {
  await browser.close();
}
