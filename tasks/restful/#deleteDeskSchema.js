'use strict'

const mark      = require ( '/var/task/modules/mark' )            
const DDBDC     = require ( '/var/task/io/DDBDC.js' )

const deleteDeskTask = async ( data ) => {
    

    mark ( `deleteDesk.js EXECUTED` )
}

module.exports = deleteDeskTask
mark ( `deleteDesk.js LOADED` )