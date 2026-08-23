<?php
// ConflictLab Wave 1 — API v0.4
// v0.4 delta: LT/EN participant UI + language capture.
// Stimulus set and response semantics remain unchanged from v0.3.

header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status'=>'error','message'=>'Method not allowed']);
    exit;
}

$body = json_decode(file_get_contents('php://input'), true);
if (!$body) {
    http_response_code(400);
    echo json_encode(['status'=>'error','message'=>'Invalid JSON']);
    exit;
}

// Required fields.
foreach (['participant_id','candidate_id','language','left_asset','right_asset','choice'] as $f) {
    if (empty($body[$f])) {
        http_response_code(400);
        echo json_encode(['status'=>'error','message'=>"Missing: $f"]);
        exit;
    }
}

$valid_choices    = ['left','right','no_clear_choice'];
$valid_languages  = ['lt','en'];
$valid_candidates = ['CS-PR-01','CS-RE-01','CS-CA-01','CR-PZ-01','CR-FS-01','CR-PO-01'];

if (!in_array($body['choice'], $valid_choices, true)) {
    http_response_code(400);
    echo json_encode(['status'=>'error','message'=>'Invalid choice']);
    exit;
}
if (!in_array($body['language'], $valid_languages, true)) {
    http_response_code(400);
    echo json_encode(['status'=>'error','message'=>'Invalid language']);
    exit;
}
if (!in_array($body['candidate_id'], $valid_candidates, true)) {
    http_response_code(400);
    echo json_encode(['status'=>'error','message'=>'Invalid candidate_id']);
    exit;
}

$participantId = (string)$body['participant_id'];
if (!preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i', $participantId)) {
    http_response_code(400);
    echo json_encode(['status'=>'error','message'=>'Invalid participant_id']);
    exit;
}

$language = (string)$body['language'];

$presentationIndex = isset($body['presentation_index']) ? (int)$body['presentation_index'] : 0;
if ($presentationIndex < 1 || $presentationIndex > 6) {
    http_response_code(400);
    echo json_encode(['status'=>'error','message'=>'Invalid presentation_index']);
    exit;
}

$intensity = null;
if (array_key_exists('intensity', $body) && $body['intensity'] !== null) {
    $intensity = (int)$body['intensity'];
    if ($intensity < 1 || $intensity > 5) {
        http_response_code(400);
        echo json_encode(['status'=>'error','message'=>'Invalid intensity']);
        exit;
    }
}

$hardToIdentify = !empty($body['hard_to_identify']) ? 1 : 0;

$latencyMs = null;
if (array_key_exists('latency_ms', $body) && $body['latency_ms'] !== null) {
    $latencyMs = (int)$body['latency_ms'];
    if ($latencyMs < 0 || $latencyMs > 3600000) {
        http_response_code(400);
        echo json_encode(['status'=>'error','message'=>'Invalid latency_ms']);
        exit;
    }
}

$assetPairs = [
    'CS-PR-01' => ['more-reveal.webp','less-reveal.jpg'],
    'CS-RE-01' => ['more-evidence.png','less-evidence.png'],
    'CS-CA-01' => ['more-reference.png','less-reference.png'],
    'CR-PZ-01' => ['no-predefined-zones.png','predefined-zones.png'],
    'CR-FS-01' => ['fixed-slots.png','continuous-capacity.png'],
    'CR-PO-01' => ['partitioned-space.png','open-space.png'],
];

$leftAsset  = basename((string)$body['left_asset']);
$rightAsset = basename((string)$body['right_asset']);
$expected   = $assetPairs[$body['candidate_id']];

if ($leftAsset === $rightAsset ||
    !in_array($leftAsset, $expected, true) ||
    !in_array($rightAsset, $expected, true)) {
    http_response_code(400);
    echo json_encode(['status'=>'error','message'=>'Invalid asset pair']);
    exit;
}

$freeText = null;
if (array_key_exists('free_text', $body) && $body['free_text'] !== null) {
    $freeText = trim((string)$body['free_text']);
    if ($freeText === '') $freeText = null;
    if ($freeText !== null) $freeText = mb_substr($freeText, 0, 2000);
}

if ($hardToIdentify === 1) {
    $freeText = null;
}

require_once 'config.php';

try {
    $pdo = new PDO(
        "mysql:host=".DB_HOST.";dbname=".DB_NAME.";charset=utf8mb4",
        DB_USER, DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    $stmt = $pdo->prepare("SELECT COUNT(*) FROM responses WHERE participant_id=?");
    $stmt->execute([$participantId]);
    if ($stmt->fetchColumn() > 100) {
        http_response_code(429);
        echo json_encode(['status'=>'error','message'=>'Rate limit']);
        exit;
    }

    $stmt = $pdo->prepare("INSERT IGNORE INTO responses
        (participant_id, candidate_id, protocol_version, language, presentation_index,
         left_asset, right_asset, choice, free_text, intensity, hard_to_identify, latency_ms)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?)");

    $stmt->execute([
        $participantId,
        $body['candidate_id'],
        'wave1-v0.4',
        $language,
        $presentationIndex,
        $leftAsset,
        $rightAsset,
        $body['choice'],
        $freeText,
        $intensity,
        $hardToIdentify,
        $latencyMs,
    ]);

    $inserted = $stmt->rowCount() === 1;
    echo json_encode(['status'=>'ok','inserted'=>$inserted]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status'=>'error','message'=>'DB error']);
    error_log('Wave1 v0.4 api error: '.$e->getMessage());
}
