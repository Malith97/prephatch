BEGIN;

DO $$
BEGIN
  BEGIN ALTER TYPE membership_status ADD VALUE IF NOT EXISTS 'unknown'; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TYPE lifecycle_status ADD VALUE IF NOT EXISTS 'other'; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TYPE exam_kind ADD VALUE IF NOT EXISTS 'other'; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TYPE question_type ADD VALUE IF NOT EXISTS 'other'; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TYPE attempt_status ADD VALUE IF NOT EXISTS 'unknown'; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TYPE submission_status ADD VALUE IF NOT EXISTS 'unknown'; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TYPE content_type ADD VALUE IF NOT EXISTS 'other'; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TYPE notification_channel ADD VALUE IF NOT EXISTS 'other'; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TYPE notification_status ADD VALUE IF NOT EXISTS 'unknown'; EXCEPTION WHEN duplicate_object THEN NULL; END;
END $$;

CREATE OR REPLACE FUNCTION app.bump_row_version()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.row_version = OLD.row_version + 1;
  RETURN NEW;
END;
$$;

DO $$
DECLARE
  t TEXT;
  deleted_tables TEXT[] := ARRAY[
    'organizations',
    'app_users',
    'organization_members',
    'cohorts',
    'cohort_members',
    'content_items',
    'access_packages',
    'access_package_versions',
    'package_user_assignments',
    'package_cohort_assignments',
    'package_org_assignments',
    'exams',
    'exam_versions',
    'questions',
    'question_versions',
    'exam_attempts',
    'attempt_answers',
    'attempt_results',
    'user_notifications',
    'notification_templates'
  ];
BEGIN
  FOREACH t IN ARRAY deleted_tables LOOP
    EXECUTE format('ALTER TABLE IF EXISTS public.%I ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ', t);
  END LOOP;
END $$;

