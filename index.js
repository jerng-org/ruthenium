'use strict'

const initLambdaNodeJSHandler = _ => {

    /*_______________________________!!
    !!            \\                 !!
    !!              \\               !!
    !!  Make way   //\\    Make way  !!
    !!            //  \\             !!
    !!__________//______\\___________*/

    //  See pertinent (nodeJS-specific) documentation at /var/task / modules / r - u - s.js

    const rus = require('/var/task/modules/r-u-s.js')

    rus.mark(`INITIALISING Handler (having loaded r-u-s.js) ...`)

    rus.frameworkDescriptionLogger.callStarts()

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
    !!  Make way   //\\    Make way  !!
    !!            //  \\             !!
    !!__________//______\\___________*/

    const ruthenium = require('/var/task/modules/framework/ruthenium.js')

    const middlewares = require('/var/task/index-middlewares.js')

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

    module.exports.handler = async function() {

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

        const rutheniumResponse = await ruthenium(hostInitializedData,
            middlewares)

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
    } // exports.handler() 

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

try { initLambdaNodeJSHandler() }
catch (e) { console.error(`
(/var/task/index.js) outer 'try' block.`, e) }
