# Promise all properties
[![tests](https://github.com/marcelowa/promise-all-properties/actions/workflows/ci.yaml/badge.svg)](https://github.com/marcelowa/promise-all-properties/actions/workflows/ci.yaml)

A helper function that receives an object with a [Promise] in each property and returns a promise that resolves to an object with the same properties and the resolved values of the promises.  

The returned promise is rejected in the following cases:  
1. The input argument is not an "object"  
2. At least one of the promises are rejected  

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise

## Requirements
* ES6 Promise supporting Javascript engine (browser or Node.js), or at least an ES6 Promise polyfill
* a node package manager installed (such as NPM or Yarn)

## Usage example (ES6/Typescript):

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

## Promise all settled properties

This helper function works the same as `promiseAllProperties`, except it uses [`Promise.allSettled`][allSettled] instead of [`Promise.all`][all]. It is therefore possible to get the status of all the promises, regardless of how many of them were fulfilled or rejected.

Usage example:

```javascript
import {promiseAllSettledProperties} from 'promise-all-properties';

const promisesObject = {
  someProperty: Promise.resolve('resolve value'),
  anotherProperty: Promise.reject(new Error('a rejection')),
  yetAnotherProperty: Promise.reject(new Error('another rejection')),
};

const promise = promiseAllSettledProperties(promisesObject);

promise.then((resolvedObject) => {
  console.log(resolvedObject);
  // {
  //   someProperty: {status: 'fulfilled', value: 'resolve value'},
  //   anotherProperty: {status: 'rejected', reason: Error('a rejection')},
  //   yetAnotherProperty: {status: 'rejected', reason: Error('another rejection')}
  // }
});

// By comparison, promiseAllProperties(promisesObject) would reject with Error('a rejection')
```

[allSettled]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled
[all]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all

## Breaking changes

### v4.0.0
- Minimum Node.js version is now 12.20.0 to support the promiseAllSettledProperties method

### v3.0.0

- Passing an Array of values causes the promise to be rejected as invalid
- Stricter TypeScript signature now errors on non-object arguments.

## Developers

### Run tests:
```bash
npm test
```

### Build:
```bash
npm run build
```

### Contributions:
PR's are welcome just make sure the the PR is squashed (one commit) and the commit messages starts with one of the following prefixes:  

`[INITIAL]`: The initial commit  
`[FEAT]`: Only changes that creating new features or modofying existing features, that are not bug fixes  
`[FIX]`: Only bug fixes  
`[DOCS]`: Only Documentation changes  
`[STYLE]`: Only changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)  
`[REFACTOR]`: Only code changes that are neither fixes or features  
`[TEST]`: Only changes that are adding new tests or modifying existing tests  
`[TOOLS]`: Only changes that affect external processeses like build tools, dev tools, auxiliary tools and libraries such as documentation generation  
`[CLEANUP]`: Only code removal: code lines, comment lines or files without affecting the project whatsoever  

## License
Public domain [Unlicense][unlicense]


[unlicense]: http://unlicense.org/