DO $$
BEGIN
  IF to_regclass('public.exams') IS NOT NULL THEN
    ALTER TABLE public.exams ADD COLUMN IF NOT EXISTS metadata JSONB;
    UPDATE public.exams SET metadata = '{}'::jsonb WHERE metadata IS NULL;
    ALTER TABLE public.exams ALTER COLUMN metadata SET DEFAULT '{}'::jsonb;
    ALTER TABLE public.exams ALTER COLUMN metadata SET NOT NULL;
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint WHERE conname = 'chk_exams_metadata_object' AND conrelid = 'public.exams'::regclass
    ) THEN
      ALTER TABLE public.exams ADD CONSTRAINT chk_exams_metadata_object CHECK (jsonb_typeof(metadata) = 'object');
    END IF;
  END IF;

  IF to_regclass('public.exam_versions') IS NOT NULL THEN
    ALTER TABLE public.exam_versions ADD COLUMN IF NOT EXISTS metadata JSONB;
    UPDATE public.exam_versions SET metadata = '{}'::jsonb WHERE metadata IS NULL;
    ALTER TABLE public.exam_versions ALTER COLUMN metadata SET DEFAULT '{}'::jsonb;
    ALTER TABLE public.exam_versions ALTER COLUMN metadata SET NOT NULL;
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint WHERE conname = 'chk_exam_versions_metadata_object' AND conrelid = 'public.exam_versions'::regclass
    ) THEN
      ALTER TABLE public.exam_versions ADD CONSTRAINT chk_exam_versions_metadata_object CHECK (jsonb_typeof(metadata) = 'object');
    END IF;
  END IF;

  IF to_regclass('public.access_packages') IS NOT NULL THEN
    ALTER TABLE public.access_packages ADD COLUMN IF NOT EXISTS metadata JSONB;
    UPDATE public.access_packages SET metadata = '{}'::jsonb WHERE metadata IS NULL;
    ALTER TABLE public.access_packages ALTER COLUMN metadata SET DEFAULT '{}'::jsonb;
    ALTER TABLE public.access_packages ALTER COLUMN metadata SET NOT NULL;
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint WHERE conname = 'chk_access_packages_metadata_object' AND conrelid = 'public.access_packages'::regclass
    ) THEN
      ALTER TABLE public.access_packages ADD CONSTRAINT chk_access_packages_metadata_object CHECK (jsonb_typeof(metadata) = 'object');
    END IF;
  END IF;

  IF to_regclass('public.access_package_versions') IS NOT NULL THEN
    ALTER TABLE public.access_package_versions ADD COLUMN IF NOT EXISTS metadata JSONB;
    UPDATE public.access_package_versions SET metadata = '{}'::jsonb WHERE metadata IS NULL;
    ALTER TABLE public.access_package_versions ALTER COLUMN metadata SET DEFAULT '{}'::jsonb;
    ALTER TABLE public.access_package_versions ALTER COLUMN metadata SET NOT NULL;
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint WHERE conname = 'chk_access_package_versions_metadata_object' AND conrelid = 'public.access_package_versions'::regclass
    ) THEN
      ALTER TABLE public.access_package_versions ADD CONSTRAINT chk_access_package_versions_metadata_object CHECK (jsonb_typeof(metadata) = 'object');
    END IF;
  END IF;

  IF to_regclass('public.exam_attempts') IS NOT NULL THEN
    ALTER TABLE public.exam_attempts ADD COLUMN IF NOT EXISTS metadata JSONB;
    UPDATE public.exam_attempts SET metadata = '{}'::jsonb WHERE metadata IS NULL;
    ALTER TABLE public.exam_attempts ALTER COLUMN metadata SET DEFAULT '{}'::jsonb;
    ALTER TABLE public.exam_attempts ALTER COLUMN metadata SET NOT NULL;
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint WHERE conname = 'chk_exam_attempts_metadata_object' AND conrelid = 'public.exam_attempts'::regclass
    ) THEN
      ALTER TABLE public.exam_attempts ADD CONSTRAINT chk_exam_attempts_metadata_object CHECK (jsonb_typeof(metadata) = 'object');
    END IF;
  END IF;

  IF to_regclass('public.questions') IS NOT NULL THEN
    ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS metadata JSONB;
    UPDATE public.questions SET metadata = '{}'::jsonb WHERE metadata IS NULL;
    ALTER TABLE public.questions ALTER COLUMN metadata SET DEFAULT '{}'::jsonb;
    ALTER TABLE public.questions ALTER COLUMN metadata SET NOT NULL;
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint WHERE conname = 'chk_questions_metadata_object' AND conrelid = 'public.questions'::regclass
    ) THEN
      ALTER TABLE public.questions ADD CONSTRAINT chk_questions_metadata_object CHECK (jsonb_typeof(metadata) = 'object');
    END IF;
  END IF;

  IF to_regclass('public.question_versions') IS NOT NULL THEN
    ALTER TABLE public.question_versions ADD COLUMN IF NOT EXISTS metadata JSONB;
    UPDATE public.question_versions SET metadata = '{}'::jsonb WHERE metadata IS NULL;
    ALTER TABLE public.question_versions ALTER COLUMN metadata SET DEFAULT '{}'::jsonb;
    ALTER TABLE public.question_versions ALTER COLUMN metadata SET NOT NULL;
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint WHERE conname = 'chk_question_versions_metadata_object' AND conrelid = 'public.question_versions'::regclass
    ) THEN
      ALTER TABLE public.question_versions ADD CONSTRAINT chk_question_versions_metadata_object CHECK (jsonb_typeof(metadata) = 'object');
    END IF;
  END IF;
END $$;

