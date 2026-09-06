<?php
declare(strict_types=1);

ini_set('session.use_strict_mode', '1');
session_set_cookie_params([
    'httponly' => true,
    'secure' => true,
    'samesite' => 'Strict',
]);
session_start();

header('Content-Type: text/html; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: no-referrer');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

$configPath = __DIR__ . '/config.php';
if (!is_file($configPath)) {
    http_response_code(503);
    exit('Backend not configured.');
}
require_once $configPath;
$adminSecretPath = __DIR__ . '/admin-secret.php';
if (is_file($adminSecretPath)) require_once $adminSecretPath;

$adminPassword = null;
if (defined('PRIOLENS_ADMIN_PASSWORD')) {
    $adminPassword = (string)PRIOLENS_ADMIN_PASSWORD;
} elseif (defined('ADMIN_PASSWORD')) {
    $adminPassword = (string)ADMIN_PASSWORD;
}
if ($adminPassword === null || $adminPassword === '' || $adminPassword === 'CHANGE_ME') {
    http_response_code(503);
    exit('Admin password is not configured.');
}

if (isset($_GET['logout'])) {
    $_SESSION = [];
    session_destroy();
    header('Location: admin.php');
    exit;
}

$loginError = null;
if (isset($_POST['admin_password'])) {
    $candidate = (string)$_POST['admin_password'];
    if (hash_equals($adminPassword, $candidate)) {
        session_regenerate_id(true);
        $_SESSION['priolens_admin_v04'] = true;
        $_SESSION['priolens_admin_failures'] = 0;
        header('Location: admin.php');
        exit;
    }
    $_SESSION['priolens_admin_failures'] = (int)($_SESSION['priolens_admin_failures'] ?? 0) + 1;
    if ($_SESSION['priolens_admin_failures'] >= 5) {
        usleep(700000);
    }
    $loginError = 'Neteisingas slaptažodis.';
}

if (empty($_SESSION['priolens_admin_v04'])) {
?>
<!doctype html>
<html lang="lt">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>PrioLens Admin</title>
<style>
:root{color-scheme:dark}*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:#101114;color:#eee;font-family:system-ui,-apple-system,"Segoe UI",sans-serif}.card{width:min(92vw,420px);background:#191b20;border:1px solid #30343b;border-radius:16px;padding:22px}h1{font-size:1.25rem;margin:0 0 6px}.muted{color:#9aa0aa;font-size:.88rem;margin:0 0 16px}input,button{width:100%;box-sizing:border-box;padding:12px;border-radius:10px;font-size:1rem}input{background:#101114;color:#eee;border:1px solid #3a3f48;margin-bottom:10px}button{background:#e8e8e8;color:#111;border:0;font-weight:750}.err{color:#ffabab;margin:0 0 10px}
</style>
</head>
<body>
<div class="card">
<h1>PrioLens Admin</h1>
<p class="muted">Read-only statistika</p>
<?php if ($loginError): ?><div class="err"><?=htmlspecialchars($loginError, ENT_QUOTES, 'UTF-8')?></div><?php endif; ?>
<form method="post">
<input type="password" name="admin_password" placeholder="Slaptažodis" autocomplete="current-password" autofocus>
<button type="submit">Prisijungti</button>
</form>
</div>
</body>
</html>
<?php
    exit;
}

function h(?string $value): string {
    return htmlspecialchars((string)$value, ENT_QUOTES, 'UTF-8');
}
function pct(int|float $n, int|float $den, int $digits = 1): string {
    if ($den <= 0) return '—';
    return number_format(($n / $den) * 100, $digits, '.', '') . '%';
}
function median(array $values): ?float {
    $xs = [];
    foreach ($values as $v) {
        if (is_int($v) || is_float($v) || (is_string($v) && is_numeric($v))) $xs[] = (float)$v;
    }
    if (!$xs) return null;
    sort($xs, SORT_NUMERIC);
    $n = count($xs);
    $m = intdiv($n, 2);
    return $n % 2 ? $xs[$m] : ($xs[$m - 1] + $xs[$m]) / 2;
}
function medianMs(array $values): string {
    $m = median($values);
    return $m === null ? '—' : number_format($m / 1000, 2, '.', '') . ' s';
}
function mean(array $values): ?float {
    $xs = array_values(array_filter($values, fn($v) => is_int($v) || is_float($v)));
    return $xs ? array_sum($xs) / count($xs) : null;
}
function shortId(string $id): string {
    return mb_substr($id, 0, 8) . '…';
}
function getArray(array $x, string $key): array {
    return isset($x[$key]) && is_array($x[$key]) ? $x[$key] : [];
}

