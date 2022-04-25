'use strict'

const conf = require(`/var/task/configuration.js`)

//////////
//      //
//  !!  //  Make way.
//      //
//////////

var customLogger = {}

if (conf.customLogging) {

    customLogger.customLogString = "\n\ncustom-logger.js : CustomLogString START : "

    // Customisation of "console"
    {
        console.initialError = conf.customLoggingMutesNativeLogging ?
            _ => _ :
            console.error
        console.error = function() {

            //var customLogStringDate = new Date
            console.initialError.apply(this, arguments) // so that the catch (e) { console.error (e) } will work
        }
    } {
        console.initialWarn = conf.customLoggingMutesNativeLogging ?
            _ => _ :
            console.warn
        console.warn = function() {

            arguments[0] = 'INTERCEPTED ' + arguments[0]
            console.initialWarn.apply(this, arguments)

            var customLogStringDate = new Date
            customLogger.customLogString += "\nCUSTOM " +
                customLogStringDate.toISOString() +
                ` WARN ` +
                Array.from(arguments).join(' ')
        }
    } {
        console.initialLog = conf.customLoggingMutesNativeLogging ?
            _ => _ :
            console.log
        console.log = function() {

            arguments[0] = 'INTERCEPTED ' + arguments[0]
            console.initialLog.apply(this, arguments)

            var customLogStringDate = new Date
            customLogger.customLogString += "\nCustomLogString " +
                customLogStringDate.toISOString() +
                ` INFO ` +
                Array.from(arguments).join(' ')
        }
    } {
        console.initialInfo = conf.customLoggingMutesNativeLogging ?
            _ => _ :
            console.info
        console.info = function() {

            arguments[0] = 'INTERCEPTED ' + arguments[0]
            console.initialInfo.apply(this, arguments)

            var customLogStringDate = new Date
            customLogger.customLogString += "\nCustomLogString " +
                customLogStringDate.toISOString() +
                ` INFO ` +
                Array.from(arguments).join(' ')
        }
    }

}

//////////
//      //
//  !!  //  Make way.
//      //
//////////

module.exports = conf.customLogging ? customLogger : undefined
