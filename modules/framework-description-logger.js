'use strict'

const conf = require(`/var/task/configuration.js`)

//////////
//      //
//  !!  //  Make way.
//      //
//////////

var frameworkDescriptionLogger = {
    frameworkDescriptionLogString: '',
    currentFunctionDescription: undefined,
    log: undefined,
    endLog: undefined,
    callDepth: 0,
    callEnumeration: [],
    callStarts: undefined,
    callEnds: undefined,
}

if (conf.frameworkDescriptionLogging) {

    frameworkDescriptionLogger.frameworkDescriptionLogString =
        "\n\nFrameworkDescriptionLogString STARTED (framework-description-logger.js INITIALISATION)"

    frameworkDescriptionLogger.endLog = _ => {
        frameworkDescriptionLogger.frameworkDescriptionLogString +=
            '\n|\n| ... FrameworkDescriptionLogString ENDED (framework-description-logger.js/endLog EXECUTION)\n'
    }

    frameworkDescriptionLogger.log = _input => {
        frameworkDescriptionLogger.frameworkDescriptionLogString +=
            ('\n|\n|' + _input).replace(/\n/g, '\n' + '... '.repeat(frameworkDescriptionLogger.callDepth))
        console.log(frameworkDescriptionLogger.frameworkDescriptionLogString)
    }

    frameworkDescriptionLogger.callStarts = _currentFunctionDescription => {
        frameworkDescriptionLogger.callDepth++
        frameworkDescriptionLogger.currentFunctionDescription = _currentFunctionDescription
        frameworkDescriptionLogger.log('Starting execution (' + _currentFunctionDescription + ')')
    }

    frameworkDescriptionLogger.callEnds = _ => {
        frameworkDescriptionLogger
            .log('Ending execution (' + frameworkDescriptionLogger.currentFunctionDescription + ')')
        delete frameworkDescriptionLogger.currentFunctionDescription 
        frameworkDescriptionLogger.callDepth--
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
