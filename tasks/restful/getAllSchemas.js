'use strict'

const mark      = require ( '/var/task/modules/mark' )            
const DDBDC     = require ( '/var/task/io/DDBDC.js' )

const getAllSchemasTask = async ( data ) => {
    
    data.RU.io.deskSchemasScan = await DDBDC.scan ( {
        TableName: 'TEST-APP-DESK-SCHEMAS',
        ReturnConsumedCapacity : 'TOTAL'
    } ).promise()

    data.RU.response.markupName = 'allSchemasMarkup'

    mark ( `getAllSchemas.js EXECUTED` )
}

module.exports = getAllSchemasTask
mark ( `getAllSchemas.js LOADED` )