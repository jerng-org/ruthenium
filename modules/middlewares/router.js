'use strict'

const fs = require ( 'fs' )
const tasks = {}

const taskFileNames = fs.readdirSync ('tasks')
taskFileNames.forEach ( ( current, index, array ) => {
    tasks[ current.slice (0, -3) ] = require ( '../../tasks/' + current )
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
        
        switch ( data.RU.request.queryStringParameters.ruthenium )
        {
            case ( 'initial' ):
                data.RU.signals.taskname = 'initialTask'
                break
            case ( 'restful' ):                 // METHOD, &type=M, &thing=N
                data.RU.signals.taskname = 'restful'    
                break
            case ( 'git-test' ):                 
                data.RU.signals.taskname = 'gitTestTask'    
                break
            case ( 'file' ):
                data.RU.signals.taskname = 'sendBlobTask'
                break
            case ( undefined ):
            default:
                data.RU.signals.redirectRoute = 'initial'
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
const mark      = require ( '../mark' )            
mark ( `router.js LOADED` )