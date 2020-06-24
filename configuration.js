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
     */
     
    performance: 0
}