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

    // Provide ID
    candidate['desk-schemas'].id = await rus.uuid4()

    // Configure DB client parameters
    const params = {

        TableName: 'RUTHENIUM-V1-DESK-SCHEMAS',

        Item: candidate['desk-schemas'],

        ConditionExpression: 'attribute_not_exists(id)',
        //  This checks data already in the DB;
        //  it seems we do not use this for validating data that has yet to
        //  be inserted into the DB.

        ReturnConsumedCapacity: 'TOTAL'

    }

    // Call storage layer
    data.RU.io.put = await rus.aws.ddbdc.put(params).promise()

    rus.conf.versbosity < 1 ||
        console.warn(`ddbdc.put returned:`, data.RU.io.put)

    // View
    data.RU.signals.redirectRoute = 'initial'


    // manipulate (data.RU), for example

    // no need to return (data)

}
module.exports = deskSchemasPost
