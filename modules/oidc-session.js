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

//////////
//      //
//  !!  //  Make way. WIP HERE
//      //
//////////

const setSessionIdWithPersistence = async(validated) => {

    //  Consistency checks
    //
    //  id.iss
    //  id.exp
    //      //  Cognito makes this equal to:
    //      //      access.exp
    //  id.'cognito:groups'
    //  id.'cognito:username' 
    //      //  Cognito makes this equal to: 
    //      //      id.sub, 
    //      //      access.sub, 
    //      //      access.username
    //  id.'cognito:roles'
    //  id.email_verified
    //      
    //  access.scope
    //  access.jti
    //  access.version
    //      // not sure if this refers to OAuth2, or some AWS API versio            
    //  access.client_id
    //      // OIDC requires this to equal: id.aud
    //
    if (validated.id_token.sub != validated.id_token['cognito:username'] ||
        validated.id_token.sub != validated.access_token.sub ||
        validated.id_token.sub != validated.access_token.username ||
        validated.id_token.aud != validated.access_token.client_id ||
        validated.id_token.exp != validated.access_token.exp
    ) {
        console.error(`(oidc-session.js) (setSessionIdWithPersistence) (validated)`, validated)
        throw Error(`input data did not pass consistency checks;`)
    }

    // Configure DB client parameters
    const params = {

        TableName: conf.platform.dynamoDB.sessions.tableName,

        Item: {
            ['cognitoUsername']: validated.id_token['cognito:username'],
            ['cognitoGroups']: validated.id_token['cognito:groups'],
            ['cognitoRoles']: validated.id_token['cognito:roles'],
            iss: validated.id_token.iss,
            exp: validated.id_token.exp,
            email_verified: validated.id_token.email_verified,
            access_token: {
                jti: validated.access_token.jti, // JWT ID
                version: validated.access_token.version, // TODO Figure out what this is
                scope: validated.access_token.scope,
                client_id: validated.access_token.client_id,
            }
        },

        ConditionExpression: `attribute_not_exists(${conf.platform.dynamoDB.sessions.primaryKey})`,
        //  This checks data already in the DB;
        //  it seems we do not use this for validating data that has yet to
        //  be inserted into the DB.

    }

    // Call storage layer
    const WIP = await ddbdc.put(params).promise()
    console.warn(`(oidc-session.js) stuff this into (data.RU.io.dynamoDB`)
}

const setSessionFromOidcAccessToken = async DATA => {

    //  set any session cookies;
    await cookie.__HostSet(
        DATA,
        conf.obfuscations.sessionCookieName,
        DATA.RU.signals.oidc.validated.access_token.jti
    )

    //  set internal signals;
    const _id = DATA.RU.signals.oidc.validated.access_token.jti
    await setSessionIdInSignals(DATA, _id)
    await setSessionIdWithPersistence(DATA.RU.signals.oidc.validated)
}

const setSessionFromRequestCookie = async DATA => {

    // TODO check and expire client session cookie, if DATABASE says sessions has expired
    console.warn('session.js : expire session cookies')

    const params = {
        TableName: 'TEST-APP-SESSIONS',
        Key: {
            [conf.platform.dynamoDB.sessions
                .tableName
            ]: DATA.RU.request.headers.cookies['__Host-' +
                conf.obfuscations.sessionCookieName]
        }
    }
    console.log(`params`,params)
    DATA.RU.io.sessionsGet = await ddbdc.get(params).promise()









    //  (no need to) set any session cookies; this is the source;

    //  set internal signals;
    const _id = DATA.RU.request.headers.cookies[
        '__Host-' + conf.obfuscations.sessionCookieName
    ][0]
    await setSessionIdInSignals(DATA, _id)
}

const expireSession = async DATA => {

    //  expire any session cookies;
    await cookie.__HostExpire(DATA, conf.obfuscations.sessionCookieName)

    //  expire internal signals;
    delete DATA.RU.signals.session
}

const oidcSession = {

    setSessionFromOidcAccessToken: setSessionFromOidcAccessToken,

    setSessionFromRequestCookie: setSessionFromRequestCookie,

    expireSession: expireSession,
}

module.exports = oidcSession
mark(`~/modules/oidcSession.js LOADED`)
