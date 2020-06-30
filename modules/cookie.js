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
 *      rus.cookie.set      ( name,                  value, { attributes } )      
 *      rus.cookie.set      ( {name, Path, Domain},  value, { attributes } )    
 *  
 *      rus.cookie.expire   ( name )                           
 *      rus.cookie.expire   ( {name, Path, Domain} )                            
 *  
 *      -   How to use cookies, attributes ; LINK
 *      -   Use defaults if (idObject) is incompletely defined
 *  
 *      rus.cookie.__SecureSet    ( suffix,                 value, { attributes } )
 *      rus.cookie.__SecureSet    ( {suffix, Path, Domain}, value, { attributes } ) 
 *
 *      rus.cookie.__SecureExpire ( suffix )
 *      rus.cookie.__SecureExpire ( {suffix, Path, Domain} )                        
 *  
 *      -   How to use __Secure- prefixed cookies ; LINK
 *      -   Use defaults if (idObject) is incompletely defined
 *  
 *      rus.cookie.__HostSet      ( suffix, value, { attributes } )
 *      rus.cookie.__HostExpire   ( suffix )
 *  
 *      -   How to use __Host- prefixed cookies ; LINK
 *      -   ID properties (except suffix) are not customisable by definition
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
 *      attributes : {                                  //  default values:
 *          Expires:        undefined,                      //  new Date( <<four signatures>>) // set-cookies.js is responsible for conversion to.toUTCString()
 *          ['Max-Age']:    undefined,                      //  3600 <<seconds>>
 *          Secure:         undefined,                      //  true
 *          HttpOnly:       undefined,                      //  true
 *          SameSite:       undefined,                      //  'Strict'
 *      }
 *
 *  USAGE
 *
 *      Each pair of (Xset) and (Xexpire) functions will mirror each other.
 *      If (Xset) applies defaults when objectID keys are not provided by the 
 *      user, then (Xexpires) will follow in the same pattern.
 *
 */

const __HostDefaultIdAttributes = {
    Path :'/',
    Domain: false,  //  << origin only, min. surface, max. security; a subset of the __Host- prefix specification >>
}

const defaultIdAttributes = __HostDefaultIdAttributes   // This relationship is not necessarily the case in the future

const defaultAttributes = {
    
    ... defaultIdAttributes,
    Expires: false,     //  << ['Max-Age'] has precedence >>
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
                                    Domain: false }
    // redundant safety, in case defaultAttributes is modified in the future


const checkId = id => {

    switch ( typeof id ) {
        case ('string'):
            id = { name: id } 
            break
        case ('object'):
            checkIdObject ( id )    // throws if id.name is missing
            break
        default:
            throw (`(cookie.js) (cookie.checkId) argument (id) was typeof neither (string) nor (object)`)
    }
    // therefore, id.name by now MUST exist

    return id
}

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

const setCookieSignal = ( DATA, id, value, attributes ) => {
            
    if ( ! value ) throw Error ( `(cookie.js) (cookie.set) second argument (value) is falsy` )
    
    const checkedId = checkId ( id )

    // enforce defaults; give (checkedId) props precedence over (attribute)
    return { 
        
        ... defaultAttributes,
        ... checkedId,          // must have (name), but may be missing Path or Domain
        value : value           // goes last to ensure it isn't overwritten
    }
}

const expireCookieSignal = ( DATA, id ) => {
    
    const checkedId = checkId ( id )
    
    // enforce defaults; give (checkedId) props precedence over (attribute)
    return {
        
        ... defaultIdAttributes,
        ... checkedId,              // must have (name), but may be missing Path or Domain
        Expires: new Date (0),      //  << ['Max-Age'] has precedence >> // set-cookies.js is responsible for conversion to.toUTCString()
        ['Max-Age']: -1,            // RFC 6265.4.1.1. "non-zero digit" thus encourages a negative number
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
     *  At this point, neither (set) nor (checkIdObject) will check/disallow
     *  empty strings. Reconsider : TODO; this may result in some errors due
     *  to entities between keyboard and chair, however these errors ought to
     *  to be transparent to, and thus manageable by such entities;
     */
    set:            
        ( DATA, id, value, attributes ) => {
           
            const cookieSignal = setCookieSignal ( DATA, id, value, attributes ) 
            
            DATA.RU.signals.sendResponse.setCookies.push ( cookieSignal )
            
console.warn(`test cookie-value string='false' and check what happens`) 
            
        },
    
    __SecureSet:    
        ( DATA, suffix, value, attributes ) => {
            
            const cookieSignal = setCookieSignal ( DATA, suffix, value, attributes ) 
            
            cookieSignal.name   = `__Secure-` + cookieSignal.name
            cookieSignal.Secure = true
            
            DATA.RU.signals.sendResponse.setCookies.push ( cookieSignal )
        },
    
    __HostSet:      
        ( DATA, suffix, value, attributes ) => {
        
            const cookieSignal = setCookieSignal ( DATA, suffix, value, attributes ) 
            
            cookieSignal.name   = `__Host-` + cookieSignal.name
            cookieSignal.Secure = true
            cookieSignal.Path   = __HostDefaultIdAttributes.Path
            cookieSignal.Domain = __HostDefaultIdAttributes.Domain
            
            DATA.RU.signals.sendResponse.setCookies.push ( cookieSignal )
        },
    
    expire:         
        ( DATA, id ) => {
            
            const cookieSignal = expireCookieSignal ( DATA, id ) 
            
            DATA.RU.signals.sendResponse.setCookies.push ( cookieSignal )
        },
    
    __SecureExpire: 
        ( DATA, suffix ) => {
        
            const cookieSignal = expireCookieSignal ( DATA, suffix ) 
            cookieSignal.name   = `__Secure-` + cookieSignal.name
            
            DATA.RU.signals.sendResponse.setCookies.push ( cookieSignal )
            cookieSignal.Secure = true
        },
    
    __HostExpire:   
        ( DATA, suffix ) => {
        
            const cookieSignal = expireCookieSignal ( DATA, suffix ) 
            cookieSignal.name   = `__Host-` + cookieSignal.name
            cookieSignal.Secure = true
            cookieSignal.Path   = __HostDefaultIdAttributes.Path
            cookieSignal.Domain = __HostDefaultIdAttributes.Domain
            
            DATA.RU.signals.sendResponse.setCookies.push ( cookieSignal )
        },
    
} }

module.exports  = cookie 
mark (`~/modules/cookie.js LOADED`)