import rus from '/var/task/modules/r-u-s.js'
import ruthenium from '/var/task/modules/framework/ruthenium.js'
import middlewares from '/var/task/index-middlewares.js'

let handler

const initLambdaNodeJSHandler = () => {

    /*_______________________________!!
    !!            \\                 !!
    !!              \\               !!
    !!  Make way   //\\    Make way  !!
    !!            //  \\             !!
    !!__________//______\\___________*/

    //  See pertinent (nodeJS-specific) documentation at /var/task / modules / r - u - s.js

    rus.mark(`INITIALISING Handler (having loaded r-u-s.js) ...`)

    rus.frameworkDescriptionLogger.backlog(`(ru) shouldn't have a folder called
    (modules) as this is easily confused with that keyword in
    (node/ecmascript)`)

    rus.frameworkDescriptionLogger.less(`(/var/task/index.js) SUMMARY
    
    -   The roles of [this file] in the [AWS Lambda > NodeJS], and
    [exports.handler] are documented by AWS.
    
    -   We run everything in a [try-catch block], including miscellaneous
    documentation. [rus.conf] can modify the original [console] with a
    [customLogger]. 

    -   A [frameworkDescriptionLogger] allows for the framework [documentation
    AND backlog note varieties] to be embedded in the codebase, near the relevant
    LOCs. [rus.conf.frameworkDescriptionLogging] determines verbosity.
    
    -   DEVELOPMENT : We commit the codebase to (git) here.
    
    -   We (require) framework and middleware files.
    
    -   We then define (exports.handler) which is called whenever the Lamba is
    executed. It captures each HTTP requests' (hostInitializedData) and
    (middlewares), run this through (ruthenium) and get (rutheniumResponse),
    then return it`)

    /*_______________________________!!
    !!            \\                 !!
    !!              \\               !!
    !!  Make way   //\\    Make way  !!
    !!            //  \\             !!
    !!__________//______\\___________*/

    rus.frameworkDescriptionLogger.more(` !!! WARNING !!! -   ANYTHING OUTSIDE
    (exports.handler) persists across all function calls, possibly for the
    lifetime of the function's CONTAINER;
                        
    DO NOT WRITE TO THESE OBJECTS, 
    
    FROM MIDDLEWARES, OR FROM ANYWHERE ELSE IN CODE CALLED BY (exports.handler),
    AS THIS MAY RESULT IN SECURITY BREACHES, OR SPACE LEAKS; DO NOT WRITE
    ANYTHING TO THESE OBJECTS,
    
    MOST IMPORTANTLY DO NOT WRITE (data) from MIDDLEWARES TO THESE OBJECTS.`)

    rus.frameworkDescriptionLogger.backlog(`... SOONER, we need to test how
    (require()) handles these, to determine exactly what data persists between
    function calls;`)

    rus.frameworkDescriptionLogger.backlog(`... LATER, we need to implement a
    checker to block this from happening at commit-time;`)

    rus.frameworkDescriptionLogger.less(`If any code is (lambda)-specific,
    prefix that file immediately, and figure out how to write a runtime agnostic
    version later. `)

    rus.frameworkDescriptionLogger.more(

        `ARCHITECTURE_NOTE`, [


            `RULE:
                
                    1.  A web server's hypertext graph should be defined in
                        minimalistic form as-if for a machine reader, first.
                    
                        HATEOAS :   
                        
                            1.  Each resource should be identified by a URI.
                            
                                (URIs may be names or locations of resources.)
                            
                            2.  HTTP responses for machine readers should
                                include a list of (some?) available URIs
                    
                    2. `,

            `We're currently working with something that looks like:
                
                    - ? route=virtual
                    
                    - & type=(desk-schemas, or desks)
                    
                    - & thing=(UNDEFINED-for-desk-schemas, or
                                                DESK-NAME-for-desks)
                    
                    - & reader=(human, or machine)
                
                We could migrate to:
                
                    -   "storage=virtual & type=Deskname     & thing=Rowid"
                    
                    -   "storage=actual  & type=desk-schemas & thing=Deskname"
                    
                    -   "storage=actual  & type=desk-cells   &
                    thing=Deskname#Columnname,Rowid" (we've stopped caring if
                    "type" and "Columnname" are singular or plural)        
                    
                User-story:     
                    
                    1.  Define traits for desks, in desk-schemas 
                    
                    2.  All desks which share a desk-schema trait all work the
                    same way But we really shouldn't bother until v2. `,

            `Things that could be done in JavaScript, but which may not be
                simply portable to other languages:
                
                -   setting non-enumerable properties on (rus.data) which allow 
                    hidden safety checks, for example (did someone delete keyX),
                    also non-writeable, non-configurable, etc.
                    
                -   one possible paradigm for managing this, is to replace all
                    prop-assignment with array-pushes, so that data already set
                    is not overwritten `
        ])

    rus.frameworkDescriptionLogger.backlog(
        `https://www.npmjs.com/package/require-directory`
    )

    if (rus.conf.gitCommit) rus.lambdaGitCommit(rus.conf.gitCommitMessage)

    /*  VERSION CONTROL HACK - a SYNCHRONOUS FUNCTION - why? 
        Because the alternative is: ( async () => await rus.lambdaGitCommit() )() 
        If we run this, the global execution context will wait for it to finish
        running before shutting itself down.
    */

    /*_______________________________!!
    !!            \\                 !!
    !!              \\               !!
    !!  Make way   //\\    Make way  !!n
    !!            //  \\             !!
    !!__________//______\\___________*/
    

    rus.frameworkDescriptionLogger.more(`we are now in (/var/task/index.js), and
    
    -   many (requires) just occured;
        
    -   next, (exports.handler) is defined : so what happens when it runs?
        
            (EXPORTS.HANDLER)
            
            -   (rus.customLogger.customLogString) is re-started;
            
            -   (rus.frameworkDescriptionLogger.frameworkDescriptionLogString)
            is re-started;
            
            -   then some actual logging;
            
            -   then two things are prepared
            
                1. (hostInitializedData) which is here crafted for the AWS
                Lambda environment, (hostInitializedData.LAMBDA) though it is
                meant to be crafted othewise if you want to run this framework
                in another environment (hostInitializedData.SOMETHING_ELSE);
                
                2. (middlewares) which is an array of middlewares obtained via
                (requires)-ment above, which will be executed later, in
                sequence;
                
            -   these two things are passed as arguments to (ruthenium) which is
            expected to return a (rutheniumResponse)
            
            -   more logging happens;
            
            -   then (rutheniumResponse) is returned by (exports.handler)
    
    -   `)

    /*_______________________________!!
    !!            \\                 !!
    !!              \\               !!
    !!  Make way   //\\    Make way  !!
    !!            //  \\             !!
    !!__________//______\\___________*/

    // LAMBDA HANDLER

    handler = function (/* event,context */) {

        rus.customLogger.restartCustomLogString(
            '(/var/task/(index.js).exports.handler CALL) ')
        rus.frameworkDescriptionLogger.logRestarts('index.js / handler EXECUTING')
        rus.frameworkDescriptionLogger.callStarts()

        //  Minimal production logger (unsystematic; hook this up with configuration.js later) 
        console.log(`REQUEST to application < handler < NodeJS < Lambda < API Gateway < 
METHOD           : ${arguments[0].requestContext.http.method} 
DOMAIN           : ${arguments[0].requestContext.domainName} 
PATH             : ${arguments[0].requestContext.http.path}
RAW QUERY STRING : ?${arguments[0].rawQueryString}`)

        rus.mark(`Handler EXECUTING ...`, true)

        const hostInitializedData = {
            LAMBDA: {
                /*  Things we must include because they are principal arguments of  Lambda invocation handlers. */
                event: arguments[0],
                context: arguments[1],
                callback: arguments[2],

                /*  Things which may not be immediately obvious, which we should encourage developers to be aware of. */
                inspectGlobal: () =>
                    rus.node.util.inspect(global, {
                        depth: Infinity,
                        showHidden: true
                    })
            }
        }

        const rutheniumResponse =  ruthenium(hostInitializedData, middlewares)

        /* Minimal production logger (unsystematic; hook this up with configuration.js later) TODO: */

        console.log(`RESPONSE from application > handler > NodeJS > Lambda > API Gateway > Client`,

            (typeof rutheniumResponse == 'string') ?
            `rutheniumResponse.slice(0,50) ... [truncated]` : (
                (typeof rutheniumResponse != 'object') ?
                `(ruthenium.js) responded with typeof (neither a string nor an object);
            we might have a problem.` :
                (`status code: ${ rutheniumResponse.statusCode }`)
            ),

            arguments[0].requestContext.http.method,
            arguments[0].requestContext.domainName +
            arguments[0].requestContext.http.path + '?' + // literal
            arguments[0].rawQueryString)

        // runs when (handler) is executed rus.mark('... Handler EXECUTED')
        rus.frameworkDescriptionLogger.callEnds()
        rus.frameworkDescriptionLogger.logEnds('index.js / handler EXECUTING')
        rus.customLogger.logCustomLogString(
            '(/var/task/(index.js).exports.handler CALL) '
        )

        return rutheniumResponse
    } // defines handler() 


    rus.mark('... Handler INITIALISED ')

    rus.frameworkDescriptionLogger.more(`we are still in (/var/task/index.js),
    but following the definition of (exports.handler)
    
    -   some logging occurs;
    
    -   the try-catch block ends; 
    
    -   some AWS API Gateway logging variables are documented here for
    convenience only;
    
    -   thus ends the source of this file; `)

    // runs when (handler) is initialised
    rus.frameworkDescriptionLogger.callEnds()
    rus.frameworkDescriptionLogger.logEnds('index.js / handler INITIALISING')
    rus.customLogger.logCustomLogString(
        '(/var/task/(index.js).exports.handler INIT) '
    )

    rus.frameworkDescriptionLogger.backlog(`s3.js; route=s3-post-policy-test`)

    rus.frameworkDescriptionLogger.backlog(`WIP: desks-get-markup.js: cell by
    cell updates`)

}

