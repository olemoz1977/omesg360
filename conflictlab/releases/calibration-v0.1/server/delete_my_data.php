<?php
declare(strict_types=1);

header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: no-referrer');

$configPath = __DIR__ . '/config.php';
if (!is_file($configPath)) { http_response_code(503); exit('Service unavailable.'); }
$config = require $configPath;
if (!is_array($config) || !isset($config['db'])) { http_response_code(503); exit('Service unavailable.'); }

function h(mixed $value): string { return htmlspecialchars((string)$value, ENT_QUOTES, 'UTF-8'); }
function valid_code(string $code): bool { return preg_match('/^[0-9a-f]{32}$/', $code) === 1; }

$lang = (($_GET['lang'] ?? $_POST['lang'] ?? 'lt') === 'en') ? 'en' : 'lt';
$message = null;
$error = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $code = strtolower(trim((string)($_POST['deletion_code'] ?? '')));
    $confirmed = ($_POST['confirm_delete'] ?? '') === 'yes';
    if (!valid_code($code) || !$confirmed) {
        usleep(450000);
        $error = $lang === 'en' ? 'Check the code and confirmation.' : 'Patikrinkite kodą ir patvirtinimą.';
    } else {
        try {
            $pdo = new PDO(
                (string)$config['db']['dsn'],
                (string)$config['db']['user'],
                (string)$config['db']['password'],
                [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC,PDO::ATTR_EMULATE_PREPARES=>false]
            );
            $tokenHash = hash('sha256', $code);
            $pdo->beginTransaction();
            $find = $pdo->prepare('SELECT id FROM cl_calibration_runs WHERE deletion_token_hash = ? FOR UPDATE');
            $find->execute([$tokenHash]);
            $row = $find->fetch();
            if ($row) {
                $runId = (int)$row['id'];
                $pdo->prepare('DELETE FROM cl_calibration_pair_events WHERE run_id = ?')->execute([$runId]);
                $pdo->prepare('DELETE FROM cl_calibration_attempts WHERE run_id = ?')->execute([$runId]);
                $pdo->prepare('DELETE FROM cl_calibration_runs WHERE id = ? AND deletion_token_hash = ?')->execute([$runId, $tokenHash]);
            }
            $pdo->commit();
            // Generic response prevents the page being used to enumerate valid codes.
            $message = $lang === 'en'
                ? 'Request completed. If the code matched an active calibration record, that session data have been deleted.'
                : 'Prašymas įvykdytas. Jei kodas atitiko aktyvų kalibravimo įrašą, tos sesijos duomenys buvo ištrinti.';
        } catch (Throwable $e) {
            if (isset($pdo) && $pdo->inTransaction()) $pdo->rollBack();
            $error = $lang === 'en' ? 'Deletion could not be completed. Please try again or contact info@omesg360.eu.' : 'Ištrynimo nepavyko užbaigti. Bandykite dar kartą arba rašykite info@omesg360.eu.';
        }
    }
}

