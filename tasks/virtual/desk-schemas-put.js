'use strict'

const rus = require('/var/task/modules/r-u-s.js')

const deskSchemasModel = require(`/var/task/io/models/desk-schemas.js`)

const status404 = require(`/var/task/tasks/status-404.js`)
const status400 = require(`/var/task/tasks/status-400.js`)
const status500 = require(`/var/task/tasks/status-500.js`)

const deskSchemasPut = async(data) => {

  const candidate = data.RU.request.formStringParameters

  if (!await rus.validateFormData(data, 'desk-schemas')) {
    await status400(data)
    return
  }

  //  end PROTOTYPICAL data validation process.

  // Configure DB client parameters
  const params = {

    TableName: 'RUTHENIUM-V1-DESK-SCHEMAS',
    Item: candidate['desk-schemas'],
    ExpressionAttributeNames: { '#name': 'name' },
    ConditionExpression: 'attribute_exists(#name)',
    ReturnConsumedCapacity: 'INDEXES'

  }

  // Call storage layer

  try {
    data.RU.io.deskSchemasPut = await rus.aws.ddbdc.put(params).promise()
  }
  catch (e) {
        console.error(e)
        switch (e.code) {
            case 'ConditionalCheckFailedException':
                await status404(data)
                return
            default: // do nothing
                await status500(data)
                return
        }
  }
  
  // View
  data.RU.signals.redirectRoute = 'initial'


  // manipulate (data.RU), for example

  // no need to return (data)

}
module.exports = deskSchemasPut

/*  UPDATES (CLOBBERS) A DESK-SCHEMA */
