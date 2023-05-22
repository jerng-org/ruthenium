'use strict'

const rus = require('/var/task/modules/r-u-s.js')

const status404 = require(`/var/task/tasks/status-404.js`)
rus.conf.verbosity > 0 &&
    console.warn(`(desks-get.js) FIXME: rendering an error page should not involve a require() here;`)

const markup = require('/var/task/tasks/virtual/desks-get-markup.js')
rus.conf.verbosity > 0 &&
    console.warn(`(desk-schemas-get.js) FIXME: rendering (-markup.js) should not involve a require() here;`)

// const deskSchemasModel  = require (`/var/task/io/models/desk-schemas.js`)

const desksGet = async (data) => {

    const deskName = data.RU.request.queryStringParameters.thing[0]

    const params = {
        TableName: 'RUTHENIUM-V1-DESK-SCHEMAS',
        Key: {
            name: deskName
        },
        //ReturnConsumedCapacity: 'INDEXES'
    }
    data.RU.io.deskSchemasGet = await rus.aws.ddb.aDynamoDBDocumentClient.send(
        new rus.aws.ddb.GetCommand(params)
    )
    if (!('Item' in data.RU.io.deskSchemasGet)) {
        await status404(data)
        return
    }

    data.RU.io.deskCellsQuery = await rus.aws.ddb.aDynamoDBDocumentClient.send(
        new rus.aws.ddb.QueryCommand({
            TableName: 'TEST-APP-DESK-CELLS',
            IndexName: 'D-GSI',
            KeyConditionExpression: 'D = :deskName',
            ExpressionAttributeValues: { ':deskName': deskName },
            //ReturnConsumedCapacity: 'INDEXES'
        })
    )

    rus.conf.verbosity > 0 &&
        console.warn(`FIXME: (desks-get.js) implement (for-of) with (Promise.allSettled)`)

    data.RU.signals.sendResponse.body = await markup(data)

    // no need to return (data)
}
module.exports = desksGet
