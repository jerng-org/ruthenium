'use strict'

const conf = require(`/var/task/configuration.js`)

//////////
//      //
//  !!  //  Make way.
//      //
//////////  ❌ 📢 ℹ️

const e1 = conf.customLoggingEmoji1

const customLogger = {
    customLogString: '',
    startCustomLogString: _ => _,
    restartCustomLogString: _ => _,
    logCustomLogString: _ => _
}

if (conf.customLogging) {

    const customLogStringDate = new Date
    const buildLineStyle1 = (_continue, _arguments, _postDateLabel) =>
        customLogger.customLogString += "\n" +
        conf.dateTimeFormat.format(customLogStringDate) + _postDateLabel + e1 +
        Array.from(_arguments)
        .join('\n')
        .replace(/\n/g, '\n' + ' '.repeat(35) + e1)
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
            buildLineStyle1(true, arguments, ' ❌ERR')
        }
    } {
        console.initialWarn = console.warn
        console.warn = function() {
            if (conf.customLoggingAllowsNativeLogging) {
                console.initialWarn.apply(this, arguments)
            }
            buildLineStyle1(true, arguments, ' 📢WAR')
        }
    } {
        console.initialLog = console.log
        console.log = function() {
            if (conf.customLoggingAllowsNativeLogging) {
                console.initialLog.apply(this, arguments)
            }
            buildLineStyle1(true, arguments, ' ℹ️LOG')
        }
    } {
        console.initialInfo = console.info
        console.info = function() {
            if (conf.customLoggingAllowsNativeLogging) {
                console.initialInfo.apply(this, arguments)
            }
            buildLineStyle1(true, arguments, ' ℹ️INF')
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
