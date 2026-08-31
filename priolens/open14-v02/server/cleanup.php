<?php
// PrioLens Open14 v0.2 retention cleanup.
// Intended for Hostinger cron via PHP CLI only.

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

$configPath = __DIR__.'/config.php';
if (!is_file($configPath)) {
    fwrite(STDERR, "Missing config.php\n");
    exit(2);
}
require_once $configPath;

try {
    $pdo = new PDO(
        'mysql:host='.DB_HOST.';dbname='.DB_NAME.';charset=utf8mb4',
        DB_USER,
        DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_EMULATE_PREPARES => false]
    );
    $stmt = $pdo->prepare('DELETE FROM priolens_open14_sessions WHERE expires_at < NOW()');
    $stmt->execute();
    fwrite(STDOUT, 'Deleted '.$stmt->rowCount()." expired row(s)\n");
    exit(0);
} catch (PDOException $e) {
    error_log('PrioLens cleanup error: '.$e->getMessage());
    fwrite(STDERR, "Cleanup failed\n");
    exit(1);
}
