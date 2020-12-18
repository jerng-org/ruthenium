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

    rus.conf.verbosity > 6 && (
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
                
                `io/models/X validation isn't linked to form input names, but it should be`,
                
                `Security: (data) object should probably not get passed lock-stock-barrel to markup files.`,
                
                `(http-METHOD) validation models COULD possibly ADDITIONALLY
                automatically check other models (e.g. after the (http-patch.js)
                validation check is positive, it could additionally check 
                subfields for the (desk-schemas) if that was the resource being
                PATCHed).`,
                
                `Route should be properly documented in (data.RU)`,
                
                `1. Abandon RESTful approaches, temporarily.
                
                2. Turn focus to making virtual tables work (desks).`,
                
                `Perhaps the best way to nested guards is with (x in object),
                and perhaps we thus need a routing table, or a routing tree 
                object.`,
                
                `Oidc does not fail on bad code (bug)`,
                
                `Rendering options, to be REQUESTED by the client:
                (a) all server responses are HTML
                    -   (a.1) a HTML response can INVITE the client to switch 
                        to protocol (b)
                (b) all server responses are JSON
                    -   (b.1) a JSON response can INVITE the client to switch
                        to protocol (a)
                        
                We need to investigate how the history API achives simultaneous:
                    -   display of URI-x in the navigation bar
                    -   no      request of URI-x from the client
                    -   actual  request of URI-y from the client
                `,

                `UUID4 to base64 !`,

                `Refactor (DESK-SCHEMAS id to be name)`,

                `There should be a (task stack) so that we can trace tasks?`,

                `make ?type=(singular) : desk-schemas -> type=desk-schema`,
                
                `(desk) CRUD ... (desk-cells- xx .js)
                
                CONSIDER renaming API endpoints (not storage structures):  
                
                    (desk-schemas)  ->  (desks)
                    (desk-cells)
                `,

                `cognito - sign-out link; persistent session store, and related policy, next.`,

                `single-page-app framework; history API`,
                
                `(statustep-functions/s-xxx.js) implement a custom message passing mechanism.`,

                `memory link; redirect to attempted URI after login`,

                `risk manage: billing attacks, for DynamoDB / Lambda / APIGW layers`,

                `
            
            BACKLOG:`,

                `linking to route=initial involves one layer of indirection, as the
                server redirects the client; REARCHITECTURE this.`,

                `(lastGuard.js) needs to be updated to disallow certain
                responses that Lambda allows (like JSON).`,

                `Some ideas for form buildes: https://www.facebook.com/groups/railsrocks/permalink/10151412423849957/`,

                `Currently, (router.js)'s (despatcher phase) calls a (task), and
                that (task) may be manually programmed to call other (tasks); but 
                there is no generic way for tasks to call tasks - should there
                be one? Or is this something we leave to the programmer?
                
                    Example of mess: we are (require)ing (status-xxx) tasks in
                    other (task)s and (middleware)s.`,

                `redirect loop detection`,

                `https://developer.mozilla.org/en-US/docs/Web/Security/Types_of_attacks`,

                `https://developer.mozilla.org/en-US/docs/Glossary/HSTS`,

                `development of validation.js features is ongoing via ~/tasks/virtual/desk-schemas-post.js`,

                `Whole class of problems:
                -   whether to use ES/JS proxies (language specific!) to 
                    automatically anotate data;
                -   example:  writes to (data.RU.signals) should be signed by 
                    the writer; perhaps via a non-enumerable property`,

                `GET method forms are not yet supported by (form middlewares);`,

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

                `v2:
                
                -   Tunneled form methods should be in REQUEST HEADERS or
                    HIDDEN INPUT ELEMENTS not in URI
                    
                    -   Also E-tags; PUT If-Match, etc. for optimistic 
                        concurrency control (locking); framework wide;
                    
                    -   Also CSRF tokens
                
                -   Probably no WebDAV, unless, we FIRST figure out a morphism
                    which uses JSON (popular) instead of XML (unpopular) wtf
                
                -   MIME multipart content for 1->N request->response-representations;
                
                -   CSRF (middleware?)
                
                -   Etags for updated data; also see "last modified" header;
                    (middleware?)
                
                -   Clean up the data model : 
                
                    -   a conceptually discrete RESOURCE can be intrinsically
                        a COLLECTION OF OTHER RESOURCES
                        
                    -   clear delineation of :
                
                        -   RESOURCEs;                  
                        
                            -   RESOURCE METADATA;
                        
                        -   resource REPRESENTATIONs;   
                        
                            -   resource REPRESENTATION METADATA
                            
                    -   Lee (1997) defines metadata as being machine readable
                    
                    -   URIs should not include HTTP METHODS (perhaps except
                            when we have to tunnel weird methods over
                            form-POSTs) (RFC 7231.2) !!! NO VERBS !!!
                                
                    -   Unsafe Methods, full scope (listed by increasing complexity)
                    
                        -   DELETE  : delete                                any entire RESOURCE
                        
                        -   PUT     : create / update                       any entire RESOURCE
                        
                        -   PATCH   : create / update / delete 
                                                      CHILD-RESOURCES of    a COLLECTION-RESOURCE
                        
                                    :   or                                  any entire RESOURCE
                        
                        -   POST    : create a CHILD-RESOURCE of            a COLLECTION-RESOURCE
                                    
                                    :   or                                  any entire RESOURCE
                                    
                                    :   POST is messy because HTML 
                                        only supports POST as a tunnel for
                                        PUT, PATCH, and DELETE
                                        
                    -   Unsafe Methods, reduced scope, Approach 1.1. (updated):
                    
                        -   Since POST's unique characteristic is that it is the 
                                only unsafe (RFC 2612) method supported by HTML,
                                we *may* feasibly scope the role of POST to
                                the tunneling of other methods, such that it 
                                interpreted to have no other use on its own;
                                
                        -   In this approach: 
                        
                            -   POST    : performs no CRUD operations 
                            
                            -   DELETE  : deletes
                                            : any entire RESOURCE
                            
                            -   PUT     : creates / updates
                                            : any entire RESOURCE
                            
                            -   PATCH   : creates / updates / deletes
                                            : CHILD-RESOURCES of
                                                a COLLECTION-RESOURCE
                                        
                                        : recursively, semantics for child C_ UD
                                            should be precisely like    - PUT
                                                                        - DELETE
                                                                        
                                        : custom semantics for arbitrary
                                            verbs/operations should be allowed,
                                            e.g. INCREMENT_BY_ONE
                                            
                                            ... however that is beyond the scope
                                            of a standard interface definition,
                                            at this time.
                `,                                                      

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

    const returnResponse = require(`/var/task/modules/middlewares/return-response.js`)

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
        console.log(`Lambda Handler EXIT Point:`,

            (typeof rutheniumResponse == 'string') ?
            `rutheniumResponse.slice(0,50) ... [truncated]` :
            ((typeof rutheniumResponse != 'object') ?
                `(ruthenium.js) responded with typeof (neither a string nor an object); we might have a problem.` :
                (`status code: ${ rutheniumResponse.statusCode }`)
            ),
            
            arguments[0].requestContext.http.method,
            arguments[0].requestContext.domainName,
            arguments[0].requestContext.http.path,
            '?', // literal
            arguments[0].rawQueryString
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

/*

API Gateway - HTTP API - logging variables :
https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-logging-variables.html

    const inner = ["$context.accountId", "$context.apiId", "$context.authorizer.claims.property",
    "$context.awsEndpointRequestId", "$context.dataProcessed",
    "$context.domainName", "$context.domainPrefix", "$context.error.message",
    "$context.error.messageString", "$context.error.responseType",
    "$context.extendedRequestId", "$context.httpMethod",
    "$context.identity.sourceIp", "$context.identity.userAgent", "$context.path",
    "$context.protocol", "$context.requestId", "$context.requestTime",
    "$context.requestTimeEpoch", "$context.routeKey", "$context.stage",
    "$context.integrationErrorMessage", "$context.integrationLatency",
    "$context.integrationStatus", "$context.responseLatency",
    "$context.responseLength", "$context.status"]
    
    .map(a=>(`"${a.slice(7)}":"${a}"`)).join(',')
    
    `{"context":{${inner}}}`

LAMBDA ENVIRONMENTAL VARIABLES :

    AWS_NODEJS_CONNECTION_REUSE_ENABLED	(value=1)
    COGNITO_ISSUER_HOST	(secret)
    COGNITO_JWKS_URI	(secret)
    COGNITO_REDIRECT_URI	(secret)
    COGNITO_RELYING_PARTY_ID	(secret)
    COGNITO_RELYING_PARTY_SECRET	(secret)
    GITHUB_JERNG_MACHINES_USER_PASSWORD	(secret)

LAMBDA & SERVER-SIDE EVENTS

    Doing this in Node.js is currently expensive, and Lambdas won't stay alive
    for very long anyway. So it is best not to try this yet, until a reasonably
    cost-efficient architecture is discovered. (AWS may add features later.)
    
    https://html.spec.whatwg.org/multipage/server-sent-events.html

*/