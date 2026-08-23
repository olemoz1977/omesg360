<?php
declare(strict_types=1);

ini_set('session.use_strict_mode', '1');
session_set_cookie_params([
    'httponly' => true,
    'secure' => true,
    'samesite' => 'Strict',
]);
session_start();
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: no-referrer');
header("Content-Security-Policy: default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'");

function admin_csrf(): string {
    if (!isset($_SESSION['cl_calibration_admin_csrf']) || !is_string($_SESSION['cl_calibration_admin_csrf'])) {
        $_SESSION['cl_calibration_admin_csrf'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['cl_calibration_admin_csrf'];
}
function require_admin_csrf(): void {
    $sent = (string)($_POST['csrf'] ?? '');
    $known = (string)($_SESSION['cl_calibration_admin_csrf'] ?? '');
    if ($known === '' || !hash_equals($known, $sent)) {
        http_response_code(403);
        exit('Invalid CSRF token.');
    }
}

$configPath = __DIR__ . '/config.php';
if (!is_file($configPath)) { http_response_code(503); exit('Calibration server not configured.'); }
$config = require $configPath;
if (!is_array($config) || !isset($config['db'])) { http_response_code(503); exit('Invalid calibration config.'); }

if (isset($_POST['logout'])) {
    require_admin_csrf();
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
    }
    session_destroy();
    header('Location: admin.php');
    exit;
}

$error = null;
if (!($_SESSION['cl_calibration_admin'] ?? false)) {
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['password'])) {
        $hash = (string)($config['admin_password_hash'] ?? '');
        if ($hash !== '' && $hash !== 'CHANGE_ME_PASSWORD_HASH' && password_verify((string)$_POST['password'], $hash)) {
            session_regenerate_id(true);
            $_SESSION['cl_calibration_admin'] = true;
            admin_csrf();
            header('Location: admin.php'); exit;
        }
        usleep(650000);
        $error = 'Neteisingas slaptažodis.';
    }
    ?><!doctype html><html lang="lt"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>ConflictLab calibration admin</title><style>body{font-family:system-ui;background:#0c0c0f;color:#eee;margin:0;padding:24px}.card{max-width:420px;margin:10vh auto;background:#17171b;border:1px solid #303038;border-radius:16px;padding:20px}input,button{font:inherit;width:100%;padding:12px;margin-top:10px;border-radius:10px}input{background:#0f0f12;color:#eee;border:1px solid #3a3a42}button{border:0;background:#84aa99;color:#08110d;font-weight:700}.err{color:#eaa}</style></head><body><div class="card"><h1>Calibration admin</h1><p>Mechanical timing only · Gate D/E = NONE</p><?php if($error):?><p class="err"><?=htmlspecialchars($error,ENT_QUOTES,'UTF-8')?></p><?php endif;?><form method="post"><input type="password" name="password" autocomplete="current-password" required><button>Prisijungti</button></form></div></body></html><?php exit;
}

$csrf = admin_csrf();
$pdo = new PDO((string)$config['db']['dsn'], (string)$config['db']['user'], (string)$config['db']['password'], [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC,PDO::ATTR_EMULATE_PREPARES=>false]);
$runs = $pdo->query('SELECT id, run_type, clean_primary, exclusion_reason, form_id, device_category, received_at FROM cl_calibration_runs ORDER BY id DESC')->fetchAll();
$attempts = $pdo->query('SELECT run_id, attempt_number, block_timed_out, page_hidden_during_block, block_elapsed_ms_final FROM cl_calibration_attempts ORDER BY run_id, attempt_number')->fetchAll();
$events = $pdo->query('SELECT run_id, attempt_number, pair_id, position_in_block, pair_presented, pair_ready_elapsed_ms, response_status, visual_choice_latency_ms, block_elapsed_ms_at_event, remaining_budget_at_pair_start_ms, page_hidden_before_event FROM cl_calibration_pair_events ORDER BY run_id, attempt_number, position_in_block')->fetchAll();

$attemptsByRun=[]; $eventsByRun=[];
foreach($attempts as $a){$attemptsByRun[(int)$a['run_id']][]=$a;}
foreach($events as $e){$eventsByRun[(int)$e['run_id']][]=$e;}

$eligibleIds=[]; $technical=0; $excludedCalibration=0; $forms=[]; $devices=[]; $excluded=[];
foreach($runs as $r){
    $id=(int)$r['id']; $type=$r['run_type'];
    if($type==='TECHNICAL'){$technical++; continue;}
    if($type!=='CALIBRATION') continue;
    $forms[$r['form_id']]=($forms[$r['form_id']]??0)+1;
    $devices[$r['device_category']]=($devices[$r['device_category']]??0)+1;
    if((int)$r['clean_primary']===1)$eligibleIds[$id]=true;
    else{$excludedCalibration++;$reason=$r['exclusion_reason']?:'UNKNOWN';$excluded[$reason]=($excluded[$reason]??0)+1;}
}
$n=count($eligibleIds);

