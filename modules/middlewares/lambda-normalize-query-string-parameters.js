'use strict'

const querystring   = require ( 'querystring' )

const lambdaNormalizeQueryStringParameters = async ( data ) => {

    if (data.RU.request.queryStringParameters) {
        
        data.RU.parsedQuerystring = querystring.parse( data.LAMBDA.event.rawQuery )
        
        for ( const prop in data.RU.request.queryStringParameters ) {
            data.RU.request.queryStringParameters[ prop ] 
                =   [ 
                        data.RU.request.queryStringParameters[ prop ] 
                    ]
        }
        
    }
    return data
}
module.exports = lambdaNormalizeQueryStringParameters