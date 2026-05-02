let middlewares

try { 
    const rus = await import("./modules/r-u-s.js")

    console.log(`TOP OF index-middlewares`)

    // PROJECT - MIDDLEWARES, lexical order 

    const applyLayout = await import('./modules/middlewares/apply-layout.js')

    const composeResponse = await import('./modules/middlewares/compose-response.js')

    const formsReindexNames = await import('./modules/middlewares/forms-reindex-names.js')

    const formsTunnelRestfulMethods = await import('./modules/middlewares/forms-tunnel-restful-methods.js')

    const formsValidateData = await import('./modules/middlewares/forms-validate-data.js')

    const lastGuard = await import('./modules/middlewares/last-guard.js')

    // AWS API Gateway, HTTP APIs, Lambda Integration, Payload Format 2.0

    const lambdaCopyRequestParameters = await import('./modules/middlewares/lambda-copy-request-parameters.js')

    const lambdaLoadMetadata = await import('./modules/middlewares/lambda-load-metadata.js')

    const lambdaNormalizeFormData = await import('./modules/middlewares/lambda-normalize-form-data.js')

    const lambdaNormalizeHeaders = await import('./modules/middlewares/lambda-normalize-headers.js')

    const lambdaNormalizeQueryStringParameters = await import('./modules/middlewares/lambda-normalize-query-string-parameters.js')

    const oidcValidation = await import('./modules/middlewares/oidc-validation.js')

    const returnResponse = await import('./modules/middlewares/return-response.js')

    const router = await import('./modules/middlewares/router.js')

    const sessionExemption = await import('./modules/middlewares/session-exemption.js')

    const sessionGuard = await import('./modules/middlewares/session-guard.js')

    const setOidcSession = await import('./modules/middlewares/set-oidc-session.js')

    const setCookies = await import('./modules/middlewares/set-cookies.js')

    middlewares = [ // MIDDLEWARES, in execution order

        /* HTTP Request - Host System Integration (AWS Lambda) Protocols &
        Data Structures*/

        lambdaCopyRequestParameters,
        /* Query string values with same key
                   stored as: CSV string */

        lambdaNormalizeHeaders,
        /* Cookie header values with same key stored
                   as: Array of values */

        lambdaNormalizeQueryStringParameters,
        /* Query string with same key
                   stored as: Array of values */

        lambdaNormalizeFormData,
        /* Form string values with same name stored
                   as: Array of values */

        //lambdaLoadMetadata,

        /*_______________________________!!
        !!            \\                 !!
        !!              \\               !!
        !!  Make way   //\\    Make way  !!
        !!            //  \\             !!
        !!__________//______\\___________*/

        /*  Middlewares below SHOULD be independent on host system (e.g.
        Lambda) implementation details Nevertheless, everything below
        targets Lambda's (response) format, so if we implement somewhere
        other than Lambda, we'll need a final (somewhere-response-formatter)
        middleware after (last-guard.js) */

        /*  HTTP Request - Session Protocols & Data Structures */
        /* CONSIDER RENAMING / NORMALISING NAMES OF THESE : TODO */

        sessionExemption,

        oidcValidation,

        setOidcSession,

        sessionGuard,

        /*  HTML Request - Form Protocols & Data Structures
          
                Discussion:     Why do we not put (formsXYZ) before
                (sessionExemption)? This seems to sit on the presumption
                that (session state) will NEVER depend on form data. */

        formsTunnelRestfulMethods,
        /* CONSIDER removing "restful" from this name: TODO */

        formsReindexNames,

        formsValidateData,

        /*  Business Logic
          
                Discussion :    Why do we put (router) after (formsXYZ) and
                not before 
                (sessionExemption)? This seems to be required IF we make
                the assertion that (routes ... i.e. business logic) may
                depend on form data.
        */

        /*  2020-08-05 follow-up on notes from spa-prototype.js (2020-08-04)
                  
                    NEW ROUTING ARCHITECTURE PROPOSAL
                  
                   routeResponseStrategy,

                   for example:     << simple HTTP >>
                                    << RESTful >>
                                    << CORBA >>
                                    << TEAPOT >> etc.

                   routeResponseMimeType,

                   routeCodePath,

                   currently under << router >>

                   << routeCodePath >> will have to include all of what is
                    currently under     << composeResponse >>
                                        << setCookies >>
                                        << applyLayout >>

                   attributeBasedAccessControl,
                   currently NO implementation

                    DISCUSS : design on DynamoDB
                  
                    Accessor
                        1ry/Partition   Key : STRING : USER_ID
                        2dy/Sort        Key : unnecessary?
                        Attribute           : MAP : TAGS 
                                                    ... as TAG_NAME => TAG_VALUE
                  
                  
                  
                    Resource
                        1ry/Partition   Key : STRING : RESOURCE_ID
                        2dy/Sort        Key : unnecessary?
                        Attribute           : MAP : TAGS 
                                                    ... as TAG_NAME => TAG_VALUE
                  


                   executeCodePath,

                   currently under << router >>

                   << executeCodePath >> should terminate in a decisive opinion 
                    on  << response headers, including status code>>, and
                        << response body >>

                    << lastGuard >> follows as is currently the case, where missing
                                    opinons are caught and handled;   
    */

        /* each route points to a tree of tasks ("sub-routines")
                  
                        Question :      Why do we not separate the router and the 
                        "dispatcher" (Rails terminology)? TODO : consider it.
    */
        router,

        /*   HTTP Response*/
        composeResponse,
        setCookies,
        applyLayout, /* - can this switch places with (setCookies)?*/
        lastGuard, /*  Final Checkpoint*/
        returnResponse

        /* HTTP Response - Host System Integration (AWS Lambda) Protocols &
        Data Structures (none at this time)*/

    ]
} catch (e) { console.error(`
( index-middlewares.js ) outer 'try' block.`, e) }

export default middlewares
