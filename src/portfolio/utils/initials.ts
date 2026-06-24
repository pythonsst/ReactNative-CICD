/**
 * Derive up-to-two-letter initials from a name, e.g. "Shiv Shankar Tiwari" → "ST".
 * Used by the avatar fallbacks in the hero and the sticky header.
 */
export const getInitials = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .map(part => part[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();
