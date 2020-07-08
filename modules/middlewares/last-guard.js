'use strict'

const rus = require('/var/task/modules/r-u-s.js')

const lastGuard = async(data) => {

    const hasStatusCode = data.RU.response.statusCode ? true : false
    const hasBody = data.RU.response.body ? true : false

    // strict disallowance of errors from any middleware (we can revisit this)
    if (data.RU.errors.length) {
        data.RU.responseBeforeLastGuard = data.RU.response
        data.RU.response = {
            statusCode: 500,
            headers: {
                'content-type': 'text/html'
            },
            body: rus.conf.labels.lastGuard500InMiddlewareBody
        }
        console.error(500,
            `"Error in middlewares." (data.RU.errors).length > 0`,
            data.RU.response.body,
            `(data) logged:`,
            data
        )
    }

    // strict minimum requirement of a status code OR body
    else
    if (!(hasStatusCode || hasBody)) {
        data.RU.responseBeforeLastGuard = data.RU.response
        data.RU.response = {
            statusCode: 500,
            headers: {
                'content-type': 'text/html'
            },
            body: rus.conf.labels.lastGuardMissingStatusCodeAndBody
        }
        console.error(500,
            `"No view." Neither (data.RU.response.statusCode) nor (data.RU.response.body) were assigned`,
            data.RU.response.body,
            `(data) logged:`,
            data
        )
    }

    // Debug
    if (rus.conf.verbosity > 2 &&
        data.RU.response.headers &&
        data.RU.response.headers['content-type'] &&
        data.RU.response.headers['content-type'].toLowerCase()
        .includes('html')) {
        // MAKE (COPY OF ORIGINAL VALUE)
        const response = { ...data.RU.response }

        // MODIFY (ORIGINAL ADDRESS) TO (NEW VALUE)
        if (typeof data.RU.response.body == 'string') {
            data.RU.response.body = await rus.print.xml300(data.RU.response.body)
        }
        if (data.RU.signals.sendResponse &&
            typeof data.RU.signals.sendResponse.body == 'string') {
            data.RU.signals.sendResponse.body = await rus.print.xml300(data.RU.signals.sendResponse.body)
        }

        // MODIFY (COPY OF ORIGINAL VALUE) TO INCLUDE (NEW VALUE)

        response.body +=
            `<hr>[ Debug of (data) by last-guard.js ] :
            <pre><code>${ 
            await rus.print.dataDebug ( data ) }</code></pre>`

        // INSERT (MODIFIED COPY OF ORGINAL VALUE) AT (ORIGINAL ADDRESS)
        data.RU.response = response
    }

    rus.conf.verbosity > 2 && console.log(data)

    return data.RU.response
}
module.exports = lastGuard
rus.mark(`~/modules/middlewares/last-guard.js LOADED`)
