-- Seed dev data generated for PrepHatch

insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
values
  (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-4111-8111-111111111111',
    'authenticated',
    'authenticated',
    'student.one@dev.prephatch.local',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    '2026-01-10 09:00:00+00',
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Student One"}'::jsonb,
    '2026-01-10 09:00:00+00',
    '2026-01-10 09:00:00+00'
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-4111-8111-111111111112',
    'authenticated',
    'authenticated',
    'student.two@dev.prephatch.local',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    '2026-01-10 09:01:00+00',
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Student Two"}'::jsonb,
    '2026-01-10 09:01:00+00',
    '2026-01-10 09:01:00+00'
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-4111-8111-111111111113',
    'authenticated',
    'authenticated',
    'instructor.one@dev.prephatch.local',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    '2026-01-10 09:02:00+00',
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Instructor One"}'::jsonb,
    '2026-01-10 09:02:00+00',
    '2026-01-10 09:02:00+00'
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-4111-8111-111111111114',
    'authenticated',
    'authenticated',
    'instructor.two@dev.prephatch.local',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    '2026-01-10 09:03:00+00',
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Instructor Two"}'::jsonb,
    '2026-01-10 09:03:00+00',
    '2026-01-10 09:03:00+00'
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-4111-8111-111111111115',
    'authenticated',
    'authenticated',
    'admin.one@dev.prephatch.local',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    '2026-01-10 09:04:00+00',
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Admin One"}'::jsonb,
    '2026-01-10 09:04:00+00',
    '2026-01-10 09:04:00+00'
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-4111-8111-111111111116',
    'authenticated',
    'authenticated',
    'admin.two@dev.prephatch.local',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    '2026-01-10 09:05:00+00',
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Admin Two"}'::jsonb,
    '2026-01-10 09:05:00+00',
    '2026-01-10 09:05:00+00'
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-4111-8111-111111111117',
    'authenticated',
    'authenticated',
    'superadmin.one@dev.prephatch.local',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    '2026-01-10 09:06:00+00',
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Super Admin One"}'::jsonb,
    '2026-01-10 09:06:00+00',
    '2026-01-10 09:06:00+00'
  )
on conflict (id) do nothing;

insert into public.organizations (
  id,
  slug,
  name,
  is_active,
  settings,
  created_at,
  updated_at,
  deleted_at
)
values
  (
    '22222222-2222-4222-8222-222222222222',
    'prephatch-dev-org',
    'PrepHatch Dev Organization',
    true,
    '{"region":"us-east-1","seed":"dev","features":{"exam_runtime":true,"analytics":true}}'::jsonb,
    '2026-01-10 09:10:00+00',
    '2026-01-10 09:10:00+00',
    null
  )
on conflict do nothing;

insert into public.app_users (
  id,
  display_name,
  avatar_url,
  default_role,
  timezone,
  locale,
  is_active,
  created_at,
  updated_at,
  deleted_at
)
values
  ('11111111-1111-4111-8111-111111111111', 'Student One', null, 'student', 'UTC', 'en', true, '2026-01-10 09:10:30+00', '2026-01-10 09:10:30+00', null),
  ('11111111-1111-4111-8111-111111111112', 'Student Two', null, 'student', 'UTC', 'en', true, '2026-01-10 09:10:40+00', '2026-01-10 09:10:40+00', null),
  ('11111111-1111-4111-8111-111111111113', 'Instructor One', null, 'instructor', 'UTC', 'en', true, '2026-01-10 09:10:50+00', '2026-01-10 09:10:50+00', null),
  ('11111111-1111-4111-8111-111111111114', 'Instructor Two', null, 'instructor', 'UTC', 'en', true, '2026-01-10 09:11:00+00', '2026-01-10 09:11:00+00', null),
  ('11111111-1111-4111-8111-111111111115', 'Admin One', null, 'admin', 'UTC', 'en', true, '2026-01-10 09:11:10+00', '2026-01-10 09:11:10+00', null),
  ('11111111-1111-4111-8111-111111111116', 'Admin Two', null, 'admin', 'UTC', 'en', true, '2026-01-10 09:11:20+00', '2026-01-10 09:11:20+00', null),
  ('11111111-1111-4111-8111-111111111117', 'Super Admin One', null, 'super_admin', 'UTC', 'en', true, '2026-01-10 09:11:30+00', '2026-01-10 09:11:30+00', null)
on conflict do nothing;

insert into public.organization_members (
  id,
  organization_id,
  user_id,
  role,
  status,
  invited_by,
  joined_at,
  created_at,
  updated_at,
  deleted_at
)
values
  ('23222222-2222-4222-8222-222222222201', '22222222-2222-4222-8222-222222222222', '11111111-1111-4111-8111-111111111111', 'student', 'active', '11111111-1111-4111-8111-111111111115', '2026-01-10 09:12:00+00', '2026-01-10 09:12:00+00', '2026-01-10 09:12:00+00', null),
  ('23222222-2222-4222-8222-222222222202', '22222222-2222-4222-8222-222222222222', '11111111-1111-4111-8111-111111111112', 'student', 'active', '11111111-1111-4111-8111-111111111115', '2026-01-10 09:12:10+00', '2026-01-10 09:12:10+00', '2026-01-10 09:12:10+00', null),
  ('23222222-2222-4222-8222-222222222203', '22222222-2222-4222-8222-222222222222', '11111111-1111-4111-8111-111111111113', 'instructor', 'active', '11111111-1111-4111-8111-111111111115', '2026-01-10 09:12:20+00', '2026-01-10 09:12:20+00', '2026-01-10 09:12:20+00', null),
  ('23222222-2222-4222-8222-222222222204', '22222222-2222-4222-8222-222222222222', '11111111-1111-4111-8111-111111111114', 'instructor', 'active', '11111111-1111-4111-8111-111111111115', '2026-01-10 09:12:30+00', '2026-01-10 09:12:30+00', '2026-01-10 09:12:30+00', null),
  ('23222222-2222-4222-8222-222222222205', '22222222-2222-4222-8222-222222222222', '11111111-1111-4111-8111-111111111115', 'admin', 'active', null, '2026-01-10 09:12:40+00', '2026-01-10 09:12:40+00', '2026-01-10 09:12:40+00', null),
  ('23222222-2222-4222-8222-222222222206', '22222222-2222-4222-8222-222222222222', '11111111-1111-4111-8111-111111111116', 'admin', 'active', '11111111-1111-4111-8111-111111111115', '2026-01-10 09:12:50+00', '2026-01-10 09:12:50+00', '2026-01-10 09:12:50+00', null),
  ('23222222-2222-4222-8222-222222222207', '22222222-2222-4222-8222-222222222222', '11111111-1111-4111-8111-111111111117', 'super_admin', 'active', null, '2026-01-10 09:13:00+00', '2026-01-10 09:13:00+00', '2026-01-10 09:13:00+00', null)
