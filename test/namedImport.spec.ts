import { test } from 'node:test';
import assert from 'node:assert/strict';
import { promiseAllProperties } from '../src/promiseAllProperties.js';

test('named export', async (t) => {
  const { a, b } = await promiseAllProperties({
    a: Promise.resolve(1 as const),
    b: Promise.resolve(2 as const),
  });

  assert.strictEqual(a, 1);
  assert.strictEqual(b, 2);
});
