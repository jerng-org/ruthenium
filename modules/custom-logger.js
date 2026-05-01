'use strict'

import conf from '../configuration.js'

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

    const buildLineStyle1 = (_continue, _arguments, _postDateLabel) => {

        const _dateTimeString = conf.customLoggingDateTimes ?
            conf.dateTimeFormat.format(new Date) :
            ''
        const _indentLength = (conf.customLoggingDateTimes ?
                conf.customLoggingDateTimeLength :
                0) +
            conf.customLoggingPostDateTimeIndentLength

        let result
        let err = {}
        Error.captureStackTrace(err)

        return customLogger.customLogString += "\n" +
            _dateTimeString + _postDateLabel + e1 +
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
            .replace(/\n/g, '\n' + ' '.repeat(_indentLength) +
                e1)
    }
    const buildLineStyle2 = (_continue, _arguments, _postDateLabel, _postEmoji) => {

        const _dateTimeString = conf.customLoggingDateTimes ?
            conf.dateTimeFormat.format(new Date) :
            ''
        customLogger.customLogString = (_continue ?
                customLogger.customLogString + '\n' :
                '\n\n') +
            _dateTimeString + _postDateLabel + e1 +
            _postEmoji + Array.from(_arguments).join('\n')
    }

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
        buildLineStyle2(false, arguments, conf.customLoggingHeaderLogStart,
            'START CustomLogString ... you may turn of the custom logger in (configuration)'
        )
    }

    customLogger.restartCustomLogString = function() {
        buildLineStyle2(false, arguments, conf.customLoggingHeaderLogRestart,
            '... RESTART CustomLogString ... you may turn of the custom logger in (configuration)'
        )
    }

    customLogger.logCustomLogString = function() {
        buildLineStyle2(true, arguments, conf.customLoggingHeaderLogLog,
            '... END CustomLogString ... you may turn of the custom logger in (configuration)'
        )
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
export default customLogger;
