'use strict'

const mark      = require ( '/var/task/modules/mark' )            
const DDBDC     = require ( '/var/task/io/DDBDC.js' )

const patchSchemaTask = async ( data ) => {
    
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#update-property

    data.RU.io.gridSchemasScan = await DDBDC.update ( {
        TableName: 'TEST-APP-GRID-SCHEMAS',
        Key: {

        },
        
        ReturnConsumedCapacity : 'TOTAL'
    } ).promise()

    data.RU.response.markupName = 'allSchemasMarkup'


    // data.RU.response.markupName = 'allSchemasMarkup'

    mark ( `patchSchema.js EXECUTED` )
}

module.exports = patchSchemaTask
mark ( `patchSchema.js LOADED` )