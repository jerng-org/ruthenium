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
const composeResponse           = require (`./modules/middlewares/composeResponse.js`) 
const copyRequestParameters     = require (`./modules/middlewares/copyRequestParameters.js`) 
const normalizeFormData         = require (`./modules/middlewares/normalizeFormData.js`) 
const normalizeHeaders          = require (`./modules/middlewares/normalizeHeaders.js`) 
const lastGuard                 = require (`./modules/middlewares/lastGuard.js`) 
const tunnelRestfulForms        = require (`./modules/middlewares/tunnelRestfulForms.js`) 
const router                    = require (`./modules/middlewares/router.js`) 

// LAMBDA HANDLER
exports.handler = async function () { 

    console.log (
    [ `THINGS TO DO : sessions, cognito, ... `]
    )

    
    mark( `index.js, first mark in handler`, true )
    
    return  ruthenium   ( arguments, [  // MIDDLEWARES, execution order
                                
        normalizeHeaders,       // Values with same key stored as: Array of values
        copyRequestParameters,  // Values with same key stored as: CSV string
        
        tunnelRestfulForms,
        normalizeFormData,
        
        router,
        
        composeResponse,
        lastGuard
    ] ) 
    
}
mark (`index.js LOADED`, true)

