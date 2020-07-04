'use strict'

const rus = require('/var/task/modules/r-u-s.js')

//  Provide a debuggable function name, 
//  in order to avoid debugging (function).toString()

const thisIsMyName = async(data) => {

    let validationFailure // defaults to "no failure"

    if (validationFailure) {
        throw Error(`test error in oidc-validation.js`)
    }
    else {
        return data
    }
}

module.exports = thisIsMyName
rus.mark(`~/modules/middlewares/this-is-my-name.js LOADED`)
