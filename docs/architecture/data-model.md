# Data Model

Status: Active  
Owner: Founder  
Last Updated: 2026-04-07  
Purpose: Defines core MVP entities, relationships, and scoring data rules.

## MVP Tables

### Identity

`profiles`
- `id` uuid pk, matches auth user id
- `email` text not null
- `display_name` text null
- `created_at` timestamptz not null
- `updated_at` timestamptz not null

`user_roles`
- `user_id` uuid fk -> profiles.id
- `role` text enum: `learner`, `admin`
- unique on (`user_id`, `role`)

### Catalog

`certifications`
- `id` uuid pk
- `code` text unique, example `aws-saa-c03`
- `name` text not null
- `status` text enum: `draft`, `active`, `archived`

`exam_packages`
- `id` uuid pk
- `certification_id` uuid fk -> certifications.id
- `slug` text unique
- `title` text not null
- `description` text not null
- `price_minor` integer not null
- `currency` text not null default `usd`
- `status` text enum: `draft`, `active`, `archived`
- `free_mock_exam_id` uuid null

### Taxonomy and Question Bank

`topics`
- `id` uuid pk
- `code` text unique
- `label` text not null
- `status` text enum: `draft`, `active`, `archived`

`questions`
- `id` uuid pk
- `package_id` uuid fk -> exam_packages.id
- `prompt_markdown` text not null
- `base_explanation_markdown` text not null
- `status` text enum: `draft`, `review_ready`, `published`, `archived`
- `reviewed_by` uuid null
- `reviewed_at` timestamptz null
- `created_at` timestamptz not null
- `updated_at` timestamptz not null

`question_options`
- `id` uuid pk
- `question_id` uuid fk -> questions.id
- `option_key` text not null
- `body_markdown` text not null
- `is_correct` boolean not null
- `wrong_answer_reasoning_markdown` text null
- unique on (`question_id`, `option_key`)

`question_topics`
- `question_id` uuid fk -> questions.id
- `topic_id` uuid fk -> topics.id
- unique on (`question_id`, `topic_id`)

`mock_exams`
- `id` uuid pk
- `package_id` uuid fk -> exam_packages.id
- `title` text not null
- `mode` text enum: `practice`, `timed`
- `access_tier` text enum: `free`, `premium`
- `status` text enum: `draft`, `published`, `archived`
- `duration_minutes` integer null for practice, required for timed

`mock_exam_questions`
- `mock_exam_id` uuid fk -> mock_exams.id
- `question_id` uuid fk -> questions.id
- `position` integer not null
- unique on (`mock_exam_id`, `position`)
- unique on (`mock_exam_id`, `question_id`)

### Commerce

`orders`
- `id` uuid pk
- `user_id` uuid fk -> profiles.id
- `package_id` uuid fk -> exam_packages.id
- `status` text enum: `created`, `pending_payment`, `paid`, `failed`, `refunded`
- `amount_minor` integer not null
- `currency` text not null
- `provider` text not null default `stripe`
- `provider_reference` text unique null
- `created_at` timestamptz not null

`payments`
- `id` uuid pk
- `order_id` uuid fk -> orders.id
- `status` text enum: `pending`, `succeeded`, `failed`, `refunded`
- `provider_event_id` text unique
- `provider_payment_id` text unique null
- `amount_minor` integer not null
- `recorded_at` timestamptz not null

`entitlements`
- `id` uuid pk
- `user_id` uuid fk -> profiles.id
- `package_id` uuid fk -> exam_packages.id
- `source` text enum: `purchase`, `admin_grant`
- `status` text enum: `active`, `expired`, `revoked`
- `starts_at` timestamptz not null
- `expires_at` timestamptz not null
- `created_order_id` uuid null fk -> orders.id

### Runtime

`attempts`
- `id` uuid pk
- `user_id` uuid fk -> profiles.id
- `mock_exam_id` uuid fk -> mock_exams.id
- `mode` text enum: `practice`, `timed`
- `status` text enum: `created`, `in_progress`, `submitted`, `auto_submitted`, `scored`
- `started_at` timestamptz not null
- `deadline_at` timestamptz null
- `submitted_at` timestamptz null
- `percentage_correct` numeric(5,2) null
- `scaled_score` integer null
- `readiness_label` text enum: `not_ready`, `borderline`, `ready`

`attempt_answers`
- `id` uuid pk
- `attempt_id` uuid fk -> attempts.id
- `question_snapshot_id` uuid fk -> attempt_question_snapshots.id
- `selected_option_key` text null
- `checked_at` timestamptz null
- `saved_at` timestamptz not null
- unique on (`attempt_id`, `question_snapshot_id`)

`attempt_question_snapshots`
- `id` uuid pk
- `attempt_id` uuid fk -> attempts.id
- `position` integer not null
- `question_id` uuid not null
- `prompt_markdown` text not null
- `options_json` jsonb not null
- `correct_option_key` text not null
- `base_explanation_markdown` text not null
- `topic_codes_json` jsonb not null

`attempt_topic_scores`
- `id` uuid pk
- `attempt_id` uuid fk -> attempts.id
- `topic_code` text not null
- `correct_count` integer not null
- `incorrect_count` integer not null
- `unanswered_count` integer not null
- unique on (`attempt_id`, `topic_code`)

### AI

`ai_explanations`
- `id` uuid pk
- `question_id` uuid not null
- `prompt_version` text not null
- `cache_key` text unique not null
- `provider` text not null
- `model` text not null
- `response_markdown` text not null
- `created_at` timestamptz not null

`ai_usage_events`
- `id` uuid pk
- `user_id` uuid fk -> profiles.id
- `question_id` uuid not null
- `cache_key` text not null
- `provider` text not null
- `model` text not null
- `tokens_in` integer not null
- `tokens_out` integer not null
- `estimated_cost_minor` integer not null
- `created_at` timestamptz not null

## Modeling Rules

- submitted attempts are immutable
- attempts store question snapshots
- entitlements are the source of truth for premium access
- base explanations exist before publish
- AI explanations are cached and separate from base explanations
- soft delete or archive is preferred over destructive deletion
- post-launch resources are intentionally omitted from the MVP schema

## Scoring Rules

- authoritative learner result is `percentage_correct`
- `scaled_score` is an internal normalized display value, not an official vendor score
- v1 formula: `scaled_score = round(100 + (percentage_correct / 100) * 900)`
- readiness bands:
  - `not_ready`: below 70%
  - `borderline`: 70% to 79.99%
  - `ready`: 80% and above

## Index and Retention Notes

- index `attempts(user_id, started_at desc)`
- index `entitlements(user_id, package_id, status, expires_at)`
- index `questions(package_id, status)`
- retain attempt and snapshot history indefinitely in MVP
