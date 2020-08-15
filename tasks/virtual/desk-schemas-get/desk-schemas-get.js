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

    console.error(`desk-schemas-get.js : before switch`)

    switch ( data.RU.request.queryStringParameters.reader ) {
        
        case ( 'machine' ) :
            // TODO
            console.error(`desk-schemas-get.js : case machine`)
            data.RU.signals.sendResponse.body = data.RU.io.deskSchemasScan 
            break
        case ( 'human' ) :
            console.error(`desk-schemas-get.js : case human`)
        default:
            console.error(`desk-schemas-get.js : case default`)
            data.RU.signals.sendResponse.body = await markup ( data )
    }

}
module.exports = deskSchemasGet