on conflict do nothing;

insert into public.cohorts (
  id,
  organization_id,
  code,
  name,
  description,
  starts_at,
  ends_at,
  is_active,
  external_id,
  created_by,
  created_at,
  updated_at,
  deleted_at
)
values
  (
    '33333333-3333-4333-8333-333333333301',
    '22222222-2222-4222-8222-222222222222',
    'JAN-2026-A',
    'January 2026 Cohort A',
    'Primary dev cohort for seeded students',
    '2026-01-01 00:00:00+00',
    '2026-12-31 23:59:59+00',
    true,
    'cohort-dev-jan-2026-a',
    '11111111-1111-4111-8111-111111111113',
    '2026-01-10 09:20:00+00',
    '2026-01-10 09:20:00+00',
    null
  )
on conflict do nothing;

insert into public.cohort_members (
  id,
  organization_id,
  cohort_id,
  user_id,
  role,
  joined_at,
  created_at,
  deleted_at
)
values
  ('33333333-3333-4333-8333-333333333311', '22222222-2222-4222-8222-222222222222', '33333333-3333-4333-8333-333333333301', '11111111-1111-4111-8111-111111111111', 'student', '2026-01-10 09:21:00+00', '2026-01-10 09:21:00+00', null),
  ('33333333-3333-4333-8333-333333333312', '22222222-2222-4222-8222-222222222222', '33333333-3333-4333-8333-333333333301', '11111111-1111-4111-8111-111111111112', 'student', '2026-01-10 09:21:10+00', '2026-01-10 09:21:10+00', null)
on conflict do nothing;

insert into public.access_packages (
  id,
  organization_id,
  code,
  name,
  description,
  is_active,
  external_id,
  created_by,
  created_at,
  updated_at,
  metadata,
  deleted_at
)
values
  (
    '44444444-4444-4444-8444-444444444401',
    '22222222-2222-4222-8222-222222222222',
    'AWS-SAA-FREE',
    'AWS SAA Free Preview Pack',
    'Starter package with one exam preview and guidance',
    true,
    'pkg-aws-saa-free',
    '11111111-1111-4111-8111-111111111113',
    '2026-01-10 09:25:00+00',
    '2026-01-10 09:25:00+00',
    '{"tier":"free","catalog":"dev"}'::jsonb,
    null
  ),
  (
    '44444444-4444-4444-8444-444444444402',
    '22222222-2222-4222-8222-222222222222',
    'CLOUD-PRO-PREMIUM',
    'Cloud Pro Premium Pack',
    'Premium package with full exam access',
    true,
    'pkg-cloud-pro-premium',
    '11111111-1111-4111-8111-111111111114',
    '2026-01-10 09:25:10+00',
    '2026-01-10 09:25:10+00',
    '{"tier":"premium","catalog":"dev"}'::jsonb,
    null
  )
on conflict do nothing;

insert into public.access_package_versions (
  id,
  package_id,
  organization_id,
  version_no,
  status,
  published_at,
  effective_from,
  effective_until,
  external_id,
  created_by,
  created_at,
  updated_at,
  metadata,
  deleted_at
)
values
  (
    '44555555-5555-4555-8555-555555555401',
    '44444444-4444-4444-8444-444444444401',
    '22222222-2222-4222-8222-222222222222',
    1,
    'published',
    '2026-01-10 09:26:00+00',
    '2026-01-10 09:26:00+00',
    null,
    'pkg-ver-aws-free-v1',
    '11111111-1111-4111-8111-111111111113',
    '2026-01-10 09:26:00+00',
    '2026-01-10 09:26:00+00',
    '{"release":"v1"}'::jsonb,
    null
  ),
  (
    '44555555-5555-4555-8555-555555555402',
    '44444444-4444-4444-8444-444444444402',
    '22222222-2222-4222-8222-222222222222',
    1,
    'published',
    '2026-01-10 09:26:10+00',
    '2026-01-10 09:26:10+00',
    null,
    'pkg-ver-cloud-premium-v1',
    '11111111-1111-4111-8111-111111111114',
    '2026-01-10 09:26:10+00',
    '2026-01-10 09:26:10+00',
    '{"release":"v1"}'::jsonb,
    null
  )
on conflict do nothing;

insert into public.content_items (
  id,
  organization_id,
  content_type,
  title,
  uri,
  external_id,
  created_by,
  created_at,
  updated_at,
  deleted_at
)
values
  (
    '44666666-6666-4666-8666-666666666401',
    '22222222-2222-4222-8222-222222222222',
    'lesson',
    'AWS Networking Fundamentals',
    'https://dev.prephatch.local/content/aws-networking-fundamentals',
    'content-aws-networking-fundamentals',
    '11111111-1111-4111-8111-111111111113',
    '2026-01-10 09:27:00+00',
    '2026-01-10 09:27:00+00',
    null
  ),
  (
    '44666666-6666-4666-8666-666666666402',
    '22222222-2222-4222-8222-222222222222',
    'video',
    'Azure Identity and Access Review',
    'https://dev.prephatch.local/content/azure-identity-access-review',
    'content-azure-identity-access-review',
    '11111111-1111-4111-8111-111111111114',
    '2026-01-10 09:27:10+00',
    '2026-01-10 09:27:10+00',
    null
  )
on conflict do nothing;

insert into public.exams (
  id,
  organization_id,
  exam_code,
  title,
  description,
  kind,
  is_active,
  external_id,
  created_by,
  archived_at,
  created_at,
  updated_at,
  metadata,
  deleted_at
)
values
  (
    '55555555-5555-4555-8555-555555555501',
    '22222222-2222-4222-8222-222222222222',
    'AWS-SAA-C03',
    'AWS Solutions Architect Associate',
    'Core architecture readiness exam for AWS SAA-C03',
    'certification',
    true,
    'exam-aws-saa-c03',
    '11111111-1111-4111-8111-111111111113',
    null,
    '2026-01-10 09:30:00+00',
    '2026-01-10 09:30:00+00',
    '{"vendor":"AWS","level":"associate"}'::jsonb,
    null
  ),
  (
    '55555555-5555-4555-8555-555555555502',
    '22222222-2222-4222-8222-222222222222',
    'AZ-104',
    'Microsoft Azure Administrator',
    'Operational readiness exam for AZ-104',
    'certification',
    true,
    'exam-az-104',
    '11111111-1111-4111-8111-111111111114',
    null,
    '2026-01-10 09:30:10+00',
    '2026-01-10 09:30:10+00',
    '{"vendor":"Microsoft","level":"associate"}'::jsonb,
    null
  )
