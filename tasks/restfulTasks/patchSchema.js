'use strict'

const mark      = require ( '/var/task/modules/mark' )            
const DDBDC     = require ( '/var/task/io/DDBDC.js' )

const patchSchemaTask = async ( data ) => {
    


    mark ( `patchSchema.js EXECUTED` )
}

module.exports = patchSchemaTask
mark ( `patchSchema.js LOADED` )