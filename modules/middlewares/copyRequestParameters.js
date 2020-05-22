const copyRequestParameters = async ( data ) => {

    data.RU.request.queryStringParameters = 
        data.LAMBDA.event.queryStringParameters
        ?   data.LAMBDA.event.queryStringParameters
        :   {}
    // Values with same key stored as: CSV string

    data.RU.request.rawPath = 
        data.LAMBDA.event.rawPath
        ?   data.LAMBDA.event.rawPath
        :   '/'
    
    data.RU.request.rawQueryString = 
        data.LAMBDA.event.rawQueryString
        ?   data.LAMBDA.event.rawQueryString
        :   ''

    data.RU.request.http = 
        data.LAMBDA.event.requestContext
        ?   (   data.LAMBDA.event.requestContext.http
                ?   data.LAMBDA.event.requestContext.http : {} )
        :   {}
                        
    return data
}

module.exports = copyRequestParameters
const mark = require ('../mark')
mark (`copyRequestParameters.js LOADED`)