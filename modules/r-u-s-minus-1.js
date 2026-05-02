let conf, mark, customLogger, frameworkDescriptionLogger, jsonwebtoken, jwkToPem

try {

console.log(`r-u-s-minus-1 : TOP of try`);

     ({ default : conf } = await import('../configuration.js'));
     ({ default : mark} = await import("../modules/mark.js"));
     ({ default : customLogger } = await import('../modules/custom-logger.js') );
     ({ default : frameworkDescriptionLogger } = await import('../modules/framework-description-logger.js'));
     ({ default : jwkToPem } = await import('jwk-to-pem')); // LAMBDA LAYER arn:aws:lambda:us-east-1:ABC:layer:oidc-jwt-validation-tools:1
     (jsonwebtoken = await import('jsonwebtoken')); // LAMBDA LAYER arn:aws:lambda:us-east-1:ABC:layer:oidc-jwt-validation-tools:1
console.log(`r-u-s-minus-1 : typeof mark :`, typeof mark)

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
}
