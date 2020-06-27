'use strict'

const rus = require ( '/var/task/modules/r-u-s.js' )

//  THIS SECTION REQUIRES REFACTORING TOWARDS ELEGANT RECURSION INTO SUB-DIRECTORIES
//  THIS SECTION IS REDUNDANT WITH (apply-layout.js)
    const tasks = {}
    const taskFileNames = rus.node.fs.readdirSync ('/var/task/tasks')
    taskFileNames.forEach ( ( current, index, array ) => {
        if ( current.toLowerCase().slice ( -3 ) == '.js' ) {
            tasks[ current.slice (0, -3) ] = require ( '/var/task/tasks/' + current )
        }
    } /* , thisArg */ ) 

const router = async ( data ) => {
 
    /*  By this point in the pipeline, (data.RU) should provide:    
    *       (.headers)
    *       (.headers.cookies)
    *       (.queryStringParameters)
    *       (.formStringParameters)
    *
    *   And, (data.LAMBDA) also provides:
    *       (.event)
    *       (.context)
    *
    *   So, any of these may be used by (DetermineTaskName)
    */
    
    // DIY here
    const customDetermineTaskName = undefined
    
    // Default here
    const defaultDetermineTaskName = () => {
        
        if (    data.RU.request.queryStringParameters.route
                && data.RU.request.queryStringParameters.route[0] ) 
        {
            switch ( data.RU.request.queryStringParameters.route[0] )
            {
            
            
            
                
            case ( 'initial' ):
            data.RU.signals.taskName = 'initial'
            break
            
            
            
            
            case ( 'restful' ):                 
            data.RU.signals.taskName = 'restful'
                // Single Item: METHOD, &type=M, &thing=N, &value/s=V
                // Batch:       METHOD, &batch=[ 
                //                          [ { method: type: thing: etc. } ]
                //                      ]
                // Transaction: METHOD, &batch=[], transaction=1  
            break
            
            
            
            
            case ( 'file' ):
            data.RU.signals.taskName = 'send-blob'
            break
            
            
            
            
            case ( undefined ):
            
            break
            
            
            
            
            default:
            // request ?query parameter was set, but is not one of the above cases;
            data.RU.signals.taskName = data.RU.request.queryStringParameters.route[0]
            }
        }
        // if (queryStringParameters.route[0] was truthy)
        
        //  EITHER  (queryStringParameters.route[0] was not defined)
        //  OR      (... it was defined as a falsy value, then conferred to .signals.taskName )
        if ( ! data.RU.signals.taskName )
        {
            // request ?query parameter was not set;
            data.RU.signals.redirectRoute = 'initial'
                
                +   `&reader=`
                +   (   data.RU.request.queryStringParameters.reader
                        ? data.RU.request.queryStringParameters.reader[0]
                        : 'human' )
                +   (   data.RU.request.queryStringParameters.message
                        ? `&message=(via router.js)${data.RU.request.queryStringParameters.message[0]}`
                        : '' )
        } 
    }
    
////////////////////////////////////////////////////////////////////////////////
// EXECUTION BEGINS

    // Determine the task.
    customDetermineTaskName 
        ? customDetermineTaskName () 
        : defaultDetermineTaskName ()

    // redirects: short-circuit
    if ( data.RU.signals.redirectRoute )
    { 
        return data
    }  

    // no redirects: 
    // Run the task, if its module is found.
    //
    //      TODO: perhaps we want another reducer here for multiple tasks?
    //
    
    else
    if ( data.RU.signals.taskName in tasks  ) {
        
        // Important things happen here, preparing (data.RU.io) for task-markup.
        await tasks [ data.RU.signals.taskName ]( data )   
        
    }
    else
    {
        throw Error ( `Could not find (${ data.RU.signals.taskName 
                        }) in the tasks directory.` )
    }

// EXECUTION ENDS
////////////////////////////////////////////////////////////////////////////////
    
    return data
}
module.exports = router
rus.mark (`~/modules/middlewares/router.js LOADED`)