import { describe, it, expect } from '@jest/globals';
import { promiseAllProperties } from '../src/promiseAllProperties.js';

describe('named export', () => {
  it('should be able to use named import', async () => {
    const { a, b } = await promiseAllProperties({
      a: Promise.resolve(1 as const),
      b: Promise.resolve(2 as const),
    });

    expect(a).toBe(1);
    expect(b).toBe(2);
  });
});
