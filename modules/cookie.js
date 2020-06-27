'use strict'

const mark      = require ( '/var/task/modules/mark.js' )


/*  This modules modifies (data.RU.signals.sendResponse.setCookies)
 *
 *      The middleware (set-cookies.js) will refer to the above.
 *
 *  (data) from middlewares is taken as the first argument for each of the 
 *  functions below; this helps us stick to the heuristic of explicity, at
 *  the expense of succinctness;
 *
 *
 */


/*                                                  
 *  rus.cookie.set      ( name,                  value, { attributes } )      
 *  rus.cookie.set      ( {name, Path, Domain},  value, { attributes } )    //  Use defaults if ID is incompletely defined
 *
 *  rus.cookie.expire   ( name )                           
 *  rus.cookie.expire   ( {name, Path, Domain} )                            //  Use defaults if ID is incompletely defined
 *
 *      How to use cookies, attributes ; LINK
 *
 *  rus.cookie.__SecureSet    ( suffix, value, { attributes } )
 *  rus.cookie.__SecureExpire ( suffix )
 *
 *      How to use __Secure- prefixed cookies ; LINK
 *
 *  rus.cookie.__HostSet      ( suffix, value, { attributes } )
 *  rus.cookie.__HostExpire   ( suffix )
 *
 *      How to use __Host- prefixed cookies ; LINK
 *
 *
 *
 *
 */

/*  Some default values: (WIP)

        id : {
            name:   'hi',                               //  default values:
            Path:   '/',                                    //  '/'
            Domain: 'secure.api.sudo.coffee'                //  undefined
        },
        value : 'my cookie value',
        attributes : {                                  //  default values:
            Expires:        undefined,                      //  new Date( <<four signatures>>).toUTCString()
            ['Max-Age']:    undefined,                      //  3600 <<seconds>>
            Secure:         undefined,                      //  true
            HttpOnly:       undefined,                      //  true
            SameSite:       undefined,                      //  'Strict'
        }

*/

const defaultAttributes = {
    
}

const __SecureDefaultAttributes = {
    
}

const __HostDefaultAttributes = {
    
}

const cookie     = async () => { return {

    set:            
        ( DATA, id, value, attributes ) => {
        
        },
    
    __SecureSet:    
        ( DATA, suffix, value, attributes ) => {
        
        },
    
    __HostSet:      
        ( DATA, suffix, value, attributes ) => {
        
        },
    
    expire:         
        ( DATA, id ) => {
        
        },
    
    __SecureExpire: 
        ( DATA, suffix ) => {
        
        },
    
    __HostExpire:   
        ( DATA, suffix ) => {
        
        },
    
} }

module.exports  = cookie 
mark (`~/modules/cookie.js LOADED`)