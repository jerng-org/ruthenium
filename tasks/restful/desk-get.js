'use strict'

const rus = require('/var/task/modules/r-u-s.js')

const status404 = require(`/var/task/tasks/status-404.js`)
rus.conf.verbosity > 0 &&
    console.warn(`(desk-get.js) FIXME: rendering an error page should not involve a require() here;`)

// const deskSchemasModel  = require (`/var/task/io/models/desk-schemas.js`)

const deskGet = async(data) => {

    const deskID = data.RU.request.queryStringParameters.thing[0]

    data.RU.io.deskSchemasQuery = await rus.aws.ddbdc.query({
        TableName: 'TEST-APP-DESK-SCHEMAS',
        KeyConditionExpression: 'id = :deskID',
        ExpressionAttributeValues: {
            ':deskID': deskID
        },
        ReturnConsumedCapacity: 'TOTAL'
    }).promise()

    if (!data.RU.io.deskSchemasQuery.Items.length) {
        await status404(data)
    }

    // no need to return (data)
}
module.exports = deskGet
