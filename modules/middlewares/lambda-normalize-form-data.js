'use strict'

//  PLEASE CAREFULLY refer to notes 
//  in (lambda-normalize-query-string-parameters.js)

const rus = require ( '/var/task/modules/r-u-s.js' )

const lambdaNormalizeFormData = async ( data ) => {

    if (    data.LAMBDA.event.headers
            &&  (   data.LAMBDA.event.headers['content-type'] 
                    == 'application/x-www-form-urlencoded'
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
            = rus.noquerystring.parse ( data.RU.request.rawFormString )


        console.warn (`GET method forms are not yet supported;`)
    }
    
    return data
}

module.exports  = lambdaNormalizeFormData