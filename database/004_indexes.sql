BEGIN;

-- In production, create heavy indexes with CREATE INDEX CONCURRENTLY outside transaction.

CREATE INDEX IF NOT EXISTS idx_org_members_org_role_status
  ON public.organization_members(organization_id, role, status)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_org_members_org_user_status_role
  ON public.organization_members(organization_id, user_id, status, role)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_cohorts_org_active_dates
  ON public.cohorts(organization_id, is_active, starts_at, ends_at)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_cohort_members_user_org
  ON public.cohort_members(user_id, organization_id)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_content_items_org_type
  ON public.content_items(organization_id, content_type)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_packages_org_active
  ON public.access_packages(organization_id, is_active)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_package_versions_org_status_effective
  ON public.access_package_versions(organization_id, status, effective_from, effective_until);

CREATE INDEX IF NOT EXISTS idx_package_user_assignments_org_user_active
  ON public.package_user_assignments(organization_id, user_id, is_active, valid_until)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_package_cohort_assignments_org_cohort_active
  ON public.package_cohort_assignments(organization_id, cohort_id, is_active, valid_until)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_exams_org_kind_active
  ON public.exams(organization_id, kind, is_active)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_exam_versions_org_exam_status_window
  ON public.exam_versions(organization_id, exam_id, status, availability_start_at, availability_end_at);

CREATE INDEX IF NOT EXISTS idx_exam_versions_org_published_at
  ON public.exam_versions(organization_id, published_at DESC)
  WHERE published_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_questions_org_category_active
  ON public.questions(organization_id, category, is_active)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_questions_tags_gin
  ON public.questions USING GIN (tags);

CREATE INDEX IF NOT EXISTS idx_question_versions_org_question_status
  ON public.question_versions(organization_id, question_id, status);

CREATE INDEX IF NOT EXISTS idx_exam_version_sections_exam_position
  ON public.exam_version_sections(exam_version_id, position);

CREATE INDEX IF NOT EXISTS idx_exam_version_questions_exam_position
  ON public.exam_version_questions(exam_version_id, position);

CREATE INDEX IF NOT EXISTS idx_exam_version_questions_section
  ON public.exam_version_questions(section_id)
  WHERE section_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_attempt_creation_requests_org_user_status_created
  ON public.attempt_creation_requests(organization_id, user_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_attempt_creation_requests_exam_version
  ON public.attempt_creation_requests(exam_version_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_attempts_org_user_exam_status
  ON public.exam_attempts(organization_id, user_id, exam_id, status)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_attempts_user_exam_status
  ON public.exam_attempts(user_id, exam_id, status)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_attempts_org_exam_version_status
  ON public.exam_attempts(organization_id, exam_version_id, status)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_attempts_org_last_activity
  ON public.exam_attempts(organization_id, last_activity_at DESC)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_attempt_sessions_attempt_heartbeat
  ON public.attempt_sessions(attempt_id, last_heartbeat_at DESC);

CREATE INDEX IF NOT EXISTS idx_attempt_answers_org_attempt_updated
  ON public.attempt_answers(organization_id, attempt_id, updated_at DESC)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_attempt_answers_org_attempt_question
  ON public.attempt_answers(organization_id, attempt_id, exam_version_question_id)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_attempt_answers_org_user_answered
  ON public.attempt_answers(organization_id, user_id, answered_at DESC)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_attempt_revisions_attempt_created
  ON public.attempt_revisions(attempt_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_attempt_submission_requests_org_attempt_status
  ON public.attempt_submission_requests(organization_id, attempt_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_attempt_submission_requests_user_created
  ON public.attempt_submission_requests(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_attempt_results_org_user_exam_graded
  ON public.attempt_results(organization_id, user_id, exam_id, graded_at DESC)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_attempt_results_org_attempt_graded
  ON public.attempt_results(organization_id, attempt_id, graded_at DESC)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_attempt_results_attempt_version
  ON public.attempt_results(attempt_id, result_version DESC)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_result_section_scores_result
  ON public.result_section_scores(attempt_result_id);

CREATE INDEX IF NOT EXISTS idx_user_exam_progress_org_user_exam
  ON public.user_exam_progress(organization_id, user_id, exam_id);

CREATE INDEX IF NOT EXISTS idx_notifications_org_user_status_schedule
  ON public.user_notifications(organization_id, user_id, status, scheduled_at)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_outbox_org_status_retry
  ON public.domain_event_outbox(organization_id, status, next_retry_at);

CREATE INDEX IF NOT EXISTS idx_outbox_aggregate
  ON public.domain_event_outbox(aggregate_type, aggregate_id);

CREATE INDEX IF NOT EXISTS idx_exam_metrics_daily_org_exam_date
  ON public.exam_metrics_daily(organization_id, exam_version_id, metric_date DESC);

CREATE INDEX IF NOT EXISTS idx_audit_events_org_created
  ON audit.audit_events(organization_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_events_entity
  ON audit.audit_events(entity_table, entity_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_events_request
  ON audit.audit_events(request_id);

CREATE INDEX IF NOT EXISTS idx_analytics_events_org_name_time
  ON analytics.analytics_events(organization_id, event_name, event_time DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_events_properties_gin
  ON analytics.analytics_events USING GIN (properties);

CREATE INDEX IF NOT EXISTS idx_audit_events_created_brin
  ON audit.audit_events USING BRIN (created_at);

CREATE INDEX IF NOT EXISTS idx_analytics_events_time_brin
  ON analytics.analytics_events USING BRIN (event_time);

COMMIT;
