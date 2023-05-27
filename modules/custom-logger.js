'use strict'

const conf = require(`/var/task/configuration.js`)

//////////
//      //
//  !!  //  Make way.
//      //
//////////

var customLogger = {
    customLogString: '',
    logCustomLogString: _ => _
}

if (conf.customLogging) {

    // Customisation of "console"
    {
        console.initialError = console.error
        console.error = function() {

            //var customLogStringDate = new Date
            console.initialError.apply(this, arguments) // so that the catch (e) { console.error (e) } will work
        }
    } {
        console.initialWarn = console.warn
        console.warn = function() {

            if (conf.customLoggingAllowsNativeLogging) {
                console.initialWarn.apply(this, arguments)
            }
            var customLogStringDate = new Date
            customLogger.customLogString += "\nCLS WARN " +
                customLogStringDate.toISOString() + ' ' +
                Array.from(arguments).join(' ')
        }
    } {
        console.initialLog = console.log
        console.log = function() {

            if (conf.customLoggingAllowsNativeLogging) {
                console.initialLog.apply(this, arguments)
            }
            var customLogStringDate = new Date
            customLogger.customLogString += "\nCLS INFO " +
                customLogStringDate.toISOString() + ' ' +
                Array.from(arguments).join(' ')
        }
    } {
        console.initialInfo = console.info
        console.info = function() {

            if (conf.customLoggingAllowsNativeLogging) {
                console.initialInfo.apply(this, arguments)
            }
            var customLogStringDate = new Date
            customLogger.customLogString += "\nCLS INFO " +
                customLogStringDate.toISOString() + ' ' +
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
