---
name: Next.js Marketing Site Conventions
globs: "**/*.{ts,tsx,mdx}"
alwaysApply: false
description: Structure and conventions for this content-driven marketing/research website
---
# Project type

This is a marketing/brand website for an AI research company — not a SaaS app.
It is content-first: narrative sections, research/blog posts, and static pages.
Optimize for fast load, SEO, and clean content structure over interactivity.

# Structure

- Use the Next.js App Router. Static generation by default ("use client" only for
  actual interactivity: nav toggle, scroll-triggered reveal, a form).
- Reusable page sections (Hero, ProblemStatement, Philosophy, SolutionCard,
  ResearchList, CTASection, etc.) live as components in `components/sections/`,
  each taking simple typed props. No page should hardcode section markup inline.
- Blog/research posts are MDX files in `content/research/`, one per post, with
  frontmatter: title, date, summary, status (e.g. "research note", "technical report").
- Every page sets a title and meta description via the Next.js metadata API —
  no page ships without basic SEO fields.
- Do not add a CMS, database, or auth system unless explicitly asked. This site
  is static content — keep it that way.

# Status labeling

The product ("AI Resource Layer") is in development. Any component that
references it must visibly show a status label (e.g. "In Development").
Never imply it is live or available to use today.
