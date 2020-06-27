module.exports = {
    
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
    verbosity:  3,
    
    
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
    
    
    /*  gitCommit
     *
     *      0   :   don't bother
     *
     *      1   :   do it
     *
     *
     */
     gitCommit: 1,
     gitCommitMessage: '-',
     
    labels:  {
        
        /*  lastGuard500InMiddleware
         *
         *      What to tell the human reader, if an error occurs in any but the
         *      final middleware such that it is processed gracefully by the 
         *      final middleware (last-guard.js) after having been stored in 
         *      (data.RU.errors) by (ruthenium-reducer.js)
         *
         */
        lastGuard500InMiddleware:
            `<h1>Status: 500 Internal Server Error</h1>
                The last guard said :
            <h3>An Error was Thrown</h3>
                ... in middlewares.`,
        
        /*  lastGuardMissingStatusCodeAndBody
         *
         *      What to tell the human reader, if (data.RU.response) is missing
         *      both (.statusCode) and (.body), detected at the 
         *      final middleware (last-guard.js) 
         *
         */
        lastGuardMissingStatusCodeAndBody:
            `<h1>Status: 500 Internal Server Error</h1>
                    The last guard said :
            <h3>No "View" was Assigned</h3>`,
        
        /*  reducer500Body
         *
         *      What to tell the human reader, if an error occurs in the final
         *      middleware (last-guard.js) such that it is caught by 
         *      (ruthenium-reducer.js).
         *
         */
        reducer500Body: 
            `Middleware reducer caught an error, in the final middleware.`
        
    }
}