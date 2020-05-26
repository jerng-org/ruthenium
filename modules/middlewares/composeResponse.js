'use strict'
 
const fs = require ( 'fs' )
const markups = {
    forms: {}
    //schemas : {},
}


// THIS SECTION REQUIRES ELEGANT RECURSION INTO SUB-DIRECTORIES
const markupFileNames = fs.readdirSync ('/var/task/markup')
markupFileNames.forEach ( ( current, index, array ) => {
    markups[ current.slice (0, -3) ] = require ( '/var/task/markup/' + current )
} // , thisArg  
)
/*
const formMarkupFileNames = fs.readdirSync ('/var/task/markup/forms')
formMarkupFileNames.forEach ( ( current, index, array ) => {
    markups.forms[ current.slice (0, -3) ] = require ( '/var/task/markup/forms/' + current )
} // , thisArg 
) 
*/


const composeResponse = async ( data ) => {
    
    if (! data.LAMBDA.event.requestContext ) {
        console.warn (`Are you in the Test Environment? This does not look like a HTTP request event.`)
        return data
    }
    
    if ( data.RU.response ) {
        
        
        


        if ( data.RU.signals.redirectRoute ) { 
            
            data.RU.signals.redirectRoute 
                = data.LAMBDA.event.requestContext.http.path
                + '?ruthenium='
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
        if ( data.RU.response.markupName ) {
        
            if ( data.RU.response.markupName in markups ) {
                
                // clobber (refine this as above; WIP / TODO )
                data.RU.response = {
                    statusCode: 200,
                    headers: {
                        'content-type': 'text/html'
                    },
                    body: await markups [ data.RU.response.markupName ]( data )
                }
            }
            else {
                throw   Error (`Could not find (${ data.RU.response.markupName 
                        }) in the markups directory. That name was specified at
                        (data.RU.response.markup).`)
            }
        }
        else
        if ( data.RU.signals.taskname ) {
            
            data.RU.signals.inferredMarkupName = data.RU.signals.taskname + 'Markup'
            
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
const mark      = require ( '../mark' )            
mark ( `composeResponse.js LOADED` )