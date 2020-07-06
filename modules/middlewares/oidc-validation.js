'use strict'

const rus = require('/var/task/modules/r-u-s.js')

/*  Roughly, this middleware tries to ...
 *
 *  validate                (data.RU.queryStringParameters.code) ...
 *  
 *  ... by calling          (rus.aws.cognito)
 *
 *      ... which calls     (~/io/cognito.js)
 *
 *          ... which calls (~/io/oidc-relying-party.js);
 *
 *
 *
 */

const oidcValidation = async(data) => {

    try {
        const debug = await rus.aws.cognito.authorizationCodeFlowJwtValidation(data.LAMBDA.event.queryStringParameters.code)
        // THROWS EXCEPTION ON FAILURE
    }
    catch (e) {
        console.error(`Middleware (oidc-validation.js) failed, (error):`, e, `(data):`, data)
        throw Error(`(oidc-validation.js) failed`)
    }
    return data
}

module.exports = oidcValidation
rus.mark(`~/modules/middlewares/oidcValidation.js LOADED`)
