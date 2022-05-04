'use strict'

const rus = require('/var/task/modules/r-u-s.js')

const status401 = require(`/var/task/tasks/status-401.js`)

const sessionGuard = async(data) => {

    rus.conf.frameworkDescriptionLogger.callStarts()

    /*  
     *  Complain if no session cookie is found in (request), and no exemption
     *  was granted by (session-exemption.js);
     */

    if (data.RU.signals.sessionExempted ||
        (data.RU.signals.session && data.RU.signals.session.id)) {

        return data
    }
    await status401(data)
    data.RU.signals.skipToMiddlewareName = 'composeResponse'
    
    rus.conf.frameworkDescriptionLogger.callEnds()
    
    return data
}

module.exports = sessionGuard
rus.mark(`~/modules/middlewares/sessionGuard.js LOADED`)


//rus.cookie.__HostExpire(data, rus.conf.obfuscations.sessionCookieName)
