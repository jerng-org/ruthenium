const getHeaders = async ( data ) => {

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

    return data
}

module.exports = getHeaders
const mark = require ('../mark')
mark (`getHeaders.js LOADED`)