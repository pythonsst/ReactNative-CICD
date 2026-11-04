import { compareVersions, isVersionLower } from '../version';

describe('compareVersions', () => {
  it('returns 0 for equal versions', () => {
    expect(compareVersions('1.2.3', '1.2.3')).toBe(0);
  });

  it('returns 1 when a > b', () => {
    expect(compareVersions('15.2.0', '13.1.0')).toBe(1);
    expect(compareVersions('1.2.10', '1.2.9')).toBe(1);
  });

  it('returns -1 when a < b', () => {
    expect(compareVersions('13.1.0', '15.2.0')).toBe(-1);
  });

  it('handles differing segment counts', () => {
    expect(compareVersions('1.2', '1.2.0')).toBe(0);
    expect(compareVersions('1.2.1', '1.2')).toBe(1);
  });

  it('treats non-numeric segments as 0 instead of NaN', () => {
    expect(compareVersions('1.x.0', '1.0.0')).toBe(0);
    expect(compareVersions('', '0.0.0')).toBe(0);
  });
});

describe('isVersionLower', () => {
  it('is true when current is behind latest (13.1 vs 15.2)', () => {
    expect(isVersionLower('13.1.0', '15.2.0')).toBe(true);
  });

  it('is false when current is equal or ahead', () => {
    expect(isVersionLower('15.2.0', '15.2.0')).toBe(false);
    expect(isVersionLower('15.3.0', '15.2.0')).toBe(false);
  });
});
