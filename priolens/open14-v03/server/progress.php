<?php
// PrioLens Open14 v0.3 MOST+LEAST partial-session checkpoint API source.
// Intended deploy target: /priolens-open14-v03-api/progress.php

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

function fail_json(int $status, string $message): void {
    http_response_code($status);
    echo json_encode(['ok'=>false,'message'=>$message], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail_json(405, 'Method not allowed');
if (!empty($_SERVER['HTTP_ORIGIN'])) {
    $allowedOrigins = ['https://omesg360.eu'];
    if (!in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins, true)) fail_json(403, 'Origin not allowed');
}

$contentLength = isset($_SERVER['CONTENT_LENGTH']) ? (int)$_SERVER['CONTENT_LENGTH'] : 0;
if ($contentLength <= 0 || $contentLength > 262144) fail_json(413, 'Invalid payload size');
$raw = file_get_contents('php://input');
if ($raw === false || $raw === '') fail_json(400, 'Empty body');
try { $body = json_decode($raw, true, 64, JSON_THROW_ON_ERROR); }
catch (Throwable $e) { fail_json(400, 'Invalid JSON'); }
if (!is_array($body)) fail_json(400, 'Invalid payload');

$requiredTop = ['schema','sessionUuid','startedAt','completedAt','seed','planSchema','bankSchema','assignerSchema','choices','sufficiencySchema','sufficiency'];
foreach ($requiredTop as $field) if (!array_key_exists($field, $body)) fail_json(400, 'Missing: '.$field);

if (array_key_exists('language', $body) && !in_array($body['language'], ['lt','en'], true)) fail_json(400, 'Invalid language');
if ($body['schema'] !== '2rasi.priolens.open14.rank-session-v0.3') fail_json(400, 'Unsupported session schema');
if ($body['sufficiencySchema'] !== '2rasi.priolens.sufficiency-v0.2') fail_json(400, 'Unsupported sufficiency schema');
if ($body['bankSchema'] !== '2rasi.priolens.open14.bank-v0.3') fail_json(400, 'Unexpected bank schema');
if ($body['planSchema'] !== '2rasi.priolens.p3.open14.plan-v0.2') fail_json(400, 'Unexpected family-plan schema');
if ($body['assignerSchema'] !== '2rasi.priolens.open14.exemplars-v0.3') fail_json(400, 'Unexpected exemplar-assigner schema');
if ($body['completedAt'] !== null) fail_json(400, 'Progress endpoint accepts incomplete sessions only');

$sessionUuid = (string)$body['sessionUuid'];
if (!preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i', $sessionUuid)) fail_json(400, 'Invalid sessionUuid');
$seed = (string)$body['seed'];
if ($seed === '' || strlen($seed) > 128) fail_json(400, 'Invalid seed');
if (!is_string($body['startedAt']) || strlen($body['startedAt']) > 40) fail_json(400, 'Invalid startedAt');

$allowedFamilies = ['REST','RESOURCE','SAFETY','ORDER','CONNECTION','BELONGING','CARE','AUTONOMY','CONTROL','RECOGNITION','MASTERY','EXPLORATION','KNOWLEDGE','OPPORTUNITY'];
$familySet = array_fill_keys($allowedFamilies, true);
if (!is_array($body['choices']) || count($body['choices']) > 14) fail_json(400, 'Expected 0 to 14 choices');

$sessionExemplars = [];
foreach ($body['choices'] as $i => $trial) {
    if (!is_array($trial) || !isset($trial['trialId']) || !is_array($trial['stimuli']) || count($trial['stimuli']) !== 3) fail_json(400, 'Invalid trial at index '.$i);
    if (!is_string($trial['trialId']) || !preg_match('/^O14-\d{2}$/', $trial['trialId'])) fail_json(400, 'Invalid trialId');

    $presented = [];
    foreach ($trial['stimuli'] as $stim) {
        if (!is_array($stim) || !isset($stim['familyId'],$stim['exemplarId'],$stim['slot'])) fail_json(400, 'Invalid stimulus');
        $family=(string)$stim['familyId']; $exemplar=(string)$stim['exemplarId']; $slot=(int)$stim['slot'];
        if (!isset($familySet[$family])) fail_json(400, 'Unknown family');
        if ($slot < 0 || $slot > 2) fail_json(400, 'Invalid slot');
        if (!in_array($exemplar, [$family.'-01',$family.'-02',$family.'-03'], true)) fail_json(400, 'Invalid exemplar');
        $trialKey=$family.'|'.$exemplar.'|'.$slot;
        if (isset($presented[$trialKey])) fail_json(400, 'Duplicate stimulus in trial');
        $presented[$trialKey]=true;
        if (isset($sessionExemplars[$exemplar])) fail_json(400, 'Exact exemplar repeated in partial session');
        $sessionExemplars[$exemplar]=true;
    }
    if (count($presented) !== 3) fail_json(400, 'Duplicate stimulus in trial');

    $noClear = !empty($trial['noClearChoice']);
    if ($noClear) {
        if (array_key_exists('choice',$trial) && $trial['choice'] !== null) fail_json(400, 'noClearChoice conflicts with choice');
        if (array_key_exists('leastChoice',$trial) && $trial['leastChoice'] !== null) fail_json(400, 'noClearChoice conflicts with leastChoice');
        if (array_key_exists('leastTie',$trial) && $trial['leastTie'] !== null) fail_json(400, 'noClearChoice conflicts with leastTie');
        if (array_key_exists('leastRtMs',$trial) && $trial['leastRtMs'] !== null) fail_json(400, 'noClearChoice conflicts with leastRtMs');
    } else {
        if (!isset($trial['choice']) || !is_array($trial['choice'])) fail_json(400, 'Missing choice');
        $c=$trial['choice'];
        if (!isset($c['familyId'],$c['exemplarId'],$c['slot'])) fail_json(400, 'Invalid choice');
        $choiceKey=(string)$c['familyId'].'|'.(string)$c['exemplarId'].'|'.(int)$c['slot'];
        if (!isset($presented[$choiceKey])) fail_json(400, 'Choice was not presented');

        if (!array_key_exists('leastTie',$trial) || !is_bool($trial['leastTie'])) fail_json(400, 'Missing least decision');
        if ($trial['leastTie']) {
            if (array_key_exists('leastChoice',$trial) && $trial['leastChoice'] !== null) fail_json(400, 'leastTie conflicts with leastChoice');
        } else {
            if (!isset($trial['leastChoice']) || !is_array($trial['leastChoice'])) fail_json(400, 'Missing leastChoice');
            $lc=$trial['leastChoice'];
            if (!isset($lc['familyId'],$lc['exemplarId'],$lc['slot'])) fail_json(400, 'Invalid leastChoice');
            $leastKey=(string)$lc['familyId'].'|'.(string)$lc['exemplarId'].'|'.(int)$lc['slot'];
            if (!isset($presented[$leastKey])) fail_json(400, 'leastChoice was not presented');
            if ($leastKey === $choiceKey) fail_json(400, 'leastChoice cannot equal choice');
        }
        if (!array_key_exists('leastRtMs',$trial) || $trial['leastRtMs'] === null) fail_json(400, 'Missing leastRtMs');
        $leastRt=(int)$trial['leastRtMs']; if ($leastRt < 0 || $leastRt > 600000) fail_json(400, 'Invalid leastRtMs');
    }
    if (isset($trial['rtMs']) && $trial['rtMs'] !== null) {
        $rt=(int)$trial['rtMs']; if ($rt < 0 || $rt > 600000) fail_json(400, 'Invalid rtMs');
    }
}

if (array_key_exists('pendingMost', $body) && $body['pendingMost'] !== null) {
    if (count($body['choices']) >= 14) fail_json(400, 'pendingMost not allowed after 14 completed choices');
    if (!is_array($body['pendingMost'])) fail_json(400, 'Invalid pendingMost');
    $pm=$body['pendingMost'];
    if (!isset($pm['familyId'],$pm['exemplarId'],$pm['slot'])) fail_json(400, 'Invalid pendingMost');
    $family=(string)$pm['familyId']; $exemplar=(string)$pm['exemplarId']; $slot=(int)$pm['slot'];
    if (!isset($familySet[$family])) fail_json(400, 'Unknown pendingMost family');
    if ($slot < 0 || $slot > 2) fail_json(400, 'Invalid pendingMost slot');
    if (!in_array($exemplar, [$family.'-01',$family.'-02',$family.'-03'], true)) fail_json(400, 'Invalid pendingMost exemplar');
    if (isset($pm['rtMs']) && $pm['rtMs'] !== null) {
        $rt=(int)$pm['rtMs']; if ($rt < 0 || $rt > 600000) fail_json(400, 'Invalid pendingMost rtMs');
    }
}

$allowedSufficiency = array_fill_keys([
    'RESTORATION_ENERGY','MATERIAL_RESOURCES','SAFETY_STABILITY','CLARITY_PREDICTABILITY',
    'CONNECTION_BELONGING','CARE_SUPPORT_PRESENT','AUTONOMY_AGENCY','RECOGNITION_ESTEEM',
    'LEARNING_GROWTH','CAPABILITY_MASTERY','MEANING_PURPOSE','CONTRIBUTION'
], true);
if (!is_array($body['sufficiency'])) fail_json(400, 'Invalid sufficiency object');
foreach ($body['sufficiency'] as $key=>$v) {
    if (!isset($allowedSufficiency[$key])) fail_json(400, 'Unknown sufficiency item');
    if ($v !== null && (!is_int($v) || $v < 1 || $v > 5)) fail_json(400, 'Invalid sufficiency value');
}

$canonicalPayload = json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
if ($canonicalPayload === false || strlen($canonicalPayload) > 262144) fail_json(413, 'Payload too large');

function uuid_v4(): string {
    $data=random_bytes(16); $data[6]=chr((ord($data[6])&0x0f)|0x40); $data[8]=chr((ord($data[8])&0x3f)|0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data),4));
}

