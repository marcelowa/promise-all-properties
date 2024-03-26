import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import promiseAllProperties, {promiseAllSettledProperties} from '../src/promiseAllProperties';

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
        firstPromise: Promise.resolve('result of first promise'),
        secondPromise: Promise.resolve('result of second promise'),
      };
      const promise = promiseAllProperties(promisesObject);
      return expect(promise).to.eventually.contain({
        firstPromise: 'result of first promise',
        secondPromise: 'result of second promise',
      });
    });

    it('should be rejected if at least one of the promises is rejected', () => {
      const promisesObject = {
        firstPromise: Promise.resolve('result of first promise'),
        secondPromise: Promise.reject('error in the second promise'),
      };
      const promise = promiseAllProperties(promisesObject);
      return expect(promise).to.be.rejectedWith('error in the second promise');
    });
  });

  describe('the typing', () => {
    type ExpectedType = Promise<{
      myString: string,
      myLiteral: 'a literal',
      myNumber: number,
      myBoolean: boolean,
    }>;

    it('returns the expected type', () => {
      let expectedType: ExpectedType;

      let result = promiseAllProperties({
        myString: Promise.resolve('a string'),
        myLiteral: Promise.resolve('a literal' as const),
        myNumber: Promise.resolve(1234),
        myBoolean: true,
      });

      expectedType = result;
      result = expectedType;
    });

    it('fails typechecking if a promise type is wrong', () => {
      // @ts-expect-error
      const result: ExpectedType = promiseAllProperties({
        myString: Promise.resolve(1234),  // should have been string
        myLiteral: Promise.resolve('a literal' as const),
        myNumber: Promise.resolve(1234),
        myBoolean: true,
      });
    });
  });
});

describe('promiseAllSettledProperties', () => {
  describe('validate rejections', () => {
    it('should reject if not receiving an object', () => {
      const promises = [
        // @ts-expect-error  (testing bad input)
        promiseAllSettledProperties(/*undefined*/),
        // @ts-expect-error  (testing bad input)
        promiseAllSettledProperties(null),
        // @ts-expect-error  (testing bad input)
        promiseAllSettledProperties('string'),
        // @ts-expect-error  (testing bad input)
        promiseAllSettledProperties(123),
        // @ts-expect-error  (testing bad input)
        promiseAllSettledProperties(true),
        // @ts-expect-error  (testing bad input)
        promiseAllSettledProperties([Promise.resolve(1)]),
      ].map((promise) =>
        expect(promise).to.be.rejectedWith(TypeError, 'The input argument must be a plain object')
      );

      return Promise.all(promises);
    });

    it('should not reject if the input object contains a non promise property', () => {
      return expect(promiseAllSettledProperties({x: 1})).to.eventually.deep.equal({x: {status: 'fulfilled', value: 1}});
    });
  });

  describe('the input is an empty object', () => {
    it('should return a promise', () => {
      expect(promiseAllSettledProperties({})).to.be.instanceOf(Promise);
    });

    it('should return a promise that resolves to an object', () => {
      return expect(promiseAllSettledProperties({})).to.eventually.be.an('object');
    });
  });

  describe('input with promises', () => {
    it('should resolve to an object with the result of each promise', () => {
      const firstRejection = new TypeError('Rejection 1');
      const secondRejection = new Error('Rejection 2');
      const promisesObject = {
        firstPromise: Promise.resolve('result of first promise'),
        secondPromise: Promise.resolve('result of second promise'),
        thirdPromise: Promise.reject(firstRejection),
        fourthPromise: Promise.reject(secondRejection),
      };
      const promise = promiseAllSettledProperties(promisesObject);
      return expect(promise).to.eventually.deep.equal({
        firstPromise: {status: 'fulfilled', value: 'result of first promise'},
        secondPromise: {status: 'fulfilled', value: 'result of second promise'},
        thirdPromise: {status: 'rejected', reason: firstRejection},
        fourthPromise: {status: 'rejected', reason: secondRejection},
      });
    });
  });

  describe('the typing', () => {
    type RejectedOutcome = {
      status: 'rejected',
      reason: any,
    };
    type ExpectedType = Promise<{
      myString: {
        status: 'fulfilled',
        value: string,
      } | RejectedOutcome,
      myLiteral: {
        status: 'fulfilled',
        value: 'a literal',
      } | RejectedOutcome,
      myNumber: {
        status: 'fulfilled',
        value: number,
      } | RejectedOutcome,
      myBoolean: {
        status: 'fulfilled',
        value: boolean,
      } | RejectedOutcome,
      myRejection: {
        status: 'fulfilled',
        value: never,
      } | RejectedOutcome,
    }>;

    it('returns the expected type', () => {
      let expectedType: ExpectedType;

      let result = promiseAllSettledProperties({
        myString: Promise.resolve('a string'),
        myLiteral: Promise.resolve('a literal' as const),
        myNumber: Promise.resolve(1234),
        myBoolean: true,
        myRejection: Promise.reject(new Error('Rejected')),
      });

      expectedType = result;
      result = expectedType;
    });

    it('fails typechecking if a promise type is wrong', () => {
      // @ts-expect-error
      const result1: ExpectedType = promiseAllSettledProperties({
        myString: Promise.resolve(1234),  // should have been string
        myLiteral: Promise.resolve('a literal' as const),
        myNumber: Promise.resolve(1234),
        myBoolean: true,
        myRejection: Promise.reject(new Error('Rejected')),
      });
    });

    it('fails typechecking if a non-promise type is wrong', () => {
      // @ts-expect-error
      const result2: ExpectedType = promiseAllSettledProperties({
        myString: Promise.resolve('a string'),
        myLiteral: Promise.resolve('a literal' as const),
        myNumber: Promise.resolve(1234),
        myBoolean: 'true-ish',  // should have been boolean
        myRejection: Promise.reject(new Error('Rejected')),
      });
    });
  });
});
