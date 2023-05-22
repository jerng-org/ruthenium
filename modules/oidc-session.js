'use strict'

const rusMinus1 = require('/var/task/modules/r-u-s-minus-one.js')
const mark = require('/var/task/modules/mark.js')
const cookie = require('/var/task/modules/cookie.js')
const conf = require(`/var/task/configuration.js`)
const { aDynamoDBDocumentClient, GetCommand, PutCommand } = require('/var/task/io/ddb.js')

/*  Given any DATA, exerts control over DATA.RU.signals.session;
 *
 */

const setSessionIdInSignals = async (DATA, id) => {

    //mark(`oidc-session.js: setSessionIdInSignals: begin`)

    rusMinus1.frameworkDescriptionLogger.callStarts()

    DATA.RU.signals.session = { id: id }

    rusMinus1.frameworkDescriptionLogger.callEnds()

    //mark(`oidc-session.js: setSessionIdInSignals: end`)
}

//////////
//      //
//  !!  //  Make way. WIP HERE
//      //
//////////

const setSessionIdWithPersistence = async (validated) => {

    rusMinus1.frameworkDescriptionLogger.callStarts()

    //mark(`oidc-session.js: setSessionIdWithPersistence: begin`)

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
        validated.id_token.aud != validated.access_token.client_id
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
            exp: validated.access_token.exp,
            email_verified: validated.id_token.email_verified,
            access_token: {
                jti: validated.access_token.jti, // JWT ID
                version: validated.access_token.version, // TODO Figure out what this is
                scope: validated.access_token.scope,
                client_id: validated.access_token.client_id,
            }
        },

        //ConditionExpression: `attribute_not_exists(${conf.platform.dynamoDB.sessions.primaryKey})`,
        //
        //      Wihout this expression, we clobber any previous session in DynamoDB
        //
        //      This checks data already in the DB;
        //      it seems we do not use this for validating data that has yet to
        //      be inserted into the DB.

    }

    // Call storage layer
    const WIP = await aDynamoDBDocumentClient.send(
        new PutCommand(params)
    )
    console.warn(`(oidc-session.js) stuff this into (data.RU.io.dynamoDB`)

    //mark(`oidc-session.js: setSessionIdWithPersistence: end`)

    rusMinus1.frameworkDescriptionLogger.callEnds()

}

const setSessionFromOidcAccessToken = async DATA => {

    rusMinus1.frameworkDescriptionLogger.callStarts()

    //mark(`oidc-session.js: setSessionFromOidcAccessToken: begin`)

    //  set any session cookies;
    await cookie.__HostSet(
        DATA,
        conf.obfuscations.sessionCookieName,
        DATA.RU.signals.oidc.validated.access_token.sub, {
            ['Max-Age']: DATA.RU.signals.oidc.validated.access_token.exp - (new Date().getTime() / 1000)
        }
    )

    //  set internal signals;
    const _id = DATA.RU.signals.oidc.validated.access_token.sub
    await setSessionIdInSignals(DATA, _id)
    await setSessionIdWithPersistence(DATA.RU.signals.oidc.validated)

    //mark(`oidc-session.js: setSessionFromOidcAccessToken: end`)

    rusMinus1.frameworkDescriptionLogger.callEnds()
}

const setSessionFromRequestCookie = async DATA => {

    rusMinus1.frameworkDescriptionLogger.callStarts()

    //mark(`oidc-session.js: setSessionFromRequestCookie: begin`)

    // DynamoDB table is currently set with TTL configuration to expire the 
    //  the object at the time specified by (access_token.exp)

    const params = {
        TableName: 'TEST-APP-SESSIONS',
        Key: {
            [conf.platform.dynamoDB.sessions
                .primaryKey
            ]: DATA.RU.request.headers.cookies['__Host-' +
                conf.obfuscations.sessionCookieName][0]
        },
        //ReturnConsumedCapacity: 'INDEXES'
    }

    mark(`oidc-session.js: hotspot: begin1`)

    DATA.RU.io.sessionsGet = await aDynamoDBDocumentClient.send(
        new GetCommand(params)
    )

    mark(`oidc-session.js: hotspot: end1`)

    if (DATA.RU.io.sessionsGet.Item) {
        //  (no need to) set any session cookies; this is the source;

        //  set internal signals;
        const _id = DATA.RU.request.headers.cookies[
            '__Host-' + conf.obfuscations.sessionCookieName
        ][0]

        await setSessionIdInSignals(DATA, _id)
    }
    else {
        await expireSession(DATA)
    }

    //mark(`oidc-session.js: setSessionFromRequestCookie: end`)

    rusMinus1.frameworkDescriptionLogger.callEnds()
}

const expireSession = async DATA => {

    rusMinus1.frameworkDescriptionLogger.callStarts()

    //mark(`oidc-session.js: expireSession: begin`)

    //  expire any session cookies;
    await cookie.__HostExpire(DATA, conf.obfuscations.sessionCookieName)

    //  expire internal signals;
    delete DATA.RU.signals.session

    //mark(`oidc-session.js: expireSession: end`)
    rusMinus1.frameworkDescriptionLogger.callEnds()

}

const oidcSession = {

    setSessionFromOidcAccessToken: setSessionFromOidcAccessToken,

    setSessionFromRequestCookie: setSessionFromRequestCookie,

    expireSession: expireSession,
}

module.exports = oidcSession
mark(`~/modules/oidc-session.js LOADED`)
