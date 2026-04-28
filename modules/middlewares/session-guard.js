import rus from "/var/task/modules/r-u-s.js";

'use strict'
const sessionGuard = async (data) => {

    rus.frameworkDescriptionLogger.callStarts()

    /*  
     *  Complain if no session cookie is found in (request), and no exemption
     *  was granted by (session-exemption.js);
     */

    if (data.RU.signals.sessionExempted ||
        (data.RU.signals.session && data.RU.signals.session.id)) {

        rus.frameworkDescriptionLogger.callEnds()

        return data
    }
    await rus.http.status401(data)
    data.RU.signals.skipToMiddlewareName = 'composeResponse'

    rus.frameworkDescriptionLogger.callEnds()

    return data
}

export default sessionGuard;
rus.mark('LOADED')

//rus.cookie.__HostExpire(data, rus.conf.obfuscations.sessionCookieName)
