import rus from "../../modules/r-u-s.js";

'use strict'

// AWS API Gateway, HTTP APIs, Lambda Integration, Payload Format 2.0

//  PLEASE CAREFULLY refer to notes 
//  in (lambda-normalize-query-string-parameters.js)
const lambdaNormalizeFormData = async ( data ) => {
    
    rus.frameworkDescriptionLogger.callStarts()

    const contentTypeKeyString = ( rus.conf.platform.lambdaService == 'AWS_SAM' ? 'Content-Type' : 'content-type' )

    if (    data.LAMBDA.event.headers
            &&  
            ( contentTypeKeyString in data.LAMBDA.event.headers )
            &&
            (   data.LAMBDA.event.headers[contentTypeKeyString]
                        .toLowerCase()
                        .indexOf( 
                            'application/x-www-form-urlencoded'
                        )  >= 0
            )
    )
    {
        data.RU.request.rawFormString =
            data.LAMBDA.event.isBase64Encoded
            ?   Buffer
                    .from ( data.LAMBDA.event.body, 'base64' )
                    .toString ('utf8')
            :   data.LAMBDA.event.body

        // NEW
        data.RU.request.formStringParameters
            = rus.node.querystring.parse ( data.RU.request.rawFormString )

    }
    rus.frameworkDescriptionLogger.callEnds()
    
    return data
}

export default lambdaNormalizeFormData;
rus.mark('LOADED')