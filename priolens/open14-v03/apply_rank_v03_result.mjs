import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const indexPath=path.resolve(here,'index.html');

function replaceOne(text,from,to,label){
  const count=text.split(from).length-1;
  if(count!==1) throw new Error(`Rank-result patch guard failed for ${label}: expected 1, found ${count}`);
  return text.replace(from,to);
}

let html=fs.readFileSync(indexPath,'utf8');

// Bilingual FIRST badge on the locked MOST image.
html=replaceOne(html,".stim.most::after{content:'PIRMAS';",".stim.most::after{content:attr(data-rank-label);",'MOST badge CSS');
html=replaceOne(
  html,
  "img.alt='';b.disabled=false;b.classList.remove('most');if(leastPhase&&state.pendingMost?.slot===slot){b.disabled=true;b.classList.add('most')}",
  "img.alt='';b.dataset.rankLabel=LANG==='en'?'FIRST':'PIRMAS';b.disabled=false;b.classList.remove('most');if(leastPhase&&state.pendingMost?.slot===slot){b.disabled=true;b.classList.add('most')}",
  'MOST badge language data'
);

// v0.3 has three unique exemplars per family. Result visuals must not retain the v0.2 two-image cap.
html=replaceOne(
  html,
  '.choiceVisuals{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-bottom:12px}',
  '.choiceVisuals{display:grid;grid-template-columns:repeat(auto-fit,minmax(84px,1fr));gap:8px;margin-bottom:12px}',
  'choice result responsive exemplar grid'
);
html=replaceOne(
  html,
  '.reflectionImages{display:grid;grid-template-columns:repeat(2,minmax(0,120px));gap:8px;margin-bottom:16px}',
  '.reflectionImages{display:grid;grid-template-columns:repeat(auto-fit,minmax(84px,1fr));gap:8px;margin-bottom:16px;max-width:360px}',
  'reflection responsive exemplar grid'
);
html=replaceOne(
  html,
  'const images=chosenImagePaths(id).slice(0,2).map',
  'const images=chosenImagePaths(id).map',
  'MOST result all exemplar images'
);
html=replaceOne(
  html,
  'const images=leastImagePaths(id).slice(0,2).map',
  'const images=leastImagePaths(id).map',
  'LEAST result all exemplar images'
);
html=replaceOne(
  html,
  'const pics=images.slice(0,2).map',
  'const pics=images.map',
  'reflection all exemplar images'
);

// LEAST can become the main comparison when it carries the clearest contrast/alignment signal.
const oldCompare=`  const pairs=[];
  for(const [family,stat] of repeated){
    const link=FAMILY_ITEM_LINKS[family];
    if(!link)continue;
    const value=state.sufficiency[link.item];
    if(Number.isFinite(value))pairs.push({family,stat,item:link.item,strength:link.strength,value});
  }
  const strengthRank=x=>x==='DIRECT'?0:1;
  const lowPairs=pairs.filter(x=>x.value<=3).sort((a,b)=>(strengthRank(a.strength)-strengthRank(b.strength))||(b.stat.chosen-a.stat.chosen)||(a.value-b.value));
  const highPairs=pairs.filter(x=>x.value>=4).sort((a,b)=>(strengthRank(a.strength)-strengthRank(b.strength))||(b.stat.chosen-a.stat.chosen)||(b.value-a.value));

  const cr=$('compareRows');cr.innerHTML='';
  if(lowPairs.length){
    const m=lowPairs[0],related=m.strength==='RELATED';
    addReflection(cr,C.alignedCue(FAMILY_LABEL[m.family],m.stat.chosen,ITEM_ABOUT_TEXT[m.item],related),C.reasonQuestion,chosenImagePaths(m.family),m.family,'MATCH_LOW');
  }else if(highPairs.length){
    const m=highPairs[0],related=m.strength==='RELATED';
    addReflection(cr,C.highCue(FAMILY_LABEL[m.family],m.stat.chosen,ITEM_ABOUT_TEXT[m.item],related),C.reasonQuestion,chosenImagePaths(m.family),m.family,'MATCH_HIGH');
  }else if(lowItems.length&&repeated.length){`;

