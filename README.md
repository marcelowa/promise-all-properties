# Promise all properties

A helper function that receives an object with a promise in each property and returns a promise that resolves to an object with the same properties and the resolved values of the promises.  

The returned promise is rejected in the following cases:
1. The input argument is not an "object"
2. at least one of the properties in the input is not a "Promise"
3. at least one of the promises is rejected

## Requirements
* ES6 Promise supporting javascript engine (browser or Node.js), or at least an ES6 Promise polyfill

## Usage example (ES6):
```javascript
import promiseAllProperties from 'promise-all-properties';

const promisesObject = {
  someProperty: Promise.resolve('resolve value'),
  anotherProperty: Promise.resolve('another resolved value'),
};

const promise = promiseAllProperties(promisesObject);

promise.then((resolvedObject) => {
  console.log(resolvedObject);
  // {
  //   someProperty: 'resolve value',
  //   anotherProperty: 'another resolved value'
  // }
});

```

## Run tests:
```bash
npm test
```

## Todo:
- Integrate lint

## License
Public domain [Unlicense][unlicense]


[unlicense]: http://unlicense.org/
