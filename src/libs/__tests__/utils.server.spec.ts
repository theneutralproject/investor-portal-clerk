import { sanitizeJson } from '../utils.server';

describe('utils.server', () => {
  describe('sanitizeJson', () => {
    it('should remove undefined values from objects', () => {
      const input = { a: 1, b: undefined };
      const expected = { a: 1 };
      expect(sanitizeJson(input)).toEqual(expected);
    });

    it('should remove functions and bigint values', () => {
      const input = {
        a: 1,
        b: () => {},
        c: BigInt(123),
        d: 'valid',
      };
      const expected = {
        a: 1,
        d: 'valid',
      };
      expect(sanitizeJson(input)).toEqual(expected);
    });

    it('should recursively sanitize nested structures', () => {
      const input = {
        a: 1,
        nested: {
          b: undefined,
          c: () => {},
          d: BigInt(10),
          e: {
            f: 'valid',
            g: undefined,
          },
        },
      };
      const expected = {
        a: 1,
        nested: {
          e: {
            f: 'valid',
          },
        },
      };
      expect(sanitizeJson(input)).toEqual(expected);
    });

    it('should sanitize arrays with mixed invalid values', () => {
      const input = [1, undefined, () => {}, BigInt(20), 'valid'];
      const expected = [1, 'valid'];
      expect(sanitizeJson(input)).toEqual(expected);
    });

    it('should return primitive values as-is', () => {
      expect(sanitizeJson(42)).toBe(42);
      expect(sanitizeJson('hello')).toBe('hello');
      expect(sanitizeJson(true)).toBe(true);
      expect(sanitizeJson(null)).toBeNull();
    });

    it('should return empty object when all values are removed', () => {
      const input = {
        a: undefined,
        b: () => {},
        c: BigInt(2),
      };
      expect(sanitizeJson(input)).toEqual({});
    });
  });
});
