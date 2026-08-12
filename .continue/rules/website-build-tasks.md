# Website Build Task List

How to use this file: work through tasks in order, one at a time. Each task has a mode (which Continue mode to use) and a ready-to-paste prompt. Prompts are deliberately small and scoped — don't combine multiple tasks into one message, even if it feels slower. On a 16K-context local model, small and sequential beats big and unscoped.

Check off each task as you complete and verify it before moving to the next.

---

## Phase 0 — Setup

- [ ] **0.1 Scaffold the project**
  Mode: Agent
  ```
  Create a new Next.js project in this folder using TypeScript, Tailwind CSS,
  and the App Router. Do not add any other libraries yet. After creating it,
  list the resulting file structure.
  ```

- [ ] **0.2 Verify the dev server runs**
  Mode: Agent
  ```
  Run the dev server and report whether it started successfully. Do not make
  any code changes.
  ```

- [ ] **0.3 Create the folder structure**
  Mode: Agent
  ```
  Create empty folders: components/sections, components/ui, content/research,
  lib. Do not create any files inside them yet.
  ```

---

## Phase 1 — Foundations

- [ ] **1.1 Design tokens**
  Mode: Edit — target `app/globals.css` and `tailwind.config.ts` only
  ```
  Read .continue/rules/design-system.md conventions. Set up a near-monochrome
  color palette (off-white background, near-black text) plus one accent color
  as CSS variables and Tailwind theme extensions. Do not touch any other files.
  ```

- [ ] **1.2 Base typography**
  Mode: Edit — target `app/globals.css` only
  ```
  Set base typography: one sans font, a clear type scale for h1-h4 and body
  text, generous line-height. Do not add a second typeface.
  ```

- [ ] **1.3 Layout shell**
  Mode: Agent — read only `app/layout.tsx`
  ```
  Read app/layout.tsx. Set up the root layout with the font and a basic
  <main> wrapper. Do not add navigation or footer yet.
  ```

- [ ] **1.4 Navigation component**
  Mode: Agent — scope to one new file
  ```
  Create components/sections/Nav.tsx with links: Home, Solutions, About,
  Resources, Contact. Minimal style, no dropdown yet. Add it to app/layout.tsx.
  Only touch these two files.
  ```

- [ ] **1.5 Footer component**
  Mode: Agent — scope to one new file
  ```
  Create components/sections/Footer.tsx with: copyright line, and links to
  Privacy and Terms. Add it to app/layout.tsx. Only touch these two files.
  ```

---

## Phase 2 — Homepage sections (one at a time)

Each of these follows the same pattern: create one section component, then
place it on the homepage. Don't ask for two sections in one prompt.

- [ ] **2.1 Hero**
  ```
  Create components/sections/Hero.tsx. Placeholder headline text is fine for
  now — I'll refine copy later. Follow globs/design-system.md conventions.
  Only create this one file.
  ```

- [ ] **2.2 Problem statement**
  ```
  Create components/sections/ProblemStatement.tsx with a heading and short
  paragraph area (placeholder text ok). Only create this one file.
  ```

- [ ] **2.3 Philosophy**
  ```
  Create components/sections/Philosophy.tsx showing 3 principle cards
  (icon/title/description, placeholder content ok). Only create this one file.
  ```

- [ ] **2.4 Solutions (with status label)**
  ```
  Create components/sections/Solutions.tsx showing one solution card with a
  visible "In Development" status badge, per nextjs-marketing-site.md rules.
  Only create this one file.
  ```

- [ ] **2.5 Research preview**
  ```
  Create components/sections/ResearchPreview.tsx showing a list of up to 3
  research post titles (placeholder titles ok, no real MDX content needed yet).
  Only create this one file.
  ```

- [ ] **2.6 Vision**
  ```
  Create components/sections/Vision.tsx — a single centered statement section,
  not a headline; placeholder text ok. Only create this one file.
  ```

- [ ] **2.7 Methodology (Research -> Build -> Measure -> Improve)**
  ```
  Create components/sections/Methodology.tsx showing a 4-step horizontal
  process: Research, Experiment, Build, Measure, Improve. Only create this file.
  ```

- [ ] **2.8 Final CTA**
  ```
  Create components/sections/FinalCTA.tsx with a heading and one button
  (placeholder link ok). Only create this one file.
  ```