on conflict do nothing;

insert into public.exam_versions (
  id,
  exam_id,
  organization_id,
  version_no,
  version_number,
  status,
  title_override,
  instructions,
  duration_minutes,
  availability_start_at,
  availability_end_at,
  submission_deadline_at,
  max_attempts_per_user,
  allow_resume,
  shuffle_questions,
  shuffle_options,
  pass_score,
  grading_policy,
  supersedes_version_id,
  external_id,
  published_at,
  created_by,
  created_at,
  updated_at,
  metadata,
  deleted_at
)
values
  (
    '55666666-6666-4666-8666-666666666501',
    '55555555-5555-4555-8555-555555555501',
    '22222222-2222-4222-8222-222222222222',
    1,
    1,
    'published',
    'AWS SAA C03 - Dev Version',
    'Select the best architecture-focused answer for each question.',
    90,
    '2026-01-01 00:00:00+00',
    '2026-12-31 23:59:59+00',
    '2026-12-31 23:59:59+00',
    3,
    true,
    true,
    true,
    70.00,
    '{"mode":"auto","negative_marking":false}'::jsonb,
    null,
    'exam-ver-aws-saa-c03-v1',
    '2026-01-10 09:31:00+00',
    '11111111-1111-4111-8111-111111111113',
    '2026-01-10 09:31:00+00',
    '2026-01-10 09:31:00+00',
    '{"blueprint":"2026-q1"}'::jsonb,
    null
  ),
  (
    '55666666-6666-4666-8666-666666666502',
    '55555555-5555-4555-8555-555555555502',
    '22222222-2222-4222-8222-222222222222',
    1,
    1,
    'published',
    'AZ-104 - Dev Version',
    'Answer with the most operationally sound Azure management choice.',
    80,
    '2026-01-01 00:00:00+00',
    '2026-12-31 23:59:59+00',
    '2026-12-31 23:59:59+00',
    3,
    true,
    true,
    true,
    70.00,
    '{"mode":"auto","negative_marking":false}'::jsonb,
    null,
    'exam-ver-az-104-v1',
    '2026-01-10 09:31:10+00',
    '11111111-1111-4111-8111-111111111114',
    '2026-01-10 09:31:10+00',
    '2026-01-10 09:31:10+00',
    '{"blueprint":"2026-q1"}'::jsonb,
    null
  )
on conflict do nothing;

insert into public.questions (
  id,
  organization_id,
  question_code,
  category,
  tags,
  is_active,
  external_id,
  created_by,
  created_at,
  updated_at,
  metadata,
  deleted_at
)
values
  ('66666666-6666-4666-8666-666666666601', '22222222-2222-4222-8222-222222222222', 'AWS-Q-001', 'networking', '{"aws","vpc","alb"}'::text[], true, 'q-aws-001', '11111111-1111-4111-8111-111111111113', '2026-01-10 09:33:00+00', '2026-01-10 09:33:00+00', '{"difficulty_band":"medium"}'::jsonb, null),
  ('66666666-6666-4666-8666-666666666602', '22222222-2222-4222-8222-222222222222', 'AWS-Q-002', 'storage', '{"aws","s3","durability"}'::text[], true, 'q-aws-002', '11111111-1111-4111-8111-111111111113', '2026-01-10 09:33:10+00', '2026-01-10 09:33:10+00', '{"difficulty_band":"easy"}'::jsonb, null),
  ('66666666-6666-4666-8666-666666666603', '22222222-2222-4222-8222-222222222222', 'AWS-Q-003', 'database', '{"aws","rds","replicas"}'::text[], true, 'q-aws-003', '11111111-1111-4111-8111-111111111113', '2026-01-10 09:33:20+00', '2026-01-10 09:33:20+00', '{"difficulty_band":"medium"}'::jsonb, null),
  ('66666666-6666-4666-8666-666666666604', '22222222-2222-4222-8222-222222222222', 'AZ-Q-001', 'identity', '{"azure","entra","rbac"}'::text[], true, 'q-az-001', '11111111-1111-4111-8111-111111111114', '2026-01-10 09:33:30+00', '2026-01-10 09:33:30+00', '{"difficulty_band":"easy"}'::jsonb, null),
  ('66666666-6666-4666-8666-666666666605', '22222222-2222-4222-8222-222222222222', 'AZ-Q-002', 'compute', '{"azure","vm","availability"}'::text[], true, 'q-az-002', '11111111-1111-4111-8111-111111111114', '2026-01-10 09:33:40+00', '2026-01-10 09:33:40+00', '{"difficulty_band":"medium"}'::jsonb, null),
  ('66666666-6666-4666-8666-666666666606', '22222222-2222-4222-8222-222222222222', 'AZ-Q-003', 'monitoring', '{"azure","monitor","alerts"}'::text[], true, 'q-az-003', '11111111-1111-4111-8111-111111111114', '2026-01-10 09:33:50+00', '2026-01-10 09:33:50+00', '{"difficulty_band":"medium"}'::jsonb, null)
on conflict do nothing;