$familyLabels = [
    'REST'=>'Poilsis / atsigavimas',
    'MASTERY'=>'Meistriškumas',
    'CONNECTION'=>'Ryšys',
    'EXPLORATION'=>'Tyrinėjimas',
    'BELONGING'=>'Priklausymas',
    'RESOURCE'=>'Resursų prieinamumas',
    'AUTONOMY'=>'Autonomija',
    'SAFETY'=>'Saugumas',
    'KNOWLEDGE'=>'Mokymasis / supratimas',
    'CARE'=>'Rūpestis / pagalba',
    'OPPORTUNITY'=>'Galimybė',
    'CONTROL'=>'Tiesioginis valdymas',
    'ORDER'=>'Tvarka / struktūra',
    'RECOGNITION'=>'Pripažinimas',
];
$bLabels = [
    'RESTORATION_ENERGY'=>'Poilsis ir energija',
    'MATERIAL_RESOURCES'=>'Materialiniai ištekliai',
    'SAFETY_STABILITY'=>'Saugumas ir stabilumas',
    'CLARITY_PREDICTABILITY'=>'Aiškumas ir nuspėjamumas',
    'CONNECTION_BELONGING'=>'Ryšys ir priklausymas',
    'CARE_SUPPORT_PRESENT'=>'Rūpestis ir parama iš kitų',
    'AUTONOMY_AGENCY'=>'Autonomija ir veikimo laisvė',
    'RECOGNITION_ESTEEM'=>'Pripažinimas ir vertinimas',
    'LEARNING_GROWTH'=>'Mokymasis ir augimas',
    'CAPABILITY_MASTERY'=>'Gebėjimai ir meistriškumas',
    'MEANING_PURPOSE'=>'Prasmė ir tikslas',
    'CONTRIBUTION'=>'Prisidėjimas',
];

try {
    $pdo = new PDO(
        'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
        DB_USER,
        DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_EMULATE_PREPARES => false]
    );
} catch (PDOException $e) {
    http_response_code(500);
    exit('Database connection failed.');
}

$mode = $_GET['schema'] ?? 'v04';
$allowedModes = ['v04','v03','all'];
if (!in_array($mode, $allowedModes, true)) $mode = 'v04';

$bankMode = $_GET['bank'] ?? ($mode === 'v04' ? 'v04' : 'all');
$allowedBankModes = ['v04','v031','all'];
if (!in_array($bankMode, $allowedBankModes, true)) $bankMode = ($mode === 'v04' ? 'v04' : 'all');
if ($mode !== 'v04') $bankMode = 'all';

$showSmoke = isset($_GET['show_smoke']) && $_GET['show_smoke'] === '1';
$sql = "SELECT id, submission_id, session_uuid, session_schema, bank_schema, planner_schema, assigner_schema,
               seed, started_at_client, completed_at_client, payload_json, created_at
        FROM priolens_open14_sessions";
$params = [];
if ($mode === 'v04') {
    $sql .= " WHERE session_schema = ?";
    $params[] = '2rasi.priolens.open14.rank-session-v0.4';
    if ($bankMode === 'v04') {
        $sql .= " AND bank_schema = ?";
        $params[] = '2rasi.priolens.open14.bank-v0.4';
    } elseif ($bankMode === 'v031') {
        $sql .= " AND bank_schema = ?";
        $params[] = '2rasi.priolens.open14.bank-v0.3.1';
    }
} elseif ($mode === 'v03') {
    $sql .= " WHERE session_schema = ?";
    $params[] = '2rasi.priolens.open14.rank-session-v0.3';
}
$sql .= " ORDER BY created_at DESC, id DESC";
$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$dbRows = $stmt->fetchAll(PDO::FETCH_ASSOC);

