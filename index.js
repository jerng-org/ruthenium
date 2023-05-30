'use strict'

const defineLambdaNodeJSHandler = _ => {

    //////////
    //      //
    //  !!  //  Make way.
    //      //
    //////////

    //  See pertinent (nodeJS-specific) documentation at /var/task/modules/r-u-s.js

    console.log(`(ru) shouldn't have a folder called (modules) as this is easily confused with that keyword in (node/ecmascript)`)

    const rus = require('/var/task/modules/r-u-s.js')

    rus.mark(`/var/task/index.js loaded mark.js`)
    rus.frameworkDescriptionLogger.logStarts()
    rus.frameworkDescriptionLogger.callStarts()

    rus.frameworkDescriptionLogger.summary(`(/var/task/index.js) SUMMARY
    -   The role of this file in the AWS Lambda > NodeJS runtime is documented by AWS
    -   The role of (exports.handler) in this runtime is documented by AWS
    
    -   We run everything in a try-catch block
    -   We include miscellaneous documentation here
    -   We perform various logging activities throughout, including this log
    -   DEVELOPMENT : We commit the codebase to (git) here
    -   We (require) framework and middleware files
    
    -   (exports.handler) is then defined to capture each HTTP requests' (hostInitializedData) and (middlewares), run this through (ruthenium) and get (rutheniumResponse), then return it
    `)

    rus.frameworkDescriptionLogger.verbiage(`we are now in (/var/task/index.js), and
    
    -   the first line says 'use strict', and immediately after this is a try-catch block; 
    
        -   right below us, is a WARNING on how the AWS Lambda environment handles (exports.handler) in the (node.js) runtime, which we are in; 
    
        -   immediately after this we have some key technical DEBT NOTES;
    
        -   then, a hack that commits this codebase to git ! ;
        
        -   many (requires) occur next, including the framework sources, and middlewares;`)

    //////////
    //      //
    //  !!  //  Make way.
    //      //
    //////////

    rus.conf.verbosity > 6 && (
        console.warn(`
        
    !!! WARNING !!! -   ANYTHING OUTSIDE (exports.handler) 
                            persists across all  function calls, possibly for the 
                            lifetime of the function's CONTAINER;
                        
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
                            
    !!! GUIDELINE !!!   -   If any code is (lambda)-specific, prefix that file
                            immediately, and figure out how to write a runtime
                            agnostic version later.
    `),
        console.warn(

            `ARCHITECTURE_NOTE`, [


                `RULE:
                
                    1.  A web server's hypertext graph should be defined in
                        minimalistic form as-if for a machine reader, first.
                    
                        HATEOAS :   
                        
                            1.  Each resource should be identified by a URI.
                            
                                (URIs may be names or locations of resources.)
                            
                            2.  HTTP responses for machine readers should 
                                include a list of 
                    
                    2.  
                    `,

                `We're currently working with something that looks like:
                
                    - ? route=virtual
                    - & type=(desk-schemas, or desks)
                    - & thing=(UNDEFINED-for-desk-schemas, or DESK-NAME-for-desks)
                    - & reader=(human, or machine)
                
                We could migrate to:
                
                    -   "storage=virtual & type=Deskname     & thing=Rowid"
                    -   "storage=actual  & type=desk-schemas & thing=Deskname"
                    -   "storage=actual  & type=desk-cells   & thing=Deskname#Columnname,Rowid"
                    (we've stopped caring if "type" and "Columnname" are singular or plural)        
                    
                    User-story:     
                    
                    1.  Define traits for desks, in desk-schemas 
                    2.  All desks which share a desk-schema trait all work the same way
                    
                        But we really shouldn't bother until v2.
                `,

                `consider upgrading performance of DynamoDB Document Client
                https://www.npmjs.com/package/aws-thin-dynamo`,

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
    )

    if (rus.conf.gitCommit) rus.lambdaGitCommit(rus.conf.gitCommitMessage)
    //  VERSION CONTROL HACK
    //  a SYNCHRONOUS FUNCTION - why? Because the alternative is:
    //
    //      ( async () => await rus.lambdaGitCommit() )()
    //
    //  If we run this, the global execution context will wait for it to finish
    //  running before shutting itself down.


    //////////
    //      //
    //  !!  //  Make way.
    //      //
    //////////

    const ruthenium = require('/var/task/modules/framework/ruthenium.js')

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

    const returnResponse = require(`/var/task/modules/middlewares/return-response.js`)

    const router = require(`/var/task/modules/middlewares/router.js`)

    const sessionExemption = require(`/var/task/modules/middlewares/session-exemption.js`)

    const sessionGuard = require(`/var/task/modules/middlewares/session-guard.js`)

    const setOidcSession = require(`/var/task/modules/middlewares/set-oidc-session.js`)

    const setCookies = require(`/var/task/modules/middlewares/set-cookies.js`)

    rus.frameworkDescriptionLogger.verbiage(`we are now in (/var/task/index.js), and
    
    -   many (requires) just occured;
        
    -   next, (exports.handler) is defined : so what happens when it runs?
        
            (EXPORTS.HANDLER)
            
            -   (rus.customLogger.customLogString) is re-started;
            
            -   (rus.frameworkDescriptionLogger.frameworkDescriptionLogString) is re-started;
            
            -   then some actual logging;
            
            -   then two things are prepared
            
                1. (hostInitializedData) which is here crafted for the AWS Lambda environment, (hostInitializedData.LAMBDA) though it is meant to be crafted othewise if you want to run this framework in another environment (hostInitializedData.SOMETHING_ELSE);
                
                2. (middlewares) which is an array of middlewares obtained via (requires)-ment above, which will be executed later, in sequence;
                
            -   these two things are passed as arguments to (ruthenium) which is expected to return a (rutheniumResponse)
            
            -   more logging happens;
            
            -   then (rutheniumResponse) is returned by (exports.handler)
    
    -   `)
    //////////
    //      //
    //  !!  //  Make way.
    //      //
    //////////

    // LAMBDA HANDLER
    exports.handler = async function() {

        if (rus.conf.customLogging) {
            rus.customLogger.restartCustomLogString('(/var/task/(index.js).exports.handler CALL)')
            //rus.customLogStringAppender("\n\n(index.js).exports.handler : CustomLogString RE-START : ")
        }
        if (rus.conf.frameworkDescriptionLogging) {
            rus.frameworkDescriptionLogger.frameworkDescriptionLogString = "\n\n⏸⏺ FrameworkDescriptionLogString RE-STARTED (/var/task/(index.js).exports.handler CALL)"
            rus.frameworkDescriptionLogger.callStarts()
        }

        // Minimal production logger (unsystematic; hook this up with configuration.js later) TODO:
        console.log(`lambda>node>handler, 
ENTRY Point      : (/var/task/index.js)
METHOD           : ${arguments[0].requestContext.http.method}
DOMAIN           : ${arguments[0].requestContext.domainName}
PATH             : ${arguments[0].requestContext.http.path}
RAW QUERY STRING : ?${arguments[0].rawQueryString}`)

        rus.mark(`lambda>node>handler, first mark (/var/task/index.js)`, true)

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
            setOidcSession,
            sessionGuard,
            // CONSIDER RENAMING / NORMALISING NAMES OF THESE : TODO

            //  HTML Request - Form Protocols & Data Structures
            //
            //      Discussion:     Why do we not put (formsXYZ) before 
            //      (sessionExemption)? This seems to sit on the presumption
            //      that (session state) will NEVER depend on form data.
            //
            formsTunnelRestfulMethods,
            // CONSIDER removing "restful" from this name: TODO

            formsReindexNames,
            formsValidateData,



            //  Business Logic
            //
            //      Discussion :    Why do we put (router) after (formsXYZ) and
            //      not before 
            //      (sessionExemption)? This seems to be required IF we make
            //      the assertion that (routes ... i.e. business logic) may
            //      depend on form data.
            //





            //  2020-08-05 follow-up on notes from spa-prototype.js (2020-08-04)
            //
            //  NEW ROUTING ARCHITECTURE PROPOSAL
            //
            // routeResponseStrategy,

            // for example:     << simple HTTP >>
            //                  << RESTful >>
            //                  << CORBA >>
            //                  << TEAPOT >> etc.

            // routeResponseMimeType,

            // routeCodePath,

            // currently under << router >>

            // << routeCodePath >> will have to include all of what is
            //  currently under     << composeResponse >>
            //                      << setCookies >>
            //                      << applyLayout >>

            // attributeBasedAccessControl,
            // currently NO implementation

            //  DISCUSS : design on DynamoDB
            //
            //  Accessor
            //      1ry/Partition   Key : STRING : USER_ID
            //      2dy/Sort        Key : unnecessary?
            //      Attribute           : MAP : TAGS 
            //                                  ... as TAG_NAME => TAG_VALUE
            //
            //
            //
            //  Resource
            //      1ry/Partition   Key : STRING : RESOURCE_ID
            //      2dy/Sort        Key : unnecessary?
            //      Attribute           : MAP : TAGS 
            //                                  ... as TAG_NAME => TAG_VALUE
            //


            // executeCodePath,

            // currently under << router >>

            // << executeCodePath >> should terminate in a decisive opinion 
            //  on  << response headers, including status code>>, and
            //      << response body >>

            //  << lastGuard >> follows as is currently the case, where missing
            //                  opinons are caught and handled;   





            router, // each route points to a tree of tasks ("sub-routines")
            //
            //      Question :      Why do we not separate the router and the 
            //      "dispatcher" (Rails terminology)? TODO : consider it.

            // HTTP Response
            composeResponse,
            setCookies,
            applyLayout, // - can this switch places with (setCookies)?
            lastGuard, //  Final Checkpoint
            returnResponse

            // HTTP Response - Host System Integration (AWS Lambda) Protocols & Data Structures
            // (none at this time)
        ]

        const rutheniumResponse = await ruthenium(hostInitializedData, middlewares)

        // Minimal production logger (unsystematic; hook this up with configuration.js later) TODO:
        console.log(`lambda>node>handler, EXIT Point (/var/task/index.js)`,

            (typeof rutheniumResponse == 'string') ?
            `rutheniumResponse.slice(0,50) ... [truncated]` :
            ((typeof rutheniumResponse != 'object') ?
                `(ruthenium.js) responded with typeof (neither a string nor an object); we might have a problem.` :
                (`status code: ${ rutheniumResponse.statusCode }`)
            ),

            arguments[0].requestContext.http.method,
            arguments[0].requestContext.domainName +
            arguments[0].requestContext.http.path +
            '?' + // literal
            arguments[0].rawQueryString
        )

        // runs when (handler) is executed 
        if (rus.conf.frameworkDescriptionLogging) {
            rus.frameworkDescriptionLogger.callEnds()
            rus.frameworkDescriptionLogger.logEnds()
        }
        if (rus.conf.customLogging) {
            rus.customLogger.logCustomLogString('(/var/task/(index.js).exports.handler CALL)')
        }

        return rutheniumResponse
    }
    // exports.handler()
    rus.mark(`index.js LOADED`)

    rus.frameworkDescriptionLogger.verbiage(`we are still in (/var/task/index.js), but following the definition of (exports.handler)
    
    -   some logging occurs;
    
    -   the try-catch block ends; 
    
    -   some AWS API Gateway logging variables are documented here for convenience only;
    
    -   thus ends the source of this file; 
    `)

    // runs when (handler) is initialised
    if (rus.conf.frameworkDescriptionLogging) {
        rus.frameworkDescriptionLogger.callEnds()
        rus.frameworkDescriptionLogger.logEnds()
    }
    if (rus.conf.customLogging) {
        rus.customLogger.logCustomLogString('(/var/task/(index.js).exports.handler INIT)')
    }

}

try {
    defineLambdaNodeJSHandler()
}
catch (e) { console.error(`
(/var/task/index.js) outer 'try' block.`, e) }
