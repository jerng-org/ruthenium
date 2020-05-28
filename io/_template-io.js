'use strict'

const mark
    = require ( '/var/task/modules/mark' )            

//  Provide a debuggable function name, 
//  in order to avoid debuggin (function).toString()

const thisIsMyName = async ( data ) => {
    
    // manipulate (data.RU.io.thisIsMyName), for example

    // no need to return (data)

    mark ( `this-is-my-name.js EXECUTED` )
}

module.exports = thisIsMyName
mark ( `this-is-my-name.js LOADED` )