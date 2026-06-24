/**
 * Maps the presentation-agnostic icon names stored in data/portfolio.ts to
 * emoji glyphs. Centralised so the same name renders the same glyph everywhere
 * and there's one place to add or change an icon.
 */
const ICONS: Record<string, string> = {
  // Skills
  phone: '\u{1F4F1}',
  code: '\u{1F4BB}',
  cloud: '\u{2601}\u{FE0F}',
  tools: '\u{1F6E0}\u{FE0F}',
  // Projects
  rocket: '\u{1F680}',
  flame: '\u{1F525}',
  star: '\u{2B50}',
  app: '\u{1F4F1}',
  // Socials
  github: '\u{1F4BB}',
  linkedin: '\u{1F4BC}',
  twitter: '\u{1F426}',
  globe: '\u{1F310}',
  mail: '\u{2709}\u{FE0F}',
};

/** Resolve an icon name to its emoji, falling back to `fallback` when unknown. */
export const resolveIcon = (name?: string, fallback = '\u{2728}'): string =>
  (name && ICONS[name]) || fallback;
