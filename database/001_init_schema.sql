BEGIN;

CREATE SCHEMA IF NOT EXISTS app;
CREATE SCHEMA IF NOT EXISTS audit;
CREATE SCHEMA IF NOT EXISTS analytics;

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE app_role AS ENUM ('student', 'instructor', 'admin', 'super_admin');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'membership_status') THEN
    CREATE TYPE membership_status AS ENUM ('invited', 'active', 'suspended', 'left');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lifecycle_status') THEN
    CREATE TYPE lifecycle_status AS ENUM ('draft', 'published', 'retired', 'archived');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'exam_kind') THEN
    CREATE TYPE exam_kind AS ENUM ('certification', 'mock', 'practice');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'question_type') THEN
    CREATE TYPE question_type AS ENUM ('single_choice', 'multiple_choice', 'true_false', 'short_text', 'essay', 'numeric', 'file_upload');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'attempt_status') THEN
    CREATE TYPE attempt_status AS ENUM ('created', 'in_progress', 'submitted', 'auto_submitted', 'graded', 'expired', 'cancelled');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'submission_status') THEN
    CREATE TYPE submission_status AS ENUM ('processing', 'accepted', 'rejected', 'failed');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'content_type') THEN
    CREATE TYPE content_type AS ENUM ('lesson', 'video', 'document', 'link');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_channel') THEN
    CREATE TYPE notification_channel AS ENUM ('email', 'in_app', 'sms', 'webhook');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_status') THEN
    CREATE TYPE notification_status AS ENUM ('queued', 'sent', 'delivered', 'read', 'failed');
  END IF;
END $$;

CREATE OR REPLACE FUNCTION app.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug CITEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS app_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE RESTRICT,
  display_name TEXT,
  avatar_url TEXT,
  default_role app_role NOT NULL DEFAULT 'student',
  timezone TEXT NOT NULL DEFAULT 'UTC',
  locale TEXT NOT NULL DEFAULT 'en',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE RESTRICT,
  role app_role NOT NULL,
  status membership_status NOT NULL DEFAULT 'active',
  invited_by UUID REFERENCES app_users(id) ON DELETE SET NULL,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_org_member UNIQUE (organization_id, user_id)
);

CREATE TABLE IF NOT EXISTS cohorts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  code CITEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  external_id TEXT,
  created_by UUID REFERENCES app_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_cohort_org_code UNIQUE (organization_id, code),
  CONSTRAINT uq_cohort_id_org UNIQUE (id, organization_id),
  CONSTRAINT chk_cohort_dates CHECK (ends_at IS NULL OR starts_at IS NULL OR ends_at >= starts_at)
);

CREATE TABLE IF NOT EXISTS cohort_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  cohort_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE RESTRICT,
  role app_role NOT NULL DEFAULT 'student',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_cohort_members_cohort_org
    FOREIGN KEY (cohort_id, organization_id)
    REFERENCES cohorts(id, organization_id)
    ON DELETE CASCADE,
  CONSTRAINT uq_cohort_member UNIQUE (cohort_id, user_id),
  CONSTRAINT chk_cohort_member_role CHECK (role IN ('student', 'instructor', 'admin', 'super_admin'))
);

CREATE TABLE IF NOT EXISTS app_login_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE RESTRICT,
  refresh_token_hash TEXT NOT NULL UNIQUE,
  device_fingerprint TEXT,
  ip INET,
  user_agent TEXT,
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  content_type content_type NOT NULL,
  title TEXT NOT NULL,
  uri TEXT,
  external_id TEXT,
  created_by UUID REFERENCES app_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_content_items_id_org UNIQUE (id, organization_id)
);

CREATE TABLE IF NOT EXISTS access_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  code CITEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  external_id TEXT,
  created_by UUID REFERENCES app_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_package_org_code UNIQUE (organization_id, code),
  CONSTRAINT uq_package_id_org UNIQUE (id, organization_id)
);

