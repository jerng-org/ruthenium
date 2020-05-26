const normalizeQueryStringParameters = async ( data ) => {

    if (data.RU.request.queryStringParameters) {
        for ( const prop in data.RU.request.queryStringParameters ) {
            data.RU.request.queryStringParameters[ prop ] 
                = data.RU.request.queryStringParameters[ prop ].split(',')
        }
        /*.forEach (
            
            nameValue => {
                
                let position
                if ( 1 > ( position = nameValue.indexOf ('=') ) ) {
                    return // where '=' is not found, -1, or in 0th position
                }
                else
                {
                    
                    const name  = nameValue.slice ( 0 , position )
                    const value = nameValue.slice ( 1 + position )
                    
                    if ( ! data.RU.request.headers.cookies ) {
                        data.RU.request.headers.cookies = {}
                    }
                    
                    if ( ! data.RU.request.headers.cookies[ name ] ) {
                        data.RU.request.headers.cookies[ name ] = []
                    }
                    
                    data.RU.request.headers.cookies[ name ].push ( value )
                    // Values with same key stored as: Array of values
                    
                }
            }
        )*/
    }
/*
    if (data.LAMBDA.event.headers) {
        data.RU.request.headers = data.LAMBDA.event.headers
        
        if ( data.LAMBDA.event.cookies ) {
            data.LAMBDA.event.cookies.forEach (
                
                nameValue => {
                    
                    let position
                    if ( 1 > ( position = nameValue.indexOf ('=') ) ) {
                        return // where '=' is not found, -1, or in 0th position
                    }
                    else
                    {
                        
                        const name  = nameValue.slice ( 0 , position )
                        const value = nameValue.slice ( 1 + position )
                        
                        if ( ! data.RU.request.headers.cookies ) {
                            data.RU.request.headers.cookies = {}
                        }
                        
                        if ( ! data.RU.request.headers.cookies[ name ] ) {
                            data.RU.request.headers.cookies[ name ] = []
                        }
                        
                        data.RU.request.headers.cookies[ name ].push ( value )
                        // Values with same key stored as: Array of values
                        
                    }
                }
            )
        }
    }
*/
    return data
}

module.exports = normalizeQueryStringParameters
const mark = require ('../mark')
mark (`normalizeQueryStringParameters.js LOADED`)