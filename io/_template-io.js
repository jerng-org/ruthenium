'use strict'

const rus = require ( '/var/task/modules/r-u-s.js' )

//  Provide a debuggable function name, 
//  in order to avoid debuggin (function).toString()

const thisIsMyName = async ( data ) => {
    
    // manipulate (data.RU.io.thisIsMyName), for example

    // no need to return (data)

    rus.mark ( `(this-is-my-name.js) EXECUTED` )
}

module.exports = thisIsMyName
rus.mark ( `(this-is-my-name.js) LOADED` )