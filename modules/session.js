'use strict'

const mark = require('/var/task/modules/mark.js')
const cookie = require('/var/task/modules/cookie.js')
const conf = require(`/var/task/configuration.js`)

/*  Given any DATA, exerts control over DATA.RU.signals.session;
 *
 */

const session = {

    setFromOidcAccessToken: async DATA => {

        //  set any session cookies;
        await cookie.__HostSet(
            DATA,
            conf.obfuscations.sessionCookieName,
            DATA.RU.signals.oidc.validated.access_token.jti
        )

        //  set internal signals;
        DATA.RU.signals.session = {
            id: DATA.RU.signals.oidc.validated.access_token.jti
        }
    },

    setFromRequestCookie: async DATA => {

        // TODO check and expire client session cookie, if DATABASE says sessions has expired
        console.warn('session.js : expire session cookies')

        //////////
        //      //
        //  !!  //  Make way.
        //      //
        //////////

        //  (no need to) set any session cookies; this is the source;
        //  set internal signals;
        DATA.RU.signals.session = {
            id: DATA.RU.request.headers.cookies[
                '__Host-' + conf.obfuscations.sessionCookieName
            ][0]
        }
    },

    expire: async DATA => {

        //  expire any session cookies;
        await cookie.__HostExpire(DATA, conf.obfuscations.sessionCookieName)

        //  expire internal signals;
        delete DATA.RU.signals.session
    },
}

module.exports = session
mark(`~/modules/session.js LOADED`)
