<?php
declare(strict_types=1);

session_start();
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: no-referrer');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

require_once 'config.php';
$rotatedSecret = __DIR__ . '/admin-secret.php';
if (is_file($rotatedSecret)) require_once $rotatedSecret;
$adminPassword = defined('ADMIN_PASSWORD_ROTATED') ? (string)ADMIN_PASSWORD_ROTATED : (defined('ADMIN_PASSWORD') ? (string)ADMIN_PASSWORD : '');

if ($adminPassword === '' || $adminPassword === 'CHANGE_ME') {
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
    if (hash_equals($adminPassword, (string)$_POST['admin_password'])) {
        $_SESSION['wave1_admin'] = true;
        header('Location: admin.php');
        exit;
    }
    $loginError = 'Neteisingas slaptažodis.';
}

if (empty($_SESSION['wave1_admin'])) {
?>
<!doctype html>
<html lang="lt">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>ConflictLab Wave 1 — Admin</title>
<style>
body{font-family:system-ui,-apple-system,sans-serif;background:#0f0f13;color:#eee;margin:0;min-height:100vh;display:grid;place-items:center}
.card{width:min(92vw,420px);background:#18181f;padding:22px;border:1px solid #30303a;border-radius:14px}
h1{font-size:1.2rem;margin:0 0 14px}
input,button{width:100%;box-sizing:border-box;padding:12px;border-radius:9px;font-size:1rem}
input{background:#101016;color:#eee;border:1px solid #3b3b46;margin-bottom:10px}
button{background:#7ecfa0;color:#0f0f13;border:0;font-weight:700}
.err{color:#ff9c9c;margin:8px 0}
.small{color:#888;font-size:.85rem}
</style>
</head>
<body>
<div class="card">
<h1>ConflictLab Wave 1 — Admin</h1>
<?php if ($loginError): ?><div class="err"><?=htmlspecialchars($loginError)?></div><?php endif; ?>
<form method="post">
<input type="password" name="admin_password" placeholder="Slaptažodis" autocomplete="current-password" autofocus>
<button type="submit">Prisijungti</button>
</form>
<p class="small">Tik skaitymui. Dalyvių duomenų redagavimo ar trynimo funkcijų nėra.</p>
</div>
</body>
</html>
<?php
    exit;
}

try {
    $pdo = new PDO(
        "mysql:host=".DB_HOST.";dbname=".DB_NAME.";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (PDOException $e) {
    http_response_code(500);
    exit('Database connection failed.');
}

$allowedProtocols = ['wave1-v0.3','wave1-v0.4'];
$activeProtocol = isset($_GET['protocol']) && in_array($_GET['protocol'], $allowedProtocols, true)
    ? $_GET['protocol']
    : 'wave1-v0.4';

$excludedParticipants = [
    '82d751a8-cbca-4854-9198-75719ea3e437',
];

$pairAssets = [
    'CS-PR-01' => ['more-reveal.webp',        'less-reveal.jpg'],
    'CS-RE-01' => ['more-evidence.png',       'less-evidence.png'],
    'CS-CA-01' => ['more-reference.png',       'less-reference.png'],
    'CR-PZ-01' => ['no-predefined-zones.png', 'predefined-zones.png'],
    'CR-FS-01' => ['fixed-slots.png',          'continuous-capacity.png'],
    'CR-PO-01' => ['partitioned-space.png',    'open-space.png'],
];

function isExcluded(string $participantId, array $excluded): bool {
    return in_array($participantId, $excluded, true);
}

function positionLabel(string $choice): string {
    if ($choice === 'left') return 'Top';
    if ($choice === 'right') return 'Bottom';
    if ($choice === 'no_clear_choice') return 'No clear choice';
    return $choice;
}

function selectedAsset(array $row): ?string {
    if ($row['choice'] === 'left') return $row['left_asset'];
    if ($row['choice'] === 'right') return $row['right_asset'];
    return null;
}

function chosenAssetLabel(array $row): string {
    $asset = selectedAsset($row);
    return $asset ?? '—';
}

function msToSec($ms): string {
    if ($ms === null || $ms === '') return '—';
    return number_format(((int)$ms)/1000, 1).' s';
}

function pct(int $n, int $den): string {
    if ($den <= 0) return '—';
    return number_format(($n / $den) * 100, 0).'%';
}

function queryWith(array $changes = []): string {
    $params = $_GET;
    unset($params['export']);
    foreach ($changes as $k=>$v) {
        if ($v === null) unset($params[$k]);
        else $params[$k] = $v;
    }
    return http_build_query($params);
}

$showExcluded = isset($_GET['show_excluded']) && $_GET['show_excluded'] === '1';

$stmt = $pdo->prepare(
    "SELECT id, participant_id, candidate_id, protocol_version, language, presentation_index,
            left_asset, right_asset, choice, free_text, intensity,
            hard_to_identify, latency_ms, created_at
     FROM responses
     WHERE protocol_version = ?
     ORDER BY created_at ASC, id ASC"
);
$stmt->execute([$activeProtocol]);
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

$participants = [];
foreach ($rows as $r) {
    $pid = $r['participant_id'];
    $excluded = isExcluded($pid, $excludedParticipants);
    if ($excluded && !$showExcluded) continue;
    if (!isset($participants[$pid])) {
        $participants[$pid] = [
            'participant_id'=>$pid,
            'language'=>$r['language'] ?? null,
            'excluded'=>$excluded,
            'rows'=>[],
            'first_at'=>$r['created_at'],
            'last_at'=>$r['created_at'],
        ];
    }
    $participants[$pid]['rows'][] = $r;
    $participants[$pid]['last_at'] = $r['created_at'];
}

foreach ($participants as &$p) {
    usort($p['rows'], fn($a,$b) => ((int)$a['presentation_index']) <=> ((int)$b['presentation_index']));
}
unset($p);

$totalParticipants = count($participants);
$completeSessions = count(array_filter($participants, fn($p)=>count($p['rows'])===6));

$languageCounts = ['lt'=>0,'en'=>0,'unknown'=>0];
foreach ($participants as $p) {
    if ($p['excluded']) continue;
    $lang = $p['language'];
    if ($lang === 'lt' || $lang === 'en') $languageCounts[$lang]++;
    else $languageCounts['unknown']++;
}

$summary = [];
foreach ($pairAssets as $cid => $assets) {
    $summary[$cid] = [
        'assets' => [
            $assets[0] => 0,
            $assets[1] => 0,
        ],
        'ncc' => 0,
        'n' => 0,
    ];
}

$positionDiagnostic = ['top'=>0, 'bottom'=>0, 'image_choices'=>0];

foreach ($participants as $p) {
    if ($p['excluded']) continue;

    foreach ($p['rows'] as $r) {
        $cid = $r['candidate_id'];
        if (!isset($summary[$cid])) continue;

        $summary[$cid]['n']++;

        if ($r['choice'] === 'no_clear_choice') {
            $summary[$cid]['ncc']++;
            continue;
        }

        $asset = selectedAsset($r);
        if ($asset !== null && isset($summary[$cid]['assets'][$asset])) {
            $summary[$cid]['assets'][$asset]++;
        }

        if ($r['choice'] === 'left') {
            $positionDiagnostic['top']++;
            $positionDiagnostic['image_choices']++;
        } elseif ($r['choice'] === 'right') {
            $positionDiagnostic['bottom']++;
            $positionDiagnostic['image_choices']++;
        }
    }
}

if (isset($_GET['export']) && $_GET['export'] === 'csv') {
    header('Content-Type: text/csv; charset=utf-8');
    $safeProtocol = str_replace(['.','/'], ['_','_'], $activeProtocol);
    header('Content-Disposition: attachment; filename="conflictlab_'.$safeProtocol.'.csv"');
    $out = fopen('php://output', 'w');
    fwrite($out, "\xEF\xBB\xBF");
    fputcsv($out, [
        'participant_id','candidate_id','protocol_version','language','presentation_index',
        'top_asset','bottom_asset','choice_position','chosen_asset',
        'free_text','intensity','hard_to_identify','latency_ms','created_at','excluded'
    ]);
    foreach ($participants as $p) {
        foreach ($p['rows'] as $r) {
            fputcsv($out, [
                $r['participant_id'],
                $r['candidate_id'],
                $r['protocol_version'],
                $r['language'],
                $r['presentation_index'],
                $r['left_asset'],
                $r['right_asset'],
                positionLabel($r['choice']),
                chosenAssetLabel($r),
                $r['free_text'],
                $r['intensity'],
                $r['hard_to_identify'],
                $r['latency_ms'],
                $r['created_at'],
                $p['excluded'] ? 1 : 0,
            ]);
        }
    }
    fclose($out);
    exit;
}
?>
<!doctype html>
<html lang="lt">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>ConflictLab Wave 1 — Admin</title>
<style>
:root{color-scheme:dark}
*{box-sizing:border-box}
body{margin:0;background:#0f0f13;color:#e8e4df;font-family:system-ui,-apple-system,'Segoe UI',sans-serif}
.wrap{max-width:1180px;margin:auto;padding:18px}
h1{font-size:1.35rem;margin:0 0 4px}.muted{color:#8b8b94}.tiny{font-size:.78rem}
.toolbar{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0}
a.btn{display:inline-block;text-decoration:none;color:#0f0f13;background:#7ecfa0;padding:9px 12px;border-radius:8px;font-weight:700}
a.btn.secondary{background:#292932;color:#ddd;border:1px solid #3c3c48}
a.btn.active{outline:2px solid #7ecfa0;outline-offset:2px}
.metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:14px 0}
.metric{background:#18181f;border:1px solid #30303a;border-radius:12px;padding:14px}
.metric b{font-size:1.6rem;display:block}
table{width:100%;border-collapse:collapse;font-size:.85rem}
th,td{padding:8px;border-bottom:1px solid #30303a;text-align:left;vertical-align:top}
th{color:#999;font-weight:600}
.card{background:#18181f;border:1px solid #30303a;border-radius:12px;margin:14px 0;overflow:hidden}
.card-head{padding:12px 14px;background:#202028;display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}
.card-body{overflow-x:auto}
.tag{display:inline-block;padding:3px 7px;border-radius:999px;background:#292932;color:#bbb;font-size:.75rem}
.tag.good{background:#173426;color:#93e4b2}.tag.warn{background:#443416;color:#ffd28a}.tag.lang{background:#1e2d40;color:#a9c9f3}
.reason{max-width:300px;white-space:pre-wrap}
.chosen{font-weight:700}.ncc{color:#e4b974}.hard{color:#ffcf86}
.summary{overflow-x:auto;background:#18181f;border:1px solid #30303a;border-radius:12px;margin:14px 0}
@media(max-width:750px){
 .wrap{padding:10px} table{font-size:.78rem} th,td{padding:7px}
 .metrics{grid-template-columns:1fr 1fr}
}
</style>
</head>
<body>
<div class="wrap">
<h1>ConflictLab — Human Wave 1</h1>
<div class="muted">Read-only admin · <?=htmlspecialchars($activeProtocol)?> · standartas: <b>Top / Bottom</b></div>

<div class="toolbar">
<a class="btn <?=$activeProtocol==='wave1-v0.4'?'active':'secondary'?>" href="?protocol=wave1-v0.4">v0.4</a>
<a class="btn <?=$activeProtocol==='wave1-v0.3'?'active':'secondary'?>" href="?protocol=wave1-v0.3">v0.3</a>
<a class="btn" href="?<?=htmlspecialchars(queryWith())?>&export=csv">Eksportuoti CSV</a>
<?php if ($showExcluded): ?>
<a class="btn secondary" href="?<?=htmlspecialchars(queryWith(['show_excluded'=>null]))?>">Slėpti techninius testus</a>
<?php else: ?>
<a class="btn secondary" href="?<?=htmlspecialchars(queryWith(['show_excluded'=>'1']))?>">Rodyti techninius testus</a>
<?php endif; ?>
<a class="btn secondary" href="?logout=1">Atsijungti</a>
</div>

<div class="metrics">
<div class="metric"><span class="muted">Dalyviai</span><b><?=$totalParticipants?></b></div>
<div class="metric"><span class="muted">Pilnos 6/6 sesijos</span><b><?=$completeSessions?></b></div>
<div class="metric"><span class="muted">LT sesijos</span><b><?=$languageCounts['lt']?></b></div>
<div class="metric"><span class="muted">EN sesijos</span><b><?=$languageCounts['en']?></b></div>
</div>

<div class="summary">
<table>
<thead><tr><th>Pora</th><th>Vaizdas / atsakymas</th><th>Pasirinko</th><th>%</th><th>Poros N</th></tr></thead>
<tbody>
<?php foreach ($summary as $cid=>$s): ?>
<?php $rowspan = count($s['assets']) + 1; $first = true; ?>
<?php foreach ($s['assets'] as $assetName=>$count): ?>
<?php $isFirst = $first; ?>
<tr>
<?php if ($isFirst): ?><td rowspan="<?=$rowspan?>"><b><?=htmlspecialchars($cid)?></b></td><?php endif; ?>
<td><?=htmlspecialchars($assetName)?></td>
<td><?=$count?></td>
<td><?=htmlspecialchars(pct($count, $s['n']))?></td>
<?php if ($isFirst): ?><td rowspan="<?=$rowspan?>" style="vertical-align:middle"><b><?=$s['n']?></b></td><?php endif; ?>
</tr>
<?php $first = false; ?>
<?php endforeach; ?>
<tr>
<td><span class="ncc">No clear choice</span></td>
<td><?=$s['ncc']?></td>
<td><?=htmlspecialchars(pct($s['ncc'], $s['n']))?></td>
</tr>
<?php endforeach; ?>
</tbody>
</table>
</div>

<div class="card">
<div class="card-head">
<div><b>Top / Bottom diagnostika</b><div class="muted tiny">Tik informacinė pozicijos šališkumo kontrolė; ne pagrindinis rezultatas.</div></div>
</div>
<div class="card-body">
<table>
<thead><tr><th>Pozicija</th><th>Pasirinkta</th><th>% tarp aiškių vaizdo pasirinkimų</th></tr></thead>
<tbody>
<tr><td>Top</td><td><?=$positionDiagnostic['top']?></td><td><?=htmlspecialchars(pct($positionDiagnostic['top'], $positionDiagnostic['image_choices']))?></td></tr>
<tr><td>Bottom</td><td><?=$positionDiagnostic['bottom']?></td><td><?=htmlspecialchars(pct($positionDiagnostic['bottom'], $positionDiagnostic['image_choices']))?></td></tr>
</tbody>
</table>
</div>
</div>

<?php if (!$participants): ?>
<div class="card"><div class="card-head">Dar nėra rodomų <?=htmlspecialchars($activeProtocol)?> sesijų.</div></div>
<?php endif; ?>

<?php foreach ($participants as $p): ?>
<div class="card">
<div class="card-head">
<div>
<b><?=htmlspecialchars(substr($p['participant_id'],0,8))?>…</b>
<span class="tag <?=$p['excluded']?'warn':'good'?>"><?=$p['excluded']?'TECH / EXCLUDE':'RESEARCH'?></span>
<span class="tag lang"><?=htmlspecialchars(strtoupper($p['language'] ?? '—'))?></span>
</div>
<div class="muted tiny"><?=htmlspecialchars($p['first_at'])?> · <?=count($p['rows'])?>/6</div>
</div>
<div class="card-body">
<table>
<thead>
<tr>
<th>#</th><th>Lang</th><th>Pora</th><th>Top</th><th>Bottom</th><th>Pozicija</th><th>Pasirinktas vaizdas</th><th>Free text</th><th>Intensity</th><th>Sunku įvardyti</th><th>Latency</th>
</tr>
</thead>
<tbody>
<?php foreach ($p['rows'] as $r): ?>
<tr>
<td><?=htmlspecialchars((string)$r['presentation_index'])?></td>
<td><?=htmlspecialchars(strtoupper($r['language'] ?? '—'))?></td>
<td><b><?=htmlspecialchars($r['candidate_id'])?></b></td>
<td><?=htmlspecialchars($r['left_asset'])?></td>
<td><?=htmlspecialchars($r['right_asset'])?></td>
<td><?=htmlspecialchars(positionLabel($r['choice']))?></td>
<td class="chosen <?= $r['choice']==='no_clear_choice' ? 'ncc' : '' ?>"><?=htmlspecialchars(chosenAssetLabel($r))?></td>
<td class="reason"><?= $r['free_text']!==null ? htmlspecialchars($r['free_text']) : '<span class="muted">—</span>' ?></td>
<td><?= $r['intensity']!==null ? htmlspecialchars((string)$r['intensity']) : '<span class="muted">—</span>' ?></td>
<td><?= ((int)$r['hard_to_identify']===1) ? '<span class="hard">Taip</span>' : 'Ne' ?></td>
<td><?=htmlspecialchars(msToSec($r['latency_ms']))?></td>
</tr>
<?php endforeach; ?>
</tbody>
</table>
</div>
</div>
<?php endforeach; ?>

<p class="muted tiny">
Pastaba: DB techniniai pavadinimai <code>left/right</code> nekeisti dėl istorinių duomenų tęstinumo.
Šiame lange jie interpretuojami kaip <b>Top/Bottom</b>. v0.4 papildomai saugo dalyvio sąsajos kalbą <b>LT/EN</b>.
Raw atsakymai čia neredaguojami.
</p>
</div>
</body>
</html>
