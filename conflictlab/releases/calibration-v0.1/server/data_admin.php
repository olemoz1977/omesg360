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
header("Referrer-Policy: no-referrer");

const EXPORT_SCHEMA_VERSION = 'timing-export-v0.1';

$configPath = __DIR__ . '/config.php';
if (!is_file($configPath)) { http_response_code(503); exit('Calibration server not configured.'); }
$config = require $configPath;
if (!is_array($config) || !isset($config['db'])) { http_response_code(503); exit('Invalid calibration config.'); }

function h(mixed $value): string { return htmlspecialchars((string)$value, ENT_QUOTES, 'UTF-8'); }
function redirect_self(): never { header('Location: data_admin.php'); exit; }
function csrf_token(): string {
    if (!isset($_SESSION['cl_data_admin_csrf']) || !is_string($_SESSION['cl_data_admin_csrf'])) {
        $_SESSION['cl_data_admin_csrf'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['cl_data_admin_csrf'];
}
function require_csrf(): void {
    $sent = (string)($_POST['csrf'] ?? '');
    $known = (string)($_SESSION['cl_data_admin_csrf'] ?? '');
    if ($known === '' || !hash_equals($known, $sent)) {
        http_response_code(403);
        exit('Invalid CSRF token.');
    }
}
function valid_deletion_code(string $code): bool { return preg_match('/^[0-9a-f]{32}$/', $code) === 1; }

if (isset($_POST['logout'])) {
    require_csrf();
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
    }
    session_destroy();
    redirect_self();
}

$loginError = null;
if (!($_SESSION['cl_calibration_admin'] ?? false)) {
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['password'])) {
        $hash = (string)($config['admin_password_hash'] ?? '');
        if ($hash !== '' && $hash !== 'CHANGE_ME_PASSWORD_HASH' && password_verify((string)$_POST['password'], $hash)) {
            session_regenerate_id(true);
            $_SESSION['cl_calibration_admin'] = true;
            unset($_SESSION['cl_delete_candidate']);
            csrf_token();
            redirect_self();
        }
        usleep(650000);
        $loginError = 'Neteisingas slaptažodis.';
    }
    ?><!doctype html><html lang="lt"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>ConflictLab data admin</title><style>body{font-family:system-ui;background:#0c0c0f;color:#eee;margin:0;padding:24px}.card{max-width:420px;margin:10vh auto;background:#17171b;border:1px solid #303038;border-radius:16px;padding:20px}input,button{font:inherit;width:100%;padding:12px;margin-top:10px;border-radius:10px}input{background:#0f0f12;color:#eee;border:1px solid #3a3a42}button{border:0;background:#84aa99;color:#08110d;font-weight:700}.err{color:#eaa}</style></head><body><div class="card"><h1>Calibration data admin</h1><p>Deletion + timing CSV only.</p><?php if($loginError):?><p class="err"><?=h($loginError)?></p><?php endif;?><form method="post"><input type="password" name="password" autocomplete="current-password" required><button>Prisijungti</button></form></div></body></html><?php exit;
}

$pdo = new PDO(
    (string)$config['db']['dsn'],
    (string)$config['db']['user'],
    (string)$config['db']['password'],
    [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC,PDO::ATTR_EMULATE_PREPARES=>false]
);
$csrf = csrf_token();

$typeFilter = in_array($_GET['type'] ?? 'CALIBRATION', ['ALL','TECHNICAL','CALIBRATION'], true) ? ($_GET['type'] ?? 'CALIBRATION') : 'CALIBRATION';
$formFilter = in_array($_GET['form'] ?? 'ALL', ['ALL','F2-A','F2-B'], true) ? ($_GET['form'] ?? 'ALL') : 'ALL';
$deviceFilter = in_array($_GET['device'] ?? 'ALL', ['ALL','mobile','tablet','desktop','unknown'], true) ? ($_GET['device'] ?? 'ALL') : 'ALL';
$statusFilter = in_array($_GET['status'] ?? 'ALL', ['ALL','ELIGIBLE','EXCLUDED'], true) ? ($_GET['status'] ?? 'ALL') : 'ALL';

