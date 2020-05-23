'use strict'

const mark      = require ( '/var/task/modules/mark' )            

//  Provide a debuggable function name, 
//  in order to avoid debugging (function).toString()

const thisIsMyName = async ( data ) => {
    
    mark ( `thisIsMyName.js EXECUTED` )
    
    return data

}

module.exports = thisIsMyName
mark ( `thisIsMyName.js LOADED` )