insert into public.question_versions (
  id,
  question_id,
  organization_id,
  version_no,
  version_number,
  status,
  question_type,
  prompt,
  prompt_rich,
  options,
  correct_answer,
  explanation,
  difficulty,
  default_points,
  external_id,
  created_by,
  created_at,
  updated_at,
  published_at,
  metadata,
  deleted_at
)
values
  (
    '66777777-7777-4777-8777-777777777601',
    '66666666-6666-4666-8666-666666666601',
    '22222222-2222-4222-8222-222222222222',
    1,
    1,
    'published',
    'single_choice',
    'A workload in private subnets needs HTTPS ingress. Which architecture is best?',
    '{"type":"doc","blocks":[{"type":"paragraph","text":"Choose the best networking architecture."}]}'::jsonb,
    '[{"id":"A","text":"Expose EC2 instances with public IPs"},{"id":"B","text":"Use a public ALB with private targets"},{"id":"C","text":"Use NAT gateway for inbound"},{"id":"D","text":"Use private API Gateway without VPC link"}]'::jsonb,
    '{"choice":"B"}'::jsonb,
    'A public ALB with private targets keeps app hosts private while allowing controlled ingress.',
    3,
    1.00,
    'qv-aws-001-v1',
    '11111111-1111-4111-8111-111111111113',
    '2026-01-10 09:35:00+00',
    '2026-01-10 09:35:00+00',
    '2026-01-10 09:35:00+00',
    '{"source":"dev_seed"}'::jsonb,
    null
  ),
  (
    '66777777-7777-4777-8777-777777777602',
    '66666666-6666-4666-8666-666666666602',
    '22222222-2222-4222-8222-222222222222',
    1,
    1,
    'published',
    'single_choice',
    'Which option improves object data durability the most?',
    '{"type":"doc","blocks":[{"type":"paragraph","text":"Pick the best durability control."}]}'::jsonb,
    '[{"id":"A","text":"Enable S3 versioning"},{"id":"B","text":"Store only on one instance store"},{"id":"C","text":"Disable backups"},{"id":"D","text":"Keep data only in cache"}]'::jsonb,
    '{"choice":"A"}'::jsonb,
    'Versioning in S3 materially improves recovery and object durability posture.',
    2,
    1.00,
    'qv-aws-002-v1',
    '11111111-1111-4111-8111-111111111113',
    '2026-01-10 09:35:10+00',
    '2026-01-10 09:35:10+00',
    '2026-01-10 09:35:10+00',
    '{"source":"dev_seed"}'::jsonb,
    null
  ),
  (
    '66777777-7777-4777-8777-777777777603',
    '66666666-6666-4666-8666-666666666603',
    '22222222-2222-4222-8222-222222222222',
    1,
    1,
    'published',
    'single_choice',
    'An OLTP system is read-heavy. What is the fastest low-risk scale option?',
    '{"type":"doc","blocks":[{"type":"paragraph","text":"Consider minimal-risk scaling."}]}'::jsonb,
    '[{"id":"A","text":"Immediate custom sharding"},{"id":"B","text":"Add read replicas and route reads"},{"id":"C","text":"Drop indexes"},{"id":"D","text":"Increase write batching only"}]'::jsonb,
    '{"choice":"B"}'::jsonb,
    'Read replicas reduce read pressure with minimal application changes.',
    3,
    1.00,
    'qv-aws-003-v1',
    '11111111-1111-4111-8111-111111111113',
    '2026-01-10 09:35:20+00',
    '2026-01-10 09:35:20+00',
    '2026-01-10 09:35:20+00',
    '{"source":"dev_seed"}'::jsonb,
    null
  ),
  (
    '66777777-7777-4777-8777-777777777604',
    '66666666-6666-4666-8666-666666666604',
    '22222222-2222-4222-8222-222222222222',
    1,
    1,
    'published',
    'single_choice',
    'Which control best enforces least privilege in Azure?',
    '{"type":"doc","blocks":[{"type":"paragraph","text":"Identity and access management question."}]}'::jsonb,
    '[{"id":"A","text":"Grant Owner everywhere"},{"id":"B","text":"Use RBAC scoped to resource groups"},{"id":"C","text":"Use one shared admin account"},{"id":"D","text":"Disable MFA"}]'::jsonb,
    '{"choice":"B"}'::jsonb,
    'Scoped RBAC assignments align with least-privilege practice.',
    2,
    1.00,
    'qv-az-001-v1',
    '11111111-1111-4111-8111-111111111114',
    '2026-01-10 09:35:30+00',
    '2026-01-10 09:35:30+00',
    '2026-01-10 09:35:30+00',
    '{"source":"dev_seed"}'::jsonb,
    null
  ),
  (
    '66777777-7777-4777-8777-777777777605',
    '66666666-6666-4666-8666-666666666605',
    '22222222-2222-4222-8222-222222222222',
    1,
    1,
    'published',
    'single_choice',
    'To increase VM resilience within a region, which is best?',
    '{"type":"doc","blocks":[{"type":"paragraph","text":"Compute resiliency question."}]}'::jsonb,
    '[{"id":"A","text":"Single VM with larger SKU"},{"id":"B","text":"Use availability zones"},{"id":"C","text":"Disable health probes"},{"id":"D","text":"Pin all workloads to one rack"}]'::jsonb,
    '{"choice":"B"}'::jsonb,
    'Availability zones distribute failure domains for higher resiliency.',
    3,
    1.00,
    'qv-az-002-v1',
    '11111111-1111-4111-8111-111111111114',
    '2026-01-10 09:35:40+00',
    '2026-01-10 09:35:40+00',
    '2026-01-10 09:35:40+00',
    '{"source":"dev_seed"}'::jsonb,
    null
  ),
  (
    '66777777-7777-4777-8777-777777777606',
    '66666666-6666-4666-8666-666666666606',
    '22222222-2222-4222-8222-222222222222',
    1,
    1,
    'published',
    'single_choice',
    'Which service is best for centralized Azure metrics and alerting?',
    '{"type":"doc","blocks":[{"type":"paragraph","text":"Monitoring and alerting question."}]}'::jsonb,
    '[{"id":"A","text":"Azure Monitor"},{"id":"B","text":"Azure Data Box"},{"id":"C","text":"Azure Lighthouse only"},{"id":"D","text":"Azure Bastion"}]'::jsonb,
    '{"choice":"A"}'::jsonb,
    'Azure Monitor is purpose-built for telemetry, metrics, and alerting.',
    2,
    1.00,
    'qv-az-003-v1',
    '11111111-1111-4111-8111-111111111114',
    '2026-01-10 09:35:50+00',
    '2026-01-10 09:35:50+00',
    '2026-01-10 09:35:50+00',
    '{"source":"dev_seed"}'::jsonb,
    null
  )
on conflict do nothing;

insert into public.exam_version_sections (
  id,
  exam_version_id,
  organization_id,
  section_key,
  title,
  description,
  position,
  time_limit_minutes,
  weight,
  created_at,
  updated_at
)
values
  (
    '77777777-7777-4777-8777-777777777701',
    '55666666-6666-4666-8666-666666666501',
    '22222222-2222-4222-8222-222222222222',
    'aws-core',
    'AWS Core Architecture',
    'Network, storage, and database fundamentals',
    1,
    90,
    1.00,
    '2026-01-10 09:37:00+00',
    '2026-01-10 09:37:00+00'
  ),
  (
    '77777777-7777-4777-8777-777777777702',
    '55666666-6666-4666-8666-666666666502',
    '22222222-2222-4222-8222-222222222222',
    'az-core',
    'Azure Core Administration',
    'Identity, compute, and monitoring',
    1,
    80,
    1.00,
    '2026-01-10 09:37:10+00',
    '2026-01-10 09:37:10+00'
  )
on conflict do nothing;

