'use strict'

const rus = require('/var/task/modules/r-u-s.js')

const deskSchemasModel = require(`/var/task/io/models/desk-schemas.js`)

const status422 = require(`/var/task/tasks/status-422.js`)

const deskSchemasPut = async(data) => {

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

    ConditionExpression: 'attribute_exists(id)',

    ReturnConsumedCapacity: 'TOTAL'

  }

  // Call storage layer
  data.RU.io.deskSchemasPut = await rus.aws.ddbdc.put(params).promise()

  // View
  data.RU.signals.redirectRoute = 'initial'


  // manipulate (data.RU), for example

  // no need to return (data)

}
module.exports = deskSchemasPut

/*  UPDATES (CLOBBERS) A DESK-SCHEMA */