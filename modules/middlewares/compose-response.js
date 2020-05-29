'use strict'
 
const fs 
    = require ( 'fs' )
const markups = {
    //schemas : {},
}

const mark 
    = require ( '/var/task/modules/mark' )

// THIS SECTION REQUIRES ELEGANT RECURSION INTO SUB-DIRECTORIES
const markupFileNames = fs.readdirSync ('/var/task/markup', {
    withFileTypes: true
})
markupFileNames.forEach ( ( current, index, array ) => {
    if (current.isFile()) {
        markups[ current.name.slice (0, -3) ] = require ( '/var/task/markup/' + current.name )
    }        
} // , thisArg  
)

/*
const formMarkupFileNames = fs.readdirSync ('/var/task/markup/forms')
formMarkupFileNames.forEach ( ( current, index, array ) => {
    markups[ 'forms/' + current.slice (0, -3) ] = require ( '/var/task/markup/forms/' + current )
} // , thisArg 
) 
*/

const composeResponse = async ( data ) => {
    
    if ( data.RU.response ) {
        
        
        


        if ( data.RU.signals.redirectRoute ) { 
            
            data.RU.signals.redirectRoute 
                = data.RU.request.http.path
                + '?route='
                + data.RU.signals.redirectRoute
            
            data.RU.response.statusCode =   data.RU.response.statusCode
                                            ? data.RU.response.statusCode
                                            : 303 // See Other
            
            // ensure headers is an object            
            data.RU.response.headers    =   data.RU.response.headers
                                            ? data.RU.response.headers
                                            : {}
            data.RU.response.headers.location =  data.RU.signals.redirectRoute 
            
        }
        else
        if ( data.RU.signals.sendBlob ) {
            
            data.RU.response.statusCode =   data.RU.response.statusCode
                                            ? data.RU.response.statusCode
                                            : 200 // OK

            // ensure headers is an object            
            data.RU.response.headers    =   data.RU.response.headers
                                            ? data.RU.response.headers
                                            : {}

            // if sendBlob specified a MIME type, then over/write response            
            if ( data.RU.signals.sendBlob[ 'content-type' ] ) {
                data.RU.response.headers[ 'content-type' ]
                = data.RU.signals.sendBlob[ 'content-type' ]
            } 

            // if response has a MIME type, sent 'nosniff' directive            
            if ( data.RU.response.headers[ 'content-type' ] ) {
                data.RU.response.headers[ 'x-content-type-options' ] = 'nosniff'
            }

            data.RU.response.body = data.RU.signals.sendBlob.body

        }
        else
        if (    data.RU.signals.sendResponse 
                &&  (   data.RU.signals.sendResponse.statusCode 
                        ||  data.RU.signals.sendResponse.body ) ) 
        {
            
            //  This branch allows the programmer to short-circuit "automatic 
            //  task-markup-matching" by specifying either the (statusCode) or
            //  (body) manually.
            
            data.RU.response.statusCode = data.RU.signals.sendResponse.statusCode
                ? data.RU.signals.sendResponse.statusCode
                : 200
                
            data.RU.response.body = data.RU.signals.sendResponse.body
                ? data.RU.signals.sendResponse.body
                : ''
                
            data.RU.response.headers = data.RU.response.headers
                ? data.RU.signals.sendResponse.headers
                : { 'content-type': 'text/html' }
                
        }
        else
        if ( data.RU.signals.markupName ) {
        
            if ( data.RU.signals.markupName in markups ) {
                
                // clobber (refine this as above; WIP / TODO )
                data.RU.response = {
                    statusCode: 200,
                    headers: {
                        'content-type': 'text/html'
                    },
                    body: await markups [ data.RU.signals.markupName ]( data )
                }
            }
            else {
                throw   Error (`Could not find (${ data.RU.signals.markupName 
                        }) in the markups directory. That name was specified at
                        (data.RU.response.markup).
                        
                        The following may be informative:
                        ${ JSON.stringify( {
                            
                            signals:
                                data.RU.signals,
                            
                            http: 
                                data.RU.request.http,
                            
                            queryStringParameters:
                                data.RU.request.queryStringParameters,
                            
                            formStringParameters:
                                data.RU.request.formStringParameters,
                            
                            headers:
                                data.RU.request.headers,
                                
                            middlewares:
                                data.RU.middlewares,
                                
                            io:
                                data.RU.io
                                
                        } , null, 4 ) }`)
            }
        }
        else
        if ( data.RU.signals.taskname ) {
            
            data.RU.signals.inferredMarkupName = data.RU.signals.taskname + '-markup'
            
            if ( data.RU.signals.inferredMarkupName in markups ) {
                
                // clobber (refine this as above; WIP / TODO )
                data.RU.response = {
                    statusCode: 200,
                    headers: {
                        'content-type': 'text/html'
                    },
                    body: await markups [ data.RU.signals.inferredMarkupName ]( data )
                }
            }
            else {
                throw   Error (`Could not find (${ data.RU.signals.inferredMarkupName }) 
                        in the markups directory. That name was guessed because 
                        (${ data.RU.signals.taskname }) was specified at 
                        (data.RU.signals.taskname).`)
            }
        }
        
        
        
        
    }
    else {
        throw   Error (`(data.RU.response) is falsy. Not sure how to proceed.
                This is usually not a problem as it should be initiated at 
                (ruthenium.js).`)
    }
    
    return data
}

module.exports  = composeResponse