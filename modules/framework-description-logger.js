'use strict'

const conf = require(`/var/task/configuration.js`)

//////////
//      //
//  !!  //  Make way.
//      //
//////////

var frameworkDescriptionLogger = {}

if (conf.frameworkDescriptionLogging) {

    frameworkDescriptionLogger.frameworkDescriptionLogString = "\n\nFrameworkDescriptionLogString STARTED (framework-description-logger.js) : "

    frameworkDescriptionLogger.log = _input => {
        frameworkDescriptionLogger.frameworkDescriptionLogString += '\n|\n| ... ' + _input
    }
}
else {
    frameworkDescriptionLogger.log = _ => _
}

//////////
//      //
//  !!  //  Make way.
//      //
//////////

module.exports = frameworkDescriptionLogger 