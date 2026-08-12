---
name: Design System
globs: "**/*.{tsx,css}"
alwaysApply: false
description: Visual identity constraints — typography, color, spacing, motion
---
# Visual identity

- Palette: near-monochrome base (off-white / near-black) plus one restrained
  accent color. No gradients, no glassmorphism, no glow effects.
- Typography: one sans for UI/body, used consistently. Build hierarchy through
  size, weight, and spacing — not color or decoration.
- Spacing: generous whitespace. Use Tailwind's default spacing scale — don't
  invent arbitrary pixel values.
- Shape: soft-cornered rectangles, minimal shadows. No skeuomorphism, no 3D
  objects, no illustrated robots or brains.
- Motion: subtle only — fade/slide on scroll reveal. No particle effects, no
  auto-playing loops. Respect prefers-reduced-motion.
- Imagery: no stock photography. Prefer abstract line-based network/diagram
  graphics, or no imagery at all.
- When in doubt, remove a visual flourish rather than add one.
