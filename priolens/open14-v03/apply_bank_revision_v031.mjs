import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const indexPath=path.resolve(here,'index.html');
let html=fs.readFileSync(indexPath,'utf8');

function replaceOne(from,to,label){
  const count=html.split(from).length-1;
  if(count!==1) throw new Error(`v0.3.1 patch guard failed for ${label}: expected 1, found ${count}`);
  html=html.replace(from,to);
}

replaceOne(
  "const DRAFT_KEY_BASE='priolens.open14.v03.rank.draft';",
  "const DRAFT_KEY_BASE='priolens.open14.v031.rank.draft';",
  'draft namespace'
);

if(!html.includes('2rasi.priolens.open14.rank-session-v0.3')) throw new Error('MOST+LEAST session schema missing before v0.3.1 bank patch');
if(!html.includes('bankSchema:bank.schema')) throw new Error('Runtime payload must derive bankSchema from loaded bank');
if(html.includes("priolens.open14.v03.rank.draft'")) throw new Error('Old v0.3 rank draft namespace remains');

fs.writeFileSync(indexPath,html,'utf8');
console.log(JSON.stringify({ok:true,draftKeyBase:'priolens.open14.v031.rank.draft',sessionSchema:'2rasi.priolens.open14.rank-session-v0.3'},null,2));
