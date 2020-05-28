'use strict'

const ddbdc 
    = require ( '/var/task/io/ddbdc.js' )

const patchDeskSchema = async ( data ) => {
    
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#update-property


    data.RU.response.markupName = 'allDeskSchemasMarkup'


    // data.RU.response.markupName = 'allDesksMarkup'

}
module.exports = patchDeskSchema