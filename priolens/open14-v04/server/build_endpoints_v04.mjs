import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const v03=path.resolve(here,'../../open14-v03/server');

function patch(source,isProgress){
  let out=source.replaceAll('2rasi.priolens.open14.rank-session-v0.3','2rasi.priolens.open14.rank-session-v0.4');
  const anchor='$canonicalPayload = json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);';
  if(!out.includes(anchor)) throw new Error('canonical payload anchor missing');
  const semantic=[
    "require_once __DIR__.'/validation_v04.php';",
    "try { validate_v04_payload($body, "+(isProgress?'true':'false')+"); }",
    "catch (InvalidArgumentException $e) { fail_json(400, $e->getMessage()); }",
    "",
    anchor
  ].join('\n');
  out=out.replace(anchor,semantic);
  return out;
}

const api=patch(fs.readFileSync(path.join(v03,'api.php'),'utf8'),false);
const progress=patch(fs.readFileSync(path.join(v03,'progress.php'),'utf8'),true);

fs.writeFileSync(path.join(here,'api.php'),api);
fs.writeFileSync(path.join(here,'progress.php'),progress);

for(const [name,text] of [['api.php',api],['progress.php',progress]]){
  if(!text.includes('2rasi.priolens.open14.rank-session-v0.4')) throw new Error(name+' missing v0.4 session schema');
  if(!text.includes("validation_v04.php")) throw new Error(name+' missing semantic validator');
  if(text.includes('2rasi.priolens.open14.rank-session-v0.3')) throw new Error(name+' still contains v0.3 session schema');
}
console.log('build_endpoints_v04: PASS');
