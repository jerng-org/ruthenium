'use strict'

/*  2022-05-22 this file was developed to resolve circular dependencies in
 *  'r-u-s.js'. The naming of this file as 'r-u-s-minus-1.js' 
 *  is in order to set precedent in case there should arise any need for 
 *  'r-u-s-minus-2.js' etc.
 *
 **/

const conf = require(`/var/task/configuration.js`)

const customLogger = require(`/var/task/modules/custom-logger.js`)
customLogger.startCustomLogString('/var/task/modules/r-u-s-minus-1.js')

const mark = require('/var/task/modules/mark.js')

const frameworkDescriptionLogger =
    require(`/var/task/modules/framework-description-logger.js`)

if (conf.frameworkDescriptionLogging.length) {
    frameworkDescriptionLogger.logStarts()

    frameworkDescriptionLogger.less(`customLogger.startCustomLogString must be
    run before anything else, and not run again, otherwise things go missing;
    derisk this issue`)

    frameworkDescriptionLogger.fixme(`the required modules here should be
    refactored; review and refactor`)

    frameworkDescriptionLogger.backlog(`rename customLogger.xxx to
    LogStart,LogRestart,LogLog (custom-logger.js)`)

}

module.exports = {
    conf: conf,
    customLogger: customLogger,
    frameworkDescriptionLogger: frameworkDescriptionLogger,
    mark: mark,
}

mark(`LOADED`)
