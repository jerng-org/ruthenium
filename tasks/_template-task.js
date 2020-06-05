'use strict'

//  Provide a debuggable function name, 
//  in order to avoid debuggin (function).toString()

const rus = require ( '/var/task/modules/r-u-s.js' )

const thisIsMyName = async ( data ) => {
    
    // manipulate (data.RU), for example

    // no need to return (data)

    rus.mark ( `_template-task.js EXECUTED` )
}

module.exports = thisIsMyName
rus.mark ( `_template-task.js LOADED` )