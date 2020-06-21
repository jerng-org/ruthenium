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


/*  Refer to "0. Notes on LAYOUTs, LAYOUT MARKUPs, and their interaction with 
 *  other tasks/markups" in (layout-set-default.js)
 */

/*  Example of Usage :  data.RU.response.body 
 *                          = wrapStringWithLayout ( data.RU.response.body )
 *
 */
 /*
const wrapStringWithLayout = async ( _data, _string ) => {

    if ( _data.RU.signals.layoutTaskName )
    {
        _data.RU.signals.inferredLayoutMarkupName
            = _data.RU.signals.layoutTaskName + '-markup'
            
        if ( _data.RU.signals.inferredLayoutMarkupName in markups )
        {
            await markups[_data.RU.signals.inferredLayoutMarkupName](_data)
        }
        else
        {
            throw Error (   `(compose-response.js),(wrapStringWithLayout) could not 
                            find (${ 
                            _data.RU.signals.inferredLayoutMarkupName 
                            }.js) in the markups directory. That name was specified at
                            (data.RU.response.inferredLayoutMarkupName).
                            
                            The following may be informative:
                            
                            ${ await rus.additionalRequestInformation ( _data )}`)
        }
    }
    else
    {   
        throw Error (   `(compose-response.js),(wrapStringWithLayout) was called; 
                        (data.RU.signals.layoutTaskName) was falsy - this is
                        normally set to a default value in (layout-set-default.js),
                        but the value may have been unset/erased between there 
                        and this line; if you wish for (wrapStringWithLayout)
                        to return the given string as-is, then consider creating
                        a layout which adds nothing to the given string, and 
                        then explicitly set that layout's name in 
                        (data.RU.signals.layoutTaskName). Otherwise, simply do
                        not run this function;`)
    }

}
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
                throw   Error (`(middlewares/compose-response.js) could not find (${ 
                        data.RU.signals.markupName 
                        }.js) in the (~/tasks) directory. That name was specified at
                        (data.RU.response.markupName).
                        
                        The following may be informative:
                        
                        ${ await rus.additionalRequestInformation ( data )}`)
            }
        }
        else
        if ( data.RU.signals.taskName ) {
            
            data.RU.signals.inferredMarkupName = data.RU.signals.taskName + '-markup'
            
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
                        (${ data.RU.signals.taskName }) was specified at 
                        (data.RU.signals.taskName).

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