ALTER TABLE IF EXISTS public.attempt_answers ADD COLUMN IF NOT EXISTS row_version INTEGER NOT NULL DEFAULT 1;
ALTER TABLE IF EXISTS public.attempt_results ADD COLUMN IF NOT EXISTS row_version INTEGER NOT NULL DEFAULT 1;
ALTER TABLE IF EXISTS public.attempt_creation_requests ADD COLUMN IF NOT EXISTS row_version INTEGER NOT NULL DEFAULT 1;
ALTER TABLE IF EXISTS public.attempt_submission_requests ADD COLUMN IF NOT EXISTS row_version INTEGER NOT NULL DEFAULT 1;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_attempt_answers_row_version_positive' AND conrelid = 'public.attempt_answers'::regclass
  ) THEN
    ALTER TABLE public.attempt_answers ADD CONSTRAINT chk_attempt_answers_row_version_positive CHECK (row_version > 0);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_attempt_results_row_version_positive' AND conrelid = 'public.attempt_results'::regclass
  ) THEN
    ALTER TABLE public.attempt_results ADD CONSTRAINT chk_attempt_results_row_version_positive CHECK (row_version > 0);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_exam_attempts_row_version_positive' AND conrelid = 'public.exam_attempts'::regclass
  ) THEN
    ALTER TABLE public.exam_attempts ADD CONSTRAINT chk_exam_attempts_row_version_positive CHECK (row_version > 0);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_attempt_creation_requests_row_version_positive' AND conrelid = 'public.attempt_creation_requests'::regclass
  ) THEN
    ALTER TABLE public.attempt_creation_requests ADD CONSTRAINT chk_attempt_creation_requests_row_version_positive CHECK (row_version > 0);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_attempt_submission_requests_row_version_positive' AND conrelid = 'public.attempt_submission_requests'::regclass
  ) THEN
    ALTER TABLE public.attempt_submission_requests ADD CONSTRAINT chk_attempt_submission_requests_row_version_positive CHECK (row_version > 0);
  END IF;
END $$;

DROP TRIGGER IF EXISTS trg_exam_attempts_row_version ON public.exam_attempts;
CREATE TRIGGER trg_exam_attempts_row_version
BEFORE UPDATE ON public.exam_attempts
FOR EACH ROW EXECUTE FUNCTION app.bump_row_version();

DROP TRIGGER IF EXISTS trg_attempt_answers_row_version ON public.attempt_answers;
CREATE TRIGGER trg_attempt_answers_row_version
BEFORE UPDATE ON public.attempt_answers
FOR EACH ROW EXECUTE FUNCTION app.bump_row_version();

DROP TRIGGER IF EXISTS trg_attempt_results_row_version ON public.attempt_results;
CREATE TRIGGER trg_attempt_results_row_version
BEFORE UPDATE ON public.attempt_results
FOR EACH ROW EXECUTE FUNCTION app.bump_row_version();

DROP TRIGGER IF EXISTS trg_attempt_creation_requests_row_version ON public.attempt_creation_requests;
CREATE TRIGGER trg_attempt_creation_requests_row_version
BEFORE UPDATE ON public.attempt_creation_requests
FOR EACH ROW EXECUTE FUNCTION app.bump_row_version();

DROP TRIGGER IF EXISTS trg_attempt_submission_requests_row_version ON public.attempt_submission_requests;
CREATE TRIGGER trg_attempt_submission_requests_row_version
BEFORE UPDATE ON public.attempt_submission_requests
FOR EACH ROW EXECUTE FUNCTION app.bump_row_version();

ALTER TABLE IF EXISTS public.exam_versions ADD COLUMN IF NOT EXISTS version_number INTEGER;
UPDATE public.exam_versions SET version_number = version_no WHERE version_number IS NULL;
ALTER TABLE IF EXISTS public.exam_versions ALTER COLUMN version_number SET NOT NULL;

ALTER TABLE IF EXISTS public.question_versions ADD COLUMN IF NOT EXISTS version_number INTEGER;
UPDATE public.question_versions SET version_number = version_no WHERE version_number IS NULL;
ALTER TABLE IF EXISTS public.question_versions ALTER COLUMN version_number SET NOT NULL;

