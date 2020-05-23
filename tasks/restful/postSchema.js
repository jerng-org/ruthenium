'use strict'

const mark      = require ( '/var/task/modules/mark' )            
const DDBDC     = require ( '/var/task/io/DDBDC.js' )

const postSchemaTask = async ( data ) => {
    
    mark ( `postSchema.js EXECUTED` )
}

module.exports = postSchemaTask
mark ( `postSchema.js LOADED` )