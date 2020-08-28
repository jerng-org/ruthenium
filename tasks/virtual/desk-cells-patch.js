'use strict'

const rus = require('/var/task/modules/r-u-s.js')

const deskSchemasModel = require(`/var/task/io/models/desk-schemas.js`)

//const status409 = require(`/var/task/tasks/status-409.js`)
//const status400 = require(`/var/task/tasks/status-400.js`)
//const status500 = require(`/var/task/tasks/status-500.js`)

const deskCellsPatch = async(data) => {

    const candidates = data.RU.request.formStringParameters

    console.warn ('(desk-cells-patch.js) form input validation skipped for now; fixme')
    
/*  
    if (!await rus.validateFormData(data, 'desk-schemas')) {
        await status400(data)
        return
    }
*/


/*  NEXT:

-   count incoming cells
-   break into batches of 25
-   validate
-   figure out how to transactionally write multiple batches of 25

*/


/*  homologous code, from copied code, needs to be customised:



    // Configure DB client parameters
    const params = {

        TableName: 'RUTHENIUM-V1-DESK-SCHEMAS',
        Item: candidate['desk-schemas'],
        ExpressionAttributeNames: { '#name': 'name' },
        ConditionExpression: 'attribute_not_exists(#name)',
        ReturnConsumedCapacity: 'TOTAL'

    }

    // Call storage layer

    try {
        data.RU.io.deskSchemasPost = await rus.aws.ddbdc.put(params).promise()
    }
    catch (e) {
        console.error(e)
        switch (e.code) {
            case 'ConditionalCheckFailedException':
                await status409(data)
                return
            default: // do nothing
                await status500(data)
                return
        }
    }
*/

throw 'WIP: desk-cells-patch'

    // View
    data.RU.signals.redirectRoute = 'initial'


    // manipulate (data.RU), for example

    // no need to return (data)
}
module.exports = deskCellsPatch