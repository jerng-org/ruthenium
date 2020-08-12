'use strict'

const initial = async ( data ) => {

    data.RU.signals.redirectRoute = 'virtual&type=desk-schemas&reader=human'
    
    if ( 'message' in data.RU.request.queryStringParameters ) {
        data.RU.signals.redirectRoute += `&message=(via initial.js)${data.RU.request.queryStringParameters.message}`
    }
    
    // no need to return data
    
}
module.exports = initial