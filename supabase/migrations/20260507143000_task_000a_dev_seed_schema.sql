create extension if not exists "pgcrypto" with schema extensions;

create table if not exists public.dev_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  full_name text not null,
  role text not null check (role in ('learner', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.exam_packages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  tier text not null check (tier in ('free', 'premium')),
  duration_minutes integer not null check (duration_minutes > 0),
  question_count integer not null check (question_count > 0),
  price_cents integer not null default 0 check (price_cents >= 0),
  currency text not null default 'USD',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.exam_questions (
  id uuid primary key default gen_random_uuid(),
  package_id uuid not null references public.exam_packages(id) on delete cascade,
  sort_order integer not null check (sort_order > 0),
  prompt text not null,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  correct_option text not null check (correct_option in ('A', 'B', 'C', 'D')),
  explanation text not null,
  created_at timestamptz not null default now(),
  unique (package_id, sort_order)
);

create table if not exists public.package_entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.dev_users(id) on delete cascade,
  package_id uuid not null references public.exam_packages(id) on delete cascade,
  access_level text not null check (access_level in ('free', 'premium')),
  source text not null default 'dev_seed',
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, package_id)
);
