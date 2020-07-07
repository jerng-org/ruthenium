'use strict'

const rus = require('/var/task/modules/r-u-s.js')

const setSession = async(data) => {

    /*  1.
     *  OIDC / Authentication mechanism has priority;
     *
     *  CURRENTLY this only checks for an unexpired id_token;
     *
     *  TODO this SHOULD look for a SCOPE in an unexpired access_token;
     */
    data.RU.signals.TAG_SET_SESSION_0 = true

    if (data.RU.signals.oidc &&
        data.RU.signals.oidc.validated &&
        data.RU.signals.oidc.validated.access_token) {

        data.RU.signals.TAG_SET_SESSION_1 = true

        /* 1.1.
         *  Attempt to INVALIDATE SESSION;
         *
         */
        if (data.RU.signals.oidc.validated.access_token.exp < (new Date).getTime() / 1000) {
            // (expiry time) in s since epoch < (current time in ms since epoch) / 1000

            data.RU.signals.TAG_SET_SESSION_2 = true

            await rus.session.expire(data)
            return data
        }

        data.RU.signals.TAG_SET_SESSION_3 = true

        /*  1.2.
         *  Attempt to create VALID SESSION;
         * 
         *  CURRENTLY this sets the access_token's JTI, but it could 
         * 
         * 
         */
        await rus.cookie.__HostSet(
            data,
            rus.conf.obfuscations.sessionCookieName,
            data.RU.signals.oidc.validated.access_token.jti
        )
        
        data.RU.signals.TAG_check_jti = data.RU.signals.oidc.validated.access_token.jti
        data.RU.signals.TAG_check_cookie = await rus.print.stringify4 ( data.RU.signals.sendResponse.setCookies)

    //////////
    //      //
    //  !!  //  Make way. WIP HERE
    //      //
    //////////


    }

    else // If none is found, then 

        /*  2.
         *  HTTP Request > Header > Cookie > Session
         *
         *      If any is found, check it against DATABASE not OIDC or other
         *      authentication mechanism;
         *
         *
         */

        if (data.RU.request.headers.cookies &&
            data.RU.request.headers.cookies[rus.conf.obfuscations.sessionCookieName]) {
            const candidateSessionId = data.RU.request.headers.cookies[rus.conf.obfuscations.sessionCookieName]

            data.RU.signals.TAG_SET_SESSION_4 = true

            // TODO check and kill
        }

    data.RU.signals.TAG_SET_SESSION_5 = true

    return data
}

module.exports = setSession
rus.mark(`~/modules/middlewares/setSessions.js LOADED`)

/* SAMPLE:

data.RU.signals.

   oidc: {
      id_token: {
        at_hash: 'MAz4_Zin9kVmNJX8f0HGGw', // hash of id_token
        sub: '***REMOVED***', // subject
        'cognito:groups': [ 'TEST-GROUP' ],
        email_verified: true,
        'cognito:preferred_role': 'arn:aws:iam::***REMOVED***:role/***REMOVED***',
        iss: '***REMOVED***',
        'cognito:username': '***REMOVED***',
        'cognito:roles': [
          'arn:aws:iam::***REMOVED***:role/***REMOVED***'
        ],
        aud: '', // relyingparty a.k.a. appID
        token_use: 'id',
        auth_time: 1594072214,
        exp: ,
        iat: 1594072214,
        email: '***REMOVED***'
      },
      access_token: {
        sub: '***REMOVED***',// subject
        'cognito:groups': [ 'TEST-GROUP' ],
        token_use: 'access',
        scope: 'aws.cognito.signin.user.admin openid',
        auth_time: 1594072214,
        iss: '***REMOVED***',
        exp: 1594075814,
        iat: 1594072214,
        version: 2,
        jti: '1830597d-346c-42fc-b5af-cd827f192c44', // token ID
        client_id: '***REMOVED***',
        username: '***REMOVED***'
      }
   }
*/
