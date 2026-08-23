-- ConflictLab calibration-v0.1
-- Add privacy-preserving lookup handle for withdrawal / erasure requests.
-- Plaintext participant deletion codes are never stored server-side.

ALTER TABLE cl_calibration_runs
  ADD COLUMN deletion_token_hash CHAR(64) DEFAULT NULL AFTER age_18_confirmed,
  ADD UNIQUE KEY uq_cl_calibration_runs_deletion_token (deletion_token_hash);
