# QA Checklist

Status: Active  
Owner: Founder  
Last Updated: 2026-04-07  
Purpose: Manual QA checklist for high-risk flows.

## Learner Flows

- signup and login: user can create an account, sign in, and land on the expected page
- free mock: logged-in user can start, answer, submit, and view results
- premium purchase: paid user can complete checkout and unlock premium access
- purchased workspace access: entitled user can open paid surfaces and expired user cannot

## Exam Flows

- practice mode: checking an answer locks it and shows explanation
- timed mode: timer counts down, refresh resumes correctly, and no explanation leaks before submit
- unanswered warning: final submit warns when questions are unanswered
- timeout auto-submit: deadline forces submit and produces results
- result screen: counts, readiness label, topic breakdown, and review content render correctly

## Admin Flows

- create question draft
- publish question with required fields only
- archive question
- assemble free and premium mocks
