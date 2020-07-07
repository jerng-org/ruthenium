'use strict'

const rus = require('/var/task/modules/r-u-s.js')

const sessionGuard = async(data) => {

    /*  Complain if no session cookie is found.
     */

    rus.cookie.__HostExpire(data, rus.conf.obfuscations.sessionCookieName)

    if (!(data.RU.request.headers.cookies &&
            ('__Host-' + rus.conf.obfuscations.sessionCookieName in data.RU.request.headers.cookies))
    ) 
    {
        data.RU.signals.skipToMiddlewareName = 'composeResponse'
    }

    return data
}

module.exports = sessionGuard
rus.mark(`~/modules/middlewares/sessionGuard.js LOADED`)
