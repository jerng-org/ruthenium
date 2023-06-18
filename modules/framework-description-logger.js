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
    callDepth: 1,
    callEnumeration: [],
    callStarts: _ => _,
    callEnds: _ => _,

    less: _ => _,
    more: _ => _,
    fixme: _ => _,
    backlog: _ => _,
    icebox: _ => _,
}

if (conf.frameworkDescriptionLogging.length) {

    frameworkDescriptionLogger.logStarts = _ => {
        frameworkDescriptionLogger.frameworkDescriptionLogString =
            "\n\n⏺ FrameworkDescriptionLogString STARTED (framework-description-logger.js INIT)"
    }

    frameworkDescriptionLogger.logEnds = _ => {
        frameworkDescriptionLogger.frameworkDescriptionLogString +=
            '\n\n⏹ FrameworkDescriptionLogString ENDED (framework-description-logger.js/logEnds CALL)\n'
        console.log(frameworkDescriptionLogger.frameworkDescriptionLogString)
    }

    frameworkDescriptionLogger.log = function() {
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
                    (
                        Object
                        .values(arguments)
                        .reduce(
                            (accumulator, currentValue, currentIndex, array) => {
                                return accumulator + '\n' + currentValue
                            }
                        )
                    ).replace(
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

    if (conf.frameworkDescriptionLogging.includes(0))
        frameworkDescriptionLogger.less = function() {
            const a = Object.values(arguments)
            a.unshift('❗ LESS:\n')
            frameworkDescriptionLogger.log.apply(this, a)
        }
    if (conf.frameworkDescriptionLogging.includes(1))
        frameworkDescriptionLogger.more = function() {
            const a = Object.values(arguments)
            a.unshift('📝 MORE:\n')
            frameworkDescriptionLogger.log.apply(this, a)
        }
    if (conf.frameworkDescriptionLogging.includes(2))
        frameworkDescriptionLogger.fixme = function() {
            const a = Object.values(arguments)
            a.unshift('🔥 FIXME:\n')
            frameworkDescriptionLogger.log.apply(this, a)
        }
    if (conf.frameworkDescriptionLogging.includes(3))
        frameworkDescriptionLogger.backlog = function() {
            const a = Object.values(arguments)
            a.unshift('🗓️ BACKLOG:\n')
            frameworkDescriptionLogger.log.apply(this, a)
        }
    if (conf.frameworkDescriptionLogging.includes(5))
        frameworkDescriptionLogger.icebox = function() {
            const a = Object.values(arguments)
            a.unshift('🧊 ICEBOX:\n')
            frameworkDescriptionLogger.log.apply(this, a)
        }

    frameworkDescriptionLogger.callStarts = _ => {

        frameworkDescriptionLogger.callDepth++

        // COMBINE 
        let result
        let err = {}

        Error.captureStackTrace(err)

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

        frameworkDescriptionLogger.callDepth--

    }

}

//////////
//      //
//  !!  //  Make way.
//      //
//////////

module.exports = frameworkDescriptionLogger
