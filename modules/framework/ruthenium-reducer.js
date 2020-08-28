'use strict'

const rus = require('/var/task/modules/r-u-s.js')

rus.conf.verbosity > 0 &&
    console.warn(`ruthenium-reducer.js: We're using (Function.name) here,
    and this needs to be 
    examined a bit more, because it may be too JavaScript-specific; i.e.
    it may not be able to be implemented the same way in other languages;
    and here we are trying to design a language agnostic framework;
    for the time being, do not over-user (Function.name);
    
    Furthermore, upon reaching (last-guard.js), any value in
    (skipToMiddlewareName) should be ignored, and last-guard should really
    have the final control action;`)

const rutheniumReducer = async(DATA_IN_PROMISE,
    CURRENT_MIDDLEWARE,
    INDEX,
    MIDDLEWARE_QUEUE) => {

    const DATA = await DATA_IN_PROMISE

    try {

        //  1.
        //  check for unusual invocation;
        if (DATA.RU.signals.skipToMiddlewareName) {
            if (DATA.RU.signals.skipToMiddlewareName != CURRENT_MIDDLEWARE.name) {

                //  1.0.
                //  mark name of skippedFrom
                DATA.RU.signals.skippingFromMiddleware = DATA.RU.signals.skippingFromMiddleware ?
                    DATA.RU.signals.skippingFromMiddleware :
                    MIDDLEWARE_QUEUE[INDEX - 1].name

                rus.mark(`middleware SKIPPED: ${ CURRENT_MIDDLEWARE.name }`)

                //  1.1.
                //  skip to next candidate in middleware queue;
                return DATA
            }
            //  1.2.
            //  log;
            DATA.RU.middlewareSkipsExclusive.push({
                from: DATA.RU.signals.skippingFromMiddleware,
                to: CURRENT_MIDDLEWARE.name
            })
            delete DATA.RU.signals.skippingFromMiddleware

            //  1.3.
            //  stop skipping after executing the current middleware;
            delete DATA.RU.signals.skipToMiddlewareName
        }

        //  2.
        //  normal operation;
        const intermediateData = await CURRENT_MIDDLEWARE(DATA)

console.error(CURRENT_MIDDLEWARE.name, ':', intermediateData.LAMBDA.event.requestContext.http.method)


        /* THROWN? This line does not run, if CURRENT_MIDDLEWARE erred */

        rus.mark(`middleware executed: ${ CURRENT_MIDDLEWARE.name }`)

        //rus.conf.verbosity > 2 && console.log(`${CURRENT_MIDDLEWARE.name}: debug entity (): ${ await rus.print.stringify4() }`, )

        //  3.
        //  Validation: as middlewares may return nonsense
        if (typeof intermediateData == 'object'
            //&&  intermediateData.LAMBDA // (uncomment this when it has been generalised to HOST_LABEL)
            && intermediateData != null
            && intermediateData.RU) {

            // ordinary;
            return intermediateData
        }
        else
        if (INDEX + 1 == MIDDLEWARE_QUEUE.length) {
            // don't complain about the last middleware in queue;
            // TODO: need to analyse this design decision a bit more;
            //  Do we really want to admit non-object responses?
            return intermediateData
        }
        else {
            // complain loudly: 
            ///////////////////////////////////////////////////////////////////////////////

            console.warn(intermediateData)
            const thingType = typeof intermediateData

            throw Error(`(ruthenium-reducer.js): 
                
    a middleware, (${ ( CURRENT_MIDDLEWARE.name
                        ?   CURRENT_MIDDLEWARE.name
                        :   'DID_YOU_NAME_YOUR_MIDDLEWARES ?').toUpperCase() }), 
    
    ... returned an unconventional ( intermediateData ): (
${ 
    rus.print.stringify4 ( {
        intermediateData_TYPE:  thingType,
        TO_STRING:              (       thingType == 'object'
                                    &&  intermediateData.toString
                                )   
                                ?   intermediateData.toString()
                                :   'toString not defined on THE_THING',
        intermediateData:       intermediateData,
        
    }, null, 4 ) 
}
        
    );
    we expected Object.keys ( intermediateData ) to include '(HOST_LABEL)' and 'RU';
    
    Here's DATA before it was operated on by the faulty middleware:
    
    ${ rus.print.stringify4 ( DATA ) }
`)

            /*  More sensitive, related, information:

                (1)        
                    util.inspect ( CURRENT_MIDDLEWARE, { 
                            depth:      Infinity, 
                            showHidden: true
                    } )
                    
                (2)
                    CURRENT_MIDDLEWARE.toString().slice( 0, 100 )
            */

            ///////////////////////////////////////////////////////////////////////////////

        }
        // end ELSE

    }
    catch (e) {

        //  1.
        //  Caches the exception
        DATA.RU.errors.push({
            'typeof': typeof e,
            thrown: e,
        })
        console.error(rus.conf.labels.middleware500Body, "\n", e, "\n", rus.print.inspectInfinity(DATA))

        //  2.
        if (rus.conf.faultTolerance) {
            if (INDEX + 1 == MIDDLEWARE_QUEUE.length) {
                //  2.a.
                //  the last middleware is special;
                return {
                    statusCode: 500,
                    body: rus.conf.labels.finalMiddleware500Body
                }
            }
            else {
                //  2.b.
                //  returning DATA here continues to attempt to execute subsequent
                //  middlewares; this is NOT preferable if we need a hard exit
                //  from the pipeline; but this is preferable if we have a 
                //  soft process that tolerates failure; so there should be a switch
                //  here;
                return DATA
            }
        }
        else // no fault tolerance
        {
            throw Error(`(ruthenium-reducer.js) Exception thrown in Middleware. System is configured for zero fault tolerance. Please search the logs.`)
        }
    }
}
module.exports = rutheniumReducer
