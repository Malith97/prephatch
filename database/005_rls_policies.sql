BEGIN;

CREATE OR REPLACE FUNCTION app.current_user_id()
RETURNS UUID
LANGUAGE sql
STABLE
AS $$
  SELECT auth.uid();
$$;

CREATE OR REPLACE FUNCTION app.is_service_role()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
  SELECT
    COALESCE(auth.jwt() ->> 'role', '') = 'service_role'
    OR current_user = 'service_role';
$$;

CREATE OR REPLACE FUNCTION app.is_active_org_member(target_org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth, pg_catalog
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_members om
    WHERE om.organization_id = target_org_id
      AND om.user_id = auth.uid()
      AND om.status = 'active'
      AND om.deleted_at IS NULL
  );
$$;

CREATE OR REPLACE FUNCTION app.is_org_instructor_or_admin(target_org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth, pg_catalog
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_members om
    WHERE om.organization_id = target_org_id
      AND om.user_id = auth.uid()
      AND om.status = 'active'
      AND om.deleted_at IS NULL
      AND om.role IN ('instructor', 'admin', 'super_admin')
  );
$$;

CREATE OR REPLACE FUNCTION app.is_org_admin(target_org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth, pg_catalog
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_members om
    WHERE om.organization_id = target_org_id
      AND om.user_id = auth.uid()
      AND om.status = 'active'
      AND om.deleted_at IS NULL
      AND om.role IN ('admin', 'super_admin')
  );
$$;

CREATE OR REPLACE FUNCTION app.is_attempt_owner(target_attempt_id UUID, target_org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth, pg_catalog
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.exam_attempts ea
    WHERE ea.id = target_attempt_id
      AND ea.organization_id = target_org_id
      AND ea.user_id = auth.uid()
      AND app.is_active_org_member(target_org_id)
  );
$$;

CREATE OR REPLACE FUNCTION app.strip_sensitive_json(input_json JSONB)
RETURNS JSONB
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  result JSONB;
BEGIN
  IF input_json IS NULL THEN
    RETURN NULL;
  END IF;

  CASE jsonb_typeof(input_json)
    WHEN 'object' THEN
      SELECT COALESCE(
        jsonb_object_agg(
          e.key,
          app.strip_sensitive_json(e.value)
        ),
        '{}'::jsonb
      )
      INTO result
      FROM jsonb_each(input_json) AS e
      WHERE lower(e.key) NOT IN (
        'is_correct',
        'correct',
        'correct_answer',
        'answer',
        'answer_key',
        'expected_answer',
        'accepted_answers',
        'score',
        'score_awarded',
        'points_override',
        'explanation',
        'rationale',
        'feedback',
        'grading',
        'grading_policy',
        'scoring_rule',
        'solution',
        'solutions',
        'internal',
        'internal_metadata',
        'hidden',
        'private',
        'teacher_note',
        'admin_note'
      )
      AND regexp_replace(lower(e.key), '[^a-z0-9]+', '', 'g') NOT IN (
        'iscorrect',
        'correct',
        'correctanswer',
        'answer',
        'answerkey',
        'expectedanswer',
        'acceptedanswers',
        'score',
        'scoreawarded',
        'pointsoverride',
        'explanation',
        'rationale',
        'feedback',
        'grading',
        'gradingpolicy',
        'scoringrule',
        'solution',
        'solutions',
        'internal',
        'internalmetadata',
        'hidden',
        'private',
        'teachernote',
        'adminnote',
        'correctanswers',
        'correctness',
        'isfinal',
        'metadata'
      );

      RETURN result;
    WHEN 'array' THEN
      SELECT COALESCE(jsonb_agg(app.strip_sensitive_json(value)), '[]'::jsonb)
      INTO result
      FROM jsonb_array_elements(input_json) AS value;

      RETURN result;
    ELSE
      RETURN input_json;
  END CASE;
END;
$$;