$primaryAttempts=[];$retryRuns=[];
foreach($attempts as $a){$id=(int)$a['run_id'];if(!isset($eligibleIds[$id]))continue;if((int)$a['attempt_number']===1)$primaryAttempts[$id]=$a;if((int)$a['attempt_number']>1)$retryRuns[$id]=true;}
$completion=0;foreach($primaryAttempts as $a)if((int)$a['block_timed_out']===0)$completion++;
$completionRate=$n?$completion/$n:null;$retryRate=$n?count($retryRuns)/$n:null;
$p1Missing=$p3Missing=$p3NeverPresented=0;$pairStats=[];$latencies=[1=>[],2=>[],3=>[]];$remaining=[1=>[],2=>[],3=>[]];
foreach($events as $e){$id=(int)$e['run_id'];if(!isset($eligibleIds[$id])||(int)$e['attempt_number']!==1)continue;$p=(int)$e['position_in_block'];$missing=$e['response_status']==='timeout';if($p===1&&$missing)$p1Missing++;if($p===3&&$missing)$p3Missing++;if($p===3&&(int)$e['pair_presented']===0)$p3NeverPresented++;$pair=$e['pair_id'];$pairStats[$pair]??=['n'=>0,'missing'=>0];$pairStats[$pair]['n']++;if($missing)$pairStats[$pair]['missing']++;if($e['visual_choice_latency_ms']!==null)$latencies[$p][]=(int)$e['visual_choice_latency_ms'];if($e['remaining_budget_at_pair_start_ms']!==null)$remaining[$p][]=(int)$e['remaining_budget_at_pair_start_ms'];}
$p1Rate=$n?$p1Missing/$n:null;$p3Rate=$n?$p3Missing/$n:null;$p3NeverRate=$n?$p3NeverPresented/$n:null;$gradient=($p1Rate!==null&&$p3Rate!==null)?$p3Rate-$p1Rate:null;
function median(array $v):?float{if(!$v)return null;sort($v);$c=count($v);$m=intdiv($c,2);return$c%2?(float)$v[$m]:($v[$m-1]+$v[$m])/2;}
function pct(?float $v):string{return$v===null?'—':number_format($v*100,1).'%';}
function ms($v):string{return$v===null?'—':number_format((float)$v,0).' ms';}
function h($v):string{return htmlspecialchars((string)$v,ENT_QUOTES,'UTF-8');}

$red=false;$green=true;$notes=[];
if($n<20)$decision='INSUFFICIENT_DATA';else{if($completionRate<.60){$red=true;$notes[]='primary completion < 60%';}if($p3NeverRate>.25){$red=true;$notes[]='P3 never presented > 25%';}if($p3Rate>.40){$red=true;$notes[]='P3 missing > 40%';}if($gradient>.20){$red=true;$notes[]='P3-P1 gradient > 20 pp';}foreach($pairStats as $pair=>$s)if($s['n']>=8&&$s['missing']/$s['n']>.50){$red=true;$notes[]="$pair missing > 50%";}if($red)$decision='REJECT_6000';else{if($completionRate<.80||$p3NeverRate>.10||$p3Rate>.20||$gradient>.10)$green=false;foreach($pairStats as $s)if($s['n']>=8&&$s['missing']/$s['n']>.30)$green=false;$decision=$green?'KEEP_6000':'ADJUST_AND_RETEST';}}

