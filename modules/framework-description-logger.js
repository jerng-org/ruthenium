'use strict'

const conf = require(`/var/task/configuration.js`)

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
        console.log(frameworkDescriptionLogger.frameworkDescriptionLogString)
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
                    ')\n|' +
                    _input
                )
                .replace(
                    /\n/g,
                    '\n' +
                    '... '.repeat(frameworkDescriptionLogger.callDepth)
                )
        }
    }

    frameworkDescriptionLogger.summary = conf.frameworkDescriptionLogging > 1 ?
        _input => {
            frameworkDescriptionLogger.log(_input)
        } :
        _ => _

    frameworkDescriptionLogger.verbiage = conf.frameworkDescriptionLogging > 2 ?
        _input => {
            frameworkDescriptionLogger.log(_input)
        } :
        _ => _

    frameworkDescriptionLogger.callStarts = _ => {
        
        frameworkDescriptionLogger.callDepth++
        
        let err = {}
        Error.captureStackTrace(err)

        frameworkDescriptionLogger.frameworkDescriptionLogString +=
            (
                '\n|\n|' +
                '( ... CALLED : ' +
                err.stack.match(/\n.*\n.*at (.*)\n/)[1] + // third line 
                ')'
            )
            .replace(
                /\n/g,
                '\n' +
                '... '.repeat(frameworkDescriptionLogger.callDepth)
            )
    }

    frameworkDescriptionLogger.callEnds = _ => {
        
        let err = {}
        Error.captureStackTrace(err)

        frameworkDescriptionLogger.frameworkDescriptionLogString +=
            (
                '\n|\n|' +
                '(' +
                err.stack.match(/\n.*\n.*at (.*)\n/)[1] + // third line 
                ' ... RETURNS )'
            )
            .replace(
                /\n/g,
                '\n' +
                '... '.repeat(frameworkDescriptionLogger.callDepth)
            )
        
        frameworkDescriptionLogger.callDepth--
    }

}

//////////
//      //
//  !!  //  Make way.
//      //
//////////

module.exports = frameworkDescriptionLogger
