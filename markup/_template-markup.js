'use strict'

const mark      = require ( '/var/task/modules/mark' )            

//  Provide a debuggable function name, 
//  in order to avoid debuggin (function).toString()

const thisIsMyName = async ( data ) => {
    
    mark ( `thisIsMyName.js EXECUTED` )

    //  Return markup as string, and it will be assigned to
    //      (data.RU.response.body) by (composeResponse.js).
    //
    //  You may also manipulated (data) directly, but that would be semantically
    //  incoherent / unpretty.

}

module.exports = thisIsMyName
mark ( `this-is-my-name.js LOADED` )