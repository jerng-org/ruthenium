'use strict'

const rus = require ( '/var/task/modules/r-u-s.js' )

//  Provide a debuggable function name, 
//  in order to avoid debugging (function).toString()

const thisIsMyName = async ( data ) => {
    
    // rutheniumReducer.js will mark() execution, you don't have to
    
    //throw Error (`test error in oidc-validation.js`)
    
    return data
}

module.exports = thisIsMyName
rus.mark (`~/modules/middlewares/this-is-my-name.js LOADED`)