'use strict'

// require() executes modules; use require.res() to resolve without execution.

// PROJECT
const mark      = require ( './modules/mark' )
mark( `index.js required mark.js`)

const gitCommit = require ( './modules/gitCommit' )            
mark( `index.js required gitCommit.js`)
gitCommit ()

const ruthenium = require ( './modules/framework/ruthenium' )
const wastems   = async ms => { 
    const start = new Date().getTime() 
    while (new Date().getTime() < start + ms);
}
// JSON.stringify( DATA, null, 4 ).replace(/\\n/g, '\n')
mark( `index.js did other things`)

// PROJECT - MIDDLEWARES, lexical order
const composeResponse                   = require (`./modules/middlewares/composeResponse.js`) 
const lastGuard                         = require (`./modules/middlewares/lastGuard.js`) 
const LCopyRequestParameters            = require (`./modules/middlewares/LCopyRequestParameters.js`) 
const LNormalizeFormData                = require (`./modules/middlewares/LNormalizeFormData.js`) 
const LNormalizeHeaders                 = require (`./modules/middlewares/LNormalizeHeaders.js`) 
const LNormalizeQueryStringParameters   = require (`./modules/middlewares/LNormalizeQueryStringParameters.js`) 
const tunnelRestfulForms                = require (`./modules/middlewares/tunnelRestfulForms.js`) 
const router                            = require (`./modules/middlewares/router.js`) 

// LAMBDA HANDLER
exports.handler = async function () { 

    console.log (
    [ `THINGS TO DO : test-middleware?ruthenium=restful&type=schemas; sessions, cognito, formHelpers, urlHelpers, htmlHelpers, markuplayouts?... `]
    )

    
    mark( `index.js, first mark in handler`, true )
    
    return  ruthenium   ( arguments, [  // MIDDLEWARES, execution order
                                
        // System Integration with AWS Lambda
        LCopyRequestParameters,         // Query string     values with same key stored as:     CSV string
        LNormalizeHeaders,              // Cookie header    values with same key stored as:     Array of values
        LNormalizeQueryStringParameters,// Query string     values with same key stored as:     Array of values
        LNormalizeFormData,             // Form string      values with same name stored as:    Array of values
        
        tunnelRestfulForms,
        router,
        
        composeResponse,
        lastGuard
    ] ) 
    
}
mark (`index.js LOADED`, true)