ALTER TABLE IF EXISTS public.exam_versions ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;
ALTER TABLE IF EXISTS public.question_versions ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_exam_versions_version_number_positive' AND conrelid = 'public.exam_versions'::regclass
  ) THEN
    ALTER TABLE public.exam_versions ADD CONSTRAINT chk_exam_versions_version_number_positive CHECK (version_number > 0);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_question_versions_version_number_positive' AND conrelid = 'public.question_versions'::regclass
  ) THEN
    ALTER TABLE public.question_versions ADD CONSTRAINT chk_question_versions_version_number_positive CHECK (version_number > 0);
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS uq_exam_versions_exam_version_number
  ON public.exam_versions(exam_id, version_number);

CREATE UNIQUE INDEX IF NOT EXISTS uq_question_versions_question_version_number
  ON public.question_versions(question_id, version_number);

CREATE OR REPLACE FUNCTION app.set_published_at_when_published()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.status = 'published' AND NEW.published_at IS NULL THEN
    NEW.published_at = NOW();
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION app.prevent_published_version_mutation()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    IF OLD.published_at IS NOT NULL OR OLD.status IN ('published', 'retired', 'archived') THEN
      RAISE EXCEPTION 'immutable published version row';
    END IF;
    RETURN OLD;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    IF OLD.published_at IS NOT NULL OR OLD.status IN ('published', 'retired', 'archived') THEN
      IF (to_jsonb(NEW) - 'updated_at') IS DISTINCT FROM (to_jsonb(OLD) - 'updated_at') THEN
        RAISE EXCEPTION 'immutable published version row';
      END IF;
    END IF;
    RETURN NEW;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_exam_versions_set_published_at ON public.exam_versions;
CREATE TRIGGER trg_exam_versions_set_published_at
BEFORE INSERT OR UPDATE ON public.exam_versions
FOR EACH ROW EXECUTE FUNCTION app.set_published_at_when_published();

DROP TRIGGER IF EXISTS trg_question_versions_set_published_at ON public.question_versions;
CREATE TRIGGER trg_question_versions_set_published_at
BEFORE INSERT OR UPDATE ON public.question_versions
FOR EACH ROW EXECUTE FUNCTION app.set_published_at_when_published();

DROP TRIGGER IF EXISTS trg_exam_versions_immutable ON public.exam_versions;
CREATE TRIGGER trg_exam_versions_immutable
BEFORE UPDATE OR DELETE ON public.exam_versions
FOR EACH ROW EXECUTE FUNCTION app.prevent_published_version_mutation();

DROP TRIGGER IF EXISTS trg_question_versions_immutable ON public.question_versions;
CREATE TRIGGER trg_question_versions_immutable
BEFORE UPDATE OR DELETE ON public.question_versions
FOR EACH ROW EXECUTE FUNCTION app.prevent_published_version_mutation();

CREATE UNIQUE INDEX IF NOT EXISTS uq_attempt_creation_requests_request_hash
  ON public.attempt_creation_requests(organization_id, user_id, request_hash);

CREATE UNIQUE INDEX IF NOT EXISTS uq_attempt_submission_requests_request_hash
  ON public.attempt_submission_requests(attempt_id, request_hash);

CREATE UNIQUE INDEX IF NOT EXISTS uq_attempt_submission_one_accepted
  ON public.attempt_submission_requests(attempt_id)
  WHERE accepted = TRUE;

CREATE UNIQUE INDEX IF NOT EXISTS uq_attempt_results_one_current
  ON public.attempt_results(attempt_id)
  WHERE is_current = TRUE;

DROP INDEX IF EXISTS uq_cohorts_org_external_id;
CREATE UNIQUE INDEX IF NOT EXISTS uq_cohorts_org_external_id
  ON public.cohorts(organization_id, external_id)
  WHERE external_id IS NOT NULL
    AND deleted_at IS NULL;

DROP INDEX IF EXISTS uq_content_items_org_external_id;
CREATE UNIQUE INDEX IF NOT EXISTS uq_content_items_org_external_id
  ON public.content_items(organization_id, external_id)
  WHERE external_id IS NOT NULL
    AND deleted_at IS NULL;

