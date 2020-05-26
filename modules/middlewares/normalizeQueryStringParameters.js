const normalizeQueryStringParameters = async ( data ) => {

    if (data.RU.request.queryStringParameters) {
        for ( const prop in data.RU.request.queryStringParameters ) {
            data.RU.request.queryStringParameters[ prop ] 
                = data.RU.request.queryStringParameters[ prop ].split(',')
        }
        
    }
    return data
}

module.exports = normalizeQueryStringParameters
const mark = require ('../mark')
mark (`normalizeQueryStringParameters.js LOADED`)