$typeFilter=in_array($_GET['type']??'ALL',['ALL','TECHNICAL','CALIBRATION'],true)?($_GET['type']??'ALL'):'ALL';
$formFilter=in_array($_GET['form']??'ALL',['ALL','F2-A','F2-B'],true)?($_GET['form']??'ALL'):'ALL';
$deviceFilter=in_array($_GET['device']??'ALL',['ALL','mobile','tablet','desktop','unknown'],true)?($_GET['device']??'ALL'):'ALL';
$statusFilter=in_array($_GET['status']??'ALL',['ALL','ELIGIBLE','EXCLUDED'],true)?($_GET['status']??'ALL'):'ALL';
$filtered=array_values(array_filter($runs,function($r)use($typeFilter,$formFilter,$deviceFilter,$statusFilter){if($typeFilter!=='ALL'&&$r['run_type']!==$typeFilter)return false;if($formFilter!=='ALL'&&$r['form_id']!==$formFilter)return false;if($deviceFilter!=='ALL'&&$r['device_category']!==$deviceFilter)return false;if($statusFilter==='ELIGIBLE'&&!($r['run_type']==='CALIBRATION'&&(int)$r['clean_primary']===1))return false;if($statusFilter==='EXCLUDED'&&!($r['run_type']==='CALIBRATION'&&(int)$r['clean_primary']===0))return false;return true;}));
$selectedId=filter_input(INPUT_GET,'run',FILTER_VALIDATE_INT)?:0;$selectedRun=null;foreach($runs as $r)if((int)$r['id']===$selectedId){$selectedRun=$r;break;}
$collectionMode=strtoupper((string)($config['collection_mode']??'TECHNICAL'));
?>
<!doctype html><html lang="lt"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>ConflictLab calibration admin</title><style>:root{color-scheme:dark;--bg:#0c0c0f;--card:#17171b;--line:#303038;--text:#eee;--muted:#aaa59c;--accent:#84aa99}*{box-sizing:border-box}body{font-family:system-ui;background:var(--bg);color:var(--text);margin:0;padding:18px}.wrap{max-width:1180px;margin:auto}.top{display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap}.tag{color:var(--accent)}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(165px,1fr));gap:10px}.card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:15px;margin:10px 0}.big{font-size:28px;font-weight:700}.muted{color:var(--muted);font-size:13px}.decision{font-size:22px;font-weight:700}.mode{display:inline-block;padding:6px 10px;border-radius:999px;border:1px solid var(--line)}.mode.tech{color:#e0bd7f}.mode.cal{color:#9fd0b8}table{width:100%;border-collapse:collapse;overflow:auto}th,td{text-align:left;border-bottom:1px solid var(--line);padding:8px;font-size:13px;vertical-align:top}a{color:#9fcab5;text-decoration:none}button,select{background:#222;color:#ddd;border:1px solid #444;border-radius:9px;padding:8px 10px}.filters{display:flex;gap:8px;flex-wrap:wrap;align-items:end}.filters label{font-size:12px;color:var(--muted);display:grid;gap:4px}.badge{padding:3px 7px;border-radius:999px;font-size:11px;border:1px solid var(--line)}.technical{color:#e0bd7f}.eligible{color:#9fd0b8}.excluded{color:#e6a0a0}.scroll{overflow:auto}</style></head><body><div class="wrap">
<div class="top"><div><div class="tag">ConflictLab · calibration-v0.1</div><h1>6000 ms timing gate</h1><span class="mode <?=$collectionMode==='CALIBRATION'?'cal':'tech'?>">SERVER MODE: <?=h($collectionMode)?></span></div><form method="post"><input type="hidden" name="csrf" value="<?=h($csrf)?>"><button name="logout" value="1">Atsijungti</button></form></div>
<p class="muted">MECHANICAL TIMING ONLY · Gate D = NONE · Gate E = NONE · TECHNICAL runs never enter N/20 · <a href="data_admin.php">Data admin / CSV / deletion</a></p>
<div class="grid"><div class="card"><div class="big"><?=$n?> / 20</div><div class="muted">calibration eligible clean primary</div></div><div class="card"><div class="big"><?=$technical?></div><div class="muted">technical / owner runs</div></div><div class="card"><div class="big"><?=$excludedCalibration?></div><div class="muted">excluded calibration runs</div></div><div class="card"><div class="big"><?=pct($completionRate)?></div><div class="muted">primary completion</div></div><div class="card"><div class="big"><?=pct($p3Rate)?></div><div class="muted">P3 missing</div></div><div class="card"><div class="big"><?=pct($p3NeverRate)?></div><div class="muted">P3 never presented</div></div><div class="card"><div class="big"><?=pct($gradient)?></div><div class="muted">P3-P1 missing gradient</div></div><div class="card"><div class="big"><?=pct($retryRate)?></div><div class="muted">retry diagnostic</div></div></div>
<div class="card"><div class="muted">Decision</div><div class="decision"><?=h($decision)?></div><?php if($notes):?><p><?=h(implode('; ',$notes))?></p><?php endif;?></div>
<div class="card"><form class="filters" method="get"><label>Type<select name="type"><?php foreach(['ALL','TECHNICAL','CALIBRATION'] as $v):?><option <?=$typeFilter===$v?'selected':''?>><?=$v?></option><?php endforeach;?></select></label><label>Form<select name="form"><?php foreach(['ALL','F2-A','F2-B'] as $v):?><option <?=$formFilter===$v?'selected':''?>><?=$v?></option><?php endforeach;?></select></label><label>Device<select name="device"><?php foreach(['ALL','mobile','tablet','desktop','unknown'] as $v):?><option <?=$deviceFilter===$v?'selected':''?>><?=$v?></option><?php endforeach;?></select></label><label>Status<select name="status"><?php foreach(['ALL','ELIGIBLE','EXCLUDED'] as $v):?><option <?=$statusFilter===$v?'selected':''?>><?=$v?></option><?php endforeach;?></select></label><button>Filtruoti</button><a href="admin.php">Reset</a></form></div>
<div class="card"><h2>Runs</h2><div class="scroll"><table><tr><th>ID</th><th>Received</th><th>Type</th><th>Status</th><th>Form</th><th>Device</th><th>Primary elapsed</th><th>Retry</th><th></th></tr><?php foreach($filtered as $r):$id=(int)$r['id'];$pa=null;$retry=false;foreach($attemptsByRun[$id]??[] as $a){if((int)$a['attempt_number']===1)$pa=$a;if((int)$a['attempt_number']>1)$retry=true;}$status=$r['run_type']==='TECHNICAL'?'TECHNICAL':((int)$r['clean_primary']===1?'ELIGIBLE':'EXCLUDED');$class=strtolower($status);?><tr><td><?=$id?></td><td><?=h($r['received_at'])?></td><td><?=h($r['run_type'])?></td><td><span class="badge <?=$class?>"><?=h($status)?></span><?php if($r['exclusion_reason']):?><div class="muted"><?=h($r['exclusion_reason'])?></div><?php endif;?></td><td><?=h($r['form_id'])?></td><td><?=h($r['device_category'])?></td><td><?=ms($pa['block_elapsed_ms_final']??null)?></td><td><?=$retry?'yes':'no'?></td><td><a href="?run=<?=$id?>">Detalės</a></td></tr><?php endforeach;?></table></div></div>
<?php if($selectedRun):$sid=(int)$selectedRun['id'];?><div class="card"><h2>Run #<?=$sid?> detalės</h2><p><?=h($selectedRun['run_type'])?> · <?=h($selectedRun['form_id'])?> · <?=h($selectedRun['device_category'])?> · <?=h($selectedRun['received_at'])?></p><h3>Attempts</h3><div class="scroll"><table><tr><th>#</th><th>Elapsed</th><th>Timed out</th><th>Page hidden</th></tr><?php foreach($attemptsByRun[$sid]??[] as $a):?><tr><td><?=h($a['attempt_number'])?></td><td><?=ms($a['block_elapsed_ms_final'])?></td><td><?=((int)$a['block_timed_out'])?'yes':'no'?></td><td><?=((int)$a['page_hidden_during_block'])?'yes':'no'?></td></tr><?php endforeach;?></table></div><h3>Pair events</h3><div class="scroll"><table><tr><th>Attempt</th><th>Pos</th><th>Pair</th><th>Presented</th><th>Ready</th><th>Status</th><th>Latency</th><th>Elapsed</th><th>Remaining</th></tr><?php foreach($eventsByRun[$sid]??[] as $e):?><tr><td><?=h($e['attempt_number'])?></td><td>P<?=h($e['position_in_block'])?></td><td><?=h($e['pair_id'])?></td><td><?=((int)$e['pair_presented'])?'yes':'no'?></td><td><?=ms($e['pair_ready_elapsed_ms'])?></td><td><?=h($e['response_status'])?></td><td><?=ms($e['visual_choice_latency_ms'])?></td><td><?=ms($e['block_elapsed_ms_at_event'])?></td><td><?=ms($e['remaining_budget_at_pair_start_ms'])?></td></tr><?php endforeach;?></table></div></div><?php endif;?>
<div class="card"><h2>Pair missingness · eligible calibration only</h2><table><tr><th>Pair</th><th>N</th><th>Missing</th><th>Rate</th><th>Decision eligible?</th></tr><?php ksort($pairStats);foreach($pairStats as $pair=>$s):$rate=$s['n']?$s['missing']/$s['n']:null;?><tr><td><?=h($pair)?></td><td><?=$s['n']?></td><td><?=$s['missing']?></td><td><?=pct($rate)?></td><td><?=$s['n']>=8?'yes':'no (N<8)'?></td></tr><?php endforeach;?></table></div>
<div class="card"><h2>Position diagnostics · eligible calibration only</h2><table><tr><th>Position</th><th>Median choice latency</th><th>Median remaining budget</th></tr><?php for($p=1;$p<=3;$p++):?><tr><td>P<?=$p?></td><td><?=ms(median($latencies[$p]))?></td><td><?=ms(median($remaining[$p]))?></td></tr><?php endfor;?></table></div>
<div class="card"><h2>Dataset</h2><p>Total runs: <?=count($runs)?> · technical: <?=$technical?> · calibration eligible: <?=$n?> · calibration excluded: <?=$excludedCalibration?></p><p>Calibration forms: <?=h(json_encode($forms,JSON_UNESCAPED_UNICODE))?></p><p>Calibration devices: <?=h(json_encode($devices,JSON_UNESCAPED_UNICODE))?></p><?php if($excluded):?><p>Exclusions: <?=h(json_encode($excluded,JSON_UNESCAPED_UNICODE))?></p><?php endif;?></div>
</div></body></html>