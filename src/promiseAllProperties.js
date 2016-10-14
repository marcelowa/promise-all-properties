/**
 * Receives an object with promise containing properties and returns a promise that resolves to an object
 * with the same properties containing the resolved values
 * @param  {Object} promisesObject  the input object with a promise in each property
 * @return {Promise}  a promise that resolved to an object with the same properties containing the resolved values
 */
export default function promiseAllProperties(promisesObject) {
  if (typeof(promisesObject) !== 'object') {
    return Promise.reject('The input argument must be of type Object');
  }

  const promisesArray = [];
  const propertiesIndex = [];

  for (const property in promisesObject) {
    const promise = promisesObject[property];
    if (!(promise instanceof Promise)) {
      return Promise.reject(`The property ${property} must contain a promise`)
    }

    promisesArray.push(promise);
    propertiesIndex.push(property);
  }

  return Promise.all(promisesArray).then((result) => {
    const resolvedObject = {};

    result.forEach((value, index) => {
      const property = propertiesIndex[index];

      resolvedObject[property] = value;
    });
    return resolvedObject;
  });

}
