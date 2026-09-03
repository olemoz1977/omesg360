import fs from 'node:fs';

const path='priolens/open14-v03/bank.json';
const bank=JSON.parse(fs.readFileSync(path,'utf8'));

if(bank.schema!=='2rasi.priolens.open14.bank-v0.3') throw new Error(`Expected bank-v0.3 source, got ${bank.schema}`);
if(bank.runtimeReady!==true) throw new Error('Expected currently deployed v0.3 bank to be runtimeReady before revision');

const patch={
  'REST-01':{
    runtimePath:'/priolens-research-assets/Open14-v03-owner-remediation-v01/rest_01_slippers_640.webp',
    runtimeSha256Expected:'16af674632e9859d63003ca777aa21253fe6e975338ec5a269f44203cbce9524'
  },
  'RESOURCE-03':{
    runtimePath:'/priolens-research-assets/Open14-v03-owner-remediation-v01/resource_03_food_640.webp',
    runtimeSha256Expected:'5d0cd65c93353af46442516c91b61e736d0abe522f6a2315e750b7841f4c480d'
  },
  'KNOWLEDGE-02':{
    runtimePath:'/priolens-research-assets/Open14-v03-owner-remediation-v01/knowledge_02_online_learning_640.webp',
    runtimeSha256Expected:'d5b243976d3533fedff1b48b8338d6102d7ed9ef59bd74205394e0543ddb65e3'
  },
  'OPPORTUNITY-01':{
    runtimePath:'/priolens-research-assets/Open14-v03-owner-remediation-v01/opportunity_01_workbench_640.webp',
    runtimeSha256Expected:'2c2ca25fd5c5b7fd3a4552c1c1298accc78a8c7534651ff3f74821d3d49df168'
  },
  'RECOGNITION-02':{
    runtimePath:'/priolens-research-assets/Open14-v03-owner-remediation-v01/recognition_02_recrop_640.webp',
    runtimeSha256Expected:'e7a765de3ac1401b15aac42e43e21cbfc674fe3c3e4f9cb5fa17e0d1142fc612'
  }
};

const byId=new Map();
for(const [family,node] of Object.entries(bank.families)){
  if(!Array.isArray(node.exemplars)||node.exemplars.length!==3) throw new Error(`${family}: expected 3 exemplars`);
  for(const ex of node.exemplars){
    if(byId.has(ex.id)) throw new Error(`Duplicate exemplar ID: ${ex.id}`);
    byId.set(ex.id,ex);
  }
}
if(byId.size!==42) throw new Error(`Expected 42 exemplar IDs, got ${byId.size}`);

for(const [id,p] of Object.entries(patch)){
  const ex=byId.get(id);
  if(!ex) throw new Error(`Missing remediation target ${id}`);
  ex.runtimePath=p.runtimePath;
  ex.runtimeSha256Expected=p.runtimeSha256Expected;
}

const paths=[...byId.values()].map(x=>x.runtimePath);
if(new Set(paths).size!==42) throw new Error('v0.3.1 must retain 42 unique runtime paths');

bank.schema='2rasi.priolens.open14.bank-v0.3.1';
bank.status='OWNER_REMEDIATION_ASSETS_HTTP_HASH_PASS_FULL42_AUDIT_PENDING';
bank.runtimeReady=false;
bank.sessionSchema='2rasi.priolens.open14.rank-session-v0.3';
bank.remediationAssetDirectory='/priolens-research-assets/Open14-v03-owner-remediation-v01/';
bank.startPolicy='FAIL_CLOSED_UNTIL_V031_FULL42_AUDIT_AND_DEPLOY_SMOKE_PASS';
bank.audit={
  familyCount:14,
  exemplarCount:42,
  uniqueExemplarIds:42,
  uniqueRuntimePaths:42,
  originalNewAssetCount:15,
  ownerRemediatedExemplarCount:5,
  runtimeShaPinnedCount:[...byId.values()].filter(x=>x.runtimeSha256Expected).length
};
bank.deploymentGate={
  ownerRemediationAssetsUploaded:true,
  ownerRemediationAssetsReachabilityPassed:true,
  ownerRemediationAssetsHashPassed:true,
  ownerRemediationAssetRunId:33785859324,
  full42AuditPassed:false,
  apiDeployed:false,
  apiSmokePassed:false,
  participantPreviewDeployed:false,
  participantPreviewStaticSmokePassed:false,
  participantPreviewChromiumSmokePassed:false,
  ownerMobileVisualSmokePassed:false
};

if(bank.audit.runtimeShaPinnedCount!==20) throw new Error(`Expected 20 SHA-pinned assets after remediation, got ${bank.audit.runtimeShaPinnedCount}`);

fs.writeFileSync(path,JSON.stringify(bank,null,2)+'\n');
console.log(JSON.stringify({ok:true,schema:bank.schema,runtimeReady:bank.runtimeReady,patched:Object.keys(patch),shaPinned:bank.audit.runtimeShaPinnedCount},null,2));
