-- PrioLens Open14 v0.2 formative pilot
-- Approved storage: dedicated Hostinger MySQL database.
-- Approved retention: 90 days.
-- No name/email/IP/user-agent columns.

CREATE TABLE IF NOT EXISTS priolens_open14_sessions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  submission_id CHAR(36) NOT NULL,
  session_uuid CHAR(36) NOT NULL,
  session_schema VARCHAR(96) NOT NULL,
  bank_schema VARCHAR(96) NOT NULL,
  planner_schema VARCHAR(96) NOT NULL,
  assigner_schema VARCHAR(96) NOT NULL,
  seed VARCHAR(128) NOT NULL,
  started_at_client VARCHAR(40) NULL,
  completed_at_client VARCHAR(40) NULL,
  payload_json LONGTEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP GENERATED ALWAYS AS (created_at + INTERVAL 90 DAY) STORED,
  PRIMARY KEY (id),
  UNIQUE KEY uq_submission_id (submission_id),
  UNIQUE KEY uq_session_uuid (session_uuid),
  KEY idx_created_at (created_at),
  KEY idx_expires_at (expires_at),
  KEY idx_bank_schema (bank_schema)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Retention invariant:
-- rows older than 90 days must be deleted by the retention cleanup job.
-- expires_at is stored explicitly so expiry is auditable.
