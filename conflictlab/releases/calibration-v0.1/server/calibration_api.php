<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

const MAX_BODY_BYTES = 131072;
const EXPECTED_SCHEMA = 'conflictlab.calibration-run.v1';
const ALLOWED_DEVICE_CATEGORIES = ['mobile', 'tablet', 'desktop', 'unknown'];
const ALLOWED_RUN_TYPES = ['TECHNICAL', 'CALIBRATION'];
const ALLOWED_FORMS = [
    'F2-A' => ['CS-CA-01', 'CR-PZ-01', 'CR-PO-01'],
    'F2-B' => ['CS-PR-01', 'CS-RE-01', 'CR-FS-01'],
];

function respond(int $status, array $payload): never {
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function fail(int $status, string $code, string $message): never {
    respond($status, ['ok' => false, 'code' => $code, 'message' => $message]);
}

function is_uuid(string $value): bool {
    return preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i', $value) === 1;
}

function is_sha256_hex(string $value): bool {
    return preg_match('/^[0-9a-f]{64}$/', $value) === 1;
}

function require_string(array $src, string $key, int $max = 128): string {
    $value = $src[$key] ?? null;
    if (!is_string($value) || $value === '' || strlen($value) > $max) {
        fail(422, 'INVALID_FIELD', "$key is invalid");
    }
    return $value;
}

function require_int(array $src, string $key, int $min, int $max): int {
    $value = $src[$key] ?? null;
    if (!is_int($value) || $value < $min || $value > $max) {
        fail(422, 'INVALID_FIELD', "$key is invalid");
    }
    return $value;
}

function require_bool(array $src, string $key): bool {
    $value = $src[$key] ?? null;
    if (!is_bool($value)) fail(422, 'INVALID_FIELD', "$key is invalid");
    return $value;
}

function nullable_int(array $src, string $key, int $min, int $max): ?int {
    if (!array_key_exists($key, $src) || $src[$key] === null) return null;
    return require_int($src, $key, $min, $max);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    fail(405, 'METHOD_NOT_ALLOWED', 'POST required');
}

$contentType = strtolower((string)($_SERVER['CONTENT_TYPE'] ?? ''));
if (!str_starts_with($contentType, 'application/json')) {
    fail(415, 'UNSUPPORTED_MEDIA_TYPE', 'application/json required');
}

$raw = file_get_contents('php://input');
if ($raw === false || $raw === '') fail(400, 'EMPTY_BODY', 'JSON body required');
if (strlen($raw) > MAX_BODY_BYTES) fail(413, 'PAYLOAD_TOO_LARGE', 'payload too large');

try {
    $payload = json_decode($raw, true, 64, JSON_THROW_ON_ERROR);
} catch (JsonException $e) {
    fail(400, 'INVALID_JSON', 'invalid JSON');
}
if (!is_array($payload)) fail(400, 'INVALID_JSON', 'JSON object required');

$configPath = __DIR__ . '/config.php';
if (!is_file($configPath)) fail(503, 'SERVER_NOT_CONFIGURED', 'calibration server is not configured');
$config = require $configPath;
if (!is_array($config) || !isset($config['db'])) fail(503, 'SERVER_NOT_CONFIGURED', 'invalid server config');
$runType = strtoupper((string)($config['collection_mode'] ?? 'TECHNICAL'));
if (!in_array($runType, ALLOWED_RUN_TYPES, true)) fail(503, 'SERVER_NOT_CONFIGURED', 'invalid collection mode');

$schema = require_string($payload, 'schema');
$messageId = require_string($payload, 'messageId', 36);
$sessionId = require_string($payload, 'sessionId', 36);
$releaseId = require_string($payload, 'releaseId', 64);
$formId = require_string($payload, 'formId', 16);
$protocolVersion = require_string($payload, 'protocolVersion', 64);
$stimulusSetVersion = require_string($payload, 'stimulusSetVersion', 64);
$blockBudgetMs = require_int($payload, 'blockBudgetMs', 1, 60000);
$technicalPreloadOk = require_bool($payload, 'technicalPreloadOk');
$deviceCategory = require_string($payload, 'deviceCategory', 16);

$consentVersion = null;
$researchConsent = null;
$age18Confirmed = null;
$deletionTokenHash = null;
$hasAnyConsentField = array_key_exists('consentVersion', $payload)
    || array_key_exists('researchConsent', $payload)
    || array_key_exists('age18Confirmed', $payload)
    || array_key_exists('deletionTokenHash', $payload);
if ($hasAnyConsentField || $runType === 'CALIBRATION') {
    $consentVersion = require_string($payload, 'consentVersion', 64);
    $researchConsent = require_bool($payload, 'researchConsent');
    $age18Confirmed = require_bool($payload, 'age18Confirmed');
    $deletionTokenHash = require_string($payload, 'deletionTokenHash', 64);
    if (!is_sha256_hex($deletionTokenHash)) fail(422, 'INVALID_DELETION_TOKEN_HASH', 'deletionTokenHash must be lowercase SHA-256 hex');
}

if ($schema !== EXPECTED_SCHEMA) fail(422, 'SCHEMA_MISMATCH', 'unsupported schema');
if (!is_uuid($messageId) || !is_uuid($sessionId)) fail(422, 'INVALID_UUID', 'messageId/sessionId must be UUIDs');
if ($releaseId !== ($config['release_id'] ?? null)) fail(422, 'RELEASE_MISMATCH', 'unexpected release');
if ($protocolVersion !== ($config['protocol_version'] ?? null)) fail(422, 'PROTOCOL_MISMATCH', 'unexpected protocol');
if ($stimulusSetVersion !== ($config['stimulus_set_version'] ?? null)) fail(422, 'STIMULUS_SET_MISMATCH', 'unexpected stimulus set');
if ($blockBudgetMs !== (int)($config['block_budget_ms'] ?? 0)) fail(422, 'BUDGET_MISMATCH', 'unexpected block budget');
if (!$technicalPreloadOk) fail(422, 'PRELOAD_NOT_CONFIRMED', 'research attempt requires successful preload');
if (!array_key_exists($formId, ALLOWED_FORMS)) fail(422, 'INVALID_FORM', 'unknown form');
if (!in_array($deviceCategory, ALLOWED_DEVICE_CATEGORIES, true)) fail(422, 'INVALID_DEVICE_CATEGORY', 'unsupported device category');

if ($runType === 'CALIBRATION') {
    $expectedConsentVersion = (string)($config['consent_version'] ?? '');
    if ($expectedConsentVersion === '') fail(503, 'SERVER_NOT_CONFIGURED', 'consent version not configured');
    if ($consentVersion !== $expectedConsentVersion) fail(422, 'CONSENT_VERSION_MISMATCH', 'unexpected consent version');
    if ($researchConsent !== true) fail(422, 'RESEARCH_CONSENT_REQUIRED', 'affirmative research consent required');
    if ($age18Confirmed !== true) fail(422, 'AGE_CONFIRMATION_REQUIRED', '18+ confirmation required');
    if ($deletionTokenHash === null) fail(422, 'DELETION_TOKEN_REQUIRED', 'deletion token hash required');
}

$attempts = $payload['attempts'] ?? null;
$events = $payload['events'] ?? null;
if (!is_array($attempts) || count($attempts) < 1 || count($attempts) > 3) fail(422, 'INVALID_ATTEMPTS', '1..3 attempts required');
if (!is_array($events) || count($events) !== count($attempts) * 3) fail(422, 'INVALID_EVENTS', 'exactly 3 logical events per attempt required');

$attemptByNumber = [];
foreach ($attempts as $attempt) {
    if (!is_array($attempt)) fail(422, 'INVALID_ATTEMPT', 'attempt must be object');
    $attemptId = require_string($attempt, 'blockAttemptId', 36);
    if (!is_uuid($attemptId)) fail(422, 'INVALID_UUID', 'blockAttemptId must be UUID');
    $number = require_int($attempt, 'blockAttemptNumber', 1, 3);
    if (isset($attemptByNumber[$number])) fail(422, 'DUPLICATE_ATTEMPT', 'attempt number duplicated');
    $budget = require_int($attempt, 'blockBudgetMs', 1, 60000);
    $elapsed = require_int($attempt, 'blockElapsedMsFinal', 0, $blockBudgetMs);
    $timedOut = require_bool($attempt, 'blockTimedOut');
    $hidden = require_bool($attempt, 'pageHiddenDuringBlock');
    $isTraining = require_bool($attempt, 'isTraining');
    $pv = require_string($attempt, 'protocolVersion', 64);
    $sv = require_string($attempt, 'stimulusSetVersion', 64);
    if ($budget !== $blockBudgetMs || $pv !== $protocolVersion || $sv !== $stimulusSetVersion || $isTraining) {
        fail(422, 'ATTEMPT_BOUNDARY_MISMATCH', 'attempt violates calibration boundary');
    }
    $attemptByNumber[$number] = [
        'blockAttemptId' => $attemptId,
        'blockAttemptNumber' => $number,
        'blockBudgetMs' => $budget,
        'blockElapsedMsFinal' => $elapsed,
        'blockTimedOut' => $timedOut,
        'pageHiddenDuringBlock' => $hidden,
    ];
}
ksort($attemptByNumber);
if (array_keys($attemptByNumber) !== range(1, count($attempts))) fail(422, 'ATTEMPT_SEQUENCE', 'attempts must be sequential from 1');

$eventsByAttempt = [];
$seenEventIds = [];
foreach ($events as $event) {
    if (!is_array($event)) fail(422, 'INVALID_EVENT', 'event must be object');
    $eventId = require_string($event, 'eventId', 36);
    if (!is_uuid($eventId) || isset($seenEventIds[$eventId])) fail(422, 'INVALID_EVENT_ID', 'eventId invalid or duplicated');
    $seenEventIds[$eventId] = true;
    $number = require_int($event, 'blockAttemptNumber', 1, 3);
    $attemptId = require_string($event, 'blockAttemptId', 36);
    if (!isset($attemptByNumber[$number]) || $attemptByNumber[$number]['blockAttemptId'] !== $attemptId) {
        fail(422, 'EVENT_ATTEMPT_MISMATCH', 'event attempt mismatch');
    }
    $pairId = require_string($event, 'pairId', 32);
    $position = require_int($event, 'positionInBlock', 1, 3);
    $presented = require_bool($event, 'pairPresented');
    $readyElapsed = nullable_int($event, 'pairReadyElapsedMs', 0, $blockBudgetMs);
    $responseStatus = require_string($event, 'responseStatus', 16);
    $latency = nullable_int($event, 'visualChoiceLatencyMs', 0, $blockBudgetMs);
    $eventElapsed = require_int($event, 'blockElapsedMsAtEvent', 0, $blockBudgetMs);
    $remaining = nullable_int($event, 'remainingBudgetAtPairStartMs', 0, $blockBudgetMs);
    $hiddenBefore = require_bool($event, 'pageHiddenBeforeEvent');
    $exposure = nullable_int($event, 'pairExposureNumber', 1, 20);

    if (!in_array($pairId, ALLOWED_FORMS[$formId], true)) fail(422, 'PAIR_FORM_MISMATCH', 'pair not in selected form');
    if (!in_array($responseStatus, ['choice', 'timeout'], true)) fail(422, 'INVALID_RESPONSE_STATUS', 'invalid response status');
    if ($responseStatus === 'choice' && (!$presented || $latency === null || $readyElapsed === null || $remaining === null)) {
        fail(422, 'CHOICE_EVENT_INCOMPLETE', 'choice event requires presented timing');
    }
    if (!$presented && ($readyElapsed !== null || $remaining !== null || $latency !== null || $exposure !== null)) {
        fail(422, 'UNPRESENTED_EVENT_TIMING', 'unpresented event cannot contain presentation timing');
    }
    if (!$presented && $responseStatus !== 'timeout') fail(422, 'UNPRESENTED_NOT_TIMEOUT', 'unpresented event must be timeout');
    if ($responseStatus === 'timeout' && $latency !== null) fail(422, 'TIMEOUT_LATENCY', 'timeout event cannot contain choice latency');

    $eventsByAttempt[$number][] = [
        'eventId' => $eventId,
        'blockAttemptId' => $attemptId,
        'blockAttemptNumber' => $number,
        'pairId' => $pairId,
        'positionInBlock' => $position,
        'pairExposureNumber' => $exposure,
        'pairPresented' => $presented,
        'pairReadyElapsedMs' => $readyElapsed,
        'responseStatus' => $responseStatus,
        'visualChoiceLatencyMs' => $latency,
        'blockElapsedMsAtEvent' => $eventElapsed,
        'remainingBudgetAtPairStartMs' => $remaining,
        'pageHiddenBeforeEvent' => $hiddenBefore,
    ];
}

foreach ($attemptByNumber as $number => $_attempt) {
    $group = $eventsByAttempt[$number] ?? [];
    if (count($group) !== 3) fail(422, 'EVENT_COUNT_PER_ATTEMPT', 'each attempt requires 3 events');
    $positions = array_map(fn($e) => $e['positionInBlock'], $group);
    sort($positions);
    if ($positions !== [1,2,3]) fail(422, 'POSITION_SET', 'positions must be 1,2,3');
    $pairs = array_map(fn($e) => $e['pairId'], $group);
    sort($pairs);
    $expected = ALLOWED_FORMS[$formId];
    sort($expected);
    if ($pairs !== $expected) fail(422, 'PAIR_SET', 'each attempt must contain the selected form pair set');
}

$primary = $attemptByNumber[1];
$cleanPrimary = !$primary['pageHiddenDuringBlock'];
$exclusionReason = $cleanPrimary ? null : 'PAGE_HIDDEN_DURING_PRIMARY';

try {
    $pdo = new PDO(
        (string)$config['db']['dsn'],
        (string)$config['db']['user'],
        (string)$config['db']['password'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );

    $check = $pdo->prepare('SELECT id, session_id FROM cl_calibration_runs WHERE message_id = ? LIMIT 1');
    $check->execute([$messageId]);
    if ($check->fetch()) respond(200, ['ok' => true, 'idempotent' => true]);

    $checkSession = $pdo->prepare('SELECT id FROM cl_calibration_runs WHERE session_id = ? LIMIT 1');
    $checkSession->execute([$sessionId]);
    if ($checkSession->fetch()) fail(409, 'SESSION_ALREADY_INGESTED', 'session already stored');

    $pdo->beginTransaction();

    $insertRun = $pdo->prepare(
        'INSERT INTO cl_calibration_runs '
        . '(message_id, session_id, release_id, run_type, form_id, protocol_version, stimulus_set_version, block_budget_ms, device_category, technical_preload_ok, clean_primary, exclusion_reason, consent_version, research_consent, age_18_confirmed, deletion_token_hash) '
        . 'VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
    );
    $insertRun->execute([
        $messageId, $sessionId, $releaseId, $runType, $formId, $protocolVersion, $stimulusSetVersion,
        $blockBudgetMs, $deviceCategory, 1, $cleanPrimary ? 1 : 0, $exclusionReason,
        $consentVersion, $researchConsent === null ? null : ($researchConsent ? 1 : 0),
        $age18Confirmed === null ? null : ($age18Confirmed ? 1 : 0), $deletionTokenHash,
    ]);
    $runId = (int)$pdo->lastInsertId();

    $insertAttempt = $pdo->prepare(
        'INSERT INTO cl_calibration_attempts '
        . '(run_id, block_attempt_id, attempt_number, block_budget_ms, block_elapsed_ms_final, block_timed_out, page_hidden_during_block) '
        . 'VALUES (?,?,?,?,?,?,?)'
    );
    $insertEvent = $pdo->prepare(
        'INSERT INTO cl_calibration_pair_events '
        . '(run_id, attempt_id, event_id, attempt_number, pair_id, position_in_block, pair_exposure_number, pair_presented, pair_ready_elapsed_ms, response_status, visual_choice_latency_ms, block_elapsed_ms_at_event, remaining_budget_at_pair_start_ms, page_hidden_before_event) '
        . 'VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
    );

    foreach ($attemptByNumber as $number => $attempt) {
        $insertAttempt->execute([
            $runId, $attempt['blockAttemptId'], $number, $attempt['blockBudgetMs'],
            $attempt['blockElapsedMsFinal'], $attempt['blockTimedOut'] ? 1 : 0,
            $attempt['pageHiddenDuringBlock'] ? 1 : 0,
        ]);
        $attemptDbId = (int)$pdo->lastInsertId();
        foreach ($eventsByAttempt[$number] as $event) {
            $insertEvent->execute([
                $runId, $attemptDbId, $event['eventId'], $number, $event['pairId'],
                $event['positionInBlock'], $event['pairExposureNumber'], $event['pairPresented'] ? 1 : 0,
                $event['pairReadyElapsedMs'], $event['responseStatus'], $event['visualChoiceLatencyMs'],
                $event['blockElapsedMsAtEvent'], $event['remainingBudgetAtPairStartMs'],
                $event['pageHiddenBeforeEvent'] ? 1 : 0,
            ]);
        }
    }

    $pdo->commit();
    respond(201, [
        'ok' => true,
        'idempotent' => false,
        'runType' => $runType,
        'calibrationEligiblePrimary' => ($runType === 'CALIBRATION' && $cleanPrimary),
        'exclusionReason' => $exclusionReason,
    ]);
} catch (PDOException $e) {
    if (isset($pdo) && $pdo->inTransaction()) $pdo->rollBack();
    fail(500, 'STORAGE_ERROR', 'calibration storage failed');
}