'use strict'

const rus = require('/var/task/modules/r-u-s.js')

// const deskSchemasModel  = require (`/var/task/io/models/desk-schemas.js`)

const deskGet = async(data) => {

    const deskName = data.RU.request.queryStringParameters.thing[0]

    data.RU.io.deskSchemasGet = await rus.aws.ddbdc.get ( {
        TableName: 'TEST-APP-DESK-SCHEMAS',
        Key:{ name:deskName }
    } ).promise()
    
    // no need to return (data)
}
module.exports = deskGet