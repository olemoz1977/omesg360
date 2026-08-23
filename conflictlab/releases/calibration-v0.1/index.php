<?php
declare(strict_types=1);

header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

$html = @file_get_contents(__DIR__ . '/index.html');
if ($html === false) {
    http_response_code(500);
    exit('ConflictLab LAB bootstrap error');
}

function replace_once(string $html, string $search, string $replace, string $label): string {
    $count = 0;
    $html = str_replace($search, $replace, $html, $count);
    if ($count !== 1) {
        http_response_code(500);
        exit('ConflictLab LAB delivery patch mismatch: ' . $label);
    }
    return $html;
}

// Hostinger serves .mjs with an incompatible MIME type in this LAB environment.
$html = str_replace('.mjs', '.js', $html);

// Privacy/withdrawal UX delivery patch:
// the plaintext deletion code must be created and shown in the browser BEFORE
// any consented timing payload can be uploaded. The API receives only its SHA-256 hash.
$html = replace_once(
    $html,
    "consentHint:'Varnelės nepažymėtos iš anksto. Atsisakymas nėra vertinamas kaip psichologinis signalas. Po sėkmingo įkėlimo gausi atsitiktinį duomenų ištrynimo kodą.'",
    "consentHint:'Varnelės nepažymėtos iš anksto. Atsisakymas nėra vertinamas kaip psichologinis signalas. Jei pasirinksi dalyvauti, prieš pagrindinį bloką naršyklė sukurs atsitiktinį ištrynimo kodą ir, jei vietinis saugojimas prieinamas, išsaugos jį tik šiame įrenginyje. Plaintext kodas į tyrimo serverį nesiunčiamas.'",
    'LT consent hint'
);
$html = replace_once(
    $html,
    "consentHint:'Checkboxes are unticked by default. Refusal is not treated as a psychological signal. After a successful upload you will receive a random data-deletion code.'",
    "consentHint:'Checkboxes are unticked by default. Refusal is not treated as a psychological signal. If you choose to participate, before the main block your browser will create a random deletion code and, where local storage is available, save it only on this device. The plaintext code is not sent to the research server.'",
    'EN consent hint'
);

$html = replace_once(
    $html,
    "participate.onclick=()=>{researchChoice={mode:'CONSENTED',age18Confirmed:true,researchConsent:true,consentVersion:CONSENT_VERSION};showMeasuredIntro()};",
    "participate.onclick=()=>{researchChoice={mode:'CONSENTED',age18Confirmed:true,researchConsent:true,consentVersion:CONSENT_VERSION};deletionToken=makeDeletionToken();showPreUploadDeletionCode()};",
    'consented route'
);

$preUploadGate = <<<'JS'
const DELETION_CODES_STORAGE_KEY='conflictlab_calibration_deletion_codes_v1';
function storeDeletionCodeLocally(code){
  if(!/^[0-9a-f]{32}$/.test(code))return false;
  try{
    const parsed=JSON.parse(localStorage.getItem(DELETION_CODES_STORAGE_KEY)||'[]');
    const list=Array.isArray(parsed)?parsed:[];
    const withoutSame=list.filter(item=>item&&item.code!==code);
    withoutSame.push({code,createdAt:new Date().toISOString(),releaseId:RELEASE_ID});
    localStorage.setItem(DELETION_CODES_STORAGE_KEY,JSON.stringify(withoutSame.slice(-12)));
    return true;
  }catch(_){return false}
}
function showPreUploadDeletionCode(){
  if(researchChoice.mode!=='CONSENTED'||!deletionToken){showError(new Error('deletion code unavailable'));return}
  const storedLocally=storeDeletionCodeLocally(deletionToken);
  setRapidMode(false);const card=document.createElement('section');card.className='card intro';
  const isLt=locale==='lt';
  const title=document.createElement('h2');title.textContent=isLt?'Išsisaugok duomenų ištrynimo kodą':'Save your data-deletion code';
  const help=document.createElement('p');help.textContent=isLt
    ?(storedLocally?'Šis kodas sukurtas tavo naršyklėje ir automatiškai išsaugotas tik šiame įrenginyje prieš siunčiant bet kokius timing tyrimo duomenis. Vis tiek rekomenduojame jį nukopijuoti. Jei užbaigto bloko duomenys bus sėkmingai įkelti, kodas leis vėliau rasti ir ištrinti tą pseudoniminę sesiją.':'Šis kodas sukurtas tavo naršyklėje prieš siunčiant bet kokius timing tyrimo duomenis. Naršyklė neleido jo automatiškai išsaugoti, todėl būtinai nukopijuok kodą prieš tęsiant. Jei užbaigto bloko duomenys bus sėkmingai įkelti, kodas leis vėliau rasti ir ištrinti tą pseudoniminę sesiją.')
    :(storedLocally?'This code was created in your browser and automatically saved only on this device before any timing-research data are sent. We still recommend copying it. If the completed block is uploaded successfully, the code will let you later locate and delete that pseudonymous session.':'This code was created in your browser before any timing-research data are sent. Your browser did not allow automatic local saving, so copy the code before continuing. If the completed block is uploaded successfully, the code will let you later locate and delete that pseudonymous session.');
  const box=document.createElement('div');box.className='withdrawal-box';
  const code=document.createElement('code');code.textContent=deletionToken;
  const copy=document.createElement('button');copy.type='button';copy.className='secondary';copy.textContent=t('copyCode');
  const savedLabel=document.createElement('label');savedLabel.className='consent-row';
  const saved=document.createElement('input');saved.type='checkbox';saved.checked=false;
  const savedText=document.createElement('span');savedText.className='consent-copy';savedText.textContent=isLt?'Patvirtinu, kad žinau, kur rasti arba išsisaugojau kodą.':'I confirm that I know where to find or have saved the code.';
  savedLabel.append(saved,savedText);
  const actions=document.createElement('div');actions.className='actions';
  const next=document.createElement('button');next.className='primary';next.type='button';next.textContent=isLt?'Tęsti į pagrindinę sesiją':'Continue to main session';next.disabled=true;
  saved.addEventListener('change',()=>{next.disabled=!saved.checked});
  copy.onclick=async()=>{try{await navigator.clipboard.writeText(deletionToken);copy.textContent=t('copied');saved.checked=true;next.disabled=false}catch(_){}};
  next.onclick=()=>showMeasuredIntro();
  box.append(code,copy);actions.append(next);card.append(title,help,box,savedLabel,actions);app.className='';app.replaceChildren(card);
}

JS;

$html = replace_once(
    $html,
    'function showMeasuredIntro(){',
    $preUploadGate . 'function showMeasuredIntro(){',
    'pre-upload deletion-code gate'
);

$html = replace_once(
    $html,
    'if(!deletionToken)deletionToken=makeDeletionToken();',
    "if(!deletionToken){uploadState={status:'FAILED',error:'DELETION_TOKEN_NOT_PREPARED',response:null};return false}",
    'upload deletion-code fail-closed check'
);

echo $html;
