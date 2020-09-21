'use strict'

// AWS API Gateway, HTTP APIs, Lambda Integration, Payload Format 2.0

const rus = require ( '/var/task/modules/r-u-s.js' )

const lambdaLoadMetadata = async ( data ) => {
    
    data.RU.metadata = ( 
        
        await rus.aws.ddbdc.get ( {
            TableName:              'TEST-APP-STASH',
            Key:                    { key: 'metadata' },
            ReturnConsumedCapacity: 'INDEXES'
        } ) 
        .promise()
    
    ).Item.value
    
    return data

}
module.exports = lambdaLoadMetadata