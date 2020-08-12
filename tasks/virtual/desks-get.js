'use strict'

const rus = require('/var/task/modules/r-u-s.js')

const status404 = require(`/var/task/tasks/status-404.js`)
rus.conf.verbosity > 0 &&
    console.warn(`(desk-get.js) FIXME: rendering an error page should not involve a require() here;`)

const markup = require('/var/task/tasks/restful/desks-get-markup.js')
rus.conf.verbosity > 0 &&
    console.warn(`(desk-schemas-get.js) FIXME: rendering (-markup.js) should not involve a require() here;`)

// const deskSchemasModel  = require (`/var/task/io/models/desk-schemas.js`)

const deskGet = async(data) => {

    const deskID = data.RU.request.queryStringParameters.thing[0]

    data.RU.io.deskSchemasQuery = await rus.aws.ddbdc.query({
        TableName: 'TEST-APP-DESK-SCHEMAS',
        KeyConditionExpression: 'id = :deskID',
        ExpressionAttributeValues: { ':deskID': deskID },
        Limit: 1,
        ReturnConsumedCapacity: 'TOTAL'
    }).promise()

    if (!data.RU.io.deskSchemasQuery.Items.length) {
        await status404(data)
        return
    }

    const deskName = data.RU.io.deskSchemasQuery.Items[0].name

    data.RU.io.deskCellsQuery = await rus.aws.ddbdc.query({
        TableName: 'TEST-APP-DESK-CELLS',
        IndexName: 'D-GSI',
        KeyConditionExpression: 'D = :deskName',
        ExpressionAttributeValues: { ':deskName': deskName },
        ReturnConsumedCapacity: 'TOTAL'
    }).promise()
    
    rus.conf.verbosity > 0
    && console.warn(`FIXME: (desks-get.js) implement (for-of) with (Promise.allSettled)`)

    data.RU.signals.sendResponse.body = await markup(data)

    // no need to return (data)
}
module.exports = deskGet