insert into public.exam_version_questions (
  id,
  exam_version_id,
  organization_id,
  section_id,
  question_version_id,
  position,
  points,
  is_required,
  scoring_rule,
  created_at,
  updated_at
)
values
  ('77888888-8888-4888-8888-888888888801', '55666666-6666-4666-8666-666666666501', '22222222-2222-4222-8222-222222222222', '77777777-7777-4777-8777-777777777701', '66777777-7777-4777-8777-777777777601', 1, 1.00, true, '{"mode":"exact_choice"}'::jsonb, '2026-01-10 09:38:00+00', '2026-01-10 09:38:00+00'),
  ('77888888-8888-4888-8888-888888888802', '55666666-6666-4666-8666-666666666501', '22222222-2222-4222-8222-222222222222', '77777777-7777-4777-8777-777777777701', '66777777-7777-4777-8777-777777777602', 2, 1.00, true, '{"mode":"exact_choice"}'::jsonb, '2026-01-10 09:38:10+00', '2026-01-10 09:38:10+00'),
  ('77888888-8888-4888-8888-888888888803', '55666666-6666-4666-8666-666666666501', '22222222-2222-4222-8222-222222222222', '77777777-7777-4777-8777-777777777701', '66777777-7777-4777-8777-777777777603', 3, 1.00, true, '{"mode":"exact_choice"}'::jsonb, '2026-01-10 09:38:20+00', '2026-01-10 09:38:20+00'),
  ('77888888-8888-4888-8888-888888888804', '55666666-6666-4666-8666-666666666502', '22222222-2222-4222-8222-222222222222', '77777777-7777-4777-8777-777777777702', '66777777-7777-4777-8777-777777777604', 1, 1.00, true, '{"mode":"exact_choice"}'::jsonb, '2026-01-10 09:38:30+00', '2026-01-10 09:38:30+00'),
  ('77888888-8888-4888-8888-888888888805', '55666666-6666-4666-8666-666666666502', '22222222-2222-4222-8222-222222222222', '77777777-7777-4777-8777-777777777702', '66777777-7777-4777-8777-777777777605', 2, 1.00, true, '{"mode":"exact_choice"}'::jsonb, '2026-01-10 09:38:40+00', '2026-01-10 09:38:40+00'),
  ('77888888-8888-4888-8888-888888888806', '55666666-6666-4666-8666-666666666502', '22222222-2222-4222-8222-222222222222', '77777777-7777-4777-8777-777777777702', '66777777-7777-4777-8777-777777777606', 3, 1.00, true, '{"mode":"exact_choice"}'::jsonb, '2026-01-10 09:38:50+00', '2026-01-10 09:38:50+00')
on conflict do nothing;

insert into public.access_package_exam_items (
  id,
  package_version_id,
  organization_id,
  exam_version_id,
  position,
  is_required,
  created_at
)
values
  (
    '77999999-9999-4999-8999-999999999901',
    '44555555-5555-4555-8555-555555555401',
    '22222222-2222-4222-8222-222222222222',
    '55666666-6666-4666-8666-666666666501',
    1,
    true,
    '2026-01-10 09:39:10+00'
  ),
  (
    '77999999-9999-4999-8999-999999999902',
    '44555555-5555-4555-8555-555555555402',
    '22222222-2222-4222-8222-222222222222',
    '55666666-6666-4666-8666-666666666502',
    1,
    true,
    '2026-01-10 09:39:20+00'
  )
on conflict do nothing;

insert into public.access_package_content_items (
  id,
  package_version_id,
  organization_id,
  content_item_id,
  position,
  created_at
)
values
  (
    '77999999-9999-4999-8999-999999999911',
    '44555555-5555-4555-8555-555555555401',
    '22222222-2222-4222-8222-222222222222',
    '44666666-6666-4666-8666-666666666401',
    1,
    '2026-01-10 09:39:30+00'
  ),
  (
    '77999999-9999-4999-8999-999999999912',
    '44555555-5555-4555-8555-555555555402',
    '22222222-2222-4222-8222-222222222222',
    '44666666-6666-4666-8666-666666666402',
    1,
    '2026-01-10 09:39:40+00'
  )
on conflict do nothing;

insert into public.package_org_assignments (
  id,
  organization_id,
  package_version_id,
  assigned_by,
  assigned_at,
  valid_from,
  valid_until,
  is_active,
  created_at,
  deleted_at
)
values
  (
    '77999999-9999-4999-8999-999999999921',
    '22222222-2222-4222-8222-222222222222',
    '44555555-5555-4555-8555-555555555401',
    '11111111-1111-4111-8111-111111111115',
    '2026-01-10 09:40:00+00',
    '2026-01-10 09:40:00+00',
    null,
    true,
    '2026-01-10 09:40:00+00',
    null
  ),
  (
    '77999999-9999-4999-8999-999999999922',
    '22222222-2222-4222-8222-222222222222',
    '44555555-5555-4555-8555-555555555402',
    '11111111-1111-4111-8111-111111111116',
    '2026-01-10 09:40:10+00',
    '2026-01-10 09:40:10+00',
    null,
    true,
    '2026-01-10 09:40:10+00',
    null
  )
on conflict do nothing;

insert into public.package_user_assignments (
  id,
  organization_id,
  package_version_id,
  user_id,
  assigned_by,
  assigned_at,
  valid_from,
  valid_until,
  is_active,
  created_at,
  deleted_at
)
values
  (
    '77999999-9999-4999-8999-999999999931',
    '22222222-2222-4222-8222-222222222222',
    '44555555-5555-4555-8555-555555555401',
    '11111111-1111-4111-8111-111111111111',
    '11111111-1111-4111-8111-111111111115',
    '2026-01-10 09:41:00+00',
    '2026-01-10 09:41:00+00',
    null,
    true,
    '2026-01-10 09:41:00+00',
    null
  ),
  (
    '77999999-9999-4999-8999-999999999932',
    '22222222-2222-4222-8222-222222222222',
    '44555555-5555-4555-8555-555555555401',
    '11111111-1111-4111-8111-111111111112',
    '11111111-1111-4111-8111-111111111115',
    '2026-01-10 09:41:10+00',
    '2026-01-10 09:41:10+00',
    null,
    true,
    '2026-01-10 09:41:10+00',
    null
  ),
  (
    '77999999-9999-4999-8999-999999999933',
    '22222222-2222-4222-8222-222222222222',
    '44555555-5555-4555-8555-555555555402',
    '11111111-1111-4111-8111-111111111111',
    '11111111-1111-4111-8111-111111111116',
    '2026-01-10 09:41:20+00',
    '2026-01-10 09:41:20+00',
    null,
    true,
    '2026-01-10 09:41:20+00',
    null
  ),
  (
    '77999999-9999-4999-8999-999999999934',
    '22222222-2222-4222-8222-222222222222',
    '44555555-5555-4555-8555-555555555402',
    '11111111-1111-4111-8111-111111111112',
    '11111111-1111-4111-8111-111111111116',
    '2026-01-10 09:41:30+00',
    '2026-01-10 09:41:30+00',
    null,
    true,
    '2026-01-10 09:41:30+00',
    null
  )
on conflict do nothing;

