'use strict'
try {

//////////
//      //
//  !!  //  Make way.
//      //
//////////
    
//  See pertinent (nodeJS-specific) documentation at /var/task/modules/r-u-s.js

const rus = require ( '/var/task/modules/r-u-s.js' )

rus.mark( `index.js loaded mark.js` )

    console.warn (
        `DEBT_NOTE`,
        [   `THINGS TO DO :`,
        
            `markuplayouts?... to integrate with the (message) parameter`,
            `development of validation.js features is ongoing via ~/tasks/restful/desk-schemas-post.js`,
            
            `$.stuff for aliasing`,
            `https://www.npmjs.com/package/require-directory`,
            `sessions`, 
            `cognito`, 
            'writes to (data.RU.signals) should be signed by the writer',
            `GET method forms are not yet supported;`,
            `note if (lastGuard.js) throws an error, nothing catches it and (data); gets borked to the client in its entirety; fix this problem.`
        ]
    )

rus.lambdaGitCommit()
    //  VERSION CONTROL HACK
    //  a SYNCHRONOUS FUNCTION - why? Because the alternative is:
    //
    //      ( async () => await rus.lambdaGitCommit() )()
    //
    //  I actually don't understand how this came to be legitimate syntax for
    //  performing (await) in the global scope. I was under the impression that
    //  even if the the (async arrow function expression body) waited for the 
    //  (rus.lambdaGitCommit), the global scope would not wait for ( async )().
    //
    //  But all the stackoverflows say that the global scope will wait for it.


//////////
//      //
//  !!  //  Make way.
//      //
//////////

const ruthenium 
    = require ( '/var/task/modules/framework/ruthenium' )

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

const formsReindexNames   
    = require (`/var/task/modules/middlewares/forms-reindex-names.js`) 

const formsTunnelRestfulMethods                
    = require (`/var/task/modules/middlewares/forms-tunnel-restful-methods.js`) 

const formsValidateData
    =   require (`/var/task/modules/middlewares/forms-validate-data.js`)
    
const router                            
    = require (`/var/task/modules/middlewares/router.js`) 

const layoutSetDefault                            
    = require (`/var/task/modules/middlewares/layout-set-default.js`) 

//////////
//      //
//  !!  //  Make way.
//      //
//////////

// LAMBDA HANDLER
exports.handler = async function () { 

    rus.mark( `index.js, first mark in handler`, true )
    
    const hostInitializedData = {
        LAMBDA: {
            //  Things we must include because they are principal arguments of 
            //  Lambda invocation handlers.
            event:          arguments[0],
            context:        arguments[1],
            callback:       arguments[2],
            
            //  Things which may not be immediately obvious, which we should
            //  encourage developers to be aware of.
            inspectGlobal:  () => rus.node.util.inspect ( global, { 
                depth:      Infinity, 
                showHidden: true
            } )
        }
    }
    
    const middlewares = [  // MIDDLEWARES, execution order
                                
        // System Integration with AWS Lambda
        lambdaCopyRequestParameters,         // Query string     values with same key stored as:     CSV string
        lambdaNormalizeHeaders,              // Cookie header    values with same key stored as:     Array of values
        lambdaNormalizeQueryStringParameters,// Query string     values with same key stored as:     Array of values
        lambdaNormalizeFormData,             // Form string      values with same name stored as:    Array of values
        lambdaLoadMetadata,
        
        // Middlewares below SHOULD be independent on host system (e.g. Lambda) implementation details
        
        formsTunnelRestfulMethods,
        formsReindexNames,
        formsValidateData,
        
        router,
        layoutSetDefault,
        
        composeResponse,
        lastGuard
        
        // TODO:    devise a mechanism where the reducer hides (data) from being
        //          returned to (index.js) by default, UNLESS (lastGuard.js)
        //          is installed. #security
    ]
    
    return ruthenium ( hostInitializedData, middlewares )
    
}
// exports.handler()
rus.mark (`index.js LOADED`)

//////////
//      //
//  !!  //  Make way.
//      //
//////////


} catch ( e ) { console.error ( `
(/var/task/index.js) outer 'try' block.`, e ) }