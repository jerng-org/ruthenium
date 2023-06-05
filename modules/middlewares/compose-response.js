'use strict'

const rus = require('/var/task/modules/r-u-s.js')

//  THIS SECTION REQUIRES REFACTORING TOWARDS ELEGANT RECURSION INTO SUB-DIRECTORIES
//  THIS SECTION IS REDUNDANT WITH (apply-layout.js)
const markups = {}

const InitMarkups = _ => {
    rus.frameworkDescriptionLogger.callStarts()

    const markupFileNames = rus.node.fs.readdirSync('/var/task/tasks', {
        withFileTypes: true
    })
    markupFileNames.forEach((current, index, array) => {

        if (current.isFile()) {

            // console.warn(`searching in:`, current.name.slice (0, -3), `for`, '/var/task/tasks/' + current.name )
            markups[current.name.slice(0, -3)] = require('/var/task/tasks/' + current.name)
        }
    } /* , thisArg */ )
    rus.frameworkDescriptionLogger.callEnds()
}

const redirect = async (DATA) => {

    rus.frameworkDescriptionLogger.callStarts()

    // Step 1.1 : Documentation
    DATA.RU.signals.redirectRoute = DATA.RU.request.http.path +
        '?route=' +
        DATA.RU.signals.redirectRoute

    // Step 2 : initialisation
    DATA.RU.response = {

        statusCode: DATA.RU.signals.sendResponse &&
            DATA.RU.signals.sendResponse.statusCode ?
            DATA.RU.signals.sendResponse.statusCode : 303 // See Other 300s
            ,

        // Ensure (headers) is an object
        headers: DATA.RU.signals.sendResponse &&
            DATA.RU.signals.sendResponse.headers ?
            DATA.RU.signals.sendResponse.headers : {}
    }

    console.warn(`compose-response.js, branch:redirectRoute : this seems insufficiently forceful - here we should not yield to a pre-set non-300 status code;`)

    // Step 1.2 : Implementation
    DATA.RU.response.headers.location = DATA.RU.signals.redirectRoute

    rus.frameworkDescriptionLogger.callEnds()
}

/*  1.  Throw, if (data.RU.response) is truthy.
 *
 *  2.  Branch, if (data.RU.signals.redirectRoute) is truthy.
 *
 *  3.  Branch, if (data.RU.signals.sendBlob) is truthy.
 *
 *  4.  Branch, if (data.RU.signals.sendJson) is truthy.
 *
 *  5.  Branch, if (data.RU.signals.sendResponse[ 'statusCode' OR 'body' ]) is truthy.
 *
 *  6.  Branch, if (data.RU.signals.markupName) is truthy.
 *
 *  7.  Branch, if (data.RU.signals.taskName) is truthy.
 *
 *  8.  Return.
 *
 */
