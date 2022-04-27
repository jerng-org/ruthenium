'use strict'

const conf = require(`/var/task/configuration.js`)

//////////
//      //
//  !!  //  Make way.
//      //
//////////

var frameworkDescriptionLogger = {
    frameworkDescriptionLogString: '',
    callDepth: 0,
    callEnumeration: [],
    callStarts: undefined,
    callEnds: undefined,
    log: undefined,
    endLog: undefined
}

if (conf.frameworkDescriptionLogging) {

    frameworkDescriptionLogger.frameworkDescriptionLogString =
        "\n\nFrameworkDescriptionLogString STARTED (framework-description-logger.js INITIALISATION)"

    frameworkDescriptionLogger.callStarts = _ => {
        frameworkDescriptionLogger.callDepth++

    }
    
    frameworkDescriptionLogger.callEnds = _ => {
        frameworkDescriptionLogger.callDepth--

    }

    frameworkDescriptionLogger.endLog = _ => {
        frameworkDescriptionLogger.frameworkDescriptionLogString +=
            '\n|\n| ... FrameworkDescriptionLogString ENDED (framework-description-logger.js/endLog EXECUTION)\n'
    }

    frameworkDescriptionLogger.log = _input => {
        frameworkDescriptionLogger.frameworkDescriptionLogString += 
        ('\n|\n|' + _input).replace(/\n/g,'\n' + '... '.repeat(frameworkDescriptionLogger.callDepth))
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
