import fs from 'node:fs';

const files=['priolens/open14-v03/server/api.php','priolens/open14-v03/server/progress.php'];
const from="if ($body['bankSchema'] !== '2rasi.priolens.open14.bank-v0.3') fail_json(400, 'Unexpected bank schema');";
const to="if (!in_array($body['bankSchema'], ['2rasi.priolens.open14.bank-v0.3','2rasi.priolens.open14.bank-v0.3.1'], true)) fail_json(400, 'Unexpected bank schema');";

for(const file of files){
  let s=fs.readFileSync(file,'utf8');
  const fromCount=s.split(from).length-1;
  const toCount=s.split(to).length-1;
  if(fromCount===1 && toCount===0){
    s=s.replace(from,to);
    fs.writeFileSync(file,s,'utf8');
  }else if(fromCount===0 && toCount===1){
    console.log(`${file}: already migrated`);
  }else{
    throw new Error(`${file}: bank-schema guard drift, old=${fromCount}, new=${toCount}`);
  }
  const out=fs.readFileSync(file,'utf8');
  if(!out.includes("2rasi.priolens.open14.rank-session-v0.3")) throw new Error(`${file}: rank session schema guard missing`);
  if(!out.includes("2rasi.priolens.open14.bank-v0.3.1")) throw new Error(`${file}: v0.3.1 bank compatibility missing`);
}
console.log('PASS: API accepts bank-v0.3 and bank-v0.3.1 while preserving rank-session-v0.3');
