let conf, mark, customLogger, frameworkDescriptionLogger, jsonwebtoken, jwkToPem, querystring, https

try {

console.log(`r-u-s-minus-1 : TOP of try`);

    ({ default: conf } = await import('../configuration.js'));
    ({ default: mark } = await import("../modules/mark.js"));
    ({ default: customLogger } = await import('../modules/custom-logger.js'));
    ({ default: frameworkDescriptionLogger } = await import('../modules/framework-description-logger.js'));
    switch (conf.platform.javascriptEngine) {
        case ('NODEJS'): {
            (jwkToPem = await import('jwk-to-pem')); // LAMBDA LAYER arn:aws:lambda:us-east-1:ABC:layer:oidc-jwt-validation-tools:1
            (jsonwebtoken = await import('jsonwebtoken')); // LAMBDA LAYER arn:aws:lambda:us-east-1:ABC:layer:oidc-jwt-validation-tools:1
            querystring = await import("node:querystring")
            https = await import("node:https")
            break
        }
        case ('TXIKIJS'): {
            (jwkToPem = await import('../node_modules/jwk-to-pem/src/jwk-to-pem.js')); // LAMBDA LAYER arn:aws:lambda:us-east-1:ABC:layer:oidc-jwt-validation-tools:1
            (jsonwebtoken = await import('../node_modules/jsonwebtoken/index.js')); // LAMBDA LAYER arn:aws:lambda:us-east-1:ABC:layer:oidc-jwt-validation-tools:1
            break
        }
        default: { throw new Error('r-u-s-minus-1 : branch not implemented') }
    }

    /*  2022-05-22 this file was developed to resolve circular dependencies in
     *  'r-u-s.js'. The naming of this file as 'r-u-s-minus-1.js' 
     *  is in order to set precedent in case there should arise any need for 
     *  'r-u-s-minus-2.js' etc.
     *
     **/

    customLogger.startCustomLogString('/var/task/modules/r-u-s-minus-1.js')

    if (conf.frameworkDescriptionLogging.length) {
        frameworkDescriptionLogger.logStarts('r-u-s-minus-1.js / handler INITIALISING')

        frameworkDescriptionLogger.fixme(`customLogger.startCustomLogString must be
        run before anything else, and not run again, otherwise things go missing;
        derisk this issue`)

        frameworkDescriptionLogger.fixme(`the required modules here should be
        refactored; review and refactor`)

        frameworkDescriptionLogger.backlog(`rename customLogger.xxx to
        LogStart,LogRestart,LogLog (custom-logger.js)`)
    }


    mark(`LOADED`)
}
catch (e) { console.error(`
r-u-s-minus-1 : outer 'try' block.`, e) }

export default {
    conf: conf,
    customLogger: customLogger,
    frameworkDescriptionLogger: frameworkDescriptionLogger,
    mark: mark,
    jsonwebtoken:jsonwebtoken,
    jwkToPem:jwkToPem,
    querystring:querystring,
    https:https
}