const initCustomRuntimeClient =  async _ => {
    /* CUSTOM RUNTIME BEGIN */
        if ( rus.conf.platform.lambdaContainerBase == 'AWS_OS_ONLY' ) {

            switch(conf.platform.javascriptEngine) {
                case ('NODEJS'): {
                    const { http } = await import('http')
                    break
                }
                case ('TXIKIJS'): {
                    break
                }
                default : { throw new Error('mark.js : branch not implemented') }
            }

            const lambdaRuntimeAPI = rus.conf.env.AWS_LAMBDA_RUNTIME_API
            const getURI           = `http://${lambdaRuntimeAPI}/2018-06-01/runtime/invocation/next`
            const postHostname     = lambdaRuntimeAPI.split(':')[0]
            const postPort         = lambdaRuntimeAPI.split(':')[1]

            async function startRuntime() {
              while (true) {
                // 1. GET Request to poll for the next invocation
                const { event, requestID } = await getNextInvocation()
                    // context : may be reconstructed from ENV variables

                try {
                  // 2. Process the event (e.g., call your handler)
                  const result = await handler(event)

                  // 3. POST Request to send the successful response
                  await sendResponse(requestID, result)

                } catch (error) {
                  // POST Request to report an invocation error
                  // sendError(requestID, error)
                }
              }
            }

            // Helper: GET next invocation event
            async function getNextInvocation() {
              return new Promise((resolve) => {
                http.get(getURI, (res) => {
                  let data = ''
                  res.on('data', chunk => data += chunk)
                  res.on('end', () => {
                    resolve({
                      event: JSON.parse(data),
                      requestID: res.headers['lambda-runtime-aws-request-id']
                    })
                  })
                })
              })
            }

            // Helper: POST response
            async function sendResponse(requestID, responseBody) {
              const options = {
                hostname: postHostname,
                port: postPort,
                path: `/2018-06-01/runtime/invocation/${requestID}/response`,
                method: 'POST'
              }
              const req = http.request(options)
              req.write(JSON.stringify(responseBody))
              req.end()
            }
            
            await startRuntime()
        }
    /* CUSTOM RUNTIME END */
}

try { 
    initLambdaNodeJSHandler() 
    initCustomRuntimeClient()
}
catch (e) { console.error(`
(/var/task/index.js) outer 'try' block.`, e) }

/* TEST SHIM :
const handler = async (event, context) => {
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            message: "Hello from ESM Lambda!",
            input: event,
        }),
    };
    return response;
};
//*/

// For AWS vendored : Node.js client
export { handler }