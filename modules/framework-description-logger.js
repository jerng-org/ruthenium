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
    logStarts: _ => _,
    logEnds: _ => _,
    callDepth: 0,
    callEnumeration: [],
    callStarts: _ => _,
    callEnds: _ => _,
    summary: _ => _,
    verbiage: _ => _,
}

if (conf.frameworkDescriptionLogging) {

    frameworkDescriptionLogger.logStarts = _ => {
        frameworkDescriptionLogger.frameworkDescriptionLogString =
            "\n\n⏺ FrameworkDescriptionLogString STARTED (framework-description-logger.js INIT)"
    }

    frameworkDescriptionLogger.logEnds = _ => {
        frameworkDescriptionLogger.frameworkDescriptionLogString +=
            '\n\n⏹ FrameworkDescriptionLogString ENDED (framework-description-logger.js/logEnds CALL)\n'
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
                    '\n|  */ '
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
            frameworkDescriptionLogger.log('📝 SUMMARY:\n' + _input)
        } :
        _ => _

    frameworkDescriptionLogger.verbiage = conf.frameworkDescriptionLogging > 2 ?
        _input => {
            frameworkDescriptionLogger.log('📝 VERBIAGE:\n' + _input)
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
                ' ❮❮ START call : ' +
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
                '    END call   : ' +
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
