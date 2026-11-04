const toParts = (v: string): number[] =>
  v
    .trim()
    .split('.')
    .map(part => {
      const n = Number.parseInt(part, 10);
      return Number.isFinite(n) ? n : 0;
    });

/** Semver-ish numeric compare. Returns 1 if a > b, -1 if a < b, 0 if equal. */
export const compareVersions = (a: string, b: string): number => {
  const pa = toParts(a);
  const pb = toParts(b);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const x = pa[i] ?? 0;
    const y = pb[i] ?? 0;
    if (x > y) {return 1;}
    if (x < y) {return -1;}
  }
  return 0;
};

/** True when `current` is behind `latest` (i.e. an update exists). */
export const isVersionLower = (current: string, latest: string): boolean =>
  compareVersions(current, latest) < 0;
