'use strict'

const rus = require ( '/var/task/modules/r-u-s.js' )

//  Provide a debuggable function name, 
//  in order to avoid debuggin (function).toString()

const thisIsMyName = async ( data ) => {
    
    // YOUR CODE HERE

    // get data from ( data.RU.io.thisIsMyName )
    
    rus.mark ( `_template-markup.js EXECUTED` )
}
//  Return markup as string, and it will be assigned to
//      (data.RU.response.body) by (composeResponse.js).
//
//  You may also manipulated (data) directly, but that would be semantically
//  incoherent / unpretty.

module.exports = thisIsMyName
rus.mark ( `_template-markup.js LOADED` )