insert into public.package_cohort_assignments (
  id,
  organization_id,
  package_version_id,
  cohort_id,
  assigned_by,
  assigned_at,
  valid_from,
  valid_until,
  is_active,
  created_at,
  deleted_at
)
values
  (
    '77999999-9999-4999-8999-999999999941',
    '22222222-2222-4222-8222-222222222222',
    '44555555-5555-4555-8555-555555555401',
    '33333333-3333-4333-8333-333333333301',
    '11111111-1111-4111-8111-111111111115',
    '2026-01-10 09:42:00+00',
    '2026-01-10 09:42:00+00',
    null,
    true,
    '2026-01-10 09:42:00+00',
    null
  )
on conflict do nothing;

insert into public.exam_attempts (
  id,
  organization_id,
  cohort_id,
  user_id,
  exam_id,
  exam_version_id,
  attempt_no,
  status,
  started_at,
  last_activity_at,
  submitted_at,
  expires_at,
  time_spent_seconds,
  client_timezone,
  row_version,
  autosave_version,
  final_submission_id,
  external_id,
  created_at,
  updated_at,
  metadata,
  deleted_at
)
values
  (
    '88888888-8888-4888-8888-888888881001',
    '22222222-2222-4222-8222-222222222222',
    '33333333-3333-4333-8333-333333333301',
    '11111111-1111-4111-8111-111111111111',
    '55555555-5555-4555-8555-555555555501',
    '55666666-6666-4666-8666-666666666501',
    1,
    'graded',
    '2026-01-11 10:00:00+00',
    '2026-01-11 10:35:00+00',
    '2026-01-11 10:35:00+00',
    '2026-01-11 11:30:00+00',
    2100,
    'UTC',
    1,
    2,
    null,
    null,
    '2026-01-11 10:00:00+00',
    '2026-01-11 10:35:00+00',
    '{"device":"chrome","seed":"dev"}'::jsonb,
    null
  ),
  (
    '88888888-8888-4888-8888-888888881002',
    '22222222-2222-4222-8222-222222222222',
    '33333333-3333-4333-8333-333333333301',
    '11111111-1111-4111-8111-111111111112',
    '55555555-5555-4555-8555-555555555501',
    '55666666-6666-4666-8666-666666666501',
    1,
    'submitted',
    '2026-01-11 11:00:00+00',
    '2026-01-11 11:20:00+00',
    '2026-01-11 11:20:00+00',
    '2026-01-11 12:30:00+00',
    1200,
    'UTC',
    1,
    1,
    null,
    null,
    '2026-01-11 11:00:00+00',
    '2026-01-11 11:20:00+00',
    '{"device":"firefox","seed":"dev"}'::jsonb,
    null
  ),
  (
    '88888888-8888-4888-8888-888888881003',
    '22222222-2222-4222-8222-222222222222',
    '33333333-3333-4333-8333-333333333301',
    '11111111-1111-4111-8111-111111111111',
    '55555555-5555-4555-8555-555555555502',
    '55666666-6666-4666-8666-666666666502',
    1,
    'in_progress',
    '2026-01-11 12:00:00+00',
    '2026-01-11 12:15:00+00',
    null,
    '2026-01-11 13:30:00+00',
    900,
    'UTC',
    1,
    1,
    null,
    null,
    '2026-01-11 12:00:00+00',
    '2026-01-11 12:15:00+00',
    '{"device":"safari","seed":"dev"}'::jsonb,
    null
  )
on conflict do nothing;

insert into public.app_login_sessions (
  id,
  organization_id,
  user_id,
  refresh_token_hash,
  device_fingerprint,
  ip,
  user_agent,
  last_seen_at,
  expires_at,
  revoked_at,
  created_at
)
values
  (
    '88888888-8888-4888-8888-888888881101',
    '22222222-2222-4222-8222-222222222222',
    '11111111-1111-4111-8111-111111111111',
    'rt_hash_student_1',
    'fp_student_1',
    '10.0.0.11'::inet,
    'Mozilla/5.0 Student One',
    '2026-01-11 12:15:00+00',
    '2026-03-01 00:00:00+00',
    null,
    '2026-01-11 10:00:00+00'
  ),
  (
    '88888888-8888-4888-8888-888888881102',
    '22222222-2222-4222-8222-222222222222',
    '11111111-1111-4111-8111-111111111112',
    'rt_hash_student_2',
    'fp_student_2',
    '10.0.0.12'::inet,
    'Mozilla/5.0 Student Two',
    '2026-01-11 11:20:00+00',
    '2026-03-01 00:00:00+00',
    null,
    '2026-01-11 11:00:00+00'
  ),
  (
    '88888888-8888-4888-8888-888888881103',
    '22222222-2222-4222-8222-222222222222',
    '11111111-1111-4111-8111-111111111113',
    'rt_hash_instructor_1',
    'fp_instructor_1',
    '10.0.0.13'::inet,
    'Mozilla/5.0 Instructor One',
    '2026-01-11 09:50:00+00',
    '2026-03-01 00:00:00+00',
    null,
    '2026-01-11 09:40:00+00'
  )
on conflict do nothing;

insert into public.attempt_sessions (
  id,
  attempt_id,
  organization_id,
  user_id,
  tab_id,
  session_token_hash,
  started_at,
  last_heartbeat_at,
  ended_at,
  user_agent,
  ip,
  created_at
)
values
  (
    '88888888-8888-4888-8888-888888881201',
    '88888888-8888-4888-8888-888888881001',
    '22222222-2222-4222-8222-222222222222',
    '11111111-1111-4111-8111-111111111111',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    'sess_hash_1001',
    '2026-01-11 10:00:00+00',
    '2026-01-11 10:35:00+00',
    '2026-01-11 10:35:00+00',
    'Mozilla/5.0 Student One',
    '10.0.0.11'::inet,
    '2026-01-11 10:00:00+00'
  ),
  (
    '88888888-8888-4888-8888-888888881202',
    '88888888-8888-4888-8888-888888881002',
    '22222222-2222-4222-8222-222222222222',
    '11111111-1111-4111-8111-111111111112',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2',
    'sess_hash_1002',
    '2026-01-11 11:00:00+00',
    '2026-01-11 11:20:00+00',
    '2026-01-11 11:20:00+00',
    'Mozilla/5.0 Student Two',
    '10.0.0.12'::inet,
    '2026-01-11 11:00:00+00'
  ),
  (
    '88888888-8888-4888-8888-888888881203',
    '88888888-8888-4888-8888-888888881003',
    '22222222-2222-4222-8222-222222222222',
    '11111111-1111-4111-8111-111111111111',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3',
    'sess_hash_1003',
    '2026-01-11 12:00:00+00',
    '2026-01-11 12:15:00+00',
    null,
    'Mozilla/5.0 Student One',
    '10.0.0.11'::inet,
    '2026-01-11 12:00:00+00'
  )
