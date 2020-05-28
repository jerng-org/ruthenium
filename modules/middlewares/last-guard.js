'use strict'

const util = require ('util')

const lastGuard = async ( data ) => {




    const hasStatusCode = data.RU.response.statusCode   ? true : false
    const hasBody       = data.RU.response.body         ? true : false
    
    // strict disallowance of errors from any middleware (we can revisit this)
    if ( data.RU.errors.length ) {
        data.RU.responseBeforeLastGuard = data.RU.response
        data.RU.response = {
            statusCode  : 500,
            headers: {
                'content-type' : 'text/html'
            },
            body:   `<h1>Status: 500 Internal Server Error</h1>
                The last guard said:
                <h3>An Error was Thrown</h3>
                Here's what we know : <pre><code>${
                JSON.stringify( data.RU.errors, null, 4 ).replace(/\\n/g, '\n')
            }</code></pre>` 
        }
        console.error (`(last-guard.js) detected a middleware error; (data) logged:`, data)
        //return data.RU.response
    }
    else
    
    // strict minimum requirement of a status code OR body
    if ( ! ( hasStatusCode || hasBody ) ) { 
        data.RU.responseBeforeLastGuard = data.RU.response
        data.RU.response = {
            statusCode : 500,
            headers: {
                'content-type' : 'text/html'
            },
            body: `<h1>Status: 500 Internal Server Error</h1>
                The last guard said :
                <h3>No "View" was Assigned</h3>
                The (data) looks like this : <pre><code>${
                JSON.stringify( data, null, 4 ).replace(/\\n/g, '\n')
            }</code></pre>` 
        }
        console.error (`(last-guard.js) detected neither (statusCode), nor (body) in the (response).`, data)
        //return data.RU.response
    }
    else 

    // Either a (statusCode) or a (body) or both are in data.RU.response
    {
    
        // OP 1
        console.log ( data.RU.request.rawPath, data.RU.request.rawQueryString  ) 
    
        // OP 2
        data.RU.response.body = hasBody 
            ? data.RU.response.body
            : `(last-guard.js) finds that (data.RU.response.body) is falsy: (${
                data.RU.response.body
                })`
        
    }



    
    //*
    const response = { ... data.RU.response }

    if ( typeof data.RU.response.body == 'string' ) {
        data.RU.response.body = data.RU.response.body.replace(/</g, '[')   
    }
    
    response.body +=
    `<pre><code>${
        util.inspect( data, { depth: Infinity } )
    }</code></pre>` 
    //*/
    
    return response 
    
    
    
    
}
module.exports = lastGuard