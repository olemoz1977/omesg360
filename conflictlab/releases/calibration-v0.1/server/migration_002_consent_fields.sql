-- ConflictLab calibration-v0.1
-- Add minimal consent evidence fields to existing calibration runs.
-- Existing TECHNICAL rows remain NULL. Real CALIBRATION uploads must be validated by the API.

ALTER TABLE cl_calibration_runs
  ADD COLUMN consent_version VARCHAR(64) DEFAULT NULL AFTER exclusion_reason,
  ADD COLUMN research_consent TINYINT(1) DEFAULT NULL AFTER consent_version,
  ADD COLUMN age_18_confirmed TINYINT(1) DEFAULT NULL AFTER research_consent;