if (($_GET['export'] ?? '') === 'csv') {
    $where = [];
    $args = [];
    if ($typeFilter !== 'ALL') { $where[] = 'r.run_type = ?'; $args[] = $typeFilter; }
    if ($formFilter !== 'ALL') { $where[] = 'r.form_id = ?'; $args[] = $formFilter; }
    if ($deviceFilter !== 'ALL') { $where[] = 'r.device_category = ?'; $args[] = $deviceFilter; }
    if ($statusFilter === 'ELIGIBLE') { $where[] = "r.run_type = 'CALIBRATION' AND r.clean_primary = 1"; }
    if ($statusFilter === 'EXCLUDED') { $where[] = "r.run_type = 'CALIBRATION' AND r.clean_primary = 0"; }
    $sql = 'SELECT '
        . 'r.id AS run_id,r.received_at,r.run_type,r.clean_primary,r.exclusion_reason,r.form_id,r.device_category,'
        . 'r.release_id,r.protocol_version,r.stimulus_set_version,r.block_budget_ms,r.consent_version,r.research_consent,r.age_18_confirmed,'
        . 'a.attempt_number,a.block_elapsed_ms_final,a.block_timed_out,a.page_hidden_during_block,'
        . 'e.pair_id,e.position_in_block,e.pair_exposure_number,e.pair_presented,e.pair_ready_elapsed_ms,e.response_status,'
        . 'e.visual_choice_latency_ms,e.block_elapsed_ms_at_event,e.remaining_budget_at_pair_start_ms,e.page_hidden_before_event '
        . 'FROM cl_calibration_runs r '
        . 'JOIN cl_calibration_attempts a ON a.run_id = r.id '
        . 'JOIN cl_calibration_pair_events e ON e.attempt_id = a.id ';
    if ($where) $sql .= 'WHERE ' . implode(' AND ', array_map(fn($x) => '(' . $x . ')', $where)) . ' ';
    $sql .= 'ORDER BY r.id,a.attempt_number,e.position_in_block';
    $stmt = $pdo->prepare($sql);
    $stmt->execute($args);

    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="conflictlab-' . EXPORT_SCHEMA_VERSION . '-' . gmdate('Ymd-His') . '.csv"');
    header('X-ConflictLab-Export-Schema: ' . EXPORT_SCHEMA_VERSION);
    $out = fopen('php://output', 'wb');
    if ($out === false) exit;
    $header = [
        'export_schema_version','run_id','received_at','run_type','clean_primary','exclusion_reason','form_id','device_category',
        'release_id','protocol_version','stimulus_set_version','block_budget_ms','consent_version','research_consent','age_18_confirmed',
        'attempt_number','block_elapsed_ms_final','block_timed_out','page_hidden_during_block','pair_id','position_in_block',
        'pair_exposure_number','pair_presented','pair_ready_elapsed_ms','response_status','visual_choice_latency_ms',
        'block_elapsed_ms_at_event','remaining_budget_at_pair_start_ms','page_hidden_before_event'
    ];
    fputcsv($out, $header);
    while ($row = $stmt->fetch()) {
        fputcsv($out, [
            EXPORT_SCHEMA_VERSION,$row['run_id'],$row['received_at'],$row['run_type'],$row['clean_primary'],$row['exclusion_reason'],
            $row['form_id'],$row['device_category'],$row['release_id'],$row['protocol_version'],$row['stimulus_set_version'],$row['block_budget_ms'],
            $row['consent_version'],$row['research_consent'],$row['age_18_confirmed'],$row['attempt_number'],$row['block_elapsed_ms_final'],
            $row['block_timed_out'],$row['page_hidden_during_block'],$row['pair_id'],$row['position_in_block'],$row['pair_exposure_number'],
            $row['pair_presented'],$row['pair_ready_elapsed_ms'],$row['response_status'],$row['visual_choice_latency_ms'],$row['block_elapsed_ms_at_event'],
            $row['remaining_budget_at_pair_start_ms'],$row['page_hidden_before_event']
        ]);
    }
    fclose($out);
    exit;
}

$message = null;
$error = null;
$candidate = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['lookup_code'])) {
    require_csrf();
    $code = strtolower(trim((string)$_POST['lookup_code']));
    if (!valid_deletion_code($code)) {
        $error = 'Kodas turi būti 32 šešioliktainių simbolių.';
        unset($_SESSION['cl_delete_candidate']);
    } else {
        $tokenHash = hash('sha256', $code);
        $stmt = $pdo->prepare('SELECT id,run_type,received_at,form_id,device_category FROM cl_calibration_runs WHERE deletion_token_hash = ? LIMIT 1');
        $stmt->execute([$tokenHash]);
        $candidate = $stmt->fetch() ?: null;
        if ($candidate) {
            $_SESSION['cl_delete_candidate'] = ['run_id'=>(int)$candidate['id'],'token_hash'=>$tokenHash];
        } else {
            unset($_SESSION['cl_delete_candidate']);
            $error = 'Pagal šį kodą aktyvaus įrašo nerasta.';
        }
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['confirm_delete'])) {
    require_csrf();
    $saved = $_SESSION['cl_delete_candidate'] ?? null;
    if (!is_array($saved) || !isset($saved['run_id'], $saved['token_hash'])) {
        $error = 'Nėra patvirtinto ištrynimo kandidato.';
    } else {
        $runId = (int)$saved['run_id'];
        $tokenHash = (string)$saved['token_hash'];
        try {
            $pdo->beginTransaction();
            $verify = $pdo->prepare('SELECT id FROM cl_calibration_runs WHERE id = ? AND deletion_token_hash = ? FOR UPDATE');
            $verify->execute([$runId, $tokenHash]);
            if (!$verify->fetch()) throw new RuntimeException('Deletion candidate changed.');
            $pdo->prepare('DELETE FROM cl_calibration_pair_events WHERE run_id = ?')->execute([$runId]);
            $pdo->prepare('DELETE FROM cl_calibration_attempts WHERE run_id = ?')->execute([$runId]);
            $del = $pdo->prepare('DELETE FROM cl_calibration_runs WHERE id = ? AND deletion_token_hash = ?');
            $del->execute([$runId, $tokenHash]);
            if ($del->rowCount() !== 1) throw new RuntimeException('Run not deleted.');
            $pdo->commit();
            unset($_SESSION['cl_delete_candidate']);
            $message = 'Sesija ir visi jos timing įvykiai ištrinti.';
        } catch (Throwable $e) {
            if ($pdo->inTransaction()) $pdo->rollBack();
            $error = 'Ištrynimas nepavyko.';
        }
    }
}

