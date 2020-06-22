'use strict'

const rus = require ( '/var/task/modules/r-u-s.js' )

const lambdaLoadMetadata = async ( data ) => {
    
    data.RU.metadata = ( 
        
        await rus.aws.ddbdc.get ( {
            TableName:              'TEST-APP-STASH',
            Key:                    { key: 'metadata' },
            ReturnConsumedCapacity: 'TOTAL'
        } ) 
        .promise()
    
    ).Item.value
    
    return data

}
module.exports = lambdaLoadMetadata