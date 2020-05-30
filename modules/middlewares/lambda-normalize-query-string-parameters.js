'use strict'

const querystring   = require ( 'querystring' )

const lambdaNormalizeQueryStringParameters = async ( data ) => {

    if (data.LAMBDA.event.rawQueryString) {
        
        data.RU.request.queryStringParameters = querystring.parse ( data.LAMBDA.event.rawQueryString )  
        
        for ( const prop in data.RU.request.queryStringParameters ) {
            

            if ( typeof data.RU.request.queryStringParameters[ prop ] == 'string' ) {
                data.RU.request.queryStringParameters[ prop ] 
                    =   [ 
                            data.RU.request.queryStringParameters[ prop ] 
                        ]
            }
            
        }
        
    }
    return data
}
module.exports = lambdaNormalizeQueryStringParameters