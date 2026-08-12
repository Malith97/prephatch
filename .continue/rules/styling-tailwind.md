---
name: Tailwind & Styling
globs: "**/*.{tsx,jsx,css}"
alwaysApply: false
description: Styling conventions using Tailwind CSS
---
# Styling
- Tailwind utility classes; avoid inline style objects unless the value is computed at runtime.
- Don't introduce a new CSS-in-JS library or stylesheet if Tailwind already covers the case.
- Extract conditional class logic to a `cn()`/clsx helper instead of long ternary strings.
- Check tailwind.config before inventing new spacing/color values — match the existing scale.
- Use Framer Motion for anything beyond a simple CSS transition, consistent with existing usage in this repo.