$copy = $lang === 'en' ? [
    'title'=>'Delete my calibration data',
    'lead'=>'Enter the 32-character deletion code shown before your main timing-research block. If you used this browser and local storage is available, the latest saved code may be filled in automatically.',
    'label'=>'Deletion code',
    'confirm'=>'I understand that this permanently deletes the server-side timing data for the matching session.',
    'button'=>'Delete matching session data',
    'privacy'=>'Privacy information',
    'contact'=>'If you prefer, you can also email info@omesg360.eu and provide the deletion code.'
] : [
    'title'=>'Ištrinti mano kalibravimo duomenis',
    'lead'=>'Įveskite 32 simbolių ištrynimo kodą, parodytą prieš pagrindinį timing tyrimo bloką. Jei naudojate tą pačią naršyklę ir vietinis saugojimas prieinamas, naujausias kodas gali būti įrašytas automatiškai.',
    'label'=>'Duomenų ištrynimo kodas',
    'confirm'=>'Suprantu, kad bus negrįžtamai ištrinti atitinkančios sesijos serverio timing duomenys.',
    'button'=>'Ištrinti atitinkančios sesijos duomenis',
    'privacy'=>'Privatumo informacija',
    'contact'=>'Jei patogiau, taip pat galite parašyti info@omesg360.eu ir pateikti ištrynimo kodą.'
];
?><!doctype html><html lang="<?=h($lang)?>"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#0c0c0f"><title><?=h($copy['title'])?> · ConflictLab</title><style>:root{color-scheme:dark}*{box-sizing:border-box}body{margin:0;background:#0c0c0f;color:#e8e4dc;font-family:Inter,system-ui,-apple-system,sans-serif;line-height:1.55}.wrap{width:min(calc(100% - 28px),620px);margin:8vh auto}.card{background:#141417;border:1px solid #29292f;border-radius:18px;padding:20px}h1{font-size:26px;margin:0 0 10px}p{color:#aaa59c}label{display:block;margin:16px 0}.code{width:100%;font:inherit;background:#0d0d10;color:#eee;border:1px solid #3a3a42;border-radius:10px;padding:12px}.check{display:flex;gap:10px;align-items:flex-start;color:#c7c2b9}.check input{margin-top:5px}button{font:inherit;width:100%;padding:12px;border:0;border-radius:10px;background:#84aa99;color:#07100c;font-weight:750;cursor:pointer}.ok{color:#9fd0b8}.err{color:#e8a5a5}.small{font-size:13px}a{color:#a9c9ba}</style></head><body><div class="wrap"><div class="card"><h1><?=h($copy['title'])?></h1><p><?=h($copy['lead'])?></p><?php if($message):?><p class="ok"><?=h($message)?></p><?php endif;?><?php if($error):?><p class="err"><?=h($error)?></p><?php endif;?><?php if(!$message):?><form id="delete-form" method="post" autocomplete="off"><input type="hidden" name="lang" value="<?=h($lang)?>"><label><?=h($copy['label'])?><input id="deletion-code" class="code" type="text" name="deletion_code" minlength="32" maxlength="32" pattern="[0-9a-fA-F]{32}" required></label><label class="check"><input type="checkbox" name="confirm_delete" value="yes" required><span><?=h($copy['confirm'])?></span></label><button><?=h($copy['button'])?></button></form><?php endif;?><p class="small"><a href="/privacy.html?lang=<?=h($lang)?>"><?=h($copy['privacy'])?></a></p><p class="small"><?=h($copy['contact'])?></p></div></div><script>
(()=>{
  const storageKey='conflictlab_calibration_deletion_codes_v1';
  const pendingKey='conflictlab_calibration_pending_delete_v1';
  function readCodes(){
    try{
      const parsed=JSON.parse(localStorage.getItem(storageKey)||'[]');
      return Array.isArray(parsed)?parsed.filter(x=>x&&/^[0-9a-f]{32}$/.test(x.code||'')):[];
    }catch(_){return []}
  }
  function writeCodes(list){
    try{localStorage.setItem(storageKey,JSON.stringify(list.slice(-12)))}catch(_){}
  }
  const input=document.getElementById('deletion-code');
  if(input&&!input.value){
    const codes=readCodes();
    const latest=codes[codes.length-1];
    if(latest)input.value=latest.code;
  }
  const form=document.getElementById('delete-form');
  if(form&&input){
    form.addEventListener('submit',()=>{
      const code=(input.value||'').trim().toLowerCase();
      if(/^[0-9a-f]{32}$/.test(code)){
        try{sessionStorage.setItem(pendingKey,code)}catch(_){}
      }
    });
  }
  const completed=<?= $message ? 'true' : 'false' ?>;
  if(completed){
    let submitted='';
    try{submitted=sessionStorage.getItem(pendingKey)||'';sessionStorage.removeItem(pendingKey)}catch(_){}
    if(/^[0-9a-f]{32}$/.test(submitted)){
      writeCodes(readCodes().filter(item=>item.code!==submitted));
    }
  }
})();
</script></body></html>
