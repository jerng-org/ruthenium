'use strict'

const rus = require ( '/var/task/modules/r-u-s.js' )

//  Provide a debuggable function name, 
//  in order to avoid debugging (function).toString()

const sessionGuard = async ( data ) => {
    
    // rutheniumReducer.js will mark() execution, you don't have to
    
    return data
}

module.exports = sessionGuard
rus.mark (`~/modules/middlewares/sessionGuard.js LOADED`)