const newCompare=`  const pairs=[];
  for(const [family,stat] of repeated){
    const link=FAMILY_ITEM_LINKS[family];
    if(!link)continue;
    const value=state.sufficiency[link.item];
    if(Number.isFinite(value))pairs.push({family,stat,item:link.item,strength:link.strength,value});
  }
  const leastPairs=[];
  for(const [family,stat] of leastRepeated){
    const link=FAMILY_ITEM_LINKS[family];
    if(!link)continue;
    const value=state.sufficiency[link.item];
    if(Number.isFinite(value))leastPairs.push({family,stat,item:link.item,strength:link.strength,value});
  }
  const strengthRank=x=>x==='DIRECT'?0:1;
  const lowPairs=pairs.filter(x=>x.value<=3).sort((a,b)=>(strengthRank(a.strength)-strengthRank(b.strength))||(b.stat.chosen-a.stat.chosen)||(a.value-b.value));
  const highPairs=pairs.filter(x=>x.value>=4).sort((a,b)=>(strengthRank(a.strength)-strengthRank(b.strength))||(b.stat.chosen-a.stat.chosen)||(b.value-a.value));
  const lowLeast=leastPairs.filter(x=>x.value<=3).sort((a,b)=>(strengthRank(a.strength)-strengthRank(b.strength))||(b.stat.least-a.stat.least)||(a.value-b.value));
  const highLeast=leastPairs.filter(x=>x.value>=4).sort((a,b)=>(strengthRank(a.strength)-strengthRank(b.strength))||(b.stat.least-a.stat.least)||(b.value-a.value));

  const cr=$('compareRows');cr.innerHTML='';
  if(lowLeast.length){
    const m=lowLeast[0],related=m.strength==='RELATED';
    const cue=LANG==='en'
      ?\`${'${related?\'Related, not direct comparison. \':\'\'}'}You rated this broader area as one you would like more of, while ${'${FAMILY_LABEL[m.family]}'} appeared among your least-pulling images ${'${m.stat.least}'} out of 3 times.\`
      :\`${'${related?\'Susijęs, bet ne tiesioginis sugretinimas. \':\'\'}'}Šią platesnę sritį įvertinai kaip tokią, kurios norėtųsi daugiau, o „${'${FAMILY_LABEL[m.family]}'}“ ${'${m.stat.least}'} iš 3 kartų pateko tarp mažiausiai traukusių vaizdų.\`;
    const q=LANG==='en'?'Does this difference feel surprising to you?':'Ar tau pačiam šis skirtumas atrodo netikėtas?';
    addReflection(cr,cue,q,leastImagePaths(m.family),null,'LOW_LEAST');
  }else if(lowPairs.length){
    const m=lowPairs[0],related=m.strength==='RELATED';
    addReflection(cr,C.alignedCue(FAMILY_LABEL[m.family],m.stat.chosen,ITEM_ABOUT_TEXT[m.item],related),C.reasonQuestion,chosenImagePaths(m.family),m.family,'MATCH_LOW');
  }else if(highPairs.length){
    const m=highPairs[0],related=m.strength==='RELATED';
    addReflection(cr,C.highCue(FAMILY_LABEL[m.family],m.stat.chosen,ITEM_ABOUT_TEXT[m.item],related),C.reasonQuestion,chosenImagePaths(m.family),m.family,'MATCH_HIGH');
  }else if(highLeast.length){
    const m=highLeast[0],related=m.strength==='RELATED';
    const cue=LANG==='en'
      ?\`${'${related?\'Related, not direct comparison. \':\'\'}'}This broader area currently feels fairly sufficient, and ${'${FAMILY_LABEL[m.family]}'} also appeared among your least-pulling images ${'${m.stat.least}'} out of 3 times.\`
      :\`${'${related?\'Susijęs, bet ne tiesioginis sugretinimas. \':\'\'}'}Ši platesnė sritis tau dabar atrodo gana pakankama, o „${'${FAMILY_LABEL[m.family]}'}“ taip pat ${'${m.stat.least}'} iš 3 kartų pateko tarp mažiausiai traukusių vaizdų.\`;
    const q=LANG==='en'?'Does that feel natural in your current situation?':'Ar tau tai atrodo natūralu dabartinėje situacijoje?';
    addReflection(cr,cue,q,leastImagePaths(m.family),null,'HIGH_LEAST');
  }else if(lowItems.length&&repeated.length){`;

html=replaceOne(html,oldCompare,newCompare,'LEAST-aware comparison priority');

for(const token of ["content:'PIRMAS'",'const leastPairs=[]','LOW_LEAST','HIGH_LEAST','data-rank-label']){
  if(token==="content:'PIRMAS'"){
    if(html.includes(token)) throw new Error('Hard-coded LT MOST badge remains');
  }else if(!html.includes(token)) throw new Error(`Rank-result build missing required token: ${token}`);
}
for(const forbidden of [
  'chosenImagePaths(id).slice(0,2)',
  'leastImagePaths(id).slice(0,2)',
  'images.slice(0,2).map'
]){
  if(html.includes(forbidden)) throw new Error(`v0.3 result still contains two-image cap: ${forbidden}`);
}

fs.writeFileSync(indexPath,html,'utf8');
console.log(JSON.stringify({ok:true,indexPath,bytes:Buffer.byteLength(html),resultProtocol:'most+least-aware-v0.3',resultImagePolicy:'show-all-repeated-exemplars'},null,2));
