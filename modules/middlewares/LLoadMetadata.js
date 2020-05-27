'use strict'

const mark      = require ( '/var/task/modules/mark' )            
const DDBDC     = require ( '/var/task/io/DDBDC.js' )

const LLoadMetadata = async ( data ) => {
    
    data.RU.metadata = ( 
        
        await DDBDC.get ( {
            TableName:              'TEST-APP-STASH',
            Key:                    { key: 'metadata' },
            ReturnConsumedCapacity: 'TOTAL'
        } ) 
        .promise()
    
    ).Item.value
    
    return data

}

module.exports = LLoadMetadata
mark ( `LLoadMetadata.js LOADED` )