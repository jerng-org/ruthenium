'use strict'

const rus = require('/var/task/modules/r-u-s.js')

const sessionExemption = async(data) => {

    if (data.RU.request.queryStringParameters.route &&
        data.RU.request.queryStringParameters.route[0] &&
        rus.conf.sessionExemptedRoutes.strings.includes ( 
            data.RU.request.queryStringParameters.route[0]
        ) && 
        
        ) {

    }

    //  employ this:         data.RU.signals.skipToMiddlewareName = 'composeResponse'
    //  ... mechanism;

    //////////
    //      //
    //  !!  //  Make way.
    //      //
    //////////

    return data
}

module.exports = sessionExemption
rus.mark(`~/modules/middlewares/sessionExemption.js LOADED`)