$sessions = [];
$malformed = 0;
$technicalCount = 0;
foreach ($dbRows as $row) {
    $payload = json_decode((string)$row['payload_json'], true);
    if (!is_array($payload)) {
        $malformed++;
        continue;
    }
    $isSmoke = ($payload['systemSmoke'] ?? false) === true;
    if ($isSmoke) {
        $technicalCount++;
        if (!$showSmoke) continue;
    }
    $row['payload'] = $payload;
    $row['is_smoke'] = $isSmoke;
    $sessions[] = $row;
}

if (isset($_GET['export']) && $_GET['export'] === 'jsonl') {
    header('Content-Type: application/x-ndjson; charset=utf-8');
    header('Content-Disposition: attachment; filename="priolens_' . $mode . '_raw.jsonl"');
    foreach ($sessions as $s) {
        echo json_encode([
            'submission_id'=>$s['submission_id'],
            'session_uuid'=>$s['session_uuid'],
            'session_schema'=>$s['session_schema'],
            'bank_schema'=>$s['bank_schema'],
            'created_at'=>$s['created_at'],
            'payload'=>$s['payload'],
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n";
    }
    exit;
}

$familyStats = [];
foreach ($familyLabels as $id=>$label) {
    $familyStats[$id] = ['label'=>$label,'shown'=>0,'most'=>0,'least'=>0];
}
$bStats = [];
foreach ($bLabels as $id=>$label) {
    $bStats[$id] = [
        'label'=>$label,
        'values'=>[],
        'dist'=>[1=>0,2=>0,3=>0,4=>0,5=>0],
        'unknown'=>0,
        'route'=>0,
    ];
}

$total = count($sessions);
$complete = 0;
$incomplete = 0;
$lang = ['lt'=>0,'en'=>0,'other'=>0];
$nccTrials = 0;
$totalTrials = 0;
$mostRt = [];
$leastRt = [];
$mostSlot = [0=>0,1=>0,2=>0];
$mostSlotN = 0;
$aFocus = array_fill_keys(array_keys($familyLabels), 0);
$aNoFocus = 0;
$aPlusSessions = 0;
$aPlusNoClear = 0;
$aSource = [];
$bSource = [];
$bRouteSessions = 0;
$sessionSummaries = [];

foreach ($sessions as $s) {
    $p = $s['payload'];
    $isComplete = $s['completed_at_client'] !== null && $s['completed_at_client'] !== '';
    if ($isComplete) $complete++; else $incomplete++;

    $language = $p['language'] ?? 'other';
    if ($language === 'lt' || $language === 'en') $lang[$language]++; else $lang['other']++;

    $sessionNcc = 0;
    $sessionMostRt = [];
    $choices = getArray($p, 'choices');
    foreach ($choices as $trial) {
        if (!is_array($trial)) continue;
        $totalTrials++;
        $stimuli = getArray($trial, 'stimuli');
        foreach ($stimuli as $stim) {
            if (!is_array($stim)) continue;
            $fid = $stim['familyId'] ?? null;
            if (is_string($fid) && isset($familyStats[$fid])) $familyStats[$fid]['shown']++;
        }

        $noClear = ($trial['noClearChoice'] ?? false) === true;
        if ($noClear) {
            $nccTrials++;
            $sessionNcc++;
        }

        $choice = $trial['choice'] ?? null;
        if (is_array($choice)) {
            $fid = $choice['familyId'] ?? null;
            if (is_string($fid) && isset($familyStats[$fid])) $familyStats[$fid]['most']++;
            $slot = $choice['slot'] ?? null;
            if (is_int($slot) && isset($mostSlot[$slot])) {
                $mostSlot[$slot]++;
                $mostSlotN++;
            }
        }
        if (isset($trial['rtMs']) && is_numeric($trial['rtMs']) && !($trial['mostRevised'] ?? false)) {
            $v = (float)$trial['rtMs'];
            $mostRt[] = $v;
            $sessionMostRt[] = $v;
        }

        $least = $trial['leastChoice'] ?? null;
        if (is_array($least)) {
            $fid = $least['familyId'] ?? null;
            if (is_string($fid) && isset($familyStats[$fid])) $familyStats[$fid]['least']++;
        }
        if (isset($trial['leastRtMs']) && is_numeric($trial['leastRtMs'])) $leastRt[] = (float)$trial['leastRtMs'];
    }

    $focus = $p['attentionFocus'] ?? null;
    $focusId = is_array($focus) && isset($focus['familyId']) ? (string)$focus['familyId'] : '';
    if ($focusId !== '' && isset($aFocus[$focusId])) $aFocus[$focusId]++; else $aNoFocus++;

    $aResolution = getArray($p, 'attentionResolution');
    $aSrc = (string)($aResolution['source'] ?? (is_array($focus) ? ($focus['source'] ?? 'UNKNOWN') : 'UNKNOWN'));
    $aSource[$aSrc] = ($aSource[$aSrc] ?? 0) + 1;
    $aClarifier = $p['attentionClarifier'] ?? null;
    if (is_array($aClarifier)) {
        $aPlusSessions++;
        if (($aClarifier['noClear'] ?? false) === true) $aPlusNoClear++;
    }

    $suff = getArray($p, 'sufficiency');
    foreach ($bStats as $itemId=>$_) {
        if (!array_key_exists($itemId, $suff) || $suff[$itemId] === null) {
            $bStats[$itemId]['unknown']++;
            continue;
        }
        $v = $suff[$itemId];
        if (is_int($v) && $v >= 1 && $v <= 5) {
            $bStats[$itemId]['values'][] = $v;
            $bStats[$itemId]['dist'][$v]++;
        }
    }

    $route = getArray($p, 'sufficiencyRoute');
    $routeItems = isset($route['itemIds']) && is_array($route['itemIds']) ? $route['itemIds'] : [];
    if ($routeItems) $bRouteSessions++;
    foreach ($routeItems as $itemId) {
        if (is_string($itemId) && isset($bStats[$itemId])) $bStats[$itemId]['route']++;
    }
    $suffResolution = getArray($p, 'sufficiencyResolution');
    $bSrc = (string)($route['source'] ?? ($suffResolution['source'] ?? 'UNKNOWN'));
    $bSource[$bSrc] = ($bSource[$bSrc] ?? 0) + 1;

    $sessionSummaries[] = [
        'session_uuid'=>(string)$s['session_uuid'],
        'submission_id'=>(string)$s['submission_id'],
        'created_at'=>(string)$s['created_at'],
        'bank_schema'=>(string)$s['bank_schema'],
        'complete'=>$isComplete,
        'language'=>$language,
        'system_smoke'=>$s['is_smoke'],
        'trials'=>count($choices),
        'ncc'=>$sessionNcc,
        'median_most_rt_ms'=>median($sessionMostRt),
        'focus'=>$focusId,
        'a_source'=>$aSrc,
        'b_route'=>$routeItems,
        'b_source'=>$bSrc,
    ];
}

if (isset($_GET['export']) && $_GET['export'] === 'csv') {
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="priolens_' . $mode . '_sessions.csv"');
    $out = fopen('php://output', 'w');
    fwrite($out, "\xEF\xBB\xBF");
    fputcsv($out, ['session_uuid','submission_id','created_at','bank_schema','complete','language','system_smoke','trials','ncc','median_most_rt_ms','attention_focus','attention_source','sufficiency_route','sufficiency_source']);
    foreach ($sessionSummaries as $x) {
        fputcsv($out, [
            $x['session_uuid'],$x['submission_id'],$x['created_at'],$x['bank_schema'],$x['complete']?1:0,$x['language'],$x['system_smoke']?1:0,
            $x['trials'],$x['ncc'],$x['median_most_rt_ms'],$x['focus'],$x['a_source'],implode('|',$x['b_route']),$x['b_source']
        ]);
    }
    fclose($out);
    exit;
}

arsort($aFocus);
arsort($aSource);
arsort($bSource);

function queryWith(array $changes = []): string {
    $q = $_GET;
    unset($q['export']);
    foreach ($changes as $k=>$v) {
        if ($v === null) unset($q[$k]); else $q[$k] = $v;
    }
    return http_build_query($q);
}
?>
<!doctype html>
<html lang="lt">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>PrioLens Admin</title>
<style>
:root{color-scheme:dark;--bg:#101114;--card:#191b20;--line:#30343b;--muted:#9aa0aa;--text:#ececec;--good:#8de2ae;--warn:#ffd28a}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font-family:system-ui,-apple-system,"Segoe UI",sans-serif}.wrap{max-width:1320px;margin:auto;padding:18px}h1{font-size:1.45rem;margin:0 0 4px}h2{font-size:1.05rem;margin:0 0 10px}.muted{color:var(--muted)}.tiny{font-size:.78rem}.toolbar{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0}.btn{display:inline-block;text-decoration:none;color:#111;background:#e6e6e6;padding:9px 12px;border-radius:9px;font-weight:750}.btn.secondary{color:#ddd;background:#22252b;border:1px solid #3a3f48}.btn.active{outline:2px solid #ddd;outline-offset:2px}.metrics{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:10px;margin:14px 0}.metric,.card{background:var(--card);border:1px solid var(--line);border-radius:14px}.metric{padding:14px}.metric b{display:block;font-size:1.55rem;margin-top:4px}.card{margin:14px 0;overflow:hidden}.cardHead{padding:12px 14px;border-bottom:1px solid var(--line)}.scroll{overflow-x:auto}table{width:100%;border-collapse:collapse;font-size:.84rem}th,td{padding:9px 10px;border-bottom:1px solid #2a2e35;text-align:left;vertical-align:top}th{color:#aeb4bd;font-weight:650;white-space:nowrap}.bar{height:7px;background:#2a2e35;border-radius:999px;overflow:hidden;min-width:90px}.bar>i{display:block;height:100%;background:#d5d5d5}.tag{display:inline-block;padding:3px 7px;border-radius:999px;background:#292d34;color:#c7ccd4;font-size:.73rem}.tag.good{background:#173426;color:var(--good)}.tag.warn{background:#443416;color:var(--warn)}.grid2{display:grid;grid-template-columns:1fr 1fr;gap:14px}.sourceList{padding:10px 14px}.sourceRow{display:flex;justify-content:space-between;gap:10px;padding:6px 0;border-bottom:1px solid #292d34}.sourceRow:last-child{border-bottom:0}.nowrap{white-space:nowrap}
@media(max-width:980px){.metrics{grid-template-columns:repeat(3,1fr)}.grid2{grid-template-columns:1fr}}@media(max-width:620px){.wrap{padding:10px}.metrics{grid-template-columns:1fr 1fr}table{font-size:.76rem}th,td{padding:7px}}
</style>
</head>
<body>
<div class="wrap">
<h1>PrioLens statistika</h1>
<div class="muted">Read-only · <?=h($mode)?><?= $mode==='v04' ? ' · bank '.h($bankMode==='v031'?'v0.3.1':($bankMode==='v04'?'v0.4':'visi')) : '' ?> · techniniai smoke testai <?= $showSmoke ? 'rodomi' : 'neįtraukti' ?></div>

<div class="toolbar">
<a class="btn <?= $mode==='v04'?'active':'secondary' ?>" href="?<?=h(queryWith(['schema'=>'v04','bank'=>'v04']))?>">v0.4</a>
<a class="btn <?= $mode==='v03'?'active':'secondary' ?>" href="?<?=h(queryWith(['schema'=>'v03','bank'=>null]))?>">v0.3</a>
<a class="btn <?= $mode==='all'?'active':'secondary' ?>" href="?<?=h(queryWith(['schema'=>'all','bank'=>null]))?>">Visos</a>
<?php if ($mode==='v04'): ?>
<a class="btn <?= $bankMode==='v04'?'active':'secondary' ?>" href="?<?=h(queryWith(['bank'=>'v04']))?>">Bank v0.4</a>
<a class="btn <?= $bankMode==='v031'?'active':'secondary' ?>" href="?<?=h(queryWith(['bank'=>'v031']))?>">Bank v0.3.1</a>
<a class="btn <?= $bankMode==='all'?'active':'secondary' ?>" href="?<?=h(queryWith(['bank'=>'all']))?>">Visi bankai</a>
<?php endif; ?>
<a class="btn secondary" href="?<?=h(queryWith(['show_smoke'=>$showSmoke?null:'1']))?>"><?= $showSmoke ? 'Slėpti smoke' : 'Rodyti smoke' ?></a>
<a class="btn" href="?<?=h(queryWith())?>&export=csv">CSV</a>
<a class="btn secondary" href="?<?=h(queryWith())?>&export=jsonl">Raw JSONL</a>
<a class="btn secondary" href="?logout=1">Atsijungti</a>
</div>

<div class="metrics">
<div class="metric"><span class="muted">Sesijos</span><b><?=$total?></b></div>
<div class="metric"><span class="muted">Baigtos</span><b><?=$complete?></b><span class="tiny muted"><?=pct($complete,$total)?></span></div>
<div class="metric"><span class="muted">Nebaigtos</span><b><?=$incomplete?></b></div>
<div class="metric"><span class="muted">LT / EN</span><b><?=$lang['lt']?> / <?=$lang['en']?></b></div>
<div class="metric"><span class="muted">NCC</span><b><?=pct($nccTrials,$totalTrials)?></b><span class="tiny muted"><?=$nccTrials?> / <?=$totalTrials?> trijulių</span></div>
<div class="metric"><span class="muted">RT mediana</span><b><?=h(medianMs($mostRt))?></b><span class="tiny muted">LEAST <?=h(medianMs($leastRt))?></span></div>
</div>

<?php if ($technicalCount || $malformed): ?>
<div class="card"><div class="cardHead"><b>Duomenų kokybė</b></div><div class="sourceList">
<div class="sourceRow"><span>Techninės systemSmoke sesijos DB</span><b><?=$technicalCount?></b></div>
<div class="sourceRow"><span>Neperskaitomas payload JSON</span><b><?=$malformed?></b></div>
</div></div>
<?php endif; ?>

<div class="card">
<div class="cardHead"><h2>Channel A: vaizdų kryptys</h2><div class="muted tiny">MOST ir LEAST rodomi atskirai. MOST−LEAST balas neskaičiuojamas.</div></div>
<div class="scroll"><table>
<thead><tr><th>Kryptis</th><th>Parodyta</th><th>MOST</th><th>MOST %</th><th>LEAST</th><th>LEAST % nuo parodymų</th></tr></thead>
<tbody>
<?php foreach ($familyStats as $id=>$s): ?>
<tr>
<td><b><?=h($s['label'])?></b><div class="tiny muted"><?=h($id)?></div></td>
<td><?=$s['shown']?></td>
<td><?=$s['most']?></td>
<td><div><?=pct($s['most'],$s['shown'])?></div><div class="bar"><i style="width:<?=min(100,($s['shown']?($s['most']/$s['shown']*100):0))?>%"></i></div></td>
<td><?=$s['least']?></td>
<td><?=pct($s['least'],$s['shown'])?></td>
</tr>
<?php endforeach; ?>
</tbody>
</table></div>
</div>

<div class="grid2">
<div class="card">
<div class="cardHead"><h2>Galutinis dėmesio fokusas</h2><div class="muted tiny">A+ nekeičia raw MOST skaičių.</div></div>
<div class="sourceList">
<?php foreach ($aFocus as $id=>$n): if ($n<=0) continue; ?>
<div class="sourceRow"><span><?=h($familyLabels[$id] ?? $id)?></span><b><?=$n?> · <?=pct($n,$total)?></b></div>
<?php endforeach; ?>
<div class="sourceRow"><span>Be vieno fokuso</span><b><?=$aNoFocus?> · <?=pct($aNoFocus,$total)?></b></div>
<div class="sourceRow"><span>A+ naudotas</span><b><?=$aPlusSessions?> · <?=pct($aPlusSessions,$total)?></b></div>
<div class="sourceRow"><span>A+ „nė viena aiškiai“</span><b><?=$aPlusNoClear?> · <?=pct($aPlusNoClear,max(1,$aPlusSessions))?></b></div>
</div>
</div>

<div class="card">
<div class="cardHead"><h2>A sprendimo šaltiniai</h2></div>
<div class="sourceList">
<?php foreach ($aSource as $src=>$n): ?><div class="sourceRow"><span class="tiny"><?=h($src)?></span><b><?=$n?> · <?=pct($n,$total)?></b></div><?php endforeach; ?>
</div>
</div>
</div>

<div class="card">
<div class="cardHead"><h2>Channel B: dabartinis pakankamumas</h2><div class="muted tiny">Vidurkis ir mediana tik iš skaitinių 1–5 atsakymų. „Sunku pasakyti“ lieka atskirai.</div></div>
<div class="scroll"><table>
<thead><tr><th>Sritis</th><th>N</th><th>Vid.</th><th>Mediana</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>Sunku pasakyti</th><th>Maršruto taškas</th></tr></thead>
<tbody>
<?php foreach ($bStats as $id=>$s): $avg=mean($s['values']); $med=median($s['values']); ?>
<tr>
<td><b><?=h($s['label'])?></b><div class="tiny muted"><?=h($id)?></div></td>
<td><?=count($s['values'])?></td>
<td><?= $avg===null?'—':number_format($avg,2,'.','') ?></td>
<td><?= $med===null?'—':number_format($med,1,'.','') ?></td>
<?php for($v=1;$v<=5;$v++): ?><td><?=$s['dist'][$v]?></td><?php endfor; ?>
<td><?=$s['unknown']?></td>
<td><b><?=$s['route']?></b> · <?=pct($s['route'],$total)?></td>
</tr>
<?php endforeach; ?>
</tbody>
</table></div>
</div>

<div class="grid2">
<div class="card">
<div class="cardHead"><h2>B maršruto šaltiniai</h2><div class="muted tiny">Sesijų su bent vienu maršruto tašku: <?=$bRouteSessions?> · <?=pct($bRouteSessions,$total)?></div></div>
<div class="sourceList">
<?php foreach ($bSource as $src=>$n): ?><div class="sourceRow"><span class="tiny"><?=h($src)?></span><b><?=$n?> · <?=pct($n,$total)?></b></div><?php endforeach; ?>
</div>
</div>

<div class="card">
<div class="cardHead"><h2>MOST pozicijos diagnostika</h2><div class="muted tiny">Tik UI pozicijos šališkumo kontrolė.</div></div>
<div class="sourceList">
<?php foreach ($mostSlot as $slot=>$n): ?><div class="sourceRow"><span>Pozicija <?=$slot+1?></span><b><?=$n?> · <?=pct($n,$mostSlotN)?></b></div><?php endforeach; ?>
</div>
</div>
</div>

<div class="card">
<div class="cardHead"><h2>Naujausios sesijos</h2><div class="muted tiny">Rodoma iki 100. Pilnas eksportas per CSV arba Raw JSONL.</div></div>
<div class="scroll"><table>
<thead><tr><th>Laikas</th><th>Sesija</th><th>Bankas</th><th>Būsena</th><th>Kalba</th><th>Trijulės</th><th>NCC</th><th>RT med.</th><th>A fokusas</th><th>A šaltinis</th><th>B maršrutas</th><th>B šaltinis</th></tr></thead>
<tbody>
<?php foreach (array_slice($sessionSummaries,0,100) as $x): ?>
<tr>
<td class="nowrap"><?=h($x['created_at'])?></td>
<td><span class="tag"><?=h(shortId($x['session_uuid']))?></span><?php if($x['system_smoke']): ?> <span class="tag warn">SMOKE</span><?php endif; ?></td>
<td><span class="tag"><?=h($x['bank_schema']==='2rasi.priolens.open14.bank-v0.4'?'v0.4':($x['bank_schema']==='2rasi.priolens.open14.bank-v0.3.1'?'v0.3.1':$x['bank_schema']))?></span></td>
<td><span class="tag <?=$x['complete']?'good':'warn'?>"><?=$x['complete']?'BAIGTA':'NEBAIGTA'?></span></td>
<td><?=h(strtoupper((string)$x['language']))?></td>
<td><?=$x['trials']?>/14</td>
<td><?=$x['ncc']?></td>
<td><?= $x['median_most_rt_ms']===null?'—':number_format($x['median_most_rt_ms']/1000,2,'.','').' s' ?></td>
<td><?=h($x['focus']!==''?($familyLabels[$x['focus']]??$x['focus']):'—')?></td>
<td class="tiny"><?=h($x['a_source'])?></td>
<td class="tiny"><?=h(implode(', ',array_map(fn($id)=>$bLabels[$id]??$id,$x['b_route'])))?></td>
<td class="tiny"><?=h($x['b_source'])?></td>
</tr>
<?php endforeach; ?>
</tbody>
</table></div>
</div>

<p class="muted tiny">PrioLens Open14 admin · raw MOST ir LEAST analitiškai atskirti · techniniai systemSmoke testai pagal nutylėjimą neįtraukiami.</p>
</div>
</body>
</html>
