# Promise all properties
[![Build Status](https://travis-ci.org/marcelowa/promise-all-properties.svg?branch=master)](https://travis-ci.org/marcelowa/promise-all-properties)

A helper function that receives an object with a promise in each property and returns a promise that resolves to an object with the same properties and the resolved values of the promises.  

The returned promise is rejected in the following cases:  
1. The input argument is not an "object"  
2. at least one of the promises is rejected  

## Requirements
* ES6 Promise supporting javascript engine (browser or Node.js), or at least an ES6 Promise polyfill
* yarn installed

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

## Run tests:
```bash
npm test
```

## Build:
```bash
npm run build
```

## Developers:
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
