'use strict'

//  Provide a debuggable function name, 
//  in order to avoid debuggin (function).toString()

const mark      = require ( '/var/task/modules/mark' )            

const thisIsMyName = async ( data ) => {
    
    // manipulate (data.RU), for example

    // no need to return (data)

    mark ( `_template-task.js EXECUTED` )
}

module.exports = thisIsMyName
mark ( `_template-task.js LOADED` )