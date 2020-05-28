'use strict'

const mark      = require ( '/var/task/modules/mark' )            
const ddbc     = require ( '/var/task/io/ddbdc.js' )

const lambdaLoadMetadata = async ( data ) => {
    
    data.RU.metadata = ( 
        
        await ddbc.get ( {
            TableName:              'TEST-APP-STASH',
            Key:                    { key: 'metadata' },
            ReturnConsumedCapacity: 'TOTAL'
        } ) 
        .promise()
    
    ).Item.value
    
    return data

}
module.exports = lambdaLoadMetadata