'use strict'

const rus = require('/var/task/modules/r-u-s.js')

rus.frameworkDescriptionLogger.more(`
//  Uncertain theoretical proposition about dependency injection :
//
//      (ruthenium.js)                                  is the client;
//
//          (index.js)                                  is an injector,
//              (~/modules/middlewares/*)               are its dependencies;
//
//          (~/modules/middlewares/router.js)           is another injector,
//              (~/tasks/*)                             are its dependencies;             
//
//          (~/modules/middlewares/composeResponse.js)  is another injector,
//              (~/markup/*)                            are its dependencies;             
`)

const reducer = require('/var/task/modules/framework/ruthenium-reducer.js')

const ruthenium = async (HOST_INITIALIZED_DATA, MIDDLEWARE_QUEUE) => {

    const frameworkData = {

        middlewares: MIDDLEWARE_QUEUE.map(m => m.name),
        // TODO move this into config, out of index.js?

        middlewareSkipsExclusive: [],
        //  { from: <<name>>, to: <<name>> }

        request: {},

        signals: {
            //  inter-middleware communications; 
            //
            //  for example,
            //  to say something about the field 
            //  (data.RU.response), instead of messing
            //  it up with (data.RU.response.mySignal),
            //  you may write (data.RU.signals.mySignal);

            sendResponse: {

                setCookies: []
                //  data will be caught by (set-cookies.js)
            }
        },

        io: {},
        //  data-sources and data-sinks may go here;

        response: null,
        //  prevent accidental assignment, prior to 
        //  (compose-response.js) fulfilling that duty;

        errors: []
        //  stuff errors in here, then continue 
        //  to let the next middleware process (data),
        //  instead of short-circuiting the entire 
        //  queue when a middleware throws an error;
        //
        //  we WILL later need a mechanism which gives
        //  the developer an option to short-circuit,
        //  but this is not currently the default;
    }

    HOST_INITIALIZED_DATA.RU = frameworkData

    const initialData = Promise.resolve(HOST_INITIALIZED_DATA)
    // clunky but more explicit than async IIFE
    let finalData

    try {
        finalData = await MIDDLEWARE_QUEUE.reduce(reducer, initialData)
    }
    catch (e) {
        console.error(rus.conf.labels.reducer500Body, `This exception was thrown : `, e)
        return {
            statusCode: 500,
            body: rus.conf.labels.reducer500Body
        }
    }

    return finalData
}
module.exports = ruthenium

rus.mark('LOADED')