CREATE OR REPLACE FUNCTION app.get_attempt_runtime_questions(target_attempt_id UUID)
RETURNS TABLE (
  attempt_id UUID,
  organization_id UUID,
  exam_id UUID,
  exam_version_id UUID,
  exam_version_question_id UUID,
  section_id UUID,
  section_title TEXT,
  question_position INTEGER,
  question_type question_type,
  prompt TEXT,
  prompt_rich JSONB,
  options JSONB,
  points NUMERIC(8,2),
  is_required BOOLEAN
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth, pg_catalog
AS $$
  SELECT
    ea.id AS attempt_id,
    ea.organization_id,
    ea.exam_id,
    ea.exam_version_id,
    evq.id AS exam_version_question_id,
    evq.section_id,
    evs.title AS section_title,
    evq.position AS question_position,
    qv.question_type,
    qv.prompt,
    app.strip_sensitive_json(qv.prompt_rich) AS prompt_rich,
    app.strip_sensitive_json(qv.options) AS options,
    evq.points,
    evq.is_required
  FROM public.exam_attempts ea
  JOIN public.exam_version_questions evq
    ON evq.exam_version_id = ea.exam_version_id
   AND evq.organization_id = ea.organization_id
  JOIN public.question_versions qv
    ON qv.id = evq.question_version_id
   AND qv.organization_id = evq.organization_id
  LEFT JOIN public.exam_version_sections evs
    ON evs.id = evq.section_id
   AND evs.organization_id = evq.organization_id
  WHERE ea.id = target_attempt_id
    AND (
      app.is_service_role()
      OR (
        ea.user_id = auth.uid()
        AND app.is_active_org_member(ea.organization_id)
      )
    )
  ORDER BY evq.position;
$$;

CREATE OR REPLACE FUNCTION app.get_attempt_exam_runtime_metadata(target_attempt_id UUID)
RETURNS TABLE (
  attempt_id UUID,
  organization_id UUID,
  exam_id UUID,
  exam_version_id UUID,
  exam_code TEXT,
  exam_title TEXT,
  exam_kind exam_kind,
  exam_status lifecycle_status,
  duration_minutes INTEGER,
  instructions TEXT,
  availability_start_at TIMESTAMPTZ,
  availability_end_at TIMESTAMPTZ,
  submission_deadline_at TIMESTAMPTZ,
  max_attempts_per_user SMALLINT,
  allow_resume BOOLEAN,
  shuffle_questions BOOLEAN,
  shuffle_options BOOLEAN
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth, pg_catalog
AS $$
  SELECT
    ea.id AS attempt_id,
    ea.organization_id,
    ea.exam_id,
    ea.exam_version_id,
    ex.exam_code::text AS exam_code,
    COALESCE(ev.title_override, ex.title) AS exam_title,
    ex.kind AS exam_kind,
    ev.status AS exam_status,
    ev.duration_minutes,
    ev.instructions,
    ev.availability_start_at,
    ev.availability_end_at,
    ev.submission_deadline_at,
    ev.max_attempts_per_user,
    ev.allow_resume,
    ev.shuffle_questions,
    ev.shuffle_options
  FROM public.exam_attempts ea
  JOIN public.exams ex
    ON ex.id = ea.exam_id
   AND ex.organization_id = ea.organization_id
  JOIN public.exam_versions ev
    ON ev.id = ea.exam_version_id
   AND ev.organization_id = ea.organization_id
  WHERE ea.id = target_attempt_id
    AND (
      app.is_service_role()
      OR (
        ea.user_id = auth.uid()
        AND app.is_active_org_member(ea.organization_id)
      )
    );
$$;

DO $$
BEGIN
  IF to_regclass('public.organizations') IS NOT NULL THEN
    ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.organizations FORCE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS organizations_select_policy ON public.organizations;
    DROP POLICY IF EXISTS organizations_insert_policy ON public.organizations;
    DROP POLICY IF EXISTS organizations_update_policy ON public.organizations;
    DROP POLICY IF EXISTS organizations_delete_policy ON public.organizations;

    CREATE POLICY organizations_select_policy ON public.organizations
      FOR SELECT
      USING (app.is_service_role() OR app.is_active_org_member(id));

    CREATE POLICY organizations_insert_policy ON public.organizations
      FOR INSERT
      WITH CHECK (app.is_service_role());

    CREATE POLICY organizations_update_policy ON public.organizations
      FOR UPDATE
      USING (app.is_service_role() OR app.is_org_admin(id))
      WITH CHECK (app.is_service_role() OR app.is_org_admin(id));

    CREATE POLICY organizations_delete_policy ON public.organizations
      FOR DELETE
      USING (app.is_service_role());
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.app_users') IS NOT NULL THEN
    ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.app_users FORCE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS app_users_select_policy ON public.app_users;
    DROP POLICY IF EXISTS app_users_insert_policy ON public.app_users;
    DROP POLICY IF EXISTS app_users_update_policy ON public.app_users;
    DROP POLICY IF EXISTS app_users_delete_policy ON public.app_users;

    CREATE POLICY app_users_select_policy ON public.app_users
      FOR SELECT
      USING (
        app.is_service_role()
        OR id = app.current_user_id()
        OR EXISTS (
          SELECT 1
          FROM public.organization_members om_target
          WHERE om_target.user_id = app_users.id
            AND om_target.status = 'active'
            AND om_target.deleted_at IS NULL
            AND app.is_org_instructor_or_admin(om_target.organization_id)
        )
      );

    CREATE POLICY app_users_insert_policy ON public.app_users
      FOR INSERT
      WITH CHECK (app.is_service_role() OR id = app.current_user_id());

    CREATE POLICY app_users_update_policy ON public.app_users
      FOR UPDATE
      USING (app.is_service_role() OR id = app.current_user_id())
      WITH CHECK (app.is_service_role() OR id = app.current_user_id());

    CREATE POLICY app_users_delete_policy ON public.app_users
      FOR DELETE
      USING (app.is_service_role());
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.organization_members') IS NOT NULL THEN
    ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.organization_members FORCE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS organization_members_select_policy ON public.organization_members;
    DROP POLICY IF EXISTS organization_members_insert_policy ON public.organization_members;
    DROP POLICY IF EXISTS organization_members_update_policy ON public.organization_members;
    DROP POLICY IF EXISTS organization_members_delete_policy ON public.organization_members;

    CREATE POLICY organization_members_select_policy ON public.organization_members
      FOR SELECT
      USING (
        app.is_service_role()
        OR app.is_org_instructor_or_admin(organization_id)
        OR user_id = app.current_user_id()
      );

    CREATE POLICY organization_members_insert_policy ON public.organization_members
      FOR INSERT
      WITH CHECK (
        app.is_service_role()
        OR app.is_org_admin(organization_id)
      );

    CREATE POLICY organization_members_update_policy ON public.organization_members
      FOR UPDATE
      USING (
        app.is_service_role()
        OR app.is_org_admin(organization_id)
      )
      WITH CHECK (
        app.is_service_role()
        OR app.is_org_admin(organization_id)
      );

    CREATE POLICY organization_members_delete_policy ON public.organization_members
      FOR DELETE
      USING (
        app.is_service_role()
        OR app.is_org_admin(organization_id)
      );
  END IF;
END $$;

DO $$
DECLARE
  t TEXT;
  internal_tables TEXT[] := ARRAY[
    'questions',
    'question_versions',
    'exam_version_questions',
    'exam_version_sections',
    'domain_event_outbox',
    'notification_templates',
    'exam_metrics_daily'
  ];
BEGIN
  FOREACH t IN ARRAY internal_tables LOOP
    IF to_regclass('public.' || t) IS NOT NULL THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
      EXECUTE format('ALTER TABLE public.%I FORCE ROW LEVEL SECURITY', t);

      EXECUTE format('DROP POLICY IF EXISTS %I_select_policy ON public.%I', t, t);
      EXECUTE format('DROP POLICY IF EXISTS %I_insert_policy ON public.%I', t, t);
      EXECUTE format('DROP POLICY IF EXISTS %I_update_policy ON public.%I', t, t);
      EXECUTE format('DROP POLICY IF EXISTS %I_delete_policy ON public.%I', t, t);

      EXECUTE format(
        'CREATE POLICY %I_select_policy ON public.%I FOR SELECT USING (app.is_service_role() OR app.is_org_instructor_or_admin(organization_id))',
        t, t
      );

      EXECUTE format(
        'CREATE POLICY %I_insert_policy ON public.%I FOR INSERT WITH CHECK (app.is_service_role() OR app.is_org_instructor_or_admin(organization_id))',
        t, t
      );

      EXECUTE format(
        'CREATE POLICY %I_update_policy ON public.%I FOR UPDATE USING (app.is_service_role() OR app.is_org_instructor_or_admin(organization_id)) WITH CHECK (app.is_service_role() OR app.is_org_instructor_or_admin(organization_id))',
        t, t
      );

      EXECUTE format(
        'CREATE POLICY %I_delete_policy ON public.%I FOR DELETE USING (app.is_service_role() OR app.is_org_instructor_or_admin(organization_id))',
        t, t
      );
    END IF;
  END LOOP;
END $$;

DO $$
BEGIN
  IF to_regclass('public.user_notifications') IS NOT NULL THEN
    ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.user_notifications FORCE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS user_notifications_select_policy ON public.user_notifications;
    DROP POLICY IF EXISTS user_notifications_insert_policy ON public.user_notifications;
    DROP POLICY IF EXISTS user_notifications_update_policy ON public.user_notifications;
    DROP POLICY IF EXISTS user_notifications_delete_policy ON public.user_notifications;

    CREATE POLICY user_notifications_select_policy ON public.user_notifications
      FOR SELECT
      USING (
        app.is_service_role()
        OR app.is_org_instructor_or_admin(organization_id)
        OR (
          user_id = app.current_user_id()
          AND app.is_active_org_member(organization_id)
        )
      );

    CREATE POLICY user_notifications_insert_policy ON public.user_notifications
      FOR INSERT
      WITH CHECK (
        app.is_service_role()
        OR app.is_org_instructor_or_admin(organization_id)
      );

    CREATE POLICY user_notifications_update_policy ON public.user_notifications
      FOR UPDATE
      USING (
        app.is_service_role()
        OR app.is_org_instructor_or_admin(organization_id)
        OR (
          user_id = app.current_user_id()
          AND app.is_active_org_member(organization_id)
        )
      )
      WITH CHECK (
        app.is_service_role()
        OR app.is_org_instructor_or_admin(organization_id)
        OR (
          user_id = app.current_user_id()
          AND app.is_active_org_member(organization_id)
        )
      );

    CREATE POLICY user_notifications_delete_policy ON public.user_notifications
      FOR DELETE
      USING (
        app.is_service_role()
        OR app.is_org_instructor_or_admin(organization_id)
      );
  END IF;
END $$;

DO $$
DECLARE
  t TEXT;
  generic_tables TEXT[] := ARRAY[
    'cohorts',
    'cohort_members',
    'content_items',
    'access_packages',
    'access_package_versions',
    'exams',
    'access_package_exam_items',
    'access_package_content_items',
    'package_user_assignments',
    'package_cohort_assignments',
    'package_org_assignments'
  ];
BEGIN
  FOREACH t IN ARRAY generic_tables LOOP
    IF to_regclass('public.' || t) IS NOT NULL THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
      EXECUTE format('ALTER TABLE public.%I FORCE ROW LEVEL SECURITY', t);

      EXECUTE format('DROP POLICY IF EXISTS %I_select_policy ON public.%I', t, t);
      EXECUTE format('DROP POLICY IF EXISTS %I_insert_policy ON public.%I', t, t);
      EXECUTE format('DROP POLICY IF EXISTS %I_update_policy ON public.%I', t, t);
      EXECUTE format('DROP POLICY IF EXISTS %I_delete_policy ON public.%I', t, t);

      EXECUTE format(
        'CREATE POLICY %I_select_policy ON public.%I FOR SELECT USING (app.is_service_role() OR app.is_active_org_member(organization_id))',
        t, t
      );

      EXECUTE format(
        'CREATE POLICY %I_insert_policy ON public.%I FOR INSERT WITH CHECK (app.is_service_role() OR app.is_org_instructor_or_admin(organization_id))',
        t, t
      );

      EXECUTE format(
        'CREATE POLICY %I_update_policy ON public.%I FOR UPDATE USING (app.is_service_role() OR app.is_org_instructor_or_admin(organization_id)) WITH CHECK (app.is_service_role() OR app.is_org_instructor_or_admin(organization_id))',
        t, t
      );

      EXECUTE format(
        'CREATE POLICY %I_delete_policy ON public.%I FOR DELETE USING (app.is_service_role() OR app.is_org_instructor_or_admin(organization_id))',
        t, t
      );
    END IF;
  END LOOP;
END $$;

DO $$
BEGIN
  IF to_regclass('public.exam_versions') IS NOT NULL THEN
    ALTER TABLE public.exam_versions ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.exam_versions FORCE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS exam_versions_select_policy ON public.exam_versions;
    DROP POLICY IF EXISTS exam_versions_insert_policy ON public.exam_versions;
    DROP POLICY IF EXISTS exam_versions_update_policy ON public.exam_versions;
    DROP POLICY IF EXISTS exam_versions_delete_policy ON public.exam_versions;

    CREATE POLICY exam_versions_select_policy ON public.exam_versions
      FOR SELECT
      USING (
        app.is_service_role()
        OR app.is_org_instructor_or_admin(organization_id)
      );

    CREATE POLICY exam_versions_insert_policy ON public.exam_versions
      FOR INSERT
      WITH CHECK (
        app.is_service_role()
        OR app.is_org_instructor_or_admin(organization_id)
      );

    CREATE POLICY exam_versions_update_policy ON public.exam_versions
      FOR UPDATE
      USING (
        app.is_service_role()
        OR app.is_org_instructor_or_admin(organization_id)
      )
      WITH CHECK (
        app.is_service_role()
        OR app.is_org_instructor_or_admin(organization_id)
      );

    CREATE POLICY exam_versions_delete_policy ON public.exam_versions
      FOR DELETE
      USING (
        app.is_service_role()
        OR app.is_org_instructor_or_admin(organization_id)
      );
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.app_login_sessions') IS NOT NULL THEN
    ALTER TABLE public.app_login_sessions ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.app_login_sessions FORCE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS app_login_sessions_select_policy ON public.app_login_sessions;
    DROP POLICY IF EXISTS app_login_sessions_insert_policy ON public.app_login_sessions;
    DROP POLICY IF EXISTS app_login_sessions_update_policy ON public.app_login_sessions;
    DROP POLICY IF EXISTS app_login_sessions_delete_policy ON public.app_login_sessions;

    CREATE POLICY app_login_sessions_select_policy ON public.app_login_sessions
      FOR SELECT
      USING (
        app.is_service_role()
        OR app.is_org_instructor_or_admin(organization_id)
        OR (user_id = app.current_user_id() AND app.is_active_org_member(organization_id))
      );

    CREATE POLICY app_login_sessions_insert_policy ON public.app_login_sessions
      FOR INSERT
      WITH CHECK (
        app.is_service_role()
        OR (user_id = app.current_user_id() AND app.is_active_org_member(organization_id))
      );

    CREATE POLICY app_login_sessions_update_policy ON public.app_login_sessions
      FOR UPDATE
      USING (
        app.is_service_role()
        OR app.is_org_instructor_or_admin(organization_id)
        OR (user_id = app.current_user_id() AND app.is_active_org_member(organization_id))
      )
      WITH CHECK (
        app.is_service_role()
        OR app.is_org_instructor_or_admin(organization_id)
        OR (user_id = app.current_user_id() AND app.is_active_org_member(organization_id))
      );

    CREATE POLICY app_login_sessions_delete_policy ON public.app_login_sessions
      FOR DELETE
      USING (
        app.is_service_role()
        OR app.is_org_instructor_or_admin(organization_id)
        OR (user_id = app.current_user_id() AND app.is_active_org_member(organization_id))
      );
  END IF;
END $$;

DO $$
DECLARE
  t TEXT;
  owned_tables TEXT[] := ARRAY[
    'attempt_creation_requests',
    'exam_attempts',
    'attempt_sessions',
    'attempt_answers',
    'attempt_submission_requests'
  ];
BEGIN
  FOREACH t IN ARRAY owned_tables LOOP
    IF to_regclass('public.' || t) IS NOT NULL THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
      EXECUTE format('ALTER TABLE public.%I FORCE ROW LEVEL SECURITY', t);

      EXECUTE format('DROP POLICY IF EXISTS %I_select_policy ON public.%I', t, t);
      EXECUTE format('DROP POLICY IF EXISTS %I_insert_policy ON public.%I', t, t);
      EXECUTE format('DROP POLICY IF EXISTS %I_update_policy ON public.%I', t, t);
      EXECUTE format('DROP POLICY IF EXISTS %I_delete_policy ON public.%I', t, t);

      EXECUTE format(
        'CREATE POLICY %I_select_policy ON public.%I FOR SELECT USING (app.is_service_role() OR app.is_org_instructor_or_admin(organization_id) OR (user_id = app.current_user_id() AND app.is_active_org_member(organization_id)))',
        t, t
      );

      EXECUTE format(
        'CREATE POLICY %I_insert_policy ON public.%I FOR INSERT WITH CHECK (app.is_service_role() OR app.is_org_instructor_or_admin(organization_id) OR (user_id = app.current_user_id() AND app.is_active_org_member(organization_id)))',
        t, t
      );

      EXECUTE format(
        'CREATE POLICY %I_update_policy ON public.%I FOR UPDATE USING (app.is_service_role() OR app.is_org_instructor_or_admin(organization_id) OR (user_id = app.current_user_id() AND app.is_active_org_member(organization_id))) WITH CHECK (app.is_service_role() OR app.is_org_instructor_or_admin(organization_id) OR (user_id = app.current_user_id() AND app.is_active_org_member(organization_id)))',
        t, t
      );

      EXECUTE format(
        'CREATE POLICY %I_delete_policy ON public.%I FOR DELETE USING (app.is_service_role() OR app.is_org_instructor_or_admin(organization_id))',
        t, t
      );
    END IF;
  END LOOP;
END $$;

DO $$
BEGIN
  IF to_regclass('public.attempt_creation_requests') IS NOT NULL THEN
    ALTER TABLE public.attempt_creation_requests ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.attempt_creation_requests FORCE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS attempt_creation_requests_select_policy ON public.attempt_creation_requests;
    DROP POLICY IF EXISTS attempt_creation_requests_insert_policy ON public.attempt_creation_requests;
    DROP POLICY IF EXISTS attempt_creation_requests_update_policy ON public.attempt_creation_requests;
    DROP POLICY IF EXISTS attempt_creation_requests_delete_policy ON public.attempt_creation_requests;

    CREATE POLICY attempt_creation_requests_select_policy ON public.attempt_creation_requests
      FOR SELECT
      USING (
        app.is_service_role()
        OR app.is_org_instructor_or_admin(organization_id)
        OR (
          user_id = app.current_user_id()
          AND app.is_active_org_member(organization_id)
          AND (attempt_id IS NULL OR app.is_attempt_owner(attempt_id, organization_id))
        )
      );

    CREATE POLICY attempt_creation_requests_insert_policy ON public.attempt_creation_requests
      FOR INSERT
      WITH CHECK (
        app.is_service_role()
        OR app.is_org_instructor_or_admin(organization_id)
        OR (
          user_id = app.current_user_id()
          AND app.is_active_org_member(organization_id)
          AND (attempt_id IS NULL OR app.is_attempt_owner(attempt_id, organization_id))
        )
      );

    CREATE POLICY attempt_creation_requests_update_policy ON public.attempt_creation_requests
      FOR UPDATE
      USING (
        app.is_service_role()
        OR app.is_org_instructor_or_admin(organization_id)
        OR (
          user_id = app.current_user_id()
          AND app.is_active_org_member(organization_id)
          AND (attempt_id IS NULL OR app.is_attempt_owner(attempt_id, organization_id))
        )
      )
      WITH CHECK (
        app.is_service_role()
        OR app.is_org_instructor_or_admin(organization_id)
        OR (
          user_id = app.current_user_id()
          AND app.is_active_org_member(organization_id)
          AND (attempt_id IS NULL OR app.is_attempt_owner(attempt_id, organization_id))
        )
      );

    CREATE POLICY attempt_creation_requests_delete_policy ON public.attempt_creation_requests
      FOR DELETE
      USING (app.is_service_role() OR app.is_org_instructor_or_admin(organization_id));
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.attempt_sessions') IS NOT NULL THEN
    ALTER TABLE public.attempt_sessions ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.attempt_sessions FORCE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS attempt_sessions_select_policy ON public.attempt_sessions;
    DROP POLICY IF EXISTS attempt_sessions_insert_policy ON public.attempt_sessions;
    DROP POLICY IF EXISTS attempt_sessions_update_policy ON public.attempt_sessions;
    DROP POLICY IF EXISTS attempt_sessions_delete_policy ON public.attempt_sessions;

    CREATE POLICY attempt_sessions_select_policy ON public.attempt_sessions
      FOR SELECT
      USING (
        app.is_service_role()
        OR app.is_org_instructor_or_admin(organization_id)
        OR (
          user_id = app.current_user_id()
          AND app.is_active_org_member(organization_id)
          AND app.is_attempt_owner(attempt_id, organization_id)
        )
      );

    CREATE POLICY attempt_sessions_insert_policy ON public.attempt_sessions
      FOR INSERT
      WITH CHECK (
        app.is_service_role()
        OR app.is_org_instructor_or_admin(organization_id)
        OR (
          user_id = app.current_user_id()
          AND app.is_active_org_member(organization_id)
          AND app.is_attempt_owner(attempt_id, organization_id)
        )
      );

    CREATE POLICY attempt_sessions_update_policy ON public.attempt_sessions
      FOR UPDATE
      USING (
        app.is_service_role()
        OR app.is_org_instructor_or_admin(organization_id)
        OR (
          user_id = app.current_user_id()
          AND app.is_active_org_member(organization_id)
          AND app.is_attempt_owner(attempt_id, organization_id)
        )
      )
      WITH CHECK (
        app.is_service_role()
        OR app.is_org_instructor_or_admin(organization_id)
        OR (
          user_id = app.current_user_id()
          AND app.is_active_org_member(organization_id)
          AND app.is_attempt_owner(attempt_id, organization_id)
        )
      );

    CREATE POLICY attempt_sessions_delete_policy ON public.attempt_sessions
      FOR DELETE
      USING (app.is_service_role() OR app.is_org_instructor_or_admin(organization_id));
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.attempt_answers') IS NOT NULL THEN
    ALTER TABLE public.attempt_answers ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.attempt_answers FORCE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS attempt_answers_select_policy ON public.attempt_answers;
    DROP POLICY IF EXISTS attempt_answers_insert_policy ON public.attempt_answers;
    DROP POLICY IF EXISTS attempt_answers_update_policy ON public.attempt_answers;
    DROP POLICY IF EXISTS attempt_answers_delete_policy ON public.attempt_answers;

    CREATE POLICY attempt_answers_select_policy ON public.attempt_answers
      FOR SELECT
      USING (
        app.is_service_role()
        OR app.is_org_instructor_or_admin(organization_id)
        OR (
          user_id = app.current_user_id()
          AND app.is_active_org_member(organization_id)
          AND app.is_attempt_owner(attempt_id, organization_id)
        )
      );

    CREATE POLICY attempt_answers_insert_policy ON public.attempt_answers
      FOR INSERT
      WITH CHECK (
        app.is_service_role()
        OR app.is_org_instructor_or_admin(organization_id)
        OR (
          user_id = app.current_user_id()
          AND app.is_active_org_member(organization_id)
          AND app.is_attempt_owner(attempt_id, organization_id)
        )
      );

    CREATE POLICY attempt_answers_update_policy ON public.attempt_answers
      FOR UPDATE
      USING (
        app.is_service_role()
        OR app.is_org_instructor_or_admin(organization_id)
        OR (
          user_id = app.current_user_id()
          AND app.is_active_org_member(organization_id)
          AND app.is_attempt_owner(attempt_id, organization_id)
        )
      )
      WITH CHECK (
        app.is_service_role()
        OR app.is_org_instructor_or_admin(organization_id)
        OR (
          user_id = app.current_user_id()
          AND app.is_active_org_member(organization_id)
          AND app.is_attempt_owner(attempt_id, organization_id)
        )
      );

    CREATE POLICY attempt_answers_delete_policy ON public.attempt_answers
      FOR DELETE
      USING (app.is_service_role() OR app.is_org_instructor_or_admin(organization_id));
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.attempt_revisions') IS NOT NULL THEN
    ALTER TABLE public.attempt_revisions ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.attempt_revisions FORCE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS attempt_revisions_select_policy ON public.attempt_revisions;
    DROP POLICY IF EXISTS attempt_revisions_insert_policy ON public.attempt_revisions;
    DROP POLICY IF EXISTS attempt_revisions_update_policy ON public.attempt_revisions;
    DROP POLICY IF EXISTS attempt_revisions_delete_policy ON public.attempt_revisions;

    CREATE POLICY attempt_revisions_select_policy ON public.attempt_revisions
      FOR SELECT
      USING (
        app.is_service_role()
        OR app.is_org_instructor_or_admin(organization_id)
        OR (
          app.is_active_org_member(organization_id)
          AND app.is_attempt_owner(attempt_id, organization_id)
        )
      );

    CREATE POLICY attempt_revisions_insert_policy ON public.attempt_revisions
      FOR INSERT
      WITH CHECK (
        app.is_service_role()
        OR app.is_org_instructor_or_admin(organization_id)
        OR (
          app.is_active_org_member(organization_id)
          AND app.is_attempt_owner(attempt_id, organization_id)
          AND (created_by IS NULL OR created_by = app.current_user_id())
        )
      );

    CREATE POLICY attempt_revisions_update_policy ON public.attempt_revisions
      FOR UPDATE
      USING (
        app.is_service_role()
        OR app.is_org_instructor_or_admin(organization_id)
        OR (
          app.is_active_org_member(organization_id)
          AND app.is_attempt_owner(attempt_id, organization_id)
          AND (created_by IS NULL OR created_by = app.current_user_id())
        )
      )
      WITH CHECK (
        app.is_service_role()
        OR app.is_org_instructor_or_admin(organization_id)
        OR (
          app.is_active_org_member(organization_id)
          AND app.is_attempt_owner(attempt_id, organization_id)
          AND (created_by IS NULL OR created_by = app.current_user_id())
        )
      );

    CREATE POLICY attempt_revisions_delete_policy ON public.attempt_revisions
      FOR DELETE
      USING (app.is_service_role() OR app.is_org_instructor_or_admin(organization_id));
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.attempt_submission_requests') IS NOT NULL THEN
    ALTER TABLE public.attempt_submission_requests ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.attempt_submission_requests FORCE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS attempt_submission_requests_select_policy ON public.attempt_submission_requests;
    DROP POLICY IF EXISTS attempt_submission_requests_insert_policy ON public.attempt_submission_requests;
    DROP POLICY IF EXISTS attempt_submission_requests_update_policy ON public.attempt_submission_requests;
    DROP POLICY IF EXISTS attempt_submission_requests_delete_policy ON public.attempt_submission_requests;

    CREATE POLICY attempt_submission_requests_select_policy ON public.attempt_submission_requests
      FOR SELECT
      USING (
        app.is_service_role()
        OR app.is_org_instructor_or_admin(organization_id)
        OR (
          user_id = app.current_user_id()
          AND app.is_active_org_member(organization_id)
          AND app.is_attempt_owner(attempt_id, organization_id)
        )
      );

    CREATE POLICY attempt_submission_requests_insert_policy ON public.attempt_submission_requests
      FOR INSERT
      WITH CHECK (
        app.is_service_role()
        OR app.is_org_instructor_or_admin(organization_id)
        OR (
          user_id = app.current_user_id()
          AND app.is_active_org_member(organization_id)
          AND app.is_attempt_owner(attempt_id, organization_id)
        )
      );

    CREATE POLICY attempt_submission_requests_update_policy ON public.attempt_submission_requests
      FOR UPDATE
      USING (
        app.is_service_role()
        OR app.is_org_instructor_or_admin(organization_id)
        OR (
          user_id = app.current_user_id()
          AND app.is_active_org_member(organization_id)
          AND app.is_attempt_owner(attempt_id, organization_id)
        )
      )
      WITH CHECK (
        app.is_service_role()
        OR app.is_org_instructor_or_admin(organization_id)
        OR (
          user_id = app.current_user_id()
          AND app.is_active_org_member(organization_id)
          AND app.is_attempt_owner(attempt_id, organization_id)
        )
      );

    CREATE POLICY attempt_submission_requests_delete_policy ON public.attempt_submission_requests
      FOR DELETE
      USING (app.is_service_role() OR app.is_org_instructor_or_admin(organization_id));
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.attempt_results') IS NOT NULL THEN
    ALTER TABLE public.attempt_results ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.attempt_results FORCE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS attempt_results_select_policy ON public.attempt_results;
    DROP POLICY IF EXISTS attempt_results_insert_policy ON public.attempt_results;
    DROP POLICY IF EXISTS attempt_results_update_policy ON public.attempt_results;
    DROP POLICY IF EXISTS attempt_results_delete_policy ON public.attempt_results;

    CREATE POLICY attempt_results_select_policy ON public.attempt_results
      FOR SELECT
      USING (
        app.is_service_role()
        OR app.is_org_instructor_or_admin(organization_id)
        OR (
          user_id = app.current_user_id()
          AND app.is_active_org_member(organization_id)
          AND app.is_attempt_owner(attempt_id, organization_id)
        )
      );

    CREATE POLICY attempt_results_insert_policy ON public.attempt_results
      FOR INSERT
      WITH CHECK (app.is_service_role() OR app.is_org_instructor_or_admin(organization_id));

    CREATE POLICY attempt_results_update_policy ON public.attempt_results
      FOR UPDATE
      USING (app.is_service_role() OR app.is_org_instructor_or_admin(organization_id))
      WITH CHECK (app.is_service_role() OR app.is_org_instructor_or_admin(organization_id));

    CREATE POLICY attempt_results_delete_policy ON public.attempt_results
      FOR DELETE
      USING (app.is_service_role() OR app.is_org_instructor_or_admin(organization_id));
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.result_section_scores') IS NOT NULL THEN
    ALTER TABLE public.result_section_scores ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.result_section_scores FORCE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS result_section_scores_select_policy ON public.result_section_scores;
    DROP POLICY IF EXISTS result_section_scores_insert_policy ON public.result_section_scores;
    DROP POLICY IF EXISTS result_section_scores_update_policy ON public.result_section_scores;
    DROP POLICY IF EXISTS result_section_scores_delete_policy ON public.result_section_scores;

    CREATE POLICY result_section_scores_select_policy ON public.result_section_scores
      FOR SELECT
      USING (
        app.is_service_role()
        OR app.is_org_instructor_or_admin(organization_id)
        OR EXISTS (
          SELECT 1
          FROM public.attempt_results ar
          WHERE ar.id = result_section_scores.attempt_result_id
            AND ar.user_id = app.current_user_id()
            AND app.is_active_org_member(ar.organization_id)
        )
      );

    CREATE POLICY result_section_scores_insert_policy ON public.result_section_scores
      FOR INSERT
      WITH CHECK (app.is_service_role() OR app.is_org_instructor_or_admin(organization_id));

    CREATE POLICY result_section_scores_update_policy ON public.result_section_scores
      FOR UPDATE
      USING (app.is_service_role() OR app.is_org_instructor_or_admin(organization_id))
      WITH CHECK (app.is_service_role() OR app.is_org_instructor_or_admin(organization_id));

    CREATE POLICY result_section_scores_delete_policy ON public.result_section_scores
      FOR DELETE
      USING (app.is_service_role() OR app.is_org_instructor_or_admin(organization_id));
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('audit.audit_events') IS NOT NULL THEN
    ALTER TABLE audit.audit_events ENABLE ROW LEVEL SECURITY;
    ALTER TABLE audit.audit_events FORCE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS audit_events_select_policy ON audit.audit_events;
    DROP POLICY IF EXISTS audit_events_insert_policy ON audit.audit_events;
    DROP POLICY IF EXISTS audit_events_update_policy ON audit.audit_events;
    DROP POLICY IF EXISTS audit_events_delete_policy ON audit.audit_events;

    CREATE POLICY audit_events_select_policy ON audit.audit_events
      FOR SELECT
      USING (app.is_service_role() OR app.is_org_instructor_or_admin(organization_id));

    CREATE POLICY audit_events_insert_policy ON audit.audit_events
      FOR INSERT
      WITH CHECK (app.is_service_role() OR app.is_org_instructor_or_admin(organization_id));

    CREATE POLICY audit_events_update_policy ON audit.audit_events
      FOR UPDATE
      USING (app.is_service_role() OR app.is_org_instructor_or_admin(organization_id))
      WITH CHECK (app.is_service_role() OR app.is_org_instructor_or_admin(organization_id));

    CREATE POLICY audit_events_delete_policy ON audit.audit_events
      FOR DELETE
      USING (app.is_service_role() OR app.is_org_instructor_or_admin(organization_id));
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('analytics.analytics_events') IS NOT NULL THEN
    ALTER TABLE analytics.analytics_events ENABLE ROW LEVEL SECURITY;
    ALTER TABLE analytics.analytics_events FORCE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS analytics_events_select_policy ON analytics.analytics_events;
    DROP POLICY IF EXISTS analytics_events_insert_policy ON analytics.analytics_events;
    DROP POLICY IF EXISTS analytics_events_update_policy ON analytics.analytics_events;
    DROP POLICY IF EXISTS analytics_events_delete_policy ON analytics.analytics_events;

    CREATE POLICY analytics_events_select_policy ON analytics.analytics_events
      FOR SELECT
      USING (app.is_service_role() OR app.is_org_instructor_or_admin(organization_id));

    CREATE POLICY analytics_events_insert_policy ON analytics.analytics_events
      FOR INSERT
      WITH CHECK (app.is_service_role() OR app.is_org_instructor_or_admin(organization_id));

    CREATE POLICY analytics_events_update_policy ON analytics.analytics_events
      FOR UPDATE
      USING (app.is_service_role() OR app.is_org_instructor_or_admin(organization_id))
      WITH CHECK (app.is_service_role() OR app.is_org_instructor_or_admin(organization_id));

    CREATE POLICY analytics_events_delete_policy ON analytics.analytics_events
      FOR DELETE
      USING (app.is_service_role() OR app.is_org_instructor_or_admin(organization_id));
  END IF;
END $$;

COMMIT;
