'use strict'

const rus = require ( '/var/task/modules/r-u-s.js' )

const markup 
    = require ( '/var/task/tasks/restful/desk-schemas-get/desk-schemas-get-markup.js' )

const deskSchemasGet = async ( data ) => {


        ////////
        //   ////
        //  //  //
        // //    //     Take note:
        ////  !!  //
        ///        //
        //////////////

    // temporary:
    data.RU.signals.noLayout = true

    data.RU.io.deskSchemasScan = await rus.aws.ddbdc.scan ( {
        TableName: 'TEST-APP-DESK-SCHEMAS',
        ReturnConsumedCapacity : 'TOTAL'
    } ).promise()

    switch ( data.RU.request.queryStringParameters.reader ) {
        
        case ( 'machine' ) :
            // TODO
            break
        case ( 'human' ) :
        default:
            data.RU.signals.sendResponse = { body : await markup ( data ) }
    }

}
module.exports = deskSchemasGet