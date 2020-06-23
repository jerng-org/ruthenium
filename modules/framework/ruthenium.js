'use strict'

const rus       = require ( '/var/task/modules/r-u-s.js' )

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


const reducer   = require ( '/var/task/modules/framework/ruthenium-reducer.js' )

const ruthenium = async ( HOST_INITIALIZED_DATA, MIDDLEWARE_QUEUE ) => {
    
    const frameworkData = {
        
        middlewares:    MIDDLEWARE_QUEUE.map ( m => m.name ), // TODO move this into config, out of index.js?
        
        request:        {},
        
        signals:        {}, //  inter-middleware communications; 
                            //
                            //  for example,
                            //  to say something about the field 
                            //  (data.RU.response), instead of messing
                            //  it up with (data.RU.response.mySignal),
                            //  you may write (data.RU.signals.mySignal)
        
        io:             {}, //  data-sources and data-sinks may go here
        
        response:       {},
        
        errors:         []  //  stuff errors in here, then continue 
                            //  to let the next middleware process (data),
                            //  instead of short-circuiting the entire 
                            //  queue when a middleware throws an error;
                            //
                            //  we WILL later need a mechanism which gives
                            //  the developer an option to short-circuit,
                            //  but this is not currently the default
    }

    HOST_INITIALIZED_DATA.RU = frameworkData

    const initialData = Promise.resolve ( HOST_INITIALIZED_DATA )
                        // clunky but more explicit thatn async IIFE

    return await MIDDLEWARE_QUEUE.reduce ( reducer , initialData )
}
module.exports = ruthenium
rus.mark (`ruthenium.js LOADED`)