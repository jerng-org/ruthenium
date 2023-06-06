'use strict'

const rus = require ( '/var/task/modules/r-u-s.js' )

//  Provide a debuggable function name, 
//  in order to avoid debugging (function).toString()

const thisIsMyName = async ( data ) => {
    
    // rutheniumReducer.js will mark () execution, you don't have to
    
    return data
}

module.exports = thisIsMyName
rus.mark (`LOADED`)