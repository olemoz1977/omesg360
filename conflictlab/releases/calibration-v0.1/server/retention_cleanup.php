<?php
declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

$configPath = __DIR__ . '/config.php';
if (!is_file($configPath)) {
    fwrite(STDERR, "Calibration server not configured.\n");
    exit(2);
}

$config = require $configPath;
if (!is_array($config) || !isset($config['db'])) {
    fwrite(STDERR, "Invalid calibration config.\n");
    exit(2);
}

$retentionDays = (int)($config['retention_days'] ?? 0);
if ($retentionDays < 1 || $retentionDays > 3650) {
    fwrite(STDERR, "Invalid retention_days.\n");
    exit(2);
}

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

    // $retentionDays is a validated integer, so it is safe to embed in the INTERVAL expression.
    // Database/server time remains authoritative for the cutoff. Select only IDs; do not print them.
    $sql = 'SELECT id FROM cl_calibration_runs '
        . 'WHERE received_at < (CURRENT_TIMESTAMP(6) - INTERVAL ' . $retentionDays . ' DAY) '
        . 'ORDER BY id ASC LIMIT 500';
    $runIds = array_map('intval', array_column($pdo->query($sql)->fetchAll(), 'id'));

    if (!$runIds) {
        fwrite(STDOUT, "retention_cleanup deleted_runs=0\n");
        exit(0);
    }

    $pdo->beginTransaction();
    $deleteEvents = $pdo->prepare('DELETE FROM cl_calibration_pair_events WHERE run_id = ?');
    $deleteAttempts = $pdo->prepare('DELETE FROM cl_calibration_attempts WHERE run_id = ?');
    $deleteRun = $pdo->prepare('DELETE FROM cl_calibration_runs WHERE id = ?');

    $deleted = 0;
    foreach ($runIds as $runId) {
        $deleteEvents->execute([$runId]);
        $deleteAttempts->execute([$runId]);
        $deleteRun->execute([$runId]);
        $deleted += $deleteRun->rowCount();
    }
    $pdo->commit();

    fwrite(STDOUT, "retention_cleanup deleted_runs={$deleted}\n");
    exit(0);
} catch (Throwable $e) {
    if (isset($pdo) && $pdo->inTransaction()) $pdo->rollBack();
    fwrite(STDERR, "retention_cleanup failed\n");
    exit(1);
}