CREATE TABLE IF NOT EXISTS access_package_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID NOT NULL,
  organization_id UUID NOT NULL,
  version_no INTEGER NOT NULL CHECK (version_no > 0),
  status lifecycle_status NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  effective_from TIMESTAMPTZ,
  effective_until TIMESTAMPTZ,
  external_id TEXT,
  created_by UUID REFERENCES app_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_package_versions_package_org
    FOREIGN KEY (package_id, organization_id)
    REFERENCES access_packages(id, organization_id)
    ON DELETE RESTRICT,
  CONSTRAINT uq_package_version UNIQUE (package_id, version_no),
  CONSTRAINT uq_package_version_id_org UNIQUE (id, organization_id),
  CONSTRAINT chk_package_effective_range CHECK (
    effective_until IS NULL OR effective_from IS NULL OR effective_until >= effective_from
  )
);

CREATE TABLE IF NOT EXISTS exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  exam_code CITEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  kind exam_kind NOT NULL DEFAULT 'certification',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  external_id TEXT,
  created_by UUID REFERENCES app_users(id) ON DELETE SET NULL,
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_exam_org_code UNIQUE (organization_id, exam_code),
  CONSTRAINT uq_exam_id_org UNIQUE (id, organization_id)
);

CREATE TABLE IF NOT EXISTS exam_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID NOT NULL,
  organization_id UUID NOT NULL,
  version_no INTEGER NOT NULL CHECK (version_no > 0),
  status lifecycle_status NOT NULL DEFAULT 'draft',
  title_override TEXT,
  instructions TEXT,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  availability_start_at TIMESTAMPTZ,
  availability_end_at TIMESTAMPTZ,
  submission_deadline_at TIMESTAMPTZ,
  max_attempts_per_user SMALLINT NOT NULL DEFAULT 1 CHECK (max_attempts_per_user > 0),
  allow_resume BOOLEAN NOT NULL DEFAULT TRUE,
  shuffle_questions BOOLEAN NOT NULL DEFAULT FALSE,
  shuffle_options BOOLEAN NOT NULL DEFAULT FALSE,
  pass_score NUMERIC(5,2) NOT NULL DEFAULT 70.00 CHECK (pass_score >= 0 AND pass_score <= 100),
  grading_policy JSONB NOT NULL DEFAULT '{}'::jsonb,
  supersedes_version_id UUID REFERENCES exam_versions(id) ON DELETE SET NULL,
  external_id TEXT,
  published_at TIMESTAMPTZ,
  created_by UUID REFERENCES app_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_exam_versions_exam_org
    FOREIGN KEY (exam_id, organization_id)
    REFERENCES exams(id, organization_id)
    ON DELETE RESTRICT,
  CONSTRAINT uq_exam_version UNIQUE (exam_id, version_no),
  CONSTRAINT uq_exam_version_id_org UNIQUE (id, organization_id),
  CONSTRAINT uq_exam_version_id_exam_org UNIQUE (id, exam_id, organization_id),
  CONSTRAINT chk_exam_availability CHECK (
    availability_end_at IS NULL OR availability_start_at IS NULL OR availability_end_at >= availability_start_at
  ),
  CONSTRAINT chk_exam_deadline CHECK (
    submission_deadline_at IS NULL OR availability_start_at IS NULL OR submission_deadline_at >= availability_start_at
  )
);

CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  question_code CITEXT NOT NULL,
  category TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}'::text[],
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  external_id TEXT,
  created_by UUID REFERENCES app_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_question_org_code UNIQUE (organization_id, question_code),
  CONSTRAINT uq_question_id_org UNIQUE (id, organization_id)
);

