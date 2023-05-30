'use strict'

const conf = require(`/var/task/configuration.js`)

//////////
//      //
//  !!  //  Make way.
//      //
//////////  ❌ 📢 ℹ️

var customLogger = {
    customLogString: '',
    startCustomLogString: _ => _,
    restartCustomLogString: _ => _,
    logCustomLogString: _ => _
}

if (conf.customLogging) {

    let customLogStringDate = new Date

    // Customisation of "console"

    {
        console.initialError = console.error
        console.error = function() {
            //  regardless of (conf.customLoggingAllowsNativeLogging)
            console.initialError.apply(this, arguments) 
            
            customLogger.customLogString += "\n" +
                conf.dateTimeFormat.format(customLogStringDate) + ' ❌ ERRO ' +
                Array.from(arguments).join(' ')
        }
    } {
        console.initialWarn = console.warn
        console.warn = function() {
            if (conf.customLoggingAllowsNativeLogging) {
                console.initialWarn.apply(this, arguments)
            }
            customLogger.customLogString += "\n" +
                conf.dateTimeFormat.format(customLogStringDate) + ' 📢WARN ' +
                Array.from(arguments).join(' ')
        }
    } {
        console.initialLog = console.log
        console.log = function() {
            if (conf.customLoggingAllowsNativeLogging) {
                console.initialLog.apply(this, arguments)
            }
            customLogger.customLogString += "\n" +
                conf.dateTimeFormat.format(customLogStringDate) + ' ℹ️LOG  ' +
                Array.from(arguments).join(' ')
        }
    } {
        console.initialInfo = console.info
        console.info = function() {
            if (conf.customLoggingAllowsNativeLogging) {
                console.initialInfo.apply(this, arguments)
            }
            customLogger.customLogString += "\n" +
                conf.dateTimeFormat.format(customLogStringDate) + ' ℹ️INFO ' +
                Array.from(arguments).join(' ')
        }
    }

    // other definitions

    customLogger.startCustomLogString = function() {
        customLogger.customLogString = '\n\n' +
            conf.dateTimeFormat.format(customLogStringDate) + ' ⏺     ' +
            'CustomLogString STARTED : ' +
            Array.from(arguments).join(' : ')
    }

    customLogger.restartCustomLogString = function() {
        customLogger.customLogString = '\n\n' +
            conf.dateTimeFormat.format(customLogStringDate) + ' ⏸⏺    '+
            'CustomLogString RE-STARTED : ' +
            Array.from(arguments).join(' : ')
    }

    customLogger.logCustomLogString = function() {
        console.initialLog(
            conf.dateTimeFormat.format(customLogStringDate) + ' ⏯    '+
            customLogger.customLogString +
            '\nCustomLogString LOGGED : ' +
            Array.from(arguments).join(':')
        )
    }

}

//////////
//      //
//  !!  //  Make way.
//      //
//////////

module.exports = customLogger
