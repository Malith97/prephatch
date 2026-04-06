# Release Checklist

Status: Active  
Owner: Founder  
Last Updated: 2026-04-07  
Purpose: Checklist for safe releases.

## Before Release

- CI green
- migrations reviewed
- preview environment verified
- critical docs updated
- smoke checklist prepared

## Smoke Paths

- homepage loads
- auth works
- free mock works end to end
- premium gate works
- checkout works in test mode
- entitlement unlock works
- AI fallback works

## After Release

- logs show no critical errors
- dashboard and package page load correctly
- one manual free-mock submission succeeds
- one paid access verification succeeds