on conflict do nothing;

insert into public.attempt_answers (
  id,
  attempt_id,
  organization_id,
  exam_version_question_id,
  user_id,
  answer_payload,
  is_flagged,
  is_final,
  score_awarded,
  answered_at,
  version_no,
  row_version,
  created_at,
  updated_at,
  deleted_at
)
values
  ('88888888-8888-4888-8888-888888881301', '88888888-8888-4888-8888-888888881001', '22222222-2222-4222-8222-222222222222', '77888888-8888-4888-8888-888888888801', '11111111-1111-4111-8111-111111111111', '{"selected":["B"]}'::jsonb, false, true, 1.00, '2026-01-11 10:10:00+00', 1, 1, '2026-01-11 10:10:00+00', '2026-01-11 10:10:00+00', null),
  ('88888888-8888-4888-8888-888888881302', '88888888-8888-4888-8888-888888881001', '22222222-2222-4222-8222-222222222222', '77888888-8888-4888-8888-888888888802', '11111111-1111-4111-8111-111111111111', '{"selected":["A"]}'::jsonb, false, true, 1.00, '2026-01-11 10:18:00+00', 1, 1, '2026-01-11 10:18:00+00', '2026-01-11 10:18:00+00', null),
  ('88888888-8888-4888-8888-888888881303', '88888888-8888-4888-8888-888888881001', '22222222-2222-4222-8222-222222222222', '77888888-8888-4888-8888-888888888803', '11111111-1111-4111-8111-111111111111', '{"selected":["D"]}'::jsonb, false, true, 0.00, '2026-01-11 10:25:00+00', 1, 1, '2026-01-11 10:25:00+00', '2026-01-11 10:25:00+00', null),
  ('88888888-8888-4888-8888-888888881304', '88888888-8888-4888-8888-888888881002', '22222222-2222-4222-8222-222222222222', '77888888-8888-4888-8888-888888888801', '11111111-1111-4111-8111-111111111112', '{"selected":["B"]}'::jsonb, false, true, null, '2026-01-11 11:08:00+00', 1, 1, '2026-01-11 11:08:00+00', '2026-01-11 11:08:00+00', null),
  ('88888888-8888-4888-8888-888888881305', '88888888-8888-4888-8888-888888881002', '22222222-2222-4222-8222-222222222222', '77888888-8888-4888-8888-888888888802', '11111111-1111-4111-8111-111111111112', '{"selected":["C"]}'::jsonb, true, true, null, '2026-01-11 11:12:00+00', 1, 1, '2026-01-11 11:12:00+00', '2026-01-11 11:12:00+00', null),
  ('88888888-8888-4888-8888-888888881306', '88888888-8888-4888-8888-888888881003', '22222222-2222-4222-8222-222222222222', '77888888-8888-4888-8888-888888888804', '11111111-1111-4111-8111-111111111111', '{"selected":["B"]}'::jsonb, false, false, null, '2026-01-11 12:05:00+00', 1, 1, '2026-01-11 12:05:00+00', '2026-01-11 12:05:00+00', null),
  ('88888888-8888-4888-8888-888888881307', '88888888-8888-4888-8888-888888881003', '22222222-2222-4222-8222-222222222222', '77888888-8888-4888-8888-888888888805', '11111111-1111-4111-8111-111111111111', '{"selected":["A"]}'::jsonb, false, false, null, '2026-01-11 12:12:00+00', 1, 1, '2026-01-11 12:12:00+00', '2026-01-11 12:12:00+00', null)
on conflict do nothing;

insert into public.attempt_revisions (
  id,
  attempt_id,
  organization_id,
  revision_no,
  source,
  snapshot,
  created_by,
  created_at
)
values
  (
    '88888888-8888-4888-8888-888888881401',
    '88888888-8888-4888-8888-888888881001',
    '22222222-2222-4222-8222-222222222222',
    1,
    'autosave',
    '{"answers":{"77888888-8888-4888-8888-888888888801":["B"],"77888888-8888-4888-8888-888888888802":["A"]}}'::jsonb,
    '11111111-1111-4111-8111-111111111111',
    '2026-01-11 10:20:00+00'
  ),
  (
    '88888888-8888-4888-8888-888888881402',
    '88888888-8888-4888-8888-888888881001',
    '22222222-2222-4222-8222-222222222222',
    2,
    'submit',
    '{"answers":{"77888888-8888-4888-8888-888888888801":["B"],"77888888-8888-4888-8888-888888888802":["A"],"77888888-8888-4888-8888-888888888803":["D"]}}'::jsonb,
    '11111111-1111-4111-8111-111111111111',
    '2026-01-11 10:35:00+00'
  )
on conflict do nothing;

insert into public.attempt_submission_requests (
  id,
  attempt_id,
  organization_id,
  user_id,
  idempotency_key,
  request_hash,
  status,
  accepted,
  error_code,
  error_message,
  processed_at,
  row_version,
  created_at
)
values
  (
    '88888888-8888-4888-8888-888888881501',
    '88888888-8888-4888-8888-888888881001',
    '22222222-2222-4222-8222-222222222222',
    '11111111-1111-4111-8111-111111111111',
    'sub-req-1001-v1',
    'subhash-1001-v1',
    'accepted',
    true,
    null,
    null,
    '2026-01-11 10:35:05+00',
    1,
    '2026-01-11 10:35:00+00'
  ),
  (
    '88888888-8888-4888-8888-888888881502',
    '88888888-8888-4888-8888-888888881002',
    '22222222-2222-4222-8222-222222222222',
    '11111111-1111-4111-8111-111111111112',
    'sub-req-1002-v1',
    'subhash-1002-v1',
    'processing',
    false,
    null,
    null,
    null,
    1,
    '2026-01-11 11:20:00+00'
  )
on conflict do nothing;

insert into public.attempt_creation_requests (
  id,
  organization_id,
  user_id,
  exam_id,
  exam_version_id,
  idempotency_key,
  request_hash,
  status,
  accepted,
  error_code,
  error_message,
  attempt_id,
  processed_at,
  row_version,
  created_at
)
values
  (
    '88888888-8888-4888-8888-888888881601',
    '22222222-2222-4222-8222-222222222222',
    '11111111-1111-4111-8111-111111111111',
    '55555555-5555-4555-8555-555555555501',
    '55666666-6666-4666-8666-666666666501',
    'create-req-1001-v1',
    'createhash-1001-v1',
    'accepted',
    true,
    null,
    null,
    '88888888-8888-4888-8888-888888881001',
    '2026-01-11 10:00:00+00',
    1,
    '2026-01-11 09:59:50+00'
  ),
  (
    '88888888-8888-4888-8888-888888881602',
    '22222222-2222-4222-8222-222222222222',
    '11111111-1111-4111-8111-111111111112',
    '55555555-5555-4555-8555-555555555501',
    '55666666-6666-4666-8666-666666666501',
    'create-req-1002-v1',
    'createhash-1002-v1',
    'accepted',
    true,
    null,
    null,
    '88888888-8888-4888-8888-888888881002',
    '2026-01-11 11:00:00+00',
    1,
    '2026-01-11 10:59:50+00'
  )
