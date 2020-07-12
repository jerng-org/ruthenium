'use strict'

const rus = require('/var/task/modules/r-u-s.js')

/*  Roughly, this middleware tries to ...
 *
 *  validate                   (data.RU.queryStringParameters.code) ...
 *  
 *      ... by calling          (rus.aws.cognito)
 *
 *          ... which calls     (~/io/cognito-oidc-relying-party.js)
 *
 *  THEN, it stores the keys (id_token) and (access_token) in (data.RU.signals.)
 *
 *
 */

const oidcValidation = async(data) => {

    if (data.LAMBDA.event.queryStringParameters.code) {
        try {
            data.RU.signals.oidc = await rus.aws.cognito.authorizationCodeFlowJwtValidation(data.LAMBDA.event.queryStringParameters.code)
        }
        catch (e) {
            console.warn(`Middleware (oidc-validation.js) failed, (error):`, e)
        }
    }
    return data
}

module.exports = oidcValidation
rus.mark(`~/modules/middlewares/oidcValidation.js LOADED`)

/* SAMPLE:

WHAT ARE THESE ATTRIBUTES? : https://medium.com/@darutk/understanding-id-token-5f83f50fa02e

data.RU.signals.oidc.validated  .id_token
                                .access_token

id.iss
id.exp
id.'cognito:groups'
id.'cognito:username' 
    //  Cognito makes this equal to: 
    //      id.sub, 
    //      access.sub, 
    //      access.username
id.'cognito:roles'
id.email
id.email_verified
id.aud 
    // OIDC requires this to equal: access.client_id

access.scope
access.jti
access.version
    // not sure if this refers to OAuth2, or some AWS API version

*/
