import * as chai from 'chai';
import { promiseAllProperties } from '../src/promiseAllProperties';

const expect = chai.expect;
describe('named export', () => {
  it('should be able to use named import', async () => {
    const { a, b } = await promiseAllProperties({
      a: Promise.resolve(1 as const),
      b: Promise.resolve(2 as const),
    });

    expect(a).to.equal(1);
    expect(b).to.equal(2);
  });
});
