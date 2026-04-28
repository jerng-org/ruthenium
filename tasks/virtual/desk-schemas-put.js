import rus from "/var/task/modules/r-u-s.js";

'use strict'
/*  CREATES / UPDATES (CLOBBERS) A DESK-SCHEMA */
import deskSchemasModel from '/var/task/io/models/desk-schemas.js'

const deskSchemasPut = async (data) => {

  if (!await rus.validateFormData(data, 'desk-schemas')) {
    await rus.http.status400(data)
    return
  }

  const candidate = data.RU.request.formStringParameters
  const params = {
    TableName: 'RUTHENIUM-V1-DESK-SCHEMAS',
    Item: candidate['desk-schemas'],
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
      default: // do nothing
        await rus.http.status500(data)
        return
    }
  }

  // View
  data.RU.signals.redirectRoute = 'initial'
}

export default deskSchemasPut;