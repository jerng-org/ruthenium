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
