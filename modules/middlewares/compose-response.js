'use strict'
 
const rus       = require ( '/var/task/modules/r-u-s.js' )

// THIS SECTION REQUIRES ELEGANT RECURSION INTO SUB-DIRECTORIES
const markups   = {}
const markupFileNames = rus.node.fs.readdirSync ('/var/task/tasks', {
    withFileTypes: true
})
markupFileNames.forEach ( ( current, index, array ) => {
    if (current.isFile()) {
        
        // console.warn(`searching in:`, current.name.slice (0, -3), `for`, '/var/task/tasks/' + current.name )
        
        markups[ current.name.slice (0, -3) ] = require ( '/var/task/tasks/' + current.name )
    }        
} // , thisArg  
)

/*  1.
 *  DEFAULT :   OPTIMISATION : completely de-coupled (task, layout)
 *  
 *  Layouts and task+markup should be treated as separate siloes. In such a case,
 *  tasks should avoid getting data from (data.RU.io.layoutXYZ). In this case 
 *  layouts can then be processed AFTER other tasks, as this avoids unnecessary
 *  processing if the task wants to respond with a non-markup (therefore non-
 *  layout requiring) response. So layouts maybe would be processed in 
 *  (compose-response.js) which runs after (router.js).
 *
 *  2.
 *  OPTIONAL:   OPTIMISATION : tightly-coupled (task, layout)
 *  
 *  Layouts should get processed BEFORE other tasks, as layouts are more 
 *  general in scope. This enables (data.RU.io.layoutXYZ) to be accessed
 *  somewhat predictably (?!) by tasks which use this layout, thereby reducing
 *  io. So layouts maybe would be processed in (router.js) before task
 *
 *  
 *
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
            
            data.
                
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
                throw   Error (`(middlewares/compose-response.js) could not find (${ data.RU.signals.markupName 
                        }.js) in the markups directory. That name was specified at
                        (data.RU.response.markup).
                        
                        The following may be informative:
                        
                        ${ await rus.additionalRequestInformation ( data )}`)
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
                throw   Error (`(middlewares/compose-response.js) could not find 
                        (${ data.RU.signals.inferredMarkupName }) 
                        in the markups directory. That name was guessed because 
                        (${ data.RU.signals.taskname }) was specified at 
                        (data.RU.signals.taskname).

                        The following may be informative:
                        
                        ${ await rus.additionalRequestInformation ( data )}`)
            }
        }
        
        
        
        
    }
    else {
        throw   Error (`(middlewares/compose-response.js) found that 
                (data.RU.response) is falsy. Not sure how to proceed.
                This is usually not a problem as it should be initiated at 
                (ruthenium.js).`)
    }
    
    return data
}

module.exports  = composeResponse
rus.mark (`compose-response.js LOADED`)