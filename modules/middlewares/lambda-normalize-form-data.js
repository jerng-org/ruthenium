const querystring   = require ( 'querystring' )

const lambdaNormalizeHeadersFormData = async ( data ) => {

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
            
        const parsedRawFormString
            = querystring.parse ( data.RU.request.rawFormString )
        
        // WIP
        data.RU.parsedRawFormString = parsedRawFormString
        // END WIP
        
        data.RU.request.formStringParameters = {}
        
        for ( const name in parsedRawFormString ) {
            data.RU.request.formStringParameters[ name ] 
                = parsedRawFormString[ name ].split(',')
        }

    }
    
    return data
}

module.exports  = lambdaNormalizeHeadersFormData