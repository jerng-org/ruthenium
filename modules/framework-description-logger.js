'use strict'

const conf = require(`/var/task/configuration.js`)
const customLogger = require(`/var/task/modules/custom-logger.js`)

//////////
//      //
//  !!  //  Make way.
//      //
//////////

var frameworkDescriptionLogger = {
    frameworkDescriptionLogString: '',
    log: _ => _,
    endLog: _ => _,
    callDepth: 0,
    callEnumeration: [],
    callStarts: _ => _,
    callEnds: _ => _,
}

if (conf.frameworkDescriptionLogging) {

    frameworkDescriptionLogger.frameworkDescriptionLogString =
        "\n\nFrameworkDescriptionLogString STARTED (framework-description-logger.js INITIALISATION)"

    frameworkDescriptionLogger.endLog = _ => {
        frameworkDescriptionLogger.frameworkDescriptionLogString +=
            '\n|\n| ... FrameworkDescriptionLogString ENDED (framework-description-logger.js/endLog EXECUTION)\n'
    }

    frameworkDescriptionLogger.log = _input => {
        {
            let err = {}
            Error.captureStackTrace(err)

            frameworkDescriptionLogger.frameworkDescriptionLogString +=
                (
                    '\n|\n|' +
                    '(' +
                    err.stack.match(/\n.*\n.*at (.*)\n/)[1] + // third line 
                    ')\n' +
                    _input
                )
                .replace(
                    /\n/g,
                    '\n' +
                    '... '.repeat(frameworkDescriptionLogger.callDepth)
                )
        }
        console.log(frameworkDescriptionLogger.frameworkDescriptionLogString)
    }

    frameworkDescriptionLogger.callStarts = _ => {
        frameworkDescriptionLogger.callDepth++
    }

    frameworkDescriptionLogger.callEnds = _ => {
        frameworkDescriptionLogger.callDepth--
    }

}

//////////
//      //
//  !!  //  Make way.
//      //
//////////

module.exports = frameworkDescriptionLogger