?><!doctype html><html lang="lt"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>ConflictLab calibration data admin</title><style>:root{color-scheme:dark;--bg:#0c0c0f;--card:#17171b;--line:#303038;--text:#eee;--muted:#aaa59c;--accent:#84aa99}*{box-sizing:border-box}body{font-family:system-ui;background:var(--bg);color:var(--text);margin:0;padding:18px}.wrap{max-width:900px;margin:auto}.top{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}.card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:16px;margin:12px 0}.muted{color:var(--muted);font-size:13px}input,select,button{font:inherit;background:#222;color:#eee;border:1px solid #444;border-radius:9px;padding:9px 10px}input[type=text]{width:min(100%,480px)}button{cursor:pointer}.primary{background:var(--accent);color:#08110d;border:0;font-weight:700}.danger{background:#54272a;border-color:#744047}.ok{color:#9fd0b8}.err{color:#e8a5a5}.filters{display:flex;gap:8px;flex-wrap:wrap;align-items:end}.filters label{display:grid;gap:4px;font-size:12px;color:var(--muted)}a{color:#9fcab5;text-decoration:none}</style></head><body><div class="wrap">
<div class="top"><div><div class="muted">ConflictLab · <?=h(EXPORT_SCHEMA_VERSION)?></div><h1>Calibration data admin</h1></div><form method="post"><input type="hidden" name="csrf" value="<?=h($csrf)?>"><button name="logout" value="1">Atsijungti</button></form></div>
<p class="muted">Tik timing datasetas. Deletion token hash ir session/message UUID į CSV neeksportuojami.</p>
<?php if($message):?><p class="ok"><?=h($message)?></p><?php endif;?><?php if($error):?><p class="err"><?=h($error)?></p><?php endif;?>
<div class="card"><h2>Duomenų ištrynimas pagal dalyvio kodą</h2><p class="muted">Įveskite tik dalyvio pateiktą 32 simbolių kodą. Jis hash'inamas serveryje ir nėra saugomas plaintext formatu.</p><form method="post"><input type="hidden" name="csrf" value="<?=h($csrf)?>"><input type="text" name="lookup_code" minlength="32" maxlength="32" pattern="[0-9a-fA-F]{32}" autocomplete="off" required><button class="primary">Rasti</button></form>
<?php if($candidate):?><div class="card"><strong>Rasta sesija</strong><p class="muted">Run #<?=h($candidate['id'])?> · <?=h($candidate['run_type'])?> · <?=h($candidate['received_at'])?> · <?=h($candidate['form_id'])?> · <?=h($candidate['device_category'])?></p><form method="post" onsubmit="return confirm('Tikrai ištrinti visą šios sesijos timing datasetą?');"><input type="hidden" name="csrf" value="<?=h($csrf)?>"><button class="danger" name="confirm_delete" value="1">Patvirtinti ištrynimą</button></form></div><?php endif;?></div>
<div class="card"><h2>Timing CSV eksportas</h2><p class="muted">Eksportas generuojamas tiesiai atsisiuntimui. Failas serveryje neišsaugomas.</p><form class="filters" method="get"><label>Type<select name="type"><?php foreach(['ALL','TECHNICAL','CALIBRATION'] as $v):?><option <?=$typeFilter===$v?'selected':''?>><?=$v?></option><?php endforeach;?></select></label><label>Form<select name="form"><?php foreach(['ALL','F2-A','F2-B'] as $v):?><option <?=$formFilter===$v?'selected':''?>><?=$v?></option><?php endforeach;?></select></label><label>Device<select name="device"><?php foreach(['ALL','mobile','tablet','desktop','unknown'] as $v):?><option <?=$deviceFilter===$v?'selected':''?>><?=$v?></option><?php endforeach;?></select></label><label>Status<select name="status"><?php foreach(['ALL','ELIGIBLE','EXCLUDED'] as $v):?><option <?=$statusFilter===$v?'selected':''?>><?=$v?></option><?php endforeach;?></select></label><button class="primary" name="export" value="csv">Atsisiųsti CSV</button></form></div>
<p><a href="admin.php">← Timing dashboard</a></p>
</div></body></html>
