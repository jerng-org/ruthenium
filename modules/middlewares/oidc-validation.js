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

    /*  More complicated logic which enables views that do not require 
     *  OIDC validation, may go here. TODO
     */

    try {
        await rus.aws.cognito.authorizationCodeFlowJwtValidation()
        // THROWS EXCEPTION ON FAILURE
    }
    catch (e) {
        console.error(`Middleware (oidc-validation.js) failed, (data):`, data)

        throw Error (`(oidc-validation.js) failed`)
    }
}

module.exports = oidcValidation
rus.mark(`~/modules/middlewares/oidcValidation.js LOADED`)
