# ECMAScript

# NodeJS

## Module Semantics

Reference : <https://www.freecodecamp.org/news/require-module-in-node-js-everything-about-module-require-ccccd3ad383/>

- it is possible to study the parameters of modules via the REPL : `node> module`
- the `module` keyword refers to the module (of the script file) where the keyword is current(ly used)
- the `exports` keyword refers to `module.exports`

Reference : <https://www.sitepoint.com/understanding-module-exports-exports-node-js/>

- `require()` executes modules; 
- `require.res()` resolves paths without execution;

# AWS Lambda

> `AWS Lambda` -> runs `NodeJS` -> calls `/var/task/index.js`

## `(/var/task/index.js).exports.handler`

This defines how AWS Lambda reacts to each invocation of the FaaS

... therefore note that the environment AROUND this handler PERSISTS across multiple FaaS invocations
    
# Framework ( ru )

- **every** file must `'use strict'`
- use **only** CommonJS [module semantics](#module-semantics)

## (ru) Trace

### (ru) Trace : `/var/task/index.js` prior to definition of `exports.handler`

0.  `/var/task/index.js` requires :

    0.  `/var/task/modules/r-u-s.js` requires :
            
        0.  `/var/task/modules/r-u-s-minus-1.js` requires : 
        
            0.  `/var/task/configuration.js`
            
            1.  `/var/task/modules/framework-description-logger.js` requires :
                
                0.  `/var/task/configuration.js`(pre-`r-u-s-minus-1.js`) 
                
            2.  `/var/task/modules/mark.js` requires :
                
                0.  `/var/task/configuration.js`(pre-`r-u-s-minus-1.js`) 
                
                1.  `/var/task/modules/custom-logger.js`(pre-`r-u-s-minus-1.js`)
            
        1.  `/var/task/io/ddb.js` requires :
        
            0.  `/var/task/modules/r-u-s-minus-1.js` ( pre-`r-u-s.js`) 
            
        2.  `/var/task/io/cognito-oidc-relying-party.js` requires :
        
            0.  `/var/task/modules/r-u-s-minus-1.js` ( pre-`r-u-s.js`) 
            
        3.  `/var/task/io/s3.js` requires :
        
            0.  `/var/task/modules/r-u-s-minus-1.js` ( pre-`r-u-s.js`) 
            
        4.  `/var/task/modules/cookie.js` requires :
        
            0.  `/var/task/modules/r-u-s-minus-1.js` ( pre-`r-u-s.js`) 
            
        5.  `/var/task/modules/custom-logger.js` requires :
        
            0.  `/var/task/modules/r-u-s-minus-1.js` ( pre-`r-u-s.js`) 
            
        6.  `/var/task/modules/html.js` requires :
        
            0.  `/var/task/modules/r-u-s-minus-1.js` ( pre-`r-u-s.js`) 
            
        7.  various `/var/task/tasks/status-###.js` files require :
        
            0.  `/var/task/modules/r-u-s-minus-1.js` ( pre-`r-u-s.js`) 
            
        8.  `/var/task/io/lambda-git-commit.js` requires :
        
            0.  `/var/task/modules/r-u-s-minus-1.js` ( pre-`r-u-s.js`) 
            
        9.  `/var/task/modules/print.js` requires :
        
            0.  `/var/task/modules/r-u-s-minus-1.js` ( pre-`r-u-s.js`) 
            
        10. `/var/task/modules/oidc-session.js` requires :
        
            0.  `/var/task/modules/r-u-s-minus-1.js` ( pre-`r-u-s.js`) 
            
            1.  `/var/task/modules/cookie.js`(pre-`r-u-s.js`)  
            
        11. `/var/task/io/uuid4.js` requires :
        
            0.  `/var/task/modules/r-u-s-minus-1.js` ( pre-`r-u-s.js`) 
            
        12. `/var/task/io/validation.js` requires :
        
            0.  `/var/task/modules/r-u-s-minus-1.js` ( pre-`r-u-s.js`) 
            
            1.  `/var/task/modules/print.js` ( pre-`r-u-s.js`)
            
            2.  various `/var/task/io/models/###` requires :
                
                0.  `/var/task/modules/r-u-s-minus-1.js` ( pre-`r-u-s.js`) 
        
    1.  `/var/task/modules/framework/ruthenium` requires :
    
        0.  `/var/task/modules/r-u-s.js`
        
        1.  `/var/task/modules/framework/ruthenium-reducer`
    
    2.  various `/var/task/modules/middlewares/###` files
    
### (ru) Trace : definition of `(/var/task/index.js).exports.handler`

0.  `(index.js).exports.handler` simply returns to the FaaS the result of calling 
    
    0.  `/var/task/modules/framework/ruthenium`, a function, on the arguments :

        0.  `hostInitializedData` : data from the runtime environment
        
        1.  `middlewares` : an array of operators that may be applied to that data
        
It should be noted that the specific order of `middlewares in their array`
underpins the (ru) framework's order of operations upon `hostInitializedData`
        
#### (ru) Trace : what happens when `ruthenium` is called

0.  `initialData` is prepared, 

    0.  by appending initialised `frameworkData`, 
    1.  to `hostInitializedData`

1.  `finalData` is prepared, 

    0.  by reducing `middlewares`,
    1.  with the `ruthenium-reducer`,
    3.  as parameterised/argued with `initialData`
    
### (ru) Trace : middleware architecture ( as developed )

... please proceed, to read the comments in `/var/task/index.js`

## (ru) Logging

These varieties of code need to be streamlined.

### `/var/task/modules/custom-logger.js`

### `/var/task/modules/framework-description-logger.js`

### `/var/task/modules/mark.js`

### `/var/task/modules/print.js`

## (ru) Comments 

These varieties of code need to be streamlined.

- inline ( conventions? )
- DOCUMENTATION.MD
- MOTIVATIONS.MD
- README.MD