# API Spec

Status: Active  
Owner: Founder  
Last Updated: 2026-04-07  
Purpose: Documents the required request and response contracts for MVP server actions and endpoints.

## Attempt Create

Purpose:
- start a free or premium mock attempt

Request:
- authenticated user
- `mock_exam_id`

Response:
- `attempt_id`
- `status`
- `started_at`
- `deadline_at`

Rules:
- must snapshot reviewed question content at start
- must reject premium attempts without active entitlement
- may return existing active attempt when safe

## Answer Save

Purpose:
- autosave selected answer

Request:
- authenticated user
- `attempt_id`
- `question_snapshot_id`
- `selected_option_key | null`

Response:
- `saved_at`
- `attempt_status`

Rules:
- reject writes after deadline
- idempotent for repeated identical writes
- no correctness leak in timed mode

## Attempt Submit

Purpose:
- finalize and score an attempt

Request:
- authenticated user
- `attempt_id`

Response:
- `attempt_id`
- `status`
- `submitted_at`
- result summary payload

Rules:
- idempotent
- score from snapshots only
- convert timeout path into safe submit result

## Result Fetch

Purpose:
- load result and review screen

Request:
- authenticated user
- `attempt_id`

Response:
- counts
- `percentage_correct`
- `scaled_score`
- `readiness_label`
- topic breakdown
- review-by-question payload

## Checkout Session Create

Purpose:
- create Stripe checkout session for a package

Request:
- authenticated user
- `package_id`

Response:
- `checkout_session_id`
- `checkout_url`

Rules:
- validate package server-side
- reject if active entitlement already exists

## Stripe Webhook

Purpose:
- record payment events and unlock access

Request:
- signed Stripe event

Response:
- success acknowledgement only

Rules:
- verify signature
- deduplicate provider event id
- create exactly one entitlement per successful order

## Access State Fetch

Purpose:
- return user-visible access state for a package

Request:
- optional authenticated user
- `package_slug`

Response:
- `access_state`: `visitor`, `free`, `paid_active`, `expired`, `admin`
- `free_mock_available`
- `renewal_available`

## AI Deep Explanation

Purpose:
- request optional deeper explanation after review

Request:
- authenticated user
- `question_id`
- `prompt_version`

Response:
- `source`: `cache` or `provider`
- `response_markdown`

Rules:
- only available after review context exists
- rate limited
- fallback keeps base explanation available
