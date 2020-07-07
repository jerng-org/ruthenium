module.exports = {

    /*  faultTolerance:
     *
     *      0   :   always break on first error
     *
     *      1   :   accumulate errors in (data.RU.errors), but continue reducing
     *              the queue of middlewares, executing subsequent middlewares;
     */
    faultTolerance: 0,

    /*  gitCommit
     *
     *      0   :   don't bother
     *
     *      1   :   do it
     *
     *
     */
    gitCommit: 1,
    gitCommitMessage: '(data.RU.signals.skipToMiddlewareName)',
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

    },

    obfuscations: {
        sessionCookieName : 'SONCHUSJD'
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
    performance: 1,

    /*  verbosity
     *
     *      0   :   ONLY    console.error -> logs
     *      
     *      1   :   0       + console.warn -> logs
     *
     *      2   :   1       + console.info -> logs
     *
     *      3   :   2       + (data) -> response.body
     *
     *      4   :   3       + (raw database output) -> response.body
     *
     *      5   :   undefined, as yet
     *
     *
     */
    verbosity: 3,

}
