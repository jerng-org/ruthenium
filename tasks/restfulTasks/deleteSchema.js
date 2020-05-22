'use strict'

const mark      = require ( '/var/task/modules/mark' )            
const DDBDC     = require ( '/var/task/io/DDBDC.js' )

const deleteSchemaTask = async ( data ) => {
    

    mark ( `deleteSchema.js EXECUTED` )
}

module.exports = deleteSchemaTask
mark ( `deleteSchema.js LOADED` )