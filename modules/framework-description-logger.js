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
        "\n\n⏺ FrameworkDescriptionLogString STARTED (framework-description-logger.js INITIALISATION)"

    frameworkDescriptionLogger.endLog = _ => {
        frameworkDescriptionLogger.frameworkDescriptionLogString +=
            '\n\n⏹ FrameworkDescriptionLogString ENDED (framework-description-logger.js/endLog EXECUTION)\n'
        console.log(frameworkDescriptionLogger.frameworkDescriptionLogString)
    }

    frameworkDescriptionLogger.log = _input => {
        {
            // COMBINE 
            let result
            let err = {}
            Error.captureStackTrace(err)

            frameworkDescriptionLogger.frameworkDescriptionLogString +=
                (
                    '\n|\n|' +
                    ' /* (' +
                    (
                        (result = err.stack.match(/\n.*\n.*at (.*)\n?/)) ?
                        result[1] :
                        err.stack
                    ) +
                    ')\n|  * ' +
                    String(_input).replace(
                        /\n/g,
                        '\n' +
                        '|  * '
                    ) +
                    '\n   */ '
                )
                .replace(
                    /\n/g,
                    '\n' +
                    '| '.repeat(frameworkDescriptionLogger.callDepth - 1)
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

        // COMBINE 
        let result
        let err = {}

        Error.captureStackTrace(err)

        // Uncomment during debugging of callDepth 
        /*
        console.initialLog(
            'FDL DEBUG callStarts, depth : ' +
            frameworkDescriptionLogger.callDepth +
            (
                (
                    (result = err.stack.match(/\n.*\n.*at (.*)\n?/)) ?
                    result[1] :
                    err.stack
                ) // third line 
            )
        )
        */

        frameworkDescriptionLogger.frameworkDescriptionLogString +=
            (
                '\n┐\n├' +
                ' ❮❮ STARTING call : ' +
                (
                    (result = err.stack.match(/\n.*\n.*at (.*)\n?/)) ?
                    result[1] :
                    err.stack
                )
            )
            .replace(
                /\n/g,
                '\n' +
                '| '.repeat(frameworkDescriptionLogger.callDepth - 1)
            )
    }

    frameworkDescriptionLogger.callEnds = _ => {

        // COMBINE 
        let result
        let err = {}
        Error.captureStackTrace(err)

        frameworkDescriptionLogger.frameworkDescriptionLogString +=
            (
                '\n└' +
                '    ENDING call   : ' +
                (
                    (result = err.stack.match(/\n.*\n.*at (.*)\n?/)) ?
                    result[1] :
                    err.stack
                ) +
                ' ❯❯'
            )
            .replace(
                /\n/g,
                '\n' +
                '| '.repeat(frameworkDescriptionLogger.callDepth - 1)
            )

        // Uncomment during debugging of callDepth 
        /*
        console.initialLog(
            'FDL DEBUG callEnds, depth : ' +
            frameworkDescriptionLogger.callDepth +
            (
                (
                    (result = err.stack.match(/\n.*\n.*at (.*)\n?/)) ?
                    result[1] :
                    err.stack
                ) // third line 
            )
        )
        */

        frameworkDescriptionLogger.callDepth--

    }

}

//////////
//      //
//  !!  //  Make way.
//      //
//////////

module.exports = frameworkDescriptionLogger
