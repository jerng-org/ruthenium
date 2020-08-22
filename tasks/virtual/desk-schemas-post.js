'use strict'

const rus = require('/var/task/modules/r-u-s.js')

const deskSchemasModel = require(`/var/task/io/models/desk-schemas.js`)

const status422 = require(`/var/task/tasks/status-422.js`)

const deskSchemasPost = async(data) => {

    const candidate = data.RU.request.formStringParameters

    if (!await rus.validateFormData(data, 'desk-schemas')) {
        await status422(data)
        return
    }

    //  end PROTOTYPICAL data validation process.

    // Configure DB client parameters
    const params = {

        TableName: 'RUTHENIUM-V1-DESK-SCHEMAS',

        Item: candidate['desk-schemas'],

        ConditionExpression: 'attribute_not_exists(id)',
        
        ReturnValues: '',

        ReturnConsumedCapacity: 'TOTAL'

    }

    // Call storage layer

    data.RU.io.deskSchemasPost = await rus.aws.ddbdc.put(params).promise()

    console.error('data.RU.io.deskSchemasPost',data.RU.io.deskSchemasPost)

    rus.conf.versbosity > 0 &&
        console.warn(`(desk-schemas-post.js) PROTOCOL: the HTTP POST method more accurately corresponds to the DynamoDB operation (updateItem) than (putItem) which is used here.`)

    // View
    data.RU.signals.redirectRoute = 'initial'


    // manipulate (data.RU), for example

    // no need to return (data)

}
module.exports = deskSchemasPost
