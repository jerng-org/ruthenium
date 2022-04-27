'use strict'

const conf = require(`/var/task/configuration.js`)

//////////
//      //
//  !!  //  Make way.
//      //
//////////

var frameworkDescriptionLogger = {
    frameworkDescriptionLogString: '',
}

if (conf.frameworkDescriptionLogging) {

    frameworkDescriptionLogger.frameworkDescriptionLogString =
        "\n\nFrameworkDescriptionLogString STARTED (framework-description-logger.js INITIALISATION)"

    frameworkDescriptionLogger.endLog = _ => {
        frameworkDescriptionLogger.frameworkDescriptionLogString +=
            '\n|\n| ... FrameworkDescriptionLogString ENDED (framework-description-logger.js/endLog EXECUTION)\n'
    }

    frameworkDescriptionLogger.log = _input => {
        frameworkDescriptionLogger.frameworkDescriptionLogString += '\n|\n| ... ' +
            _input
        console.log(frameworkDescriptionLogger.frameworkDescriptionLogString)
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
