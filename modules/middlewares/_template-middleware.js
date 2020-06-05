'use strict'

const mark          = require ( '/var/task/modules/mark' )            

//  Provide a debuggable function name, 
//  in order to avoid debugging (function).toString()

const thisIsMyName = async ( data ) => {
    
    // rutheniumReducer.js will mark() execution, you don't have to
    
    return data

}

module.exports = thisIsMyName
mark (`this-is-my-name.js LOADED`, true)