CREATE TABLE IF NOT EXISTS question_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL,
  organization_id UUID NOT NULL,
  version_no INTEGER NOT NULL CHECK (version_no > 0),
  status lifecycle_status NOT NULL DEFAULT 'draft',
  question_type question_type NOT NULL,
  prompt TEXT NOT NULL,
  prompt_rich JSONB NOT NULL DEFAULT '{}'::jsonb,
  options JSONB NOT NULL DEFAULT '[]'::jsonb,
  correct_answer JSONB NOT NULL,
  explanation TEXT,
  difficulty SMALLINT CHECK (difficulty BETWEEN 1 AND 5),
  default_points NUMERIC(8,2) NOT NULL DEFAULT 1.00 CHECK (default_points >= 0),
  external_id TEXT,
  created_by UUID REFERENCES app_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_question_versions_question_org
    FOREIGN KEY (question_id, organization_id)
    REFERENCES questions(id, organization_id)
    ON DELETE RESTRICT,
  CONSTRAINT uq_question_version UNIQUE (question_id, version_no),
  CONSTRAINT uq_question_version_id_org UNIQUE (id, organization_id)
);

CREATE TABLE IF NOT EXISTS exam_version_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_version_id UUID NOT NULL,
  organization_id UUID NOT NULL,
  section_key TEXT,
  title TEXT NOT NULL,
  description TEXT,
  position INTEGER NOT NULL CHECK (position > 0),
  time_limit_minutes INTEGER CHECK (time_limit_minutes > 0),
  weight NUMERIC(6,2) NOT NULL DEFAULT 1.00 CHECK (weight > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_exam_version_sections_exam_version_org
    FOREIGN KEY (exam_version_id, organization_id)
    REFERENCES exam_versions(id, organization_id)
    ON DELETE CASCADE,
  CONSTRAINT uq_section_id_org UNIQUE (id, organization_id),
  CONSTRAINT uq_section_position UNIQUE (exam_version_id, position),
  CONSTRAINT uq_section_key UNIQUE (exam_version_id, section_key)
);

CREATE TABLE IF NOT EXISTS exam_version_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_version_id UUID NOT NULL,
  organization_id UUID NOT NULL,
  section_id UUID,
  question_version_id UUID NOT NULL,
  position INTEGER NOT NULL CHECK (position > 0),
  points NUMERIC(8,2) NOT NULL CHECK (points >= 0),
  is_required BOOLEAN NOT NULL DEFAULT TRUE,
  scoring_rule JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_exam_version_questions_exam_version_org
    FOREIGN KEY (exam_version_id, organization_id)
    REFERENCES exam_versions(id, organization_id)
    ON DELETE CASCADE,
  CONSTRAINT fk_exam_version_questions_section_org
    FOREIGN KEY (section_id, organization_id)
    REFERENCES exam_version_sections(id, organization_id)
    ON DELETE RESTRICT,
  CONSTRAINT fk_exam_version_questions_question_version_org
    FOREIGN KEY (question_version_id, organization_id)
    REFERENCES question_versions(id, organization_id)
    ON DELETE RESTRICT,
  CONSTRAINT uq_evq_id_org UNIQUE (id, organization_id),
  CONSTRAINT uq_evq_position UNIQUE (exam_version_id, position)
);

CREATE TABLE IF NOT EXISTS access_package_exam_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_version_id UUID NOT NULL,
  organization_id UUID NOT NULL,
  exam_version_id UUID NOT NULL,
  position INTEGER NOT NULL DEFAULT 1 CHECK (position > 0),
  is_required BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_package_exam_items_package_version_org
    FOREIGN KEY (package_version_id, organization_id)
    REFERENCES access_package_versions(id, organization_id)
    ON DELETE CASCADE,
  CONSTRAINT fk_package_exam_items_exam_version_org
    FOREIGN KEY (exam_version_id, organization_id)
    REFERENCES exam_versions(id, organization_id)
    ON DELETE RESTRICT,
  CONSTRAINT uq_package_exam_item UNIQUE (package_version_id, exam_version_id),
  CONSTRAINT uq_package_exam_position UNIQUE (package_version_id, position)
);

