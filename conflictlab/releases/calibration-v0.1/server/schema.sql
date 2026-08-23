-- ConflictLab calibration-v0.1
-- Mechanical timing telemetry only. Separate from Wave 1 storage.

CREATE TABLE IF NOT EXISTS cl_calibration_runs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  message_id CHAR(36) NOT NULL,
  session_id CHAR(36) NOT NULL,
  release_id VARCHAR(64) NOT NULL,
  run_type VARCHAR(16) NOT NULL DEFAULT 'TECHNICAL',
  form_id VARCHAR(16) NOT NULL,
  protocol_version VARCHAR(64) NOT NULL,
  stimulus_set_version VARCHAR(64) NOT NULL,
  block_budget_ms INT UNSIGNED NOT NULL,
  device_category VARCHAR(16) NOT NULL,
  technical_preload_ok TINYINT(1) NOT NULL,
  clean_primary TINYINT(1) NOT NULL,
  exclusion_reason VARCHAR(96) DEFAULT NULL,
  consent_version VARCHAR(64) DEFAULT NULL,
  research_consent TINYINT(1) DEFAULT NULL,
  age_18_confirmed TINYINT(1) DEFAULT NULL,
  deletion_token_hash CHAR(64) DEFAULT NULL,
  received_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  UNIQUE KEY uq_cl_calibration_runs_message (message_id),
  UNIQUE KEY uq_cl_calibration_runs_session (session_id),
  UNIQUE KEY uq_cl_calibration_runs_deletion_token (deletion_token_hash),
  KEY ix_cl_calibration_runs_clean (clean_primary, received_at),
  KEY ix_cl_calibration_runs_type_clean (run_type, clean_primary, received_at),
  KEY ix_cl_calibration_runs_form (form_id, received_at),
  KEY ix_cl_calibration_runs_device (device_category, received_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cl_calibration_attempts (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  run_id BIGINT UNSIGNED NOT NULL,
  block_attempt_id CHAR(36) NOT NULL,
  attempt_number TINYINT UNSIGNED NOT NULL,
  block_budget_ms INT UNSIGNED NOT NULL,
  block_elapsed_ms_final INT UNSIGNED NOT NULL,
  block_timed_out TINYINT(1) NOT NULL,
  page_hidden_during_block TINYINT(1) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_cl_calibration_attempt_id (block_attempt_id),
  UNIQUE KEY uq_cl_calibration_attempt_number (run_id, attempt_number),
  CONSTRAINT fk_cl_calibration_attempt_run
    FOREIGN KEY (run_id) REFERENCES cl_calibration_runs(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cl_calibration_pair_events (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  run_id BIGINT UNSIGNED NOT NULL,
  attempt_id BIGINT UNSIGNED NOT NULL,
  event_id CHAR(36) NOT NULL,
  attempt_number TINYINT UNSIGNED NOT NULL,
  pair_id VARCHAR(32) NOT NULL,
  position_in_block TINYINT UNSIGNED NOT NULL,
  pair_exposure_number TINYINT UNSIGNED DEFAULT NULL,
  pair_presented TINYINT(1) NOT NULL,
  pair_ready_elapsed_ms INT UNSIGNED DEFAULT NULL,
  response_status VARCHAR(16) NOT NULL,
  visual_choice_latency_ms INT UNSIGNED DEFAULT NULL,
  block_elapsed_ms_at_event INT UNSIGNED NOT NULL,
  remaining_budget_at_pair_start_ms INT UNSIGNED DEFAULT NULL,
  page_hidden_before_event TINYINT(1) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_cl_calibration_event_id (event_id),
  UNIQUE KEY uq_cl_calibration_event_position (attempt_id, position_in_block),
  KEY ix_cl_calibration_event_pair (pair_id, attempt_number),
  KEY ix_cl_calibration_event_position_metric (attempt_number, position_in_block),
  CONSTRAINT fk_cl_calibration_event_run
    FOREIGN KEY (run_id) REFERENCES cl_calibration_runs(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_cl_calibration_event_attempt
    FOREIGN KEY (attempt_id) REFERENCES cl_calibration_attempts(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;