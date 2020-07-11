'use strict'

const mark = require('/var/task/modules/mark.js')
const cookie = require('/var/task/modules/cookie.js')
const conf = require(`/var/task/configuration.js`)
const ddbdc = require('/var/task/io/ddbdc.js')

/*  Given any DATA, exerts control over DATA.RU.signals.session;
 *
 */

const setSessionIdInSignals = async(DATA, id) => {
    DATA.RU.signals.session = { id: id }
}

const setSessionIdWithPersistence = async(id) => {
    // Configure DB client parameters
    const params = {
        
        TableName: 'WIP',
        
        Item: {},            
        
        ConditionExpression : 'attribute_not_exists(id)',
          //  This checks data already in the DB;
          //  it seems we do not use this for validating data that has yet to
          //  be inserted into the DB.

    }

    // Call storage layer
    const WIP = await ddbdc.put ( params ).promise()

}
const oidcSession = {

    setFromOidcAccessToken: async DATA => {

        //  set any session cookies;
        await cookie.__HostSet(
            DATA,
            conf.obfuscations.sessionCookieName,
            DATA.RU.signals.oidc.validated.access_token.jti
        )

        //  set internal signals;
        const _id = DATA.RU.signals.oidc.validated.access_token.jti
        await setSessionIdInSignals(DATA, _id)
        await setSessionIdWithPersistence(_id)
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
        const _id = DATA.RU.request.headers.cookies[
            '__Host-' + conf.obfuscations.sessionCookieName
        ][0]
        await setSessionIdInSignals(DATA, _id)
        await setSessionIdWithPersistence(_id)
    },

    expire: async DATA => {

        //  expire any session cookies;
        await cookie.__HostExpire(DATA, conf.obfuscations.sessionCookieName)

        //  expire internal signals;
        delete DATA.RU.signals.session
    },
}

module.exports = oidcSession
mark(`~/modules/oidcSession.js LOADED`)