CREATE TABLE IF NOT EXISTS access_package_content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_version_id UUID NOT NULL,
  organization_id UUID NOT NULL,
  content_item_id UUID NOT NULL,
  position INTEGER NOT NULL DEFAULT 1 CHECK (position > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_package_content_items_package_version_org
    FOREIGN KEY (package_version_id, organization_id)
    REFERENCES access_package_versions(id, organization_id)
    ON DELETE CASCADE,
  CONSTRAINT fk_package_content_items_content_org
    FOREIGN KEY (content_item_id, organization_id)
    REFERENCES content_items(id, organization_id)
    ON DELETE RESTRICT,
  CONSTRAINT uq_package_content_item UNIQUE (package_version_id, content_item_id),
  CONSTRAINT uq_package_content_position UNIQUE (package_version_id, position)
);

CREATE TABLE IF NOT EXISTS package_user_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  package_version_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE RESTRICT,
  assigned_by UUID REFERENCES app_users(id) ON DELETE SET NULL,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_package_user_assignments_package_version_org
    FOREIGN KEY (package_version_id, organization_id)
    REFERENCES access_package_versions(id, organization_id)
    ON DELETE RESTRICT,
  CONSTRAINT uq_package_user_assignment UNIQUE (package_version_id, user_id),
  CONSTRAINT chk_package_user_validity CHECK (valid_until IS NULL OR valid_until >= valid_from)
);

CREATE TABLE IF NOT EXISTS package_cohort_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  package_version_id UUID NOT NULL,
  cohort_id UUID NOT NULL,
  assigned_by UUID REFERENCES app_users(id) ON DELETE SET NULL,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_package_cohort_assignments_package_version_org
    FOREIGN KEY (package_version_id, organization_id)
    REFERENCES access_package_versions(id, organization_id)
    ON DELETE RESTRICT,
  CONSTRAINT fk_package_cohort_assignments_cohort_org
    FOREIGN KEY (cohort_id, organization_id)
    REFERENCES cohorts(id, organization_id)
    ON DELETE RESTRICT,
  CONSTRAINT uq_package_cohort_assignment UNIQUE (package_version_id, cohort_id),
  CONSTRAINT chk_package_cohort_validity CHECK (valid_until IS NULL OR valid_until >= valid_from)
);

CREATE TABLE IF NOT EXISTS package_org_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  package_version_id UUID NOT NULL,
  assigned_by UUID REFERENCES app_users(id) ON DELETE SET NULL,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_package_org_assignments_package_version_org
    FOREIGN KEY (package_version_id, organization_id)
    REFERENCES access_package_versions(id, organization_id)
    ON DELETE RESTRICT,
  CONSTRAINT uq_package_org_assignment UNIQUE (organization_id, package_version_id),
  CONSTRAINT chk_package_org_validity CHECK (valid_until IS NULL OR valid_until >= valid_from)
);

CREATE TABLE IF NOT EXISTS attempt_creation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE RESTRICT,
  exam_id UUID NOT NULL,
  exam_version_id UUID NOT NULL,
  idempotency_key TEXT NOT NULL,
  request_hash TEXT NOT NULL,
  status submission_status NOT NULL DEFAULT 'processing',
  accepted BOOLEAN NOT NULL DEFAULT FALSE,
  error_code TEXT,
  error_message TEXT,
  attempt_id UUID,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_attempt_creation_requests_exam_org
    FOREIGN KEY (exam_id, organization_id)
    REFERENCES exams(id, organization_id)
    ON DELETE RESTRICT,
  CONSTRAINT fk_attempt_creation_requests_exam_version_org
    FOREIGN KEY (exam_version_id, organization_id)
    REFERENCES exam_versions(id, organization_id)
    ON DELETE RESTRICT,
  CONSTRAINT uq_attempt_creation_idempotency UNIQUE (organization_id, user_id, idempotency_key)
);

