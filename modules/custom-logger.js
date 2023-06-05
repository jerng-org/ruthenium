'use strict'

const conf = require(`/var/task/configuration.js`)

//////////
//      //
//  !!  //  Make way.
//      //
//////////  ❌ 📢 ℹ️

const e1 = conf.customLoggingEmoji1
const e2 = conf.customLoggingEmoji2

const customLogger = {
    customLogString: '',
    startCustomLogString: _ => _,
    restartCustomLogString: _ => _,
    logCustomLogString: _ => _
}

if (conf.customLogging) {

    const customLogStringDate = new Date

    const buildLineStyle1 = (_continue, _arguments, _postDateLabel) => {

        let result
        let err = {}
        Error.captureStackTrace(err)

        return customLogger.customLogString += "\n" +
            conf.dateTimeFormat.format(customLogStringDate) + _postDateLabel + e1 +
            Array.from(_arguments).concat([]
                /*
                (!conf.customLoggingLineTrace ? [] : [
                    e2 +
                    ((result = err.stack.match(/\n.*\n.*\n.*( at .*)\n?/)) ?
                        result[1] :
                        err.stack) 
                ])
                */
            )
            .join('\n')
            .concat(
                (!conf.customLoggingLineTrace ?
                    '' :
                    (
                        e2 + ((result = err.stack.match(/\n.*\n.*\n.*(at .*)\n?/)) ?
                            result[1] :
                            err.stack)
                    )
                )
            )
            .replace(/\n/g, '\n' + ' '.repeat(35) + e1)
    }
    const buildLineStyle2 = (_continue, _arguments, _postDateLabel, _postEmoji) =>
        customLogger.customLogString = (_continue ?
            customLogger.customLogString + '\n' :
            '\n\n') +
        conf.dateTimeFormat.format(customLogStringDate) + _postDateLabel + e1 +
        _postEmoji + Array.from(_arguments).join('\n')

    // Customisation of "console"

    {
        console.initialError = console.error
        console.error = function() {
            //  regardless of (conf.customLoggingAllowsNativeLogging)
            console.initialError.apply(this, arguments)
            buildLineStyle1(true, arguments, conf.customLoggingHeaderError)
        }
    } {
        console.initialWarn = console.warn
        console.warn = function() {
            if (conf.customLoggingAllowsNativeLogging) {
                console.initialWarn.apply(this, arguments)
            }
            buildLineStyle1(true, arguments, conf.customLoggingHeaderWarn)
        }
    } {
        console.initialLog = console.log
        console.log = function() {
            if (conf.customLoggingAllowsNativeLogging) {
                console.initialLog.apply(this, arguments)
            }
            buildLineStyle1(true, arguments, conf.customLoggingHeaderLog)
        }
    } {
        console.initialInfo = console.info
        console.info = function() {
            if (conf.customLoggingAllowsNativeLogging) {
                console.initialInfo.apply(this, arguments)
            }
            buildLineStyle1(true, arguments, conf.customLoggingHeaderInfo)
        }
    }

    // other definitions

    customLogger.startCustomLogString = function() {
        buildLineStyle2(false, arguments, ' ⏺   ', 'CustomLogString STARTED : ')
    }

    customLogger.restartCustomLogString = function() {
        buildLineStyle2(false, arguments, ' ⏸⏺ ', 'CustomLogString RE-STARTED : ')
    }

    customLogger.logCustomLogString = function() {
        buildLineStyle2(true, arguments, ' ⏯   ', 'CustomLogString LOGGED : ')
        console.initialLog(
            customLogger.customLogString
        )
    }

}

//////////
//      //
//  !!  //  Make way.
//      //
//////////

module.exports = customLogger