const composeResponse = async (data) => {

    rus.frameworkDescriptionLogger.callStarts()

    //console.error(`(compose-response.js:top:data.RU.signals)`, data.RU.signals)

    if (data.RU.response) {
        console.error(`(compose-response.js) found that (data.RU.response) was truthy; composition aborted; nothing should be assigned to (data.RU.response) prior to (compose-response.js); (data.RU.response): ${ await rus.print.stringify4(data.RU.response) }`)
        delete data.RU.response

        await rus.http.status500(data)
        await composeResponse(data)
    }
    // Initialisation of (data.RU.response) has moved to branches below

    //  no returns yet;
    ////////////////////////////////////////////////////////////////////////////
    //  henceforth, each branch below will return;

    if (data.RU.signals.redirectRoute) {

        await redirect(data)
        rus.frameworkDescriptionLogger.callEnds()
        return data
    }
    else

    if (data.RU.signals.sendBlob) {

        data.RU.response = {}

        data.RU.response.statusCode = data.RU.signals.sendResponse &&
            data.RU.signals.sendResponse.statusCode ?
            data.RU.signals.sendResponse.statusCode :
            200 // OK

        // ensure headers is an object            
        data.RU.response.headers = data.RU.signals.sendResponse &&
            data.RU.signals.sendResponse.headers ?
            data.RU.signals.sendResponse.headers : {}

        // if sendBlob specified a MIME type, then over/write response            
        if (data.RU.signals.sendBlob['content-type']) {

            data.RU.response.headers['content-type'] = data.RU.signals.sendBlob['content-type']
        }

        // if response has a MIME type, sent 'nosniff' directive            
        if (data.RU.response.headers['content-type']) {
            data.RU.response.headers['x-content-type-options'] = 'nosniff'
        }

        data.RU.response.body = data.RU.signals.sendBlob.body

        rus.frameworkDescriptionLogger.callEnds()
        return data
    }
    else

    if (data.RU.signals.sendJson) {
        console.warn('(compose-response.js) data.RU.signals.sendJson : implementation specific to Lambda payload format 2.0')

        data.RU.response = data.RU.signals.sendJson
        data.RU.signals.skipToMiddlewareName = 'returnResponse'
        rus.frameworkDescriptionLogger.callEnds()
        return data
    }
    else

    if (data.RU.signals.sendResponse &&
        (data.RU.signals.sendResponse.statusCode ||
            data.RU.signals.sendResponse.body)) {

        data.RU.response = {}


        //  This branch allows the programmer to short-circuit "automatic 
        //  task-markup-matching" by specifying either the (statusCode) or
        //  (body) manually.

        data.RU.response.statusCode = data.RU.signals.sendResponse.statusCode ?
            data.RU.signals.sendResponse.statusCode :
            200

        data.RU.response.body = data.RU.signals.sendResponse.body ?
            data.RU.signals.sendResponse.body :
            ''

        data.RU.response.headers = data.RU.signals.sendResponse.headers ?
            data.RU.signals.sendResponse.headers : { 'content-type': 'text/html' }

        rus.frameworkDescriptionLogger.callEnds()
        return data
    }
    else

    if (data.RU.signals.markupName) {
        if (data.RU.signals.markupName in markups) {

            data.RU.response = {}

            // clobber (refine this as above; WIP / TODO )
            data.RU.response = {
                statusCode: 200,
                headers: {
                    'content-type': 'text/html'
                },
                body: await markups[data.RU.signals.markupName](data)
            }
        }
        else {
            console.error(`(compose-response.js) could not find (${  data.RU.signals.markupName  }.js) in the (~/tasks) directory. That name was specified at (data.RU.signals.markupName).
                    
                    The following may be informative:
                    
                    ${ await rus.additionalRequestInformation ( data )}`)

            await rus.http.status501(data)
            await composeResponse(data)
        }
        rus.frameworkDescriptionLogger.callEnds()
        return data
    }
    else

    if (data.RU.signals.taskName) {
        data.RU.signals.inferredMarkupName = data.RU.signals.taskName + '-markup'

        if (data.RU.signals.inferredMarkupName in markups) {

            data.RU.response = {}

            // clobber (refine this as above; WIP / TODO )
            data.RU.response = {
                statusCode: 200,
                headers: {
                    'content-type': 'text/html'
                },
                body: await markups[data.RU.signals.inferredMarkupName](data)
            }
        }
        else {
            console.error(`(middlewares/compose-response.js) could not find  (${ data.RU.signals.inferredMarkupName })  in the markups directory. That name was guessed because (${ data.RU.signals.taskName }) was specified at  (data.RU.signals.taskName).`
                /*
                + `The following may be informative:
                    
                ${ await rus.additionalRequestInformation ( data )}`
                */
            )

            await rus.http.status501(data)
            await composeResponse(data)
        }
        rus.frameworkDescriptionLogger.callEnds()
        return data
    }
}

module.exports = composeResponse

rus.mark('LOADED')