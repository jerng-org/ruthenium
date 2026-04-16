'use strict'

// AWS API Gateway, HTTP APIs, Lambda Integration, Payload Format 2.0

//  PLEASE CAREFULLY refer to notes 
//  in (lambda-normalize-query-string-parameters.js)

const rus = require ( '/var/task/modules/r-u-s.js' )

const lambdaNormalizeFormData = async ( data ) => {
    
    rus.frameworkDescriptionLogger.callStarts()

    const contentTypeKeyString = ( process.env.AWS_SAM_LOCAL === 'true' ? 'Content-Type' : 'content-type' )

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

module.exports  = lambdaNormalizeFormData

rus.mark('LOADED')