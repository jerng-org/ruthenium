'use strict'

console.warn (`fixme https://html.spec.whatwg.org/#set-of-comma-separated-tokens`)

const rus = require ( '/var/task/modules/r-u-s.js' )

const lambdaNormalizeQueryStringParameters = async ( data ) => {

    if (data.LAMBDA.event.rawQueryString) {
        
        data.RU.request.queryStringParameters = rus.node.querystring.parse ( data.LAMBDA.event.rawQueryString )  
        
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