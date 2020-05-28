'use strict'

const ddbdc     
    = require ( '/var/task/io/ddbdc.js' )

const markup 
    = require ( '/var/task/tasks/restful/get-all-desk-schemas/markup.js' )

const getAllDeskSchemas = async ( data ) => {
    
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
            data.RU.response.body = await markup ( data )
    }

}
module.exports = getAllDeskSchemas