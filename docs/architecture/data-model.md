# Data Model

Status: Draft  
Owner: Founder  
Last Updated: 2026-04-06  
Purpose: Defines core entities and modeling rules.

## Main Entity Groups

### Identity
- profiles
- user_roles

### Catalog
- certifications
- exam_packages

### Taxonomy
- topics

### Question Bank
- questions
- question_options
- question_topics
- mock_exams
- mock_exam_questions

### Commerce
- orders
- payments
- entitlements

### Runtime
- attempts
- attempt_answers
- attempt_question_snapshots
- attempt_topic_scores

### Resources
- notes
- cheatsheets

### AI
- ai_explanations
- ai_usage_events

## Modeling Rules

- submitted attempts are immutable
- attempts store question snapshots
- entitlements are the source of truth for premium access
- base explanations exist before publish
- AI explanations are cached and separate from base explanations
- soft delete / archive is preferred over destructive deletion

## Open Items

- define exact fields for `questions`
- define score model for scaled score
- define history retention policy
