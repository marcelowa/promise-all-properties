import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import promiseAllProperties from '../src/promiseAllProperties';

chai.use(chaiAsPromised);
const expect = chai.expect;

describe('promiseAllProperties', () => {
  describe('validate rejections', () => {
    it('should reject if not receiving an object', () => {
      const promises = [
        // @ts-expect-error  (testing bad input)
        promiseAllProperties(/*undefined*/),
        // @ts-expect-error  (testing bad input)
        promiseAllProperties(null),
        // @ts-expect-error  (testing bad input)
        promiseAllProperties('string'),
        // @ts-expect-error  (testing bad input)
        promiseAllProperties(123),
        // @ts-expect-error  (testing bad input)
        promiseAllProperties(true),
        // @ts-expect-error  (testing bad input)
        promiseAllProperties([Promise.resolve(1)]),
      ].map((promise) =>
        expect(promise).to.be.rejectedWith(TypeError, 'The input argument must be a plain object')
      );

      return Promise.all(promises);
    });

    it('should not reject if the input object contains a non promise property', () => {
      return expect(promiseAllProperties({x: 1})).to.eventually.contain({
          x: 1,
      });
    });

  });

  describe('the input is an empty object', () => {
    it('should return a promise', () => {
      expect(promiseAllProperties({})).to.be.instanceOf(Promise);
    });

    it('should return a promise the resolves to an object', () => {
      return expect(promiseAllProperties({})).to.eventually.be.an('object');
    });
  });

  describe('input with promises that should resolve', () => {
    it('should resolve to an object with resolved values instead', () => {
      const promisesObject = {
        firstPromise : Promise.resolve('result of first promise'),
        secondPromise : Promise.resolve('result of second promise'),
      };
      const promise = promiseAllProperties(promisesObject);
      return expect(promise).to.eventually.contain({
          firstPromise : 'result of first promise',
          secondPromise : 'result of second promise',
      });
    });
  });

  describe('input with promises that should resolve', () => {
    it('should be rejected if at least one of the promises is rejected', () => {
      const promisesObject = {
        firstPromise : Promise.resolve('result of first promise'),
        secondPromise : Promise.reject('error in the second promise'),
      };
      const promise = promiseAllProperties(promisesObject);
      return expect(promise).to.be.rejectedWith('error in the second promise');
    });
  });

});