CREATE TABLE IF NOT EXISTS exam_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  cohort_id UUID,
  user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE RESTRICT,
  exam_id UUID NOT NULL,
  exam_version_id UUID NOT NULL,
  attempt_no INTEGER NOT NULL CHECK (attempt_no > 0),
  status attempt_status NOT NULL DEFAULT 'created',
  started_at TIMESTAMPTZ,
  last_activity_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  time_spent_seconds INTEGER NOT NULL DEFAULT 0 CHECK (time_spent_seconds >= 0),
  client_timezone TEXT,
  row_version INTEGER NOT NULL DEFAULT 1 CHECK (row_version > 0),
  autosave_version INTEGER NOT NULL DEFAULT 0 CHECK (autosave_version >= 0),
  final_submission_id UUID,
  external_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_exam_attempts_cohort_org
    FOREIGN KEY (cohort_id, organization_id)
    REFERENCES cohorts(id, organization_id)
    ON DELETE RESTRICT,
  CONSTRAINT fk_exam_attempts_exam_org
    FOREIGN KEY (exam_id, organization_id)
    REFERENCES exams(id, organization_id)
    ON DELETE RESTRICT,
  CONSTRAINT fk_exam_attempts_exam_version_exam_org
    FOREIGN KEY (exam_version_id, exam_id, organization_id)
    REFERENCES exam_versions(id, exam_id, organization_id)
    ON DELETE RESTRICT,
  CONSTRAINT uq_attempt_user_exam_version_no UNIQUE (user_id, exam_version_id, attempt_no),
  CONSTRAINT uq_attempt_id_org UNIQUE (id, organization_id)
);

CREATE TABLE IF NOT EXISTS attempt_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL,
  organization_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE RESTRICT,
  tab_id UUID NOT NULL DEFAULT gen_random_uuid(),
  session_token_hash TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_heartbeat_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  user_agent TEXT,
  ip INET,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_attempt_sessions_attempt_org
    FOREIGN KEY (attempt_id, organization_id)
    REFERENCES exam_attempts(id, organization_id)
    ON DELETE RESTRICT,
  CONSTRAINT uq_attempt_tab UNIQUE (attempt_id, tab_id)
);

CREATE TABLE IF NOT EXISTS attempt_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL,
  organization_id UUID NOT NULL,
  exam_version_question_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE RESTRICT,
  answer_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_flagged BOOLEAN NOT NULL DEFAULT FALSE,
  is_final BOOLEAN NOT NULL DEFAULT FALSE,
  score_awarded NUMERIC(8,2),
  answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  version_no INTEGER NOT NULL DEFAULT 1 CHECK (version_no > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_attempt_answers_attempt_org
    FOREIGN KEY (attempt_id, organization_id)
    REFERENCES exam_attempts(id, organization_id)
    ON DELETE RESTRICT,
  CONSTRAINT fk_attempt_answers_exam_version_question_org
    FOREIGN KEY (exam_version_question_id, organization_id)
    REFERENCES exam_version_questions(id, organization_id)
    ON DELETE RESTRICT,
  CONSTRAINT uq_attempt_question_answer UNIQUE (attempt_id, exam_version_question_id)
);

CREATE TABLE IF NOT EXISTS attempt_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL,
  organization_id UUID NOT NULL,
  revision_no INTEGER NOT NULL CHECK (revision_no > 0),
  source TEXT NOT NULL CHECK (source IN ('autosave', 'submit', 'regrade', 'manual_edit')),
  snapshot JSONB NOT NULL,
  created_by UUID REFERENCES app_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_attempt_revisions_attempt_org
    FOREIGN KEY (attempt_id, organization_id)
    REFERENCES exam_attempts(id, organization_id)
    ON DELETE RESTRICT,
  CONSTRAINT uq_attempt_revision UNIQUE (attempt_id, revision_no)
);

