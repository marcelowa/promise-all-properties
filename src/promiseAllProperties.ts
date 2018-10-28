export type PromisesMap<T> = { [P in keyof T]: Promise<T[P]> | T[P] };

/**
 * Receives an object with promise containing properties and returns a promise that resolves to an object
 * with the same properties containing the resolved values
 * @param  {PromisesMap<T>} promisesMap  the input object with a promise in each property
 * @return {Promise<T>}  a promise that resolved to an object with the same properties containing the resolved values
 */
export default function promiseAllProperties<T>(promisesMap: PromisesMap<T>): Promise<T> {
  if (promisesMap === null || typeof promisesMap !== 'object') {
    return Promise.reject(new TypeError('The input argument must be of type Object'));
  }

  const keys = Object.keys(promisesMap);
  const promises = keys.map((key) => {
    return (promisesMap as any)[key];
  });

  return Promise.all(promises).then(results => {
    return results.reduce((resolved, result, index) => {
      resolved[keys[index]] = result;
      return resolved;
    }, {});
  });
}
