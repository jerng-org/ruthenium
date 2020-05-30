'use strict'

const fs = require ( 'fs' )
const tasks = {}

const taskFileNames = fs.readdirSync ('/var/task/tasks')
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
        
        if (data.RU.request.queryStringParameters.route) {
            switch ( data.RU.request.queryStringParameters.route[0] )
            {
                case ( 'initial' ):
                    data.RU.signals.taskname = 'initial'
                    break
                case ( 'restful' ):                 
                    data.RU.signals.taskname = 'restful'
                        // Single Item: METHOD, &type=M, &thing=N, &value/s=V
                        // Batch:       METHOD, &batch=[ 
                        //                          [ { method: type: thing: etc. } ]
                        //                      ]
                        // Transaction: METHOD, &batch=[], transaction=1  
                    break
                case ( 'file' ):
                    data.RU.signals.taskname = 'send-blob'
                    break
                case ( undefined ):
                    // see below
                default:
                    // see below
            }
        }
        
        //  Either, there was no (route) queryParameter, 
        //  or,     there was no matching (case) for the (route) argument
        if ( ! data.RU.signals.taskname ) {
            
            throw JSON.parse( data,null, 4)
            
            data.RU.signals.redirectRoute = 'initial&reader='
                +   (   data.RU.request.queryStringParameters.reader
                        ? data.RU.request.queryStringParameters.reader[0]
                        : 'human'
                    )
        }
    }
    
    // Determine the task.
    customDetermineTaskName 
        ? customDetermineTaskName () 
        : defaultDetermineTaskName ()

////////////////////////////////////////////////////////////////////////////////

    // redirects: short-circuit
    if ( data.RU.signals.redirectRoute || data.RU.signals.redirectRoute ) {
        return data
    }    

    // no redirects: 
    // Run the task, if its module is found.
    //
    //      TODO: perhaps we want another reducer here for multiple tasks?
    //
    if ( data.RU.signals.taskname in tasks  ) {
        await tasks [ data.RU.signals.taskname ]( data )   
    }
    else {
        throw Error ( `Could not find (${ data.RU.signals.taskname 
                        }) in the tasks directory.` )
    }

////////////////////////////////////////////////////////////////////////////////
    
    return data
}
module.exports = router