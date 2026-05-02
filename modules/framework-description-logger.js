console.log('framework-description-logger : TOP ')
import conf from '../configuration.js'

//////////
//      //
//  !!  //  Make way.
//      //
//////////

const frameworkDescriptionLogger = {
    frameworkDescriptionLogString: '',
    log: _ => _,
    logStarts: _ => _,
    logRestarts: _ => _,
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

    const e1 = conf.frameworkDescriptionLoggingEmoji1
    const i1 = conf.frameworkDescriptionLoggingIndent1

    frameworkDescriptionLogger.logStarts = _note => {
        frameworkDescriptionLogger.frameworkDescriptionLogString =
            "\n\n⏺ FrameworkDescriptionLogString STARTED ( " + _note + " )"
    }

    frameworkDescriptionLogger.logRestarts = _note => {
        frameworkDescriptionLogger.frameworkDescriptionLogString =
            "\n\n⏺ FrameworkDescriptionLogString RESTARTED  ( " + _note + " )"
    }

    frameworkDescriptionLogger.logEnds = _note => {
        frameworkDescriptionLogger.frameworkDescriptionLogString +=
            '\n\n⏹ FrameworkDescriptionLogString ENDED ( ' + _note + ' )\n'
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
                    '\n' + e1 + '\n' + e1 +
                    ' /* (' +
                    (
                        (result = err.stack.match(/at.*/g)) ?
                        result[2] :
                        err.stack
                    ) +
                    ')\n' + e1 + '  * ' +
                    (
                        Object
                        .values(arguments)
                        .reduce(
                            (acc, cur) => acc + '\n' + cur,
                            ''
                        )
                    ).replace(
                        /\n/g,
                        '\n' +
                        e1 + '  * '
                    ) +
                    '\n' + e1 + '  */ '
                )
                .replace(
                    /\n/g,
                    '\n' +
                    (e1 + i1).repeat(frameworkDescriptionLogger.callDepth - 1)
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
                (e1 + i1).repeat(frameworkDescriptionLogger.callDepth - 1)
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
                (e1 + i1).repeat(frameworkDescriptionLogger.callDepth - 1)
            )

        frameworkDescriptionLogger.callDepth--

    }

}

//////////
//      //
//  !!  //  Make way.
//      //
//////////

if (conf.frameworkDescriptionLoggingAutoStart)
    frameworkDescriptionLogger.callStarts()

export default frameworkDescriptionLogger;
