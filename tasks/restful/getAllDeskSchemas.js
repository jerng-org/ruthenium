'use strict'

const mark      = require ( '/var/task/modules/mark' )
const DDBDC     = require ( '/var/task/io/DDBDC.js' )

const getAllDeskSchemas = async ( data ) => {
    
    data.RU.io.deskSchemasScan = await DDBDC.scan ( {
        TableName: 'TEST-APP-DESK-SCHEMAS',
        ReturnConsumedCapacity : 'TOTAL'
    } ).promise()

    switch ( data.RU.request.queryStringParameters.reader ) {
        
        case ( 'machine' ) :
            // TODO
            break
        case ( 'human' ) :
        default:
            data.RU.signals.markupName = 'allDeskSchemasMarkup'
    }

    mark ( `getAllDeskSchemas.js EXECUTED` )
}

module.exports = getAllDeskSchemas
mark ( `getAllDeskSchemas.js LOADED` )