CREATE TABLE IF NOT EXISTS attempt_submission_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL,
  organization_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE RESTRICT,
  idempotency_key TEXT NOT NULL,
  request_hash TEXT NOT NULL,
  status submission_status NOT NULL DEFAULT 'processing',
  accepted BOOLEAN NOT NULL DEFAULT FALSE,
  error_code TEXT,
  error_message TEXT,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_attempt_submission_requests_attempt_org
    FOREIGN KEY (attempt_id, organization_id)
    REFERENCES exam_attempts(id, organization_id)
    ON DELETE RESTRICT,
  CONSTRAINT uq_attempt_submission_idempotency UNIQUE (attempt_id, idempotency_key)
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'fk_exam_attempts_final_submission'
      AND conrelid = 'public.exam_attempts'::regclass
  ) THEN
    ALTER TABLE exam_attempts
      ADD CONSTRAINT fk_exam_attempts_final_submission
      FOREIGN KEY (final_submission_id)
      REFERENCES attempt_submission_requests(id)
      ON DELETE SET NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'attempt_creation_requests'
      AND column_name = 'attempt_id'
  ) THEN
    ALTER TABLE attempt_creation_requests ADD COLUMN attempt_id UUID;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'fk_attempt_creation_requests_attempt_org'
      AND conrelid = 'public.attempt_creation_requests'::regclass
  ) THEN
    ALTER TABLE attempt_creation_requests
      ADD CONSTRAINT fk_attempt_creation_requests_attempt_org
      FOREIGN KEY (attempt_id, organization_id)
      REFERENCES exam_attempts(id, organization_id)
      ON DELETE RESTRICT;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS attempt_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE RESTRICT,
  exam_id UUID NOT NULL,
  exam_version_id UUID NOT NULL,
  result_version INTEGER NOT NULL DEFAULT 1 CHECK (result_version > 0),
  is_current BOOLEAN NOT NULL DEFAULT TRUE,
  raw_score NUMERIC(10,2) NOT NULL,
  max_score NUMERIC(10,2) NOT NULL CHECK (max_score > 0),
  percentage NUMERIC(5,2) NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  passed BOOLEAN NOT NULL,
  breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
  graded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_attempt_results_attempt_org
    FOREIGN KEY (attempt_id, organization_id)
    REFERENCES exam_attempts(id, organization_id)
    ON DELETE RESTRICT,
  CONSTRAINT fk_attempt_results_exam_org
    FOREIGN KEY (exam_id, organization_id)
    REFERENCES exams(id, organization_id)
    ON DELETE RESTRICT,
  CONSTRAINT fk_attempt_results_exam_version_org
    FOREIGN KEY (exam_version_id, organization_id)
    REFERENCES exam_versions(id, organization_id)
    ON DELETE RESTRICT,
  CONSTRAINT uq_attempt_result_version UNIQUE (attempt_id, result_version),
  CONSTRAINT uq_attempt_results_id_org UNIQUE (id, organization_id)
);

CREATE TABLE IF NOT EXISTS result_section_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_result_id UUID NOT NULL,
  organization_id UUID NOT NULL,
  section_id UUID,
  points_awarded NUMERIC(10,2) NOT NULL,
  points_possible NUMERIC(10,2) NOT NULL CHECK (points_possible >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_result_section_scores_result_org
    FOREIGN KEY (attempt_result_id, organization_id)
    REFERENCES attempt_results(id, organization_id)
    ON DELETE RESTRICT,
  CONSTRAINT fk_result_section_scores_section_org
    FOREIGN KEY (section_id, organization_id)
    REFERENCES exam_version_sections(id, organization_id)
    ON DELETE RESTRICT,
  CONSTRAINT uq_result_section UNIQUE (attempt_result_id, section_id)
);

