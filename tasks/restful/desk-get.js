'use strict'

const rus = require('/var/task/modules/r-u-s.js')

// const deskSchemasModel  = require (`/var/task/io/models/desk-schemas.js`)

const deskGet = async(data) => {

    const deskID = data.RU.request.queryStringParameters.thing[0]

    data.RU.io.deskSchemasQuery = await rus.aws.ddbdc.query({
        TableName: 'TEST-APP-DESK-SCHEMAS',
        KeyConditionExpression: 'id = :deskID',
        ExpressionAttributeValues: {
            ':deskID': deskID
        },
        ReturnConsumedCapacity:'TOTAL'
    }).promise()

    // no need to return (data)
}
module.exports = deskGet