$configPath=__DIR__.'/config.php';
if (!is_file($configPath)) fail_json(503, 'Backend not configured');
require_once $configPath;

try {
    $pdo=new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME.';charset=utf8mb4',DB_USER,DB_PASS,[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,PDO::ATTR_EMULATE_PREPARES=>false]);
    $recentCount=(int)$pdo->query("SELECT COUNT(*) FROM priolens_open14_sessions WHERE created_at >= (NOW() - INTERVAL 1 DAY)")->fetchColumn();
    if ($recentCount > 5000) fail_json(429, 'Submission limit reached');

    $submissionId=uuid_v4();
    $stmt=$pdo->prepare("INSERT INTO priolens_open14_sessions
      (submission_id,session_uuid,session_schema,bank_schema,planner_schema,assigner_schema,seed,started_at_client,completed_at_client,payload_json)
      VALUES (?,?,?,?,?,?,?,?,NULL,?)
      ON DUPLICATE KEY UPDATE
        payload_json=IF(completed_at_client IS NULL, VALUES(payload_json), payload_json),
        session_schema=IF(completed_at_client IS NULL, VALUES(session_schema), session_schema),
        bank_schema=IF(completed_at_client IS NULL, VALUES(bank_schema), bank_schema),
        planner_schema=IF(completed_at_client IS NULL, VALUES(planner_schema), planner_schema),
        assigner_schema=IF(completed_at_client IS NULL, VALUES(assigner_schema), assigner_schema)");
    $stmt->execute([$submissionId,$sessionUuid,$body['schema'],$body['bankSchema'],$body['planSchema'],$body['assignerSchema'],$seed,$body['startedAt'],$canonicalPayload]);

    $q=$pdo->prepare('SELECT submission_id, completed_at_client IS NOT NULL AS completed FROM priolens_open14_sessions WHERE session_uuid=? LIMIT 1');
    $q->execute([$sessionUuid]);
    $row=$q->fetch(PDO::FETCH_ASSOC);
    if (!$row) fail_json(500, 'Checkpoint lookup failed');
    echo json_encode(['ok'=>true,'saved'=>true,'submissionId'=>$row['submission_id'],'completedAlready'=>(bool)$row['completed']]);
} catch (PDOException $e) {
    error_log('PrioLens Open14 v0.3 rank progress API error: '.$e->getMessage());
    fail_json(500, 'Database error');
}
