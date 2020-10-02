'use strict'

//  Provide a debuggable function name, 
//  in order to avoid debuggin (function).toString()

const rus = require ( '/var/task/modules/r-u-s.js' )

const uuid4Create = async ( data ) => {

    data.RU.signals.noLayout = true
    
    data.RU.signals.sendResponse = { body : rus.uuid4() }

    rus.mark ( `~/tasks/_template-task.js EXECUTED` )
}
// manipulate (data.RU), for example
// no need to return (data)

module.exports = uuid4Create
rus.mark ( `~/tasks/uuid4Create.js LOADED` )