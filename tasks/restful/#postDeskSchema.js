'use strict'

const mark      = require ( '/var/task/modules/mark' )            
const DDBDC     = require ( '/var/task/io/DDBDC.js' )

const postDeskSchema = async ( data ) => {
    
    mark ( `postDeskSchema.js EXECUTED` )
}

module.exports = postDeskSchema
mark ( `postDeskSchema.js LOADED` )