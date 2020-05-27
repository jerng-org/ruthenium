const LCopyRequestParameters = async ( data ) => {

    // Maybe move this to firstGuard or something like that - its own .js
    if (! data.LAMBDA.event.requestContext ) {
        console.warn (`Are you in the Test Environment? This does not look like a HTTP request event.`)
        return data
    }

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

module.exports = LCopyRequestParameters
const mark = require ('../mark')
mark (`LCopyRequestParameters.js LOADED`)