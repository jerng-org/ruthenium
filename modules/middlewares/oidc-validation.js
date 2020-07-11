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

    try {
        data.RU.signals.oidc = await rus.aws.cognito.authorizationCodeFlowJwtValidation(data.LAMBDA.event.queryStringParameters.code)
    }
    catch (e) {
        console.warn(`Middleware (oidc-validation.js) failed, (error):`, e)
    }
    return data
}

module.exports = oidcValidation
rus.mark(`~/modules/middlewares/oidcValidation.js LOADED`)

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
        aud: '', // relyingparty a.k.a. (appID) (access_token.client_id)
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
        client_id: '', // appID a.k.a. (id_token.aud)
        username: '***REMOVED***'
      }
   }
*/
