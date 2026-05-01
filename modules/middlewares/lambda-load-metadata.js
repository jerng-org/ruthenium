import rus from "../../modules/r-u-s.js";

'use strict'

// AWS API Gateway, HTTP APIs, Lambda Integration, Payload Format 2.0
const lambdaLoadMetadata = async ( data ) => {
    
    rus.frameworkDescriptionLogger.callStarts()
    
    data.RU.metadata = ( 
        
        await rus.aws.ddbdc.get ( {
            TableName:              'RUTHENIUM-V1-STASH',
            Key:                    { key: 'metadata' },
            //ReturnConsumedCapacity: 'INDEXES'
        } ) 
        .promise()
    
    ).Item.value
    
    rus.frameworkDescriptionLogger.callEnds()
    
    return data

}

export default lambdaLoadMetadata;
rus.mark('LOADED')