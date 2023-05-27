# AWS Lambda

# NodeJS

## Module Semantics

Reference : <https://www.freecodecamp.org/news/require-module-in-node-js-everything-about-module-require-ccccd3ad383/>

- it is possible to study the parameters of modules via the REPL : `node> module`
- the `module` keyword refers to the module (of the script file) where the keyword is current(ly used)
- the `exports` keyword refers to `module.exports`

Reference : <https://www.sitepoint.com/understanding-module-exports-exports-node-js/>

- `require()`` executes modules; 
- `require.res()` resolves paths without execution;

# Framework ( ru )

- **every** file must `'use strict'`
- use **only** CommonJS [module semantics](#module-semantics)
```
AWS Lambda -> runs NodeJS -> calls /var/task/index.js

(index.js's module).exports.handler -> defines how AWS Lambda reacts to each invocation of the FaaS
```

# ECMAScript
