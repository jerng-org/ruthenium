'use strict'

const ddbdc     
    = require ( '/var/task/io/ddbdc.js' )

const markup 
    = require ( '/var/task/tasks/restful/desk-schemas-get-markup.js' )

const deskSchemasGet = async ( data ) => {

    data.RU.io.deskSchemasScan = await ddbdc.scan ( {
        TableName: 'TEST-APP-DESK-SCHEMAS',
        ReturnConsumedCapacity : 'TOTAL'
    } ).promise()

    switch ( data.RU.request.queryStringParameters.reader ) {
        
        case ( 'machine' ) :
            // TODO
            break
        case ( 'human' ) :
        default:
            data.RU.signals.sendResponse= { body : await markup ( data ) }
    }

}
module.exports = deskSchemasGet