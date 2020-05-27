'use strict'

const mark      = require ( '/var/task/modules/mark' )            

const appMetadata = async ( data ) => {
    
    // manipulate (data.RU.io.thisIsMyName), for example

    // no need to return (data)



    mark ( `appMetadata.js EXECUTED` )
}

module.exports = appMetadata
mark ( `appMetadata.js LOADED` )