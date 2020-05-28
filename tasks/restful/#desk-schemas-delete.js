'use strict'

const mark      = require ( '/var/task/modules/mark' )            
const ddbdc     = require ( '/var/task/io/ddbdc.js' )

const deleteDeskTask = async ( data ) => {
    

    mark ( `deleteDeskSchema.js EXECUTED` )
}

module.exports = deleteDeskTask
mark ( `deleteDeskSchema.js LOADED` )