CREATE TABLE IF NOT EXISTS user_exam_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE RESTRICT,
  exam_id UUID NOT NULL,
  latest_attempt_id UUID,
  latest_result_id UUID,
  attempts_count INTEGER NOT NULL DEFAULT 0 CHECK (attempts_count >= 0),
  best_score NUMERIC(5,2) CHECK (best_score >= 0 AND best_score <= 100),
  last_activity_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_user_exam_progress_exam_org
    FOREIGN KEY (exam_id, organization_id)
    REFERENCES exams(id, organization_id)
    ON DELETE RESTRICT,
  CONSTRAINT fk_user_exam_progress_latest_attempt_org
    FOREIGN KEY (latest_attempt_id, organization_id)
    REFERENCES exam_attempts(id, organization_id)
    ON DELETE RESTRICT,
  CONSTRAINT fk_user_exam_progress_latest_result_org
    FOREIGN KEY (latest_result_id, organization_id)
    REFERENCES attempt_results(id, organization_id)
    ON DELETE RESTRICT,
  CONSTRAINT uq_user_exam_progress UNIQUE (organization_id, user_id, exam_id)
);

CREATE TABLE IF NOT EXISTS notification_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  template_key TEXT NOT NULL,
  channel notification_channel NOT NULL,
  subject TEXT,
  body TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_notification_template UNIQUE (organization_id, template_key, channel),
  CONSTRAINT uq_notification_templates_id_org UNIQUE (id, organization_id)
);

CREATE TABLE IF NOT EXISTS user_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE RESTRICT,
  template_id UUID,
  channel notification_channel NOT NULL,
  title TEXT,
  message TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  status notification_status NOT NULL DEFAULT 'queued',
  scheduled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  sent_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  external_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_user_notifications_template_org
    FOREIGN KEY (template_id, organization_id)
    REFERENCES notification_templates(id, organization_id)
    ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS domain_event_outbox (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  event_type TEXT NOT NULL,
  aggregate_type TEXT NOT NULL,
  aggregate_id UUID NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'published', 'failed')),
  retry_count INTEGER NOT NULL DEFAULT 0 CHECK (retry_count >= 0),
  next_retry_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exam_metrics_daily (
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  exam_version_id UUID NOT NULL,
  metric_date DATE NOT NULL,
  started_count INTEGER NOT NULL DEFAULT 0 CHECK (started_count >= 0),
  submitted_count INTEGER NOT NULL DEFAULT 0 CHECK (submitted_count >= 0),
  pass_count INTEGER NOT NULL DEFAULT 0 CHECK (pass_count >= 0),
  avg_score NUMERIC(6,2),
  avg_time_spent_seconds INTEGER,
  PRIMARY KEY (organization_id, exam_version_id, metric_date),
  CONSTRAINT fk_exam_metrics_daily_exam_version_org
    FOREIGN KEY (exam_version_id, organization_id)
    REFERENCES exam_versions(id, organization_id)
    ON DELETE RESTRICT
);

ALTER TABLE IF EXISTS public.organizations ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE IF EXISTS public.cohorts ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE IF EXISTS public.access_packages ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE IF EXISTS public.exams ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE IF EXISTS public.questions ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE IF EXISTS public.notification_templates ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

ALTER TABLE IF EXISTS public.organizations DROP CONSTRAINT IF EXISTS organizations_slug_key;
ALTER TABLE IF EXISTS public.cohorts DROP CONSTRAINT IF EXISTS uq_cohort_org_code;
ALTER TABLE IF EXISTS public.access_packages DROP CONSTRAINT IF EXISTS uq_package_org_code;
ALTER TABLE IF EXISTS public.exams DROP CONSTRAINT IF EXISTS uq_exam_org_code;
ALTER TABLE IF EXISTS public.questions DROP CONSTRAINT IF EXISTS uq_question_org_code;
ALTER TABLE IF EXISTS public.notification_templates DROP CONSTRAINT IF EXISTS uq_notification_template;

CREATE UNIQUE INDEX IF NOT EXISTS uq_organizations_slug_active
  ON public.organizations(slug)
  WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_cohorts_org_code_active
  ON public.cohorts(organization_id, code)
  WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_access_packages_org_code_active
  ON public.access_packages(organization_id, code)
  WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_exams_org_code_active
  ON public.exams(organization_id, exam_code)
  WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_questions_org_code_active
  ON public.questions(organization_id, question_code)
  WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_notification_templates_active
  ON public.notification_templates(organization_id, template_key, channel)
  WHERE deleted_at IS NULL;