on conflict do nothing;

insert into public.attempt_results (
  id,
  attempt_id,
  organization_id,
  user_id,
  exam_id,
  exam_version_id,
  result_version,
  is_current,
  raw_score,
  max_score,
  percentage,
  passed,
  breakdown,
  graded_at,
  row_version,
  created_at,
  updated_at,
  deleted_at
)
values
  (
    '88888888-8888-4888-8888-888888881701',
    '88888888-8888-4888-8888-888888881001',
    '22222222-2222-4222-8222-222222222222',
    '11111111-1111-4111-8111-111111111111',
    '55555555-5555-4555-8555-555555555501',
    '55666666-6666-4666-8666-666666666501',
    1,
    true,
    2.00,
    3.00,
    66.67,
    false,
    '{"section_scores":{"aws-core":{"correct":2,"total":3}}}'::jsonb,
    '2026-01-11 10:36:00+00',
    1,
    '2026-01-11 10:36:00+00',
    '2026-01-11 10:36:00+00',
    null
  )
on conflict do nothing;

insert into public.result_section_scores (
  id,
  attempt_result_id,
  organization_id,
  section_id,
  points_awarded,
  points_possible,
  created_at
)
values
  (
    '88888888-8888-4888-8888-888888881801',
    '88888888-8888-4888-8888-888888881701',
    '22222222-2222-4222-8222-222222222222',
    '77777777-7777-4777-8777-777777777701',
    2.00,
    3.00,
    '2026-01-11 10:36:10+00'
  )
on conflict do nothing;

insert into public.user_exam_progress (
  id,
  organization_id,
  user_id,
  exam_id,
  latest_attempt_id,
  latest_result_id,
  attempts_count,
  best_score,
  last_activity_at,
  updated_at
)
values
  (
    '88888888-8888-4888-8888-888888881901',
    '22222222-2222-4222-8222-222222222222',
    '11111111-1111-4111-8111-111111111111',
    '55555555-5555-4555-8555-555555555501',
    '88888888-8888-4888-8888-888888881001',
    '88888888-8888-4888-8888-888888881701',
    1,
    66.67,
    '2026-01-11 10:36:10+00',
    '2026-01-11 10:36:10+00'
  ),
  (
    '88888888-8888-4888-8888-888888881902',
    '22222222-2222-4222-8222-222222222222',
    '11111111-1111-4111-8111-111111111112',
    '55555555-5555-4555-8555-555555555501',
    '88888888-8888-4888-8888-888888881002',
    null,
    1,
    null,
    '2026-01-11 11:20:00+00',
    '2026-01-11 11:20:00+00'
  ),
  (
    '88888888-8888-4888-8888-888888881903',
    '22222222-2222-4222-8222-222222222222',
    '11111111-1111-4111-8111-111111111111',
    '55555555-5555-4555-8555-555555555502',
    '88888888-8888-4888-8888-888888881003',
    null,
    1,
    null,
    '2026-01-11 12:15:00+00',
    '2026-01-11 12:15:00+00'
  )
on conflict do nothing;

insert into public.notification_templates (
  id,
  organization_id,
  template_key,
  channel,
  subject,
  body,
  is_active,
  created_at,
  updated_at,
  deleted_at
)
values
  (
    '99999999-9999-4999-8999-999999992001',
    '22222222-2222-4222-8222-222222222222',
    'attempt_submitted',
    'in_app',
    'Attempt submitted',
    'Your attempt has been submitted successfully.',
    true,
    '2026-01-10 09:50:00+00',
    '2026-01-10 09:50:00+00',
    null
  ),
  (
    '99999999-9999-4999-8999-999999992002',
    '22222222-2222-4222-8222-222222222222',
    'result_ready',
    'email',
    'Your result is ready',
    'Your graded result is now available.',
    true,
    '2026-01-10 09:50:10+00',
    '2026-01-10 09:50:10+00',
    null
  )
on conflict do nothing;

insert into public.user_notifications (
  id,
  organization_id,
  user_id,
  template_id,
  channel,
  title,
  message,
  payload,
  status,
  scheduled_at,
  sent_at,
  read_at,
  external_id,
  created_at,
  updated_at,
  deleted_at
)
values
  (
    '99999999-9999-4999-8999-999999992101',
    '22222222-2222-4222-8222-222222222222',
    '11111111-1111-4111-8111-111111111111',
    '99999999-9999-4999-8999-999999992001',
    'in_app',
    'Attempt submitted',
    'Attempt #1 for AWS SAA-C03 was submitted.',
    '{"attempt_id":"88888888-8888-4888-8888-888888881001"}'::jsonb,
    'read',
    '2026-01-11 10:35:00+00',
    '2026-01-11 10:35:00+00',
    '2026-01-11 10:40:00+00',
    null,
    '2026-01-11 10:35:00+00',
    '2026-01-11 10:40:00+00',
    null
  ),
  (
    '99999999-9999-4999-8999-999999992102',
    '22222222-2222-4222-8222-222222222222',
    '11111111-1111-4111-8111-111111111111',
    '99999999-9999-4999-8999-999999992002',
    'email',
    'Result ready',
    'Your result for AWS SAA-C03 is now available.',
    '{"attempt_result_id":"88888888-8888-4888-8888-888888881701"}'::jsonb,
    'sent',
    '2026-01-11 10:36:00+00',
    '2026-01-11 10:36:05+00',
    null,
    null,
    '2026-01-11 10:36:00+00',
    '2026-01-11 10:36:05+00',
    null
  ),
  (
    '99999999-9999-4999-8999-999999992103',
    '22222222-2222-4222-8222-222222222222',
    '11111111-1111-4111-8111-111111111112',
    '99999999-9999-4999-8999-999999992001',
    'in_app',
    'Attempt submitted',
    'Attempt #1 for AWS SAA-C03 is being processed.',
    '{"attempt_id":"88888888-8888-4888-8888-888888881002"}'::jsonb,
    'queued',
    '2026-01-11 11:20:00+00',
    null,
    null,
    null,
    '2026-01-11 11:20:00+00',
    '2026-01-11 11:20:00+00',
    null
  )
on conflict do nothing;
