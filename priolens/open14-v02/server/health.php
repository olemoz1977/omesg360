<?php
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

$configPath = __DIR__.'/config.php';
if (!is_file($configPath)) {
    http_response_code(503);
    echo json_encode(['ok'=>false,'configured'=>false]);
    exit;
}
require_once $configPath;

try {
    $pdo = new PDO(
        'mysql:host='.DB_HOST.';dbname='.DB_NAME.';charset=utf8mb4',
        DB_USER,
        DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_EMULATE_PREPARES => false]
    );
    $pdo->query('SELECT 1')->fetchColumn();
    $stmt = $pdo->query("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'priolens_open14_sessions'");
    $tableReady = ((int)$stmt->fetchColumn() === 1);
    if (!$tableReady) {
        http_response_code(503);
        echo json_encode(['ok'=>false,'configured'=>true,'database'=>true,'table'=>false]);
        exit;
    }
    echo json_encode(['ok'=>true,'configured'=>true,'database'=>true,'table'=>true]);
} catch (PDOException $e) {
    error_log('PrioLens health error: '.$e->getMessage());
    http_response_code(503);
    echo json_encode(['ok'=>false,'configured'=>true,'database'=>false,'table'=>false]);
}