DROP INDEX IF EXISTS uq_access_packages_org_external_id;
CREATE UNIQUE INDEX IF NOT EXISTS uq_access_packages_org_external_id
  ON public.access_packages(organization_id, external_id)
  WHERE external_id IS NOT NULL
    AND deleted_at IS NULL;

DROP INDEX IF EXISTS uq_access_package_versions_org_external_id;
CREATE UNIQUE INDEX IF NOT EXISTS uq_access_package_versions_org_external_id
  ON public.access_package_versions(organization_id, external_id)
  WHERE external_id IS NOT NULL
    AND deleted_at IS NULL;

DROP INDEX IF EXISTS uq_exams_org_external_id;
CREATE UNIQUE INDEX IF NOT EXISTS uq_exams_org_external_id
  ON public.exams(organization_id, external_id)
  WHERE external_id IS NOT NULL
    AND deleted_at IS NULL;

DROP INDEX IF EXISTS uq_exam_versions_org_external_id;
CREATE UNIQUE INDEX IF NOT EXISTS uq_exam_versions_org_external_id
  ON public.exam_versions(organization_id, external_id)
  WHERE external_id IS NOT NULL
    AND deleted_at IS NULL;

DROP INDEX IF EXISTS uq_questions_org_external_id;
CREATE UNIQUE INDEX IF NOT EXISTS uq_questions_org_external_id
  ON public.questions(organization_id, external_id)
  WHERE external_id IS NOT NULL
    AND deleted_at IS NULL;

DROP INDEX IF EXISTS uq_question_versions_org_external_id;
CREATE UNIQUE INDEX IF NOT EXISTS uq_question_versions_org_external_id
  ON public.question_versions(organization_id, external_id)
  WHERE external_id IS NOT NULL
    AND deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_exam_attempts_org_external_id
  ON public.exam_attempts(organization_id, external_id)
  WHERE external_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_user_notifications_org_external_id
  ON public.user_notifications(organization_id, external_id)
  WHERE external_id IS NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_attempt_creation_requests_idempotency_nonempty' AND conrelid = 'public.attempt_creation_requests'::regclass
  ) THEN
    ALTER TABLE public.attempt_creation_requests
      ADD CONSTRAINT chk_attempt_creation_requests_idempotency_nonempty
      CHECK (length(trim(idempotency_key)) > 0 AND length(trim(request_hash)) > 0);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_attempt_submission_requests_idempotency_nonempty' AND conrelid = 'public.attempt_submission_requests'::regclass
  ) THEN
    ALTER TABLE public.attempt_submission_requests
      ADD CONSTRAINT chk_attempt_submission_requests_idempotency_nonempty
      CHECK (length(trim(idempotency_key)) > 0 AND length(trim(request_hash)) > 0);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_attempt_creation_requests_acceptance_consistency' AND conrelid = 'public.attempt_creation_requests'::regclass
  ) THEN
    ALTER TABLE public.attempt_creation_requests
      ADD CONSTRAINT chk_attempt_creation_requests_acceptance_consistency
      CHECK ((accepted = TRUE AND status = 'accepted') OR (accepted = FALSE AND status <> 'accepted'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_attempt_submission_requests_acceptance_consistency' AND conrelid = 'public.attempt_submission_requests'::regclass
  ) THEN
    ALTER TABLE public.attempt_submission_requests
      ADD CONSTRAINT chk_attempt_submission_requests_acceptance_consistency
      CHECK ((accepted = TRUE AND status = 'accepted') OR (accepted = FALSE AND status <> 'accepted'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_exam_attempts_submission_lifecycle' AND conrelid = 'public.exam_attempts'::regclass
  ) THEN
    ALTER TABLE public.exam_attempts
      ADD CONSTRAINT chk_exam_attempts_submission_lifecycle
      CHECK (
        (status IN ('submitted', 'auto_submitted', 'graded') AND submitted_at IS NOT NULL)
        OR (status NOT IN ('submitted', 'auto_submitted', 'graded') AND submitted_at IS NULL)
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_attempt_results_score_bounds' AND conrelid = 'public.attempt_results'::regclass
  ) THEN
    ALTER TABLE public.attempt_results
      ADD CONSTRAINT chk_attempt_results_score_bounds
      CHECK (raw_score >= 0 AND raw_score <= max_score);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_exam_attempts_started_before_submitted' AND conrelid = 'public.exam_attempts'::regclass
  ) THEN
    ALTER TABLE public.exam_attempts
      ADD CONSTRAINT chk_exam_attempts_started_before_submitted
      CHECK (submitted_at IS NULL OR started_at IS NULL OR submitted_at >= started_at);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_exam_attempts_expiry_after_start' AND conrelid = 'public.exam_attempts'::regclass
  ) THEN
    ALTER TABLE public.exam_attempts
      ADD CONSTRAINT chk_exam_attempts_expiry_after_start
      CHECK (expires_at IS NULL OR started_at IS NULL OR expires_at >= started_at);
  END IF;
