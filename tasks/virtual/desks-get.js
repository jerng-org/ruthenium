import rus from "../../modules/r-u-s.js";
import markup from "../../tasks/virtual/desks-get-markup.js";

'use strict'
rus.frameworkDescriptionLogger.fixme(`rendering (-markup.js) should not involve a require() here;`)

const desksGet = async (data) => {

    const deskName = data.RU.request.queryStringParameters['desk-schema-name'][0]

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
        await rus.http.status404(data)
        return
    }

    data.RU.io.deskCellsQuery = await rus.aws.ddb.aDynamoDBDocumentClient.send(
        new rus.aws.ddb.QueryCommand({
            TableName: 'RUTHENIUM-V1-DESK-CELLS',
            IndexName: 'D-GSI',
            KeyConditionExpression: 'D = :deskName',
            ExpressionAttributeValues: { ':deskName': deskName },
            //ReturnConsumedCapacity: 'INDEXES'
        })
    )

    rus.frameworkDescriptionLogger.fixme(`implement (for-of) with (Promise.allSettled)`)

    data.RU.signals.sendResponse.body = await markup(data)

    // no need to return (data)
}

export default desksGet;
