type PlainObj = Record<string, unknown>;
export type PromisesMap<T extends PlainObj> = {
  [P in keyof T]: Promise<T[P]> | T[P];
};
export type PromiseOutcomesMap<T extends PlainObj> = {
  [P in keyof T]: PromiseSettledResult<T[P]>;
}

type Keys<T extends PlainObj> = (keyof T)[];
type Promises<T extends PlainObj> = PromisesMap<T>[keyof T][];

/**
 * Receives an object with promises or values as properties and returns a promise that resolves to an object
 * with the same properties containing the resolved values.
 *
 * If any of the given promises are rejected, the resulting promise is rejected with the reason set to that
 * of the promise that was rejected first.
 *
 * @param  {PromisesMap<T>} promisesMap  the input object with a promise or value in each property
 * @template T the type of the input object, but with all properties having been awaited
 * @return {Promise<T>}  a promise that resolved to an object with the same properties containing the resolved values
 * @see Promise.all
 */
export default function promiseAllProperties<T extends PlainObj>(
  promisesMap: PromisesMap<T>
): Promise<T> {
  if (!isProduction() && !isValidPromisesMap(promisesMap)) {
    return Promise.reject(new TypeError('The input argument must be a plain object'));
  }

  const [keys, promises] = extractKeysAndPromises(promisesMap);

  return Promise.all(promises)
    .then(results => reassembleResultsAsMap(keys, results) as T);
}

/**
 * Receives an object with promises or values as properties and returns a promise that resolves to an object
 * with the same properties containing the outcome of each promise.
 *
 * If any of the given promises are rejected, the resulting promise will still resolve. This lets you
 * inspect the results and report on all rejected promises and not just the first one.
 *
 * @param promisesMap the input object with a promise or value in each property
 * @template T the type of the input object, but with all properties having been awaited
 * @return a promise that resolves to an object with the same properties containing the outcomes
 * @see Promise.allSettled
 */
function promiseAllSettledProperties<T extends PlainObj>(
  promisesMap: PromisesMap<T>
): Promise<PromiseOutcomesMap<T>> {
  if (!isProduction() && !isValidPromisesMap(promisesMap)) {
    return Promise.reject(new TypeError('The input argument must be a plain object'));
  }

  const [keys, promises] = extractKeysAndPromises(promisesMap);

  return Promise.allSettled(promises)
    .then(results => reassembleResultsAsMap(keys, results) as PromiseOutcomesMap<T>);
}

function isProduction(): boolean {
  return typeof process !== undefined && process.env.NODE_ENV === 'production';
}

function isValidPromisesMap(promisesMap: unknown): promisesMap is PromisesMap<PlainObj> {
  return promisesMap != null && typeof promisesMap === 'object' && !Array.isArray(promisesMap);
}

function extractKeysAndPromises<T extends PlainObj>(promisesMap: PromisesMap<T>): [Keys<T>, Promises<T>] {
  const keys: (keyof T)[] = Object.keys(promisesMap);
  const promises = keys.map((key) => promisesMap[key]);
  return [keys, promises];
}

function reassembleResultsAsMap<T extends PlainObj, R>(keys: Keys<T>, results: R[]): Record<keyof T, R> {
  const reassembled: Partial<Record<keyof T, R>> = {};
  results.forEach((result, index) => {
    const correspondingKey = keys[index];
    reassembled[correspondingKey] = result;
  });
  // We know all keys of T have a value now, so remove Partial<>
  return reassembled as Record<keyof T, R>;
  // We are unable to associate each key of T with the specific type for that key,
  // so the caller must cast the result to the appropriate type
}

export {promiseAllProperties, promiseAllSettledProperties};
