const { isWall, TILE } = require('../isWall');

describe('isWall', () => {
  test('returns true for wall cells', () => {
    expect(isWall(0, 0)).toBe(true);
  });

  test('returns false for open cells', () => {
    expect(isWall(TILE + 1, TILE + 1)).toBe(false);
  });

  test('returns undefined for out-of-bounds positions', () => {
    expect(isWall(-10, 0)).toBeUndefined();
    expect(isWall(TILE * 15, TILE * 15)).toBeUndefined();
  });
});
