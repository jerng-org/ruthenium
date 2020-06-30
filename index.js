'use strict'
try {

//////////
//      //
//  !!  //  Make way.
//      //
//////////

/* 

!!! WARNING !!! -   ANYTHING OUTSIDE (exports.handler) 

                        persists across all  function calls, possibly for the 
                        lifetime of the function's container;
                    
                    DO NOT WRITE TO THESE OBJECTS, 
                    
                        FROM MIDDLEWARES, OR FROM ANYWHERE ELSE IN CODE CALLED
                        BY (exports.handler), AS THIS MAY RESULT IN
                        SECURITY BREACHES, OR SPACE LEAKS;

                    DO NOT WRITE ANYTHING TO THESE OBJECTS,
                    
                        MOST IMPORTANTLY DO NOT WRITE (data) from MIDDLEWARES
                        TO THESE OBJECTS;
                        
                    ... SOONER, we need to test how (require()) handles these,
                        to determine exactly what data persists between
                        function calls;
                        
                    ... LATER, we need to implement a checker to block this from
                        happening at commit-time;
*/

//////////
//      //
//  !!  //  Make way.
//      //
//////////
    
//  See pertinent (nodeJS-specific) documentation at /var/task/modules/r-u-s.js

const rus = require ( '/var/task/modules/r-u-s.js' )

rus.mark( `index.js loaded mark.js` )

    rus.conf.verbosity < 1 
    || console.warn (
        `DEBT_NOTE`,
        [   
            `CURRENT:`,
            `cookies - read and memorise entire MDN protocol`, 
            `sessions - read and memorise entire MDN protocol`, 
            `https://developer.mozilla.org/en-US/docs/Web/Security/Types_of_attacks`,
            `https://developer.mozilla.org/en-US/docs/Glossary/HSTS`,
            `
            
            BACKLOG:`,
            `cognito`, 
            `development of validation.js features is ongoing via ~/tasks/restful/desk-schemas-post.js`,
            `Whole class of problems:
                - whether to use ES/JS proxies (language specific!) to automatically anotate data;
                - example:  writes to (data.RU.signals) should be signed by the writer; 
                            perhaps via a non-enumerable property`,
            `GET method forms are not yet supported;`,
            `DECOUPLE: (compose-response.js) should be broken up into multiple middlewares also`, 
            `Compliance=Weak mode which decreases performance but increases accepted spelling varieties for things like field names`,
            `Test how require() maintains modules in memory, between function calls;`,
            `
            
            ICEBOX:`,
            `$.stuff for aliasing`,
            `https://www.npmjs.com/package/require-directory`,
        ]
    )

if ( rus.conf.gitCommit ) rus.lambdaGitCommit ( rus.conf.gitCommitMessage )
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
const applyLayout                            
    = require (`/var/task/modules/middlewares/apply-layout.js`) 
    
const composeResponse
    = require (`/var/task/modules/middlewares/compose-response.js`) 

const formsReindexNames   
    = require (`/var/task/modules/middlewares/forms-reindex-names.js`) 

const formsTunnelRestfulMethods                
    = require (`/var/task/modules/middlewares/forms-tunnel-restful-methods.js`) 

const formsValidateData
    =  require (`/var/task/modules/middlewares/forms-validate-data.js`)
    
const lastGuard
    = require (`/var/task/modules/middlewares/last-guard.js`) 

// AWS API Gateway, HTTP APIs, Lambda Integration, Payload Format 2.0

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

const router                            
    = require (`/var/task/modules/middlewares/router.js`) 

const setCookies
    = require (`/var/task/modules/middlewares/set-cookies.js`) 

//////////
//      //
//  !!  //  Make way.
//      //
//////////

// LAMBDA HANDLER
exports.handler = async function () { 

    // Minimal production logger (unsystematic; hook this up with configuration.js later) TODO:
    console.log (   arguments[0].requestContext.http.method,
                    arguments[0].requestContext.domainName,
                    arguments[0].requestContext.http.path,
                    '?',
                    arguments[0].rawQueryString
    )

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
        
        composeResponse,
        setCookies,
        applyLayout,

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