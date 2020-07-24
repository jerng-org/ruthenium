'use strict'

//  Provide a debuggable function name, 
//  in order to avoid debuggin (function).toString()

const rus = require ( '/var/task/modules/r-u-s.js' )

const spaPrototype = async ( data ) => {

    // YOUR CODE HERE
    
    // set data in ( data.RU.io.thisIsMyName )



    data.RU.signals.sendResponse.statusCode = 200
    data.RU.signals.sendResponse.body = 'Single-page App Prototype'





    rus.mark ( `~/tasks/spa-prototype.js EXECUTED` )
}
// manipulate (data.RU), for example
// no need to return (data)

module.exports = spaPrototype
rus.mark ( `~/tasks/spa-prototype.js LOADED` )