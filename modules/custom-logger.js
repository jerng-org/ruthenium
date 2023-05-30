'use strict'

const conf = require(`/var/task/configuration.js`)

//////////
//      //
//  !!  //  Make way.
//      //
//////////  ❌ 📢 ℹ️

var customLogger = {
    customLogString: '',
    logCustomLogString: _ => _
}

if (conf.customLogging) {

    let customLogStringDate = new Date

    // Customisation of "console"
    {
        console.initialError = console.error
        console.error = function() {
            console.initialError.apply(this, arguments) // so that the catch (e) { console.error (e) } will work
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
    customLogger.customLogString = "\n\nCLS/CustomLogString STARTED : (~/modules/custom-logger.js INITIALISATION)\n"

    customLogger.restartCustomLogString = function() {
        customLogger.customLogString = '\n\nCLS/CustomLogString RE-STARTED : ' +
            Array.from(arguments).join(' : ') +
            '\n'
    }

    customLogger.logCustomLogString = function() {
        console.initialLog(
            customLogger.customLogString +
            '\nCLS LOGGED : ' +
            Array.from(arguments).join(':') +
            '\n\n'
        )
    }

}

//////////
//      //
//  !!  //  Make way.
//      //
//////////

module.exports = customLogger
