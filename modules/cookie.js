'use strict'

const mark      = require ( `/var/task/modules/mark.js` )
const conf      = require ( `/var/task/configuration.js` )

/*  This modules pushed into (data.RU.signals.sendResponse.setCookies) a 
 *  signal of the form:
 *
 *      {   name:   STRING,
 *          value:  STRINGIFIED,
 *          ... attributes
 *      }
 *
 *  The middleware (set-cookies.js) will refer to the above.
 *
 *  (data) from middlewares is taken as the first argument for each of the 
 *  functions below; this helps us stick to the heuristic of explicity, at
 *  the expense of succinctness;
 *
 *
 */


/*  SIGNATURES
 *
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
 *  PARAMETERS
 *
 *      DATA        -   a POJO, the standard framework lifecycle (data) object
 *
 *      ID          -   a POJO, with the named properties:
 *                      -   name    :   cookie name, unquoted, unencoded
 *                      -   Path    :   see ATTRIBUTES
 *                      -   Domain  :   see ATTRIBUTES
 *
 *      VALUE       -   anything, which will be coerced to a string
 *
 *      ATTRIBUTES  -   a POJO, with the named properties; see
 *                      -   const defaulAttributes
 *                      -   const __SecureDefaultAttributes
 *                      -   const __HostDefaultAttributes
 *
 *
 *
 *
 *
 *
 *
 */

const defaultIdAttributes = {
    Path :'/',
    Domain: undefined,  //  << origin only, min. surface, max. security >>
}

const defaultAttributes = {
    
    ... defaultIdAttributes,
    Expires: undefined, //  << ['Max-Age'] has precedence >>
    ['Max-Age']: 3600,  //  << seconds; could be init in rus.conf TODO >>
    Secure: true,       //  << typically: client only sends cookie over TLS >>
    HttpOnly: true,     //  << client omits cookie from "non-HTTP" APIs >>
    SameSite: 'Strict'  //  << client omits cookies if server is hit via cross-site request [RFC 6265 5.3.7.1. ] >>
    
                                //  DRAFT TODO Explicit Consent for cross-site links: 
                                //      if page is 404 due to this policy,
                                //      then note the (intended/href) URL,
                                //      read the (referer) request header, then note that URL,
                                //      read the user's current (session) then note its state,
                                //      display the noted URLs and session state in a clear
                                //      !!! WARNING !!! to the user, beside a continuation link
}

const __SecureDefaultAttributes = { ... defaultAttributes, Secure: true }
    // redundant safety, in case defaultAttributes is modified in the future

const __HostDefaultAttributes = {   ... __SecureDefaultAttributes, 
                                    Path: '/', 
                                    Domain: undefined }
    // redundant safety, in case defaultAttributes is modified in the future


/*  This function does NOT SET any missing EXPECTED arguments.
 */
const checkIdObject = idObject => {
    if ( ! ( 'name' in idObject ) ) {
        throw Error (   `(cookie.js) (cookie.checkIdObject) second argument (id) has typeof 'object' but key 'name' was not found;` )
    }
    if ( ! ( 'Path' in idObject ) ) {
        conf.verbosity > 0 
            && console.warn (   `(cookie.js) (cookie.checkIdObject) second argument (id) has typeof 'object' but key 'Path' was not found; may default` )
    }
    if ( ! ( 'Domain' in idObject ) ) {
        conf.verbosity > 0 
            && console.warn (   `(cookie.js) (cookie.checkIdObject) second argument (id) has typeof 'object' but key 'Path' was not found; may default` )
    }
}

const cookie     = async () => { return {

    /*  Begin with user provided (attributes) argument;
     *
     *  -   check the idObject if it is provided; if it is provided, its Path
     *      and Domain properties take precedence over those in (attributes);
     *     
     *  -   allow user to overwrite defaults; but if user does not set any
     *      attribute then use the default value, forcing user to manually
     *      delete default value after calling (cookie.set);
     *
     *  -   set (name) and (value) appropriately;
     *  
     */
    set:            
        ( DATA, id, value, attributes ) => {
            
            if ( ! value ) throw Error ( `(cooke.js) (cookie.set) second argument (value) is falsy` )
            
            switch ( typeof id ) {
                case ('string'):
                    id = { name: id } 
                    break
                case ('object'):
                    checkIdObject ( id )    // throws if id.name is missing
                    break
            }
            // therefore, id.name by now MUST exist
            
            // enforce defaults; give (id) props precedence over (attribute)
            const cookieSignal = { 
                ... defaultAttributes,
                ... id,         // must have (name), but may be missing Path or Domain
                value : value   // goes last to ensure it isn't overwritten
            }
            
            DATA.RU.signals.sendResponse.setCookies.push ( cookieSignal )
            
console.warn(`test cookie-value string='false' and check what happens`) 
            
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