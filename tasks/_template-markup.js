'use strict'

const rus = require ( '/var/task/modules/r-u-s.js' )

//  Provide a debuggable function name, 
//  in order to avoid debuggin (function).toString()

const thisIsMyName = async ( data ) => {
    
    // YOUR CODE HERE

    // get data from ( data.RU.io.thisIsMyName )
    
    //  IFF this is a LAYOUT MARKUP, and if this is run after the main task+markup
    //  are rendered, then find that rendered markup in (data.RU.response.body),
    //  wrap it with more mar, then return it.
    
    rus.mark ( `_template-markup.js EXECUTED` )
}
//  Return markup as string, and it will be assigned to
//      (data.RU.response.body) by (compose-response.js).
//
//  You may also manipulate (data) directly, but that would be semantically
//  incoherent / unpretty.

module.exports = thisIsMyName
rus.mark ( `~/tasks/_template-markup.js LOADED` )