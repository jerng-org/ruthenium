'use strict'

const rus = require('/var/task/modules/r-u-s.js')

const deskSchemasModel = require(`/var/task/io/models/desk-schemas.js`)

const deskSchemasPut = async (data) => {

  const candidate = data.RU.request.formStringParameters

  if (!await rus.validateFormData(data, 'desk-schemas')) {
    await rus.http.status400(data)
    return
  }

  //  end PROTOTYPICAL data validation process.

  // Configure DB client parameters
  const params = {

    TableName: 'RUTHENIUM-V1-DESK-SCHEMAS',
    Item: candidate['desk-schemas'],
    ExpressionAttributeNames: { '#name': 'name' },
    ConditionExpression: 'attribute_exists(#name)',
    //ReturnConsumedCapacity: 'INDEXES'

  }

  // Call storage layer

  try {
    data.RU.io.deskSchemasPut = await rus.aws.ddb.aDynamoDBDocumentClient.send(
      new rus.aws.ddb.PutCommand(params)
    )
  }
  catch (e) {
    console.error(e)
    switch (e.code) {
      case 'ConditionalCheckFailedException':
        await rus.http.status404(data)
        return
      default: // do nothing
        await rus.http.status500(data)
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
