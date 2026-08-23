-- ConflictLab calibration-v0.1 -> admin v2 / collection-mode migration
-- Run once on an existing calibration database.
-- Existing rows become TECHNICAL by design, so they cannot enter N/20.

ALTER TABLE cl_calibration_runs
  ADD COLUMN run_type VARCHAR(16) NOT NULL DEFAULT 'TECHNICAL' AFTER release_id,
  ADD KEY ix_cl_calibration_runs_type_clean (run_type, clean_primary, received_at);
