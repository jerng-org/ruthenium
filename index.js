'use strict'
try {

    //////////
    //      //
    //  !!  //  Make way.
    //      //
    //////////

    //  See pertinent (nodeJS-specific) documentation at /var/task/modules/r-u-s.js

    const rus = require('/var/task/modules/r-u-s.js')

    rus.mark(`index.js loaded mark.js`)

    //////////
    //      //
    //  !!  //  Make way.
    //      //
    //////////

    rus.conf.verbosity > 4 &&
        console.warn(`
        
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
    `),
        console.warn(

            `DEBT_NOTE`, [

                `CURRENT:`,

                `un protected routes`,

                `cognito - integration; designing with a view to opt-out easily, 
            later;`,

                `single-page-app framework; history API`,

                `
            
            BACKLOG:`,

                `history API, S3 hosting with session, for SPA`,

                `https://developer.mozilla.org/en-US/docs/Web/Security/Types_of_attacks`,

                `https://developer.mozilla.org/en-US/docs/Glossary/HSTS`,

                `development of validation.js features is ongoing via ~/tasks/restful/desk-schemas-post.js`,

                `Whole class of problems:
                -   whether to use ES/JS proxies (language specific!) to 
                    automatically anotate data;
                -   example:  writes to (data.RU.signals) should be signed by 
                    the writer; perhaps via a non-enumerable property`,

                `GET method forms are not yet supported;`,

                `DECOUPLE: (compose-response.js) should be broken up into multiple 
            middlewares also`,

                `Compliance=Weak mode which decreases performance but increases 
            accepted spelling varieties for things like field names`,

                `Test how require() maintains modules in memory, between function 
            calls;`,

                `Modify the architecture of (the entire framework) such that it 
            behaves more like a library; then again, the trade off always is how 
            much it behaves like a cage, while feeling like a prairie.`,

                `sessions.js: look for a SCOPE in an unexpired access_token;`,

                `Examine the pattern which would allow throwing an exception in any
                middleware, to be checked for safety, then sent to Lambda as the response 
                via ( middleware -> reducer -> ruthenium -> Lambda handler);`,

                `devise a mechanism where the reducer hides (data) from being
                returned to (index.js) by default, UNLESS (lastGuard.js)
                is installed. #security`,

                `
            
            ICEBOX:`,

                `$.stuff for aliasing`,

                `https://www.npmjs.com/package/require-directory`,

                `Things that could be done in JavaScript, but which may not be 
                simply portable to other languages:
                
                -   setting non-enumerable properties on (data) which allow 
                    hidden safety checks, for example (did someone delete keyX),
                    also non-writeable, non-configurable, etc.
                    
                -   one possible paradigm for managing this, is to replace all
                    prop-assignment with array-pushes, so that data already set
                    not overwritten
                    `
            ]
        )

    if (rus.conf.gitCommit) rus.lambdaGitCommit(rus.conf.gitCommitMessage)
    //  VERSION CONTROL HACK
    //  a SYNCHRONOUS FUNCTION - why? Because the alternative is:
    //
    //      ( async () => await rus.lambdaGitCommit() )()
    //
    //  If we run this, the global execution context will wait for it to finish
    //  running before shutting itself down.
    //
    //  IIRC : the Lambda runtime DOES allow us to leave running async processes
    //  paused, while the overall Lambda container is paused, in between 
    //  billable periods; this is NOT THE DEFAULT; but it can be configured in
    //  the Lambda response control structures; by default the runtime will
    //  wait for all asynchronous processes to finish running in the global
    //  scope, before it then ends, not simply pauses, the execution context.
    //  This pattern seems prone to an accumulation of async proceseses running
    //  in the background and taking up both computation and memory, however.


    //////////
    //      //
    //  !!  //  Make way.
    //      //
    //////////

    const ruthenium = require('/var/task/modules/framework/ruthenium')

    // PROJECT - MIDDLEWARES, lexical order
    const applyLayout = require(`/var/task/modules/middlewares/apply-layout.js`)

    const composeResponse = require(`/var/task/modules/middlewares/compose-response.js`)

    const formsReindexNames = require(`/var/task/modules/middlewares/forms-reindex-names.js`)

    const formsTunnelRestfulMethods = require(`/var/task/modules/middlewares/forms-tunnel-restful-methods.js`)

    const formsValidateData = require(`/var/task/modules/middlewares/forms-validate-data.js`)

    const lastGuard = require(`/var/task/modules/middlewares/last-guard.js`)

    // AWS API Gateway, HTTP APIs, Lambda Integration, Payload Format 2.0

    const lambdaCopyRequestParameters = require(`/var/task/modules/middlewares/lambda-copy-request-parameters.js`)

    const lambdaLoadMetadata = require(`/var/task/modules/middlewares/lambda-load-metadata.js`)

    const lambdaNormalizeFormData = require(`/var/task/modules/middlewares/lambda-normalize-form-data.js`)

    const lambdaNormalizeHeaders = require(`/var/task/modules/middlewares/lambda-normalize-headers.js`)

    const lambdaNormalizeQueryStringParameters = require(`/var/task/modules/middlewares/lambda-normalize-query-string-parameters.js`)

    const oidcValidation = require(`/var/task/modules/middlewares/oidc-validation.js`)

    const router = require(`/var/task/modules/middlewares/router.js`)

    const sessionExemption = require(`/var/task/modules/middlewares/session-exemption.js`)

    const sessionGuard = require(`/var/task/modules/middlewares/session-guard.js`)

    const setSession = require(`/var/task/modules/middlewares/set-session.js`)

    const setCookies = require(`/var/task/modules/middlewares/set-cookies.js`)

    //////////
    //      //
    //  !!  //  Make way.
    //      //
    //////////

    // LAMBDA HANDLER
    exports.handler = async function() {

        // Minimal production logger (unsystematic; hook this up with configuration.js later) TODO:
        console.log(`Lambda Handler ENTRY Point:`,
            arguments[0].requestContext.http.method,
            arguments[0].requestContext.domainName,
            arguments[0].requestContext.http.path,
            '?', // literal
            arguments[0].rawQueryString
        )

        rus.mark(`index.js, first mark in handler`, true)

        const hostInitializedData = {
            LAMBDA: {
                //  Things we must include because they are principal arguments of 
                //  Lambda invocation handlers.
                event: arguments[0],
                context: arguments[1],
                callback: arguments[2],

                //  Things which may not be immediately obvious, which we should
                //  encourage developers to be aware of.
                inspectGlobal: () => rus.node.util.inspect(global, {
                    depth: Infinity,
                    showHidden: true
                })
            }
        }

        const middlewares = [ // MIDDLEWARES, in execution order

            // HTTP Request - Host System Integration (AWS Lambda) Protocols & Data Structures
            lambdaCopyRequestParameters, // Query string     values with same key stored as:     CSV string
            lambdaNormalizeHeaders, // Cookie header    values with same key stored as:     Array of values
            lambdaNormalizeQueryStringParameters, // Query string     values with same key stored as:     Array of values
            lambdaNormalizeFormData, // Form string      values with same name stored as:    Array of values
            //lambdaLoadMetadata,

            //////////
            //      //
            //  !!  //  Make way.
            //      //
            //////////

            //  Middlewares below SHOULD be independent on host system (e.g. Lambda) implementation details
            //  Nevertheless, everything below targets Lambda's (response) format,
            //  so if we implement somewhere other than Lambda, we'll need a final
            //  (somewhere-response-formatter) middleware after (last-guard.js)

            //  HTTP Request - Session Protocols & Data Structures
            sessionExemption,
            oidcValidation,
            setSession,
            sessionGuard,

            //  HTML Request - Form Protocols & Data Structures
            formsTunnelRestfulMethods,
            formsReindexNames,
            formsValidateData,

            //  Business Logic
            router, // each route points to a tree of tasks ("sub-routines")

            // HTTP Response
            composeResponse,
            setCookies,
            applyLayout, // - can this switch places with (setCookies)?
            lastGuard //  Final Checkpoint

            // HTTP Response - Host System Integration (AWS Lambda) Protocols & Data Structures
            // (none at this time)
        ]

        const rutheniumResponse = await ruthenium(hostInitializedData, middlewares)

        // Minimal production logger (unsystematic; hook this up with configuration.js later) TODO:
        console.log(`Lambda Handler EXIT Point:`,
            (typeof rutheniumResponse == 'string') ?
            `rutheniumResponse.slice(0,50) ... [truncated]` :
            ((typeof rutheniumResponse != 'object') ?
                `(ruthenium.js) responded with typeof (neither a string nor an object); we might have a problem.` :
                (`status code: ${ rutheniumResponse.statusCode }`)
            )
        )

        return rutheniumResponse
    }
    // exports.handler()
    rus.mark(`index.js LOADED`)

    //////////
    //      //
    //  !!  //  Make way.
    //      //
    //////////


}
catch (e) { console.error(`
(/var/task/index.js) outer 'try' block.`, e) }