END $$;

CREATE OR REPLACE FUNCTION app.enforce_attempt_result_attempt_state()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_org_id UUID;
  v_user_id UUID;
  v_exam_id UUID;
  v_exam_version_id UUID;
  v_status attempt_status;
  v_submitted_at TIMESTAMPTZ;
BEGIN
  SELECT
    ea.organization_id,
    ea.user_id,
    ea.exam_id,
    ea.exam_version_id,
    ea.status,
    ea.submitted_at
  INTO
    v_org_id,
    v_user_id,
    v_exam_id,
    v_exam_version_id,
    v_status,
    v_submitted_at
  FROM public.exam_attempts ea
  WHERE ea.id = NEW.attempt_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'attempt % does not exist', NEW.attempt_id;
  END IF;

  IF NEW.organization_id IS DISTINCT FROM v_org_id THEN
    RAISE EXCEPTION 'attempt_result organization_id does not match attempt organization_id';
  END IF;

  IF NEW.user_id IS DISTINCT FROM v_user_id THEN
    RAISE EXCEPTION 'attempt_result user_id does not match attempt user_id';
  END IF;

  IF NEW.exam_id IS DISTINCT FROM v_exam_id THEN
    RAISE EXCEPTION 'attempt_result exam_id does not match attempt exam_id';
  END IF;

  IF NEW.exam_version_id IS DISTINCT FROM v_exam_version_id THEN
    RAISE EXCEPTION 'attempt_result exam_version_id does not match attempt exam_version_id';
  END IF;

  IF v_status NOT IN ('submitted', 'auto_submitted', 'graded') OR v_submitted_at IS NULL THEN
    RAISE EXCEPTION 'attempt_result requires submitted/graded attempt state';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_attempt_results_enforce_attempt_state ON public.attempt_results;
CREATE TRIGGER trg_attempt_results_enforce_attempt_state
BEFORE INSERT OR UPDATE ON public.attempt_results
FOR EACH ROW EXECUTE FUNCTION app.enforce_attempt_result_attempt_state();

COMMENT ON COLUMN public.exams.metadata IS 'Extensible exam metadata (must be JSON object).';
COMMENT ON COLUMN public.access_packages.metadata IS 'Extensible package metadata (must be JSON object).';
COMMENT ON COLUMN public.exam_attempts.metadata IS 'Extensible attempt metadata (must be JSON object).';
COMMENT ON COLUMN public.questions.metadata IS 'Extensible question metadata (must be JSON object).';
COMMENT ON TABLE public.exam_versions IS 'Published versions are immutable.';
COMMENT ON TABLE public.question_versions IS 'Published versions are immutable.';
COMMENT ON TABLE public.attempt_creation_requests IS 'Idempotent attempt creation requests.';
COMMENT ON TABLE public.attempt_submission_requests IS 'Idempotent attempt submission requests.';

COMMIT;
