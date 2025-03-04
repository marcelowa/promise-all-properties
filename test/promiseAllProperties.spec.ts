import { describe, it, expect } from '@jest/globals';
import promiseAllProperties, { promiseAllSettledProperties } from '../src/promiseAllProperties.js';

describe('promiseAllProperties', () => {
  describe('validate rejections', () => {
    it('should reject if not receiving an object', async () => {
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
      ];

      for (const promise of promises) {
        await expect(promise).rejects.toThrow('The input argument must be a plain object');
      }
    });

    it('should not reject if the input object contains a non promise property', async () => {
      const result = await promiseAllProperties({ x: 1 });
      expect(result).toEqual({ x: 1 });
    });
  });

  describe('the input is an empty object', () => {
    it('should return a promise', () => {
      expect(promiseAllProperties({})).toBeInstanceOf(Promise);
    });

    it('should return a promise that resolves to an object', async () => {
      const result = await promiseAllProperties({});
      expect(typeof result).toBe('object');
    });
  });

  describe('input with promises that should resolve', () => {
    it('should resolve to an object with resolved values instead', async () => {
      const promisesObject = {
        firstPromise: Promise.resolve('result of first promise'),
        secondPromise: Promise.resolve('result of second promise'),
      };
      const result = await promiseAllProperties(promisesObject);
      expect(result).toEqual({
        firstPromise: 'result of first promise',
        secondPromise: 'result of second promise',
      });
    });

    it('should be rejected if at least one of the promises is rejected', async () => {
      const promisesObject = {
        firstPromise: Promise.resolve('result of first promise'),
        secondPromise: Promise.reject('error in the second promise'),
      };
      await expect(promiseAllProperties(promisesObject)).rejects.toMatch(/error in the second promise/);
    });
  });

  describe('the typing', () => {
    it('returns the expected type', () => {
      type ExpectedType = Promise<{
        myString: string,
        myLiteral: 'a literal',
        myNumber: number,
        myBoolean: boolean,
      }>;

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
      type ExpectedType = Promise<{
        myString: string,
        myLiteral: 'a literal',
        myNumber: number,
        myBoolean: boolean,
      }>;

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
    it('should reject if not receiving an object', async () => {
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
      ];

      for (const promise of promises) {
        await expect(promise).rejects.toThrow('The input argument must be a plain object');
      }
    });

    it('should not reject if the input object contains a non promise property', async () => {
      const result = await promiseAllSettledProperties({ x: 1 });
      expect(result).toEqual({ x: { status: 'fulfilled', value: 1 } });
    });
  });

  describe('the input is an empty object', () => {
    it('should return a promise', () => {
      expect(promiseAllSettledProperties({})).toBeInstanceOf(Promise);
    });

    it('should return a promise that resolves to an object', async () => {
      const result = await promiseAllSettledProperties({});
      expect(typeof result).toBe('object');
    });
  });

  describe('input with promises', () => {
    it('should resolve to an object with the result of each promise', async () => {
      const firstRejection = new TypeError('Rejection 1');
      const secondRejection = new Error('Rejection 2');
      const promisesObject = {
        firstPromise: Promise.resolve('result of first promise'),
        secondPromise: Promise.resolve('result of second promise'),
        thirdPromise: Promise.reject(firstRejection),
        fourthPromise: Promise.reject(secondRejection),
      };
      const result = await promiseAllSettledProperties(promisesObject);
      expect(result).toEqual({
        firstPromise: { status: 'fulfilled', value: 'result of first promise' },
        secondPromise: { status: 'fulfilled', value: 'result of second promise' },
        thirdPromise: { status: 'rejected', reason: firstRejection },
        fourthPromise: { status: 'rejected', reason: secondRejection },
      });
    });
  });

  describe('the typing', () => {
    it('returns the expected type', () => {
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
