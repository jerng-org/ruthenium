'use strict'

/*  rewrites the contents of (data.RU.request.http),
 *  therefore must executed only after the middleware (copyRequestParamters.js)
 *
 *  Addresses this issue by using a conventional tunnel approach: 
 *  https://softwareengineering.stackexchange.com/questions/114156/why-are-there-are-no-put-and-delete-methods-on-html-forms
 *
 *  Provide a debuggable function name, 
 *  in order to avoid debuggin (function).toString()
 * 
 *  TODO : check : this appears to do nothing for the time being 
 */

const rus = require ( '/var/task/modules/r-u-s.js' )

const formsTunnelRestfulMethods = async ( data ) => {
    
    if ( 'form-method' in data.RU.request.queryStringParameters ) {
        
        // Is there a more performant (whilst readable) way to write this?
        switch ( data.RU.request.queryStringParameters['form-method'][0].toUpperCase() ) {
            
            case ('PUT'):
                data.RU.request.http.method = 'PUT'
                break            
            case ('PATCH'):
                data.RU.request.http.method = 'PATCH'
                break            
            case ('DELETE'):
                data.RU.request.http.method = 'DELETE'
                break            
            default:
                // de nada
        }
        
    }
    
    return data

}
module.exports = formsTunnelRestfulMethods
rus.mark (`~/modules/middlewares/forms-tunnel-restful-methods.js LOADED`)