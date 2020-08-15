'use strict'

const rus = require ( '/var/task/modules/r-u-s.js' )

const markup 
    = require ( '/var/task/tasks/virtual/desk-schemas-get/desk-schemas-get-markup.js' )
rus.conf.verbosity > 0 &&
    console.warn(`(desk-schemas-get.js) FIXME: rendering (-markup.js) should not involve a require() here;`)

const deskSchemasGet = async ( data ) => {

    data.RU.io.deskSchemasScan = await rus.aws.ddbdc.scan ( {
        TableName: 'TEST-APP-DESK-SCHEMAS',
        ReturnConsumedCapacity : 'TOTAL'
    } ).promise()

    switch ( data.RU.request.queryStringParameters.reader[0] ) {
        
        case ( 'machine' ) :
            data.RU.signals.sendJson = data.RU.io.deskSchemasScan 
            break
        case ( 'human' ) :
        default:
            data.RU.signals.sendResponse.body = await markup ( data )
    }

}
module.exports = deskSchemasGet