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

    rus.conf.verbosity > 4 && (
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
                            
    !!! GUIDELINE !!!   -   If any code is (lambda)-specific, prefix that file
                            immediately, and figure out how to write a runtime
                            agnostic version later.
    `),
        console.warn(

            `DEBT_NOTE`, [

                `CURRENT:`,

                `cognito - integration; designing with a view to opt-out easily, 
            later;
            
                sign-out link; persistent session store, and related policy, next.`,

                `single-page-app framework; history API`,

                `
            
            BACKLOG:`,

                `Improve docs on "what we are trying to do here"`,
                
                `redirect loop detection`,

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

                `Addressing the issue: (modulesA) which are (require)d by (rus)
                cannot call (rus.moduleB): we can resolve this (a) dynamically
                where (modulesA.method(_RUS, ... OTHER_ARGUMENTS) or (b) by
                establishing a (pre-rus) of some sort; I haven't looked into
                this`,

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

    const setOidcSession = require(`/var/task/modules/middlewares/set-oidc-session.js`)

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
            setOidcSession,
            sessionGuard,

            //  HTML Request - Form Protocols & Data Structures
            //
            //      Discussion:     Why do we not put (formsXYZ) before 
            //      (sessionExemption)? This seems to sit on the presumption
            //      that (session state) will NEVER depend on form data.
            //
            formsTunnelRestfulMethods,
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
            router, // each route points to a tree of tasks ("sub-routines")
            //
            //      Question :      Why do we not separate the router and the 
            //      "dispatcher" (Rails terminology)? TODO : consider it.

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

/* 2020-07-13

ARCHITECTURAL NOTES

Layers for consideration:

    1.
    SERVER INFRASTRUCTURE
    
    1.1.
    -   Microprocessor Architecture & other Hardware: generally not a problem.

    1.2.
    -   Operating Systems: generally a minor problem in 2020, as much of these
        traditional issues seem to have become abstracted into the Cloud
        Provider layer - or maybe it's just that most people use a Linux of 
        some sort these days.

    !!! v v v v !!!
    !!! WARNING !!!
    !!! v v v v !!!
    
    1.3.
    -   Cloud Providers: platform-specific environmental variables, such as
        special API gateway HTTP parsers, FaaS runtime idiosyncracies,
        cloud-specific data stores / caches.
    
    1.4.
    -   Language Runtimes: a language runtime determines the programming
        language rules which codify the instructions which will finally be 
        executed on a microprocessor; language runtimes are effectively
        frameworks for abstracting over microprocessor instruction architecture;
        the language runtime is usually selected by the developer. 
        
        An explosion of complexity in software begins here; Language Frameworks 
        are actually a subclass of the programming language layer, and should 
        not be considered separately - language frameworks are additional rules
        which limit the acceptable forms of code in a language, in the same way 
        that language runtimes limit the acceptable forms of characters which
        may be compiled/interpreted to microprocessor instructions.
        
    1.5.
    -   Storage Runtimes: filesystems, databases, caches, queues,

    !!! v v v v !!!
    !!! WARNING !!!
    !!! v v v v !!!
    
    2.
    CLIENT INFRASTRUCTURE

    2.1.
    -   Standards Gatekeepers: W3.org RFCs, TC39, Browser vendors.

    2.2.
    -   Native Mobile Vendors
    
Addressing issues 1.3. - 1.5.:

    3.
    A Language Runtime Agnostic Design Pattern
        
    -   This would be a framework for abstraction over the Standards
        Gatekeeper layer.
        
    3.1.
    -   A platonic data structure which is flexible enough to be implemented
        in various language runtimes (1.4.), easily; it must also be reasonbly 
        efficient to store in various storage runtimes (1.5.)
        
        3.1.1.
        -   A DSL for representing business data; query format; result format.
            (This particular item is a bit scary and seems like a potential
            time-suck.) !!! WARNING !!!
        
    -   Of course, only a subset of all 1.4. and all 1.5. would be expected to
        be compatible with 3.1.
    
    3.2.
    -   Encapsulation of code, which enables isometric implementation of 
        operations upon data ("computation"), regardless of language runtime
        and storage runtime.
    
    4.n.    
    A Language-specific Implementation of 3.

Chart of 3.

        Pick a              Pick a
        Cloud               Language Runtime
        [1.3.1.]   +--------[1.4.1.]--------+
        [1.3.2.]---+        [1.4.2.]        |
        ...        |        ...             |
        [1.3.n.]   |        [1.4.n.]        |
                   |                        |
                   |                        |
                   |        Pick a          |
                   |        Datastore       |
                   |        [1.5.1.]        |
                   +--------[1.5.2.]        |
                            ...             |
                            [1.5.n.]        |
                                            |   Use the 4. which
                                            |   fits your chosen
                                            |   Language Runtime
                                            +---[4#1.4.1.]

        [4#1.4.1.   for example, would have been written with the following
                    considerations:
        
                    -   agnostic with regards to any 1.3.
                    -   agnostic with regards to any 1.5.
                    
                    Therefore, it should have:
                    
                    -   IO interface with 1.3.
                        -   inputs accept only  3.1.
                        -   outputs are in      3.1.
                        
                    -   IO interface with 1.4.
                        -   inputs accept only  3.1.
                        -   outputs are in      3.1.
                    
                    INTEGRATIONS:
                    
                    4#1.4.1#1.3.1#i would then be a chunk of code written for
                                    1.4.1., which that takes upstream data from 
                                    1.3.1., and transforms it into 3.1., such 
                                    that it can be accepted by the INPUT 
                                    interface of 4#1.4.1. E.g. a HTTP Request
                                    FROM AWS API Gateway would need to be 
                                    parsed to 3.1. before input to 4#1.4.1.
                    
                    4#1.4.1#1.3.1#o would then be a chunk of code written for
                                    1.4.1., which that takes 3.1., and 
                                    transforms it such that it can be accepted 
                                    by the OUTPUT interface of 4#1.4.1. E.g. a
                                    HTTP Response TO AWS API Gateway would need
                                    to be parsed from 3.1. before output from
                                    4#1.4.1.
                                    
                    4#1.4.1#1.5.1#i would then be a chunk of code written for
                                    1.4.1., which that takes upstream data from 
                                    1.5.1., and transforms it into 3.1., such 
                                    that it can be accepted by the INPUT 
                                    interface of 4#1.4.1. E.g. a database 
                                    response FROM AWS DYNAMODB would need to be 
                                    parsed to 3.1. before being input to
                                    4#1.4.1.
                    
                    4#1.4.1#1.5.1#o would then be a chunk of code written for
                                    1.4.1., which that takes 3.1., and 
                                    transforms it such that it can be accepted 
                                    by the OUTPUT interface of 4#1.4.1. E.g. a 
                                    database request TO AWS DYNAMODB would need
                                    to be parsed from 3.1. before being output
                                    from 4#1.4.1.
        ]

Current state of 3.1. / 3.2.

    3.1. is currently TODO
    
    -   data.RU.request : a slightly modified version of AWS API GATEWAY's 
        (event) object.
    
    -   data.RU.signals.sendResponse : a complex version of AWS API GATEWAY's
        (response) object; significant plumbing needs to happen here, so that
        there is eventually only one way to send responses out of (ruthenium)
        and to disallow most of the various options accepted by AWS API GATEWAY.
        TODO
        
    -   Database abstraction has not yet been plumbed, but it should look
        something like this:
        
        data.RU.io.VENDOR.request =     {}  TODO
        data.RU.io.VENDOR.response =    {}  TODO
            (currently we just do data.RU.io.KEY)
        
    -   ORMs are bad. We're not aiming to build one - but we do need a common
        data FORMAT / SYNTAX / DSL for representing data with entity relations.
        TODO (3.1.1.)
        
        Once 3.1.1. has been established, and since the ORM pattern is banned,
        we can then mandate that developers must MANUALLY implement:
        
        -   4#1.4.n#1.5.n#i
        -   4#1.4.n#1.5.n#o

        It is then left to the developer to decide if they would be lazy and 
        use an ORM or other library instead of a completely manual 
        implementation.

*/