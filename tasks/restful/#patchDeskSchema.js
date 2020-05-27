'use strict'

const mark      = require ( '/var/task/modules/mark' )            
const DDBDC     = require ( '/var/task/io/DDBDC.js' )

const patchDeskSchema = async ( data ) => {
    
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#update-property

    data.RU.io.gridDesksScan = await DDBDC.update ( {
        TableName: 'TEST-APP-GRID-DeskS',
        Key: {

        },
        
        ReturnConsumedCapacity : 'TOTAL'
    } ).promise()

    data.RU.response.markupName = 'allDeskSchemasMarkup'


    // data.RU.response.markupName = 'allDesksMarkup'

    mark ( `patchDeskSchema.js EXECUTED` )
}

module.exports = patchDeskSchema
mark ( `patchDeskSchema.js LOADED` )