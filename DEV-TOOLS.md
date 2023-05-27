# ECMAScript

# NodeJS

## Module Semantics

Reference : <https://www.freecodecamp.org/news/require-module-in-node-js-everything-about-module-require-ccccd3ad383/>

- it is possible to study the parameters of modules via the REPL : `node> module`
- the `module` keyword refers to the module (of the script file) where the keyword is current(ly used)
- the `exports` keyword refers to `module.exports`

Reference : <https://www.sitepoint.com/understanding-module-exports-exports-node-js/>

- `require()`` executes modules; 
- `require.res()` resolves paths without execution;

# AWS Lambda

```
AWS Lambda -> runs NodeJS -> calls /var/task/index.js
```
## `(index.js's module).exports.handler`

This defines how AWS Lambda reacts to each invocation of the FaaS

... therefore note that the environment AROUND this handler PERSISTS across multiple FaaS invocations
    
# Framework ( ru )

- **every** file must `'use strict'`
- use **only** CommonJS [module semantics](#module-semantics)

## (ru) Trace

0.  `/var/task/index.js` requires :
    0.  `/var/task/modules/r-u-s.js` requires :
        0.  `/var/task/configuration.js` (leaf : should remain a leaf)
        1.  `/var/task/modules/r-u-s-minus-one.js` requires : 
            0.  `/var/task/modules/framework-description-logger.js` requires :
                1.  `/var/task/configuration.js`(pre-`r-u-s.js`) 
            1.  `/var/task/modules/mark.js` requires :
                0.  `/var/task/configuration.js`(pre-`r-u-s.js`) 
                1.  `/var/task/modules/custom-logger.js`(pre-`r-u-s.js`)
        2.  `/var/task/io/ddb.js`
        3.  `/var/task/io/cognito-oidc-relying-party.js`
            0.  `/var/task/configuration.js`(pre-`r-u-s.js`) 
            1.  `/var/task/modules/r-u-s-minus-one.js` 
        4.  `/var/task/io/s3.js`
            0.  `/var/task/modules/r-u-s-minus-one.js` 
        5.  `/var/task/modules/cookie.js`
            0.  `/var/task/configuration.js`(pre-`r-u-s.js`) 
            1.  `/var/task/modules/r-u-s-minus-one.js` 
        6.  `/var/task/modules/custom-logger.js`
                0.  `/var/task/configuration.js`(pre-`r-u-s.js`) 
        7.  `/var/task/modules/html.js`
            0.  `/var/task/configuration.js`(pre-`r-u-s.js`) 
            1.  `/var/task/modules/r-u-s-minus-one.js` 
        8.  various `/var/task/tasks/status-###.js` files
        9.  `var/task/io/lambda-git-commit.js` requires :
            0.  `/var/task/modules/r-u-s-minus-one.js` 
        10.  `var/task/modules/print.js`
            0.  `/var/task/configuration.js`(pre-`r-u-s.js`) 
            1.  `/var/task/modules/r-u-s-minus-one.js` 
        11.  `var/task/modules/oidc-session.js`
            0.  `/var/task/configuration.js`(pre-`r-u-s.js`) 
            1.  `/var/task/modules/r-u-s-minus-one.js` 
            2.  `/var/task/modules/cookie.js`(pre-`r-u-s.js`)  
        12.  `var/task/io/uuid4.js`
            0.  `/var/task/modules/r-u-s-minus-one.js` 
        13.  `var/task/io/validation.js`
            0.  `/var/task/configuration.js`(pre-`r-u-s.js`) 
            1.  `/var/task/modules/r-u-s-minus-one.js` 
            2.  `var/task/modules/print.js` ( pre-`r-u-s.js`)
            3.  various `/var/task/io/models/###`
        