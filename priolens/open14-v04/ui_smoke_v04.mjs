import { chromium } from 'playwright';
import { buildOpen14Plan, FAMILY_SET } from './p3_open14_planner_v02.mjs';

const BASE=process.env.PRIOLENS_V04_BASE||'http://127.0.0.1:8765/';
const SCHEMA='2rasi.priolens.open14.rank-session-v0.4';
const BANK='2rasi.priolens.open14.bank-v0.3.1';
const DRAFT='priolens.open14.v04.rank.draft.lt';
const RESULT='priolens.open14.v04.last-result.lt';
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
    progressPayloads.push(body);
    await route.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"saved":true,"submissionId":"V04-LOCAL"}'});
  });
  await page.route('**/priolens-open14-v04-api/api.php',async route=>{
    const body=JSON.parse(route.request().postData()||'{}');
    if(body.schema!==SCHEMA)throw new Error('final schema != v0.4');
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

  await page.waitForSelector('#result.active');
  await page.waitForFunction(()=>document.querySelector('#saveStatus')&&!document.querySelector('#saveStatus').textContent.includes('tikrinamas'),null,{timeout:10000});
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
  const routeContinents=await page.locator('#needsMapStage .continent').count();
  const routeNodes=await page.locator('#needsMapStage .needNode').count();
  if(routeContinents!==1)throw new Error('single B+ endpoint should render one route-relevant continent, got '+routeContinents);
  if(routeNodes!==1)throw new Error('single B+ endpoint should render one need node, got '+routeNodes);
  await page.waitForFunction(()=>document.querySelectorAll('#needsMapStage .routePath').length===1);
  if(await page.locator('#needsMapStage .routeOrigin').count())throw new Error('cartographic route must enter from the lower map edge without a visible origin marker');
  if(await page.locator('#needsMapStage .landShape .landFill').count()!==1)throw new Error('single route-relevant land must render one irregular coastline SVG');
  if(await page.locator('#needsMapStage .landShoreHaloOuter').count()!==1)throw new Error('illustrated map should render one outer shoreline halo');
  if(await page.locator('#needsMapStage .landTerrain').count()<2)throw new Error('illustrated map should carry restrained interior terrain cues');
  if(await page.locator('#needsMapStage .landWater').count()!==1)throw new Error('illustrated map should carry one subtle inland-water cue');
  if(await page.locator('#needsMapStage .mapPin').count()!==1)throw new Error('single route should render one map-location pin');
  const routeD=await page.locator('#needsMapStage .routePath').getAttribute('d');
  if(!routeD||!routeD.includes(' C '))throw new Error('single route must use a curved cubic path: '+routeD);
  if(await page.locator('.shipVisual svg').count()!==1)throw new Error('final minimalist ship SVG missing');
  if(await page.locator('.shipGhost,.shipHull,.shipMast,.shipSail').count())throw new Error('dashed prototype ship classes still present');
  if(!await page.locator('#mapRoute').evaluate(el=>el.classList.contains('hidden')))throw new Error('single route summary should be hidden to avoid duplicating the need label above the land');
  if(((await page.locator('#mapRoute').textContent())||'').trim())throw new Error('single route summary should be empty when the land already carries the endpoint label');

  await page.click('#shipDetailsButton');
  await page.waitForFunction(()=>new URLSearchParams(location.search).get('detail')==='attention');
  const attentionText=(await page.locator('#attentionDetail').textContent())||'';
  if(/\bMOST\b|\bLEAST\b|\bA\+\b/.test(attentionText))throw new Error('technical A terminology leaked into participant detail: '+attentionText);
  if(await page.locator('#repeatRows img').count())throw new Error('focus exemplars should not be duplicated in the summary block');
  if(await page.locator('#compareRows .reflectionImages img').count()!==3)throw new Error('3/3 focus exemplars must remain visible in the reflection block');
  const reflectionQuestion='Kas, tavo manymu, galėjo traukti šiuose vaizduose?';
  const reflectionQuestionCount=attentionText.split(reflectionQuestion).length-1;
  if(reflectionQuestionCount!==1)throw new Error('reflection question must appear exactly once, got '+reflectionQuestionCount);
  const reflectionBeforeBackground=await page.evaluate(()=>{
    const a=document.getElementById('compareHeading'),b=document.getElementById('leastHeading');
    return Boolean(a.compareDocumentPosition(b)&Node.DOCUMENT_POSITION_FOLLOWING);
  });
  if(!reflectionBeforeBackground)throw new Error('background 3/3 detail must come after the main reflection block');

  const firstReason=page.locator('#compareRows .reasonOption').first();
  const expectedReason=((await firstReason.textContent())||'').trim();
  await firstReason.click();
  await page.waitForSelector('#compareRows .reflectionAnswerValue');
  const selectedReason=((await page.locator('#compareRows .reflectionAnswerValue').textContent())||'').trim();
  if(!selectedReason||selectedReason!==expectedReason)throw new Error('selected reflection answer not shown after collapse: '+selectedReason);
  const selectedColor=await page.locator('#compareRows .reflectionAnswerValue').evaluate(el=>getComputedStyle(el).color);
  if(selectedColor==='rgb(255, 255, 255)'||selectedColor==='white')throw new Error('selected reflection answer is white on white: '+selectedColor);
  if(await page.locator('#compareRows .reasonOption').count())throw new Error('reflection option list did not collapse after selection');

  await page.click('#attentionBack');
  await page.waitForFunction(()=>!new URLSearchParams(location.search).has('detail'));

  await page.click('#mapDetailsButton');
  await page.waitForFunction(()=>new URLSearchParams(location.search).get('detail')==='sufficiency');
  if(await page.locator('#suffDetail').evaluate(el=>el.classList.contains('hidden')))throw new Error('sufficiency bottom sheet hidden');
  if(await page.locator('#result').evaluate(el=>el.classList.contains('detailMode')))throw new Error('sufficiency bottom sheet must not replace the result scene');
  const suffText=(await page.locator('#suffDetail').textContent())||'';
  if(/\bB\+\b|Channel B/.test(suffText))throw new Error('technical B terminology leaked into participant detail: '+suffText);
  if(!suffText.includes('Kaip ši poreikio sritis buvo išskirta?'))throw new Error('need-area provenance heading missing: '+suffText);
  if(suffText.includes('Kodėl ši kryptis?'))throw new Error('old direction wording remains in sufficiency detail');
  if(!suffText.includes('mažiausiai pakankama'))throw new Error('single-route sufficiency-method note is not explicit enough');
  await page.click('#suffDetailClose');
  await page.waitForFunction(()=>!new URLSearchParams(location.search).has('detail'));

  if(await page.evaluate(k=>localStorage.getItem(k),DRAFT)!==null)throw new Error('v0.4 draft not cleared after successful final save');
  const storedResult=JSON.parse(await page.evaluate(k=>localStorage.getItem(k),RESULT));
  if(!storedResult?.completedAt||storedResult?.submission?.ok!==true)throw new Error('completed result snapshot missing after successful final save');
  const finalPostCountBeforeReload=finalPayloads.length;
  const focusBeforeReload=((await page.locator('#shipFocus').textContent())||'').trim();
  const routeBeforeReload=((await page.locator('#mapRoute').textContent())||'').trim();

  await page.reload({waitUntil:'networkidle'});
  await page.waitForSelector('#result.active');
  const restoredStatus=((await page.locator('#saveStatus').textContent())||'').trim();
  if(!restoredStatus.includes('atkurta'))throw new Error('completed result was not identified as restored after reload: '+restoredStatus);
  if(((await page.locator('#shipFocus').textContent())||'').trim()!==focusBeforeReload)throw new Error('restored focus changed after reload');
  if(((await page.locator('#mapRoute').textContent())||'').trim()!==routeBeforeReload)throw new Error('restored route changed after reload');
  if(finalPayloads.length!==finalPostCountBeforeReload)throw new Error('restoring a completed result must not POST the final session again');

  // Visual-only synthetic restore checks: preserve protocol-valid endpoint sets exactly.
  await page.evaluate(k=>{
    const x=JSON.parse(localStorage.getItem(k));
    x.sufficiencyRoute={source:'B_PLUS_SIMILAR',itemIds:['MEANING_PURPOSE','CONTRIBUTION'],minimumValue:2};
    localStorage.setItem(k,JSON.stringify(x));
  },RESULT);
  await page.reload({waitUntil:'networkidle'});
  await page.waitForSelector('#result.active');
  if(await page.locator('#needsMapStage .continent').count()!==1)throw new Error('two tied endpoints in one need group should share one land');
  if(await page.locator('#needsMapStage .landShape .landFill').count()!==1)throw new Error('two same-group endpoints should still share one coastline');
  if(await page.locator('#needsMapStage .needNode').count()!==2)throw new Error('two tied endpoints in one group should render two need nodes');
  await page.waitForFunction(()=>document.querySelectorAll('#needsMapStage .routePath').length===2);

  await page.evaluate(k=>{
    const x=JSON.parse(localStorage.getItem(k));
    x.sufficiencyRoute={source:'B_PLUS_SIMILAR',itemIds:['RESTORATION_ENERGY','AUTONOMY_AGENCY','MEANING_PURPOSE'],minimumValue:2};
    localStorage.setItem(k,JSON.stringify(x));
  },RESULT);
  await page.reload({waitUntil:'networkidle'});
  await page.waitForSelector('#result.active');
  if(await page.locator('#needsMapStage .continent').count()!==3)throw new Error('three valid tied endpoints across groups must render three lands without truncation');
  if(await page.locator('#needsMapStage .landShape .landFill').count()!==3)throw new Error('three route-relevant groups must render three coastlines');
  if(await page.locator('#needsMapStage .needNode').count()!==3)throw new Error('three valid tied endpoints must render all three need nodes');
  await page.waitForFunction(()=>document.querySelectorAll('#needsMapStage .routePath').length===3);
  if(finalPayloads.length!==finalPostCountBeforeReload)throw new Error('visual restore-state checks must not POST final session again');

  await page.click('#restart');
  await page.waitForSelector('#intro.active');
  if(await page.evaluate(k=>localStorage.getItem(k),RESULT)!==null)throw new Error('Atlikti dar kartą did not clear completed result snapshot');

  const keys=await page.evaluate(()=>Object.keys(localStorage));
  if(keys.some(k=>k.includes('priolens.open14.v031.rank.draft')))throw new Error('v0.3.1 draft namespace leaked into v0.4');

  console.log('PASS: v0.4 local 390x844 frozen IA + illustrated island target + map pins + curved lower-edge routes for single/same-land-2/cross-land-3 + clean details + restore');
} finally {
  await browser.close();
}
