<?php
declare(strict_types=1);

return [
    'db' => [
        'dsn' => 'mysql:host=localhost;dbname=CHANGE_ME;charset=utf8mb4',
        'user' => 'CHANGE_ME',
        'password' => 'CHANGE_ME',
    ],
    // Create with: php -r "echo password_hash('CHANGE_ME', PASSWORD_DEFAULT), PHP_EOL;"
    'admin_password_hash' => 'CHANGE_ME_PASSWORD_HASH',
    // TECHNICAL runs never count toward N/20. Change to CALIBRATION only before real participant collection.
    'collection_mode' => 'TECHNICAL',
    'release_id' => 'calibration-v0.1',
    'protocol_version' => 'future-rapid-v1',
    'stimulus_set_version' => 'stimulus-set-v1',
    'block_budget_ms' => 6000,
    // CALIBRATION uploads must present this exact affirmative-consent version.
    'consent_version' => 'timing-research-consent-v0.1',
    // Raw/pseudonymous timing-study event retention. Cleanup must be run by a verified server cron.
    'retention_days' => 90,
];