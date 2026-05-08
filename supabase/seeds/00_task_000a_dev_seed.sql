do $$
begin
  raise notice '[task-000a] start seeding dev users, packages, questions, and entitlements';
end
$$;

insert into public.dev_users (id, email, full_name, role)
values
  ('10000000-0000-4000-8000-000000000001', 'learner.free@dev.prephatch.local', 'Dev Learner Free', 'learner'),
  ('10000000-0000-4000-8000-000000000002', 'learner.premium@dev.prephatch.local', 'Dev Learner Premium', 'learner'),
  ('10000000-0000-4000-8000-000000000003', 'admin.reviewer@dev.prephatch.local', 'Dev Reviewer Admin', 'admin')
on conflict (id) do update
set
  email = excluded.email,
  full_name = excluded.full_name,
  role = excluded.role;

insert into public.exam_packages (
  id,
  slug,
  title,
  tier,
  duration_minutes,
  question_count,
  price_cents,
  currency,
  is_active
)
values
  (
    '20000000-0000-4000-8000-000000000001',
    'aws-saa-c03-free-preview',
    'AWS SAA-C03 Free Preview',
    'free',
    20,
    4,
    0,
    'USD',
    true
  ),
  (
    '20000000-0000-4000-8000-000000000002',
    'aws-saa-c03-complete-pack',
    'AWS SAA-C03 Complete Pack',
    'premium',
    130,
    65,
    14900,
    'USD',
    true
  )
on conflict (id) do update
set
  slug = excluded.slug,
  title = excluded.title,
  tier = excluded.tier,
  duration_minutes = excluded.duration_minutes,
  question_count = excluded.question_count,
  price_cents = excluded.price_cents,
  currency = excluded.currency,
  is_active = excluded.is_active,
  updated_at = now();

insert into public.exam_questions (
  id,
  package_id,
  sort_order,
  prompt,
  option_a,
  option_b,
  option_c,
  option_d,
  correct_option,
  explanation
)
values
  (
    '30000000-0000-4000-8000-000000000001',
    '20000000-0000-4000-8000-000000000001',
    1,
    'A workload in private subnets needs HTTPS ingress. Which architecture is best?',
    'Expose EC2 instances with public IPs',
    'Use a public ALB with private targets',
    'Use a NAT gateway for inbound traffic',
    'Use private API Gateway without VPC link',
    'B',
    'A public ALB with private targets keeps application hosts non-public while allowing controlled ingress.'
  ),
  (
    '30000000-0000-4000-8000-000000000002',
    '20000000-0000-4000-8000-000000000001',
    2,
    'Which option improves data durability the most?',
    'Enable versioning on S3',
    'Rely on one EC2 instance store',
    'Disable backup retention',
    'Keep data only in memory',
    'A',
    'S3 versioning improves recovery and durability for object data.'
  ),
  (
    '30000000-0000-4000-8000-000000000003',
    '20000000-0000-4000-8000-000000000002',
    1,
    'An OLTP system is read-heavy. What is the fastest low-risk scale option?',
    'Immediate custom sharding',
    'Add read replicas and route read traffic',
    'Drop critical indexes',
    'Increase write batch size only',
    'B',
    'Read replicas reduce read pressure with minimal application change.'
  ),
  (
    '30000000-0000-4000-8000-000000000004',
    '20000000-0000-4000-8000-000000000002',
    2,
    'A producer must fan out events asynchronously to many consumers. Best fit?',
    'Synchronous REST call chain',
    'SNS topic fan-out',
    'Single Lambda without trigger',
    'IAM policy only',
    'B',
    'SNS provides reliable one-to-many asynchronous delivery.'
  )
on conflict (id) do update
set
  package_id = excluded.package_id,
  sort_order = excluded.sort_order,
  prompt = excluded.prompt,
  option_a = excluded.option_a,
  option_b = excluded.option_b,
  option_c = excluded.option_c,
  option_d = excluded.option_d,
  correct_option = excluded.correct_option,
  explanation = excluded.explanation;

insert into public.package_entitlements (
  id,
  user_id,
  package_id,
  access_level,
  source
)
values
  (
    '40000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000001',
    '20000000-0000-4000-8000-000000000001',
    'free',
    'dev_seed'
  ),
  (
    '40000000-0000-4000-8000-000000000002',
    '10000000-0000-4000-8000-000000000002',
    '20000000-0000-4000-8000-000000000001',
    'free',
    'dev_seed'
  ),
  (
    '40000000-0000-4000-8000-000000000003',
    '10000000-0000-4000-8000-000000000002',
    '20000000-0000-4000-8000-000000000002',
    'premium',
    'dev_seed'
  )
on conflict (id) do update
set
  user_id = excluded.user_id,
  package_id = excluded.package_id,
  access_level = excluded.access_level,
  source = excluded.source;

do $$
declare
  seeded_user_count integer;
  seeded_package_count integer;
  seeded_question_count integer;
  seeded_entitlement_count integer;
begin
  select count(*) into seeded_user_count
  from public.dev_users
  where email like '%@dev.prephatch.local';

  select count(*) into seeded_package_count
  from public.exam_packages
  where slug in ('aws-saa-c03-free-preview', 'aws-saa-c03-complete-pack');

  select count(*) into seeded_question_count
  from public.exam_questions
  where id in (
    '30000000-0000-4000-8000-000000000001',
    '30000000-0000-4000-8000-000000000002',
    '30000000-0000-4000-8000-000000000003',
    '30000000-0000-4000-8000-000000000004'
  );

  select count(*) into seeded_entitlement_count
  from public.package_entitlements
  where source = 'dev_seed';

  raise notice
    '[task-000a] seed complete: users=%, packages=%, questions=%, entitlements=%',
    seeded_user_count,
    seeded_package_count,
    seeded_question_count,
    seeded_entitlement_count;
end
$$;
