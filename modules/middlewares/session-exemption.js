'use strict'

const rus = require('/var/task/modules/r-u-s.js')

/*  This middleware checks the (route) query parameter, and compares it to
 *  configuration; if (routeValue) is included in (the array of 
 *  sessionExemptedRouteStrings) of matched by at least one of (the array of
 *  sessionExemptedRouteRegExps), then (signals.sessionExepted) is set to (true)
 *  and (signals.skipToMiddlewareName) is specified as 'sessionGuard';
 *
 */

const sessionExemption = async(data) => {

    if (data.RU.request.queryStringParameters.route &&
        data.RU.request.queryStringParameters.route[0] &&
        (rus.conf.sessionExemptedRoutes.strings.includes(
                data.RU.request.queryStringParameters.route[0]
            ) ||
            rus.conf.sessionExemptedRoutes.regExps.some(
                re => re.test(data.RU.request.queryStringParameters.route[0])
            )

        )) {
            
        
        data.RU.signals.sessionExempted = true
        data.RU.signals.skipToMiddlewareName = 'sessionGuard'
    }

    return data
}

module.exports = sessionExemption
rus.mark(`~/modules/middlewares/sessionExemption.js LOADED`)
