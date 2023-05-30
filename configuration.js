'use strict'
// Dev: easy to find and edit
const gitCommit = 1 
const gitCommitMessage = `review, refactoring, & documentation : removed dev-junk code`
//`WIP: s3.js; route=s3-post-policy-test; WIP: desks-get-markup.js: cell by cell updates`

module.exports = {

    app: {

        uri: {

            scheme: 'https',

            authority: {
                userinfo: null,
                host: 'ruthenium-v1.dev.theunicorn.coffee',
                port: null
            },

            path: '',

            /*
            
            query: '',
            segment: ''
                // these URI components are not currently relevant here
            
            */
        }

    },

    /*  customLogging
     *  
     *      0 : console behaves normally
     *
     *      1 : console is redirected to a customised logger
     *
     *      2 : undefined ... maybe have a hybrid mode
     */

    customLogging: 0,
    customLoggingAllowsNativeLogging: 0,

    defaults: {

        cookie: {
            ['Max-Age']: 3600 // << seconds >>
        }

    },

    /*  faultTolerance:
     *
     *      0   :   always break on first error
     *
     *      1   :   accumulate errors in (data.RU.errors), but continue reducing
     *              the queue of middlewares, executing subsequent middlewares;
     */
    faultTolerance: 0,

    /*  frameworkDescriptionLogging
     *
     *      0   :   none
     *
     *      1   :   log calls 
     *
     *      2   :   1 + SUMMARY descriptors
     *
     *      3   :   2 + verbose narration
     */
    frameworkDescriptionLogging : 3,

    /*  gitCommit
     *
     *      0   :   don't bother
     *
     *      1   :   do it
     *
     *
     */
    gitCommit: gitCommit,
    gitCommitMessage: gitCommitMessage,
    /*  USES:
     *  Merge order     :   1
     *  Name            :   git-lambda2
     *  Layer version   :   6
     *  Version ARN     :   arn:aws:lambda:us-east-1:553035198032:layer:git-lambda2:6
     */

    labels: {

        /*  finalMiddleware500Body
         *
         *      What to tell the human reader, if an error occurs in the final
         *      middleware (typically, last-guard.js) such that it is caught by 
         *      (ruthenium-reducer.js).
         *
         */
        finalMiddleware500Body: `Reducer caught: an error in the final middleware. Please examine logs.`,

        /*  lastGuard500InMiddlewareBody
         *
         *      What to tell the human reader, if an error occurs in any but the
         *      final middleware such that it is processed gracefully by the 
         *      final middleware (last-guard.js) after having been stored in 
         *      (data.RU.errors) by (ruthenium-reducer.js)
         *
         */
        lastGuard500InMiddlewareBody: `<h1>Status: 500 Internal Server Error</h1>
                The last guard said :
            <h3>An Error was Thrown</h3>
                ... in middlewares.
                Please examine logs.`,

        /*  lastGuardMissingStatusCodeAndBody
         *
         *      What to tell the human reader, if (data.RU.response) is missing
         *      both (.statusCode) and (.body), detected at the 
         *      final middleware (last-guard.js) 
         *
         */
        lastGuardMissingStatusCodeAndBody: `<h1>Status: 500 Internal Server Error</h1>
                    The last guard said :
            <h3>No "View" was Assigned</h3>
                    Please examine logs.`,

        /*  middleware500Body
         *
         *      What to tell the human reader, if an error occurs in 
         *      any middleware (~/modules/middlewares/*) such that it is caught by 
         *      (ruthenium-reducer.js).
         *
         */
        middleware500Body: `Reducer caught: an error in a middleware. Please examine logs.`,

        /*  reducer500Body
         *
         *      What to tell the human reader, if an error occurs in 
         *      any (ruthenium-reducer.js) such that it is caught by 
         *      (ruthenium.js).
         *
         */
        reducer500Body: `Framework caught: an error in the reducer. Please examine logs.`,

        /* Specific to the current storage system.
         */
        deskCellTypes: {
            N: 'number',
            S: 'string',
            B: 'binary'
        }
    },

    obfuscations: {
        sessionCookieName: 'SONCHUSJD' // some random characters
    },

    /*  performance monitoring
     *
     *      0   :   none
     *
     *      1   :   some
     *
     *      2   :   undefined, as yet
     *
     */
    performance: 0,

    /*  platform:
     *  
     *      Items specific to our AWS environment:
     *      -   DynamoDB
     *      -   API Gateway
     *      -   Lambda
     *      -
     */
    platform: {
        dynamoDB: {
            /*  -   used by (oidc-session.js) TODO which c/should be renamed 
             *      (lambda-oidc-session.js);
             *  -   this data should be sufficient documentation for the
             *      recreation of a fungible table for this application;
             */
            sessions: {
                tableName: `TEST-APP-SESSIONS`,
                primaryKey: 'cognitoUsername',
                //sortKey: 'exp',   //  we cannot "getItem()" when the (exp) is unknown
                //  so exp needs to be a LSI
                //  TODO rename this 'hashKey'
                ttlKey: 'exp'

            }
        }
    },

    /*  session exempted routes
     *
     *  This class of object:
     *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
     *
     *  This method of operation:
     *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test
     *
     *  -   
     *
     *
     */

    sessionExemptedRoutes: {
        strings: [
            'file',
        ],
        regExps: [
            /^status-\d{3}$/ // status code pages
        ]
    },

    storage: {
        deskCellTypeKeys: ['S', 'N', 'B']
    },

    /*  verbosity
     *
     *      0   :   ONLY    console.error   -> logs
     *      
     *      1   :   0       + console.warn  -> logs
     *
     *      2   :   1       + console.info  -> logs
     *
     *      3   :   2       + (reindexed form data; 
     *                          raw database output)        -> response.body
     *
     *      4   :   3       + (data)                        -> response.body
     *
     *      5   :   4       
     *
     *      6   :   5       + (data)                        -> logs
     *
     *      7   :   6       + (development meta-narrative)  -> logs
     *
     *      8   :   undefined as yet
     */
    verbosity: 2,


}
