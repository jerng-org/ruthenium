'use strict'

const rus = require('/var/task/modules/r-u-s.js')

const setOidcSession = async(data) => {
    
    rus.frameworkDescriptionLogger.callStarts()

    /*  1.
     *  OIDC / Authentication mechanism has priority;
     *
     *  CURRENTLY this only checks for an unexpired id_token;
     *
     *  TODO this SHOULD look for a SCOPE in an unexpired access_token;
     */

    if (data.RU.signals.oidc &&
        data.RU.signals.oidc.validated &&
        data.RU.signals.oidc.validated.access_token) {

        /* 1.1.
         *  Attempt to INVALIDATE SESSION;
         *
         */
        if (data.RU.signals.oidc.validated.access_token.exp < (new Date).getTime() / 1000) {
            // (expiry time) in s since epoch < (current time in ms since epoch) / 1000

            //  set any session cookies;
            //  set internal signals;
            await rus.oidcSession.expireSession(data)
            return data
        }

        /*  1.2.
         *  Attempt to create VALID SESSION;
         * 
         *  CURRENTLY this sets the access_token's JTI, but it could 
         * 
         * 
         */
         
        //  set any session cookies;
        //  set internal signals;
        await rus.oidcSession.setSessionFromOidcAccessToken(data)

    //////////
    //      //
    //  !!  //  Make way. WIP HERE
    //      //
    //////////

    }

    else // If no valid OIDC (access_token) is found, then 

        /*  2.
         *  HTTP Request > Header > Cookie > Session
         *
         *      If any is found, check it against DATABASE not OIDC or other
         *      authentication mechanism;
         *
         *
         */

        if (data.RU.request.headers.cookies &&
            data.RU.request.headers.cookies['__Host-'+rus.conf.obfuscations.sessionCookieName]) {

            //  set any session cookies;
            //  set internal signals;
            await rus.oidcSession.setSessionFromRequestCookie(data)
        }

    rus.frameworkDescriptionLogger.callEnds()
    
    return data
}

module.exports = setOidcSession

rus.mark('LOADED')