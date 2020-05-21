const copyURLParameters = async ( data ) => {

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
                        
    return data
}

module.exports = copyURLParameters
const mark = require ('../mark')
mark (`copyURLParameters.js LOADED`)