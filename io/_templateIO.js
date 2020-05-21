'use strict'

const mark      = require ( '../modules/mark' )            

//  Provide a debuggable function name, 
//  in order to avoid debuggin (function).toString()

const thisIsMyName = async ( data ) => {
    
    // manipulate (data.RU.io.thisIsMyName), for example

    // no need to return (data)

    mark ( `thisIsMyName.js EXECUTED` )
}

module.exports = thisIsMyName
mark ( `thisIsMyName.js LOADED` )