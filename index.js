'use strict'

/*

{   const stack = (new Error).stack;  console.warn ( `⚠ DEBT_WARNING ⚠`, 
    stack.substring( stack.indexOf( '(' ), stack.indexOf( ')' ) + 1 ) )
}

JSON.stringify( DATA, null, 4 ).replace(/\\n/g, '\n')

*/

// require() executes modules; use require.res() to resolve without execution.

const util      
    = require ( 'util' )

// PROJECT
const mark 
    = require ( '/var/task/modules/mark' )
mark( `index.js loaded mark.js`)

const gitCommit
    = require ( '/var/task/modules/git-commit' )            

gitCommit ()

const ruthenium 
    = require ( '/var/task/modules/framework/ruthenium' )

const wastems   = async ms => { 
    const start = new Date().getTime() 
    while (new Date().getTime() < start + ms);
}

// PROJECT - MIDDLEWARES, lexical order
const composeResponse
    = require (`/var/task/modules/middlewares/compose-response.js`) 

const lastGuard
    = require (`/var/task/modules/middlewares/last-guard.js`) 

const lambdaCopyRequestParameters
    = require (`/var/task/modules/middlewares/lambda-copy-request-parameters.js`) 

const lambdaLoadMetadata                     
    = require (`/var/task/modules/middlewares/lambda-load-metadata.js`) 

const lambdaNormalizeFormData                
    = require (`/var/task/modules/middlewares/lambda-normalize-form-data.js`) 

const lambdaNormalizeHeaders                 
    = require (`/var/task/modules/middlewares/lambda-normalize-headers.js`) 

const lambdaNormalizeQueryStringParameters   
    = require (`/var/task/modules/middlewares/lambda-normalize-query-string-parameters.js`) 

const tunnelRestfulForms                
    = require (`/var/task/modules/middlewares/tunnel-restful-forms.js`) 

const router                            
    = require (`/var/task/modules/middlewares/router.js`) 

// LAMBDA HANDLER
exports.handler = async function () { 

    console.warn (
        `DEBT_NOTE`,
        [   `THINGS TO DO :`,
            `https://www.npmjs.com/package/require-directory`,
            `utilities/RU module?`,
            `test-middleware?ruthenium=restful&type=schemas;`,
            `sessions`, 
            `cognito`, 
            `formHelpers`, 
            `urlHelpers`, 
            `htmlHelpers`, 
            `markuplayouts?... `,
            'writes to (data.RU.signals) should be signed by the writer',
            `note if (lastGuard.js) throws an error, nothing catches it and (data); gets borked to the client in its entirety; fix this problem.`
        ]
    )

    mark( `index.js, first mark in handler`, true )
    
    const hostInitializedData = {
        LAMBDA: {
            //  Things we must include because they are principal arguments of 
            //  Lambda invocation handlers.
            event:          arguments[0],
            context:        arguments[1],
            callback:       arguments[2],
            
            //  Things which may not be immediately obvious, which we should
            //  encourage developers to be aware of.
            inspectGlobal:  () => util.inspect ( global, { 
                depth:      Infinity, 
                showHidden: true
            } )
        }
    }
    
    const middlewares = [  // MIDDLEWARES, execution order
                                
        // System Integration with AWS Lambda
        lambdaCopyRequestParameters,         // Query string     values with same key stored as:     CSV string
        lambdaNormalizeHeaders,              // Cookie header    values with same key stored as:     Array of values
        //lambdaNormalizeQueryStringParameters,// Query string     values with same key stored as:     Array of values
        lambdaNormalizeFormData,             // Form string      values with same name stored as:    Array of values
        lambdaLoadMetadata,
        
        // Middlewares below SHOULD be independent on host system (e.g. Lambda) implementation details
        tunnelRestfulForms,
        router,
        
        composeResponse,
        lastGuard
    ]
    
    return ruthenium ( hostInitializedData, middlewares )
    
}
mark (`index.js LOADED`, true)