-- updated_at triggers
DROP TRIGGER IF EXISTS trg_organizations_updated_at ON organizations;
CREATE TRIGGER trg_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

DROP TRIGGER IF EXISTS trg_app_users_updated_at ON app_users;
CREATE TRIGGER trg_app_users_updated_at BEFORE UPDATE ON app_users FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

DROP TRIGGER IF EXISTS trg_org_members_updated_at ON organization_members;
CREATE TRIGGER trg_org_members_updated_at BEFORE UPDATE ON organization_members FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

DROP TRIGGER IF EXISTS trg_cohorts_updated_at ON cohorts;
CREATE TRIGGER trg_cohorts_updated_at BEFORE UPDATE ON cohorts FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

DROP TRIGGER IF EXISTS trg_content_items_updated_at ON content_items;
CREATE TRIGGER trg_content_items_updated_at BEFORE UPDATE ON content_items FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

DROP TRIGGER IF EXISTS trg_access_packages_updated_at ON access_packages;
CREATE TRIGGER trg_access_packages_updated_at BEFORE UPDATE ON access_packages FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

DROP TRIGGER IF EXISTS trg_access_package_versions_updated_at ON access_package_versions;
CREATE TRIGGER trg_access_package_versions_updated_at BEFORE UPDATE ON access_package_versions FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

DROP TRIGGER IF EXISTS trg_exams_updated_at ON exams;
CREATE TRIGGER trg_exams_updated_at BEFORE UPDATE ON exams FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

DROP TRIGGER IF EXISTS trg_exam_versions_updated_at ON exam_versions;
CREATE TRIGGER trg_exam_versions_updated_at BEFORE UPDATE ON exam_versions FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

DROP TRIGGER IF EXISTS trg_questions_updated_at ON questions;
CREATE TRIGGER trg_questions_updated_at BEFORE UPDATE ON questions FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

DROP TRIGGER IF EXISTS trg_question_versions_updated_at ON question_versions;
CREATE TRIGGER trg_question_versions_updated_at BEFORE UPDATE ON question_versions FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

DROP TRIGGER IF EXISTS trg_exam_version_sections_updated_at ON exam_version_sections;
CREATE TRIGGER trg_exam_version_sections_updated_at BEFORE UPDATE ON exam_version_sections FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

DROP TRIGGER IF EXISTS trg_exam_version_questions_updated_at ON exam_version_questions;
CREATE TRIGGER trg_exam_version_questions_updated_at BEFORE UPDATE ON exam_version_questions FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

DROP TRIGGER IF EXISTS trg_exam_attempts_updated_at ON exam_attempts;
CREATE TRIGGER trg_exam_attempts_updated_at BEFORE UPDATE ON exam_attempts FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

DROP TRIGGER IF EXISTS trg_attempt_answers_updated_at ON attempt_answers;
CREATE TRIGGER trg_attempt_answers_updated_at BEFORE UPDATE ON attempt_answers FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

DROP TRIGGER IF EXISTS trg_attempt_results_updated_at ON attempt_results;
CREATE TRIGGER trg_attempt_results_updated_at BEFORE UPDATE ON attempt_results FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

DROP TRIGGER IF EXISTS trg_user_exam_progress_updated_at ON user_exam_progress;
CREATE TRIGGER trg_user_exam_progress_updated_at BEFORE UPDATE ON user_exam_progress FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

DROP TRIGGER IF EXISTS trg_notification_templates_updated_at ON notification_templates;
CREATE TRIGGER trg_notification_templates_updated_at BEFORE UPDATE ON notification_templates FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

DROP TRIGGER IF EXISTS trg_user_notifications_updated_at ON user_notifications;
CREATE TRIGGER trg_user_notifications_updated_at BEFORE UPDATE ON user_notifications FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

COMMIT;
