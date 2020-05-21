'use strict'

const mark  = require ( '../modules/mark' )            
const DDBDC = require ( '../io/DDBDC.js' )

const initialTask = async ( data ) => {
    
    data.RU.io.gridSchemasScan = await DDBDC.scan ( {
        TableName: 'TEST-APP-GRID-SCHEMAS',
        ReturnConsumedCapacity : 'TOTAL'
    } ).promise()

    mark( `scan COMPLETED` )

    // no need to return data
    
}
module.exports = initialTask
mark ( `initialTask.js LOADED` )