- [ ] **2.9 Assemble homepage**
  Mode: Agent — read `app/page.tsx` first
  ```
  Read app/page.tsx. Import and place these sections in order: Hero,
  ProblemStatement, Philosophy, Solutions, ResearchPreview, Vision,
  Methodology, FinalCTA. Only touch app/page.tsx.
  ```

---

## Phase 3 — Secondary pages

- [ ] **3.1 About page**
  ```
  Create app/about/page.tsx. Sections: why we exist, what we believe, what
  we're building, long-term direction. Placeholder copy ok — follow
  content-writing.md tone rules (no hype language). Only create this file.
  ```

- [ ] **3.2 Team section on About**
  ```
  Read app/about/page.tsx. Add a team section formatted as a short founder
  note, not a corporate grid — I'll provide the real names/bios myself, use
  [PLACEHOLDER] markers, do not invent people or credentials. Only touch this file.
  ```

- [ ] **3.3 Solutions page**
  ```
  Create app/solutions/page.tsx expanding on the homepage Solutions section:
  concept explanation, "In Development" status, and an FAQ area at the bottom
  (3-4 placeholder Q&As). Only create this file.
  ```

- [ ] **3.4 Resources index page**
  ```
  Create app/resources/page.tsx listing research/blog posts and a link to
  Careers. No real post content needed yet — placeholder list is fine.
  Only create this file.
  ```

- [ ] **3.5 Careers page**
  ```
  Create app/resources/careers/page.tsx. Sections: who we want, research
  culture, engineering culture, general invitation to reach out. Do not
  invent specific job openings. Only create this file.
  ```

- [ ] **3.6 Contact page**
  ```
  Create app/contact/page.tsx with categories: general inquiry, partnership,
  research collaboration, careers, media. Use [PLACEHOLDER EMAIL] — I'll fill
  in real contact info myself. Only create this file.
  ```

- [ ] **3.7 Privacy and Terms stubs**
  ```
  Create app/privacy/page.tsx and app/terms/page.tsx with a simple heading and
  a "content coming soon" placeholder paragraph in each. Only create these two files.
  ```

---

## Phase 4 — Content system

- [ ] **4.1 First research post**
  ```
  Create content/research/first-post.mdx with frontmatter (title, date,
  summary, status) and placeholder body content. Only create this one file.
  ```

- [ ] **4.2 MDX rendering**
  ```
  Read content/research/first-post.mdx. Create app/resources/research/[slug]/page.tsx
  that reads and renders an MDX file from content/research by slug. Only
  create/touch this one route file plus any minimal lib helper it needs.
  ```

---

## Phase 5 — Polish and QA (do these last, one at a time)

- [ ] **5.1 Mobile responsiveness pass — Nav and Footer only**
  ```
  Read components/sections/Nav.tsx and Footer.tsx. Check and fix mobile
  responsiveness for these two files only.
  ```

- [ ] **5.2 Mobile responsiveness pass — Hero and Problem only**
  ```
  Read components/sections/Hero.tsx and ProblemStatement.tsx. Check and fix
  mobile responsiveness for these two files only.
  ```
  (Repeat this pattern in pairs for the remaining homepage sections rather
  than asking for a full-site responsiveness pass in one prompt.)

- [ ] **5.3 Basic accessibility check — Nav only**
  ```
  Read components/sections/Nav.tsx. Check for missing alt text, proper
  landmark roles, and keyboard navigability. Fix only what's found here.
  ```
  (Repeat per component as needed.)

- [ ] **5.4 SEO metadata pass — Home and About only**
  ```
  Read app/page.tsx and app/about/page.tsx. Confirm both export proper
  metadata (title, description). Add if missing. Only touch these two files.
  ```
  (Repeat for remaining pages in small batches of 2.)

---

## Notes

- If any single task still hits a context or reliability issue, split it into
  two even smaller steps rather than switching to a bigger model or context
  size first — most failures here come from scope, not model capacity.
- Real copywriting (final headline, body text, bios) is intentionally left as
  placeholders throughout — do that as a separate pass once the structure is
  built, ideally in Chat mode with the content-writing.md rule active, one
  section/page at a time.
