'use strict'

const mark      = require ( `/var/task/modules/mark.js` )
const conf      = require ( `/var/task/configuration.js` )

/*  QUICK START
 *
 *      PREFER:     rus.cookie.__HostSet   ( suffix, value )
 *                  rus.cookie.__HostExpire( suffix )
 *
 *                  ... over:
 *
 *                  rus.cookie.__SecureSet   ( suffix, value )
 *                  rus.cookie.__SecureExpire( suffix )
 *
 *                  ... over:
 *
 *                  rus.cookie.set   ( name, value )
 *                  rus.cookie.expire( name )
 *
 *  -   you can refine (stringName) to << explaination of (idObject) >>
 *
 *  -   default attributes will be applied ( some are configurable in rus.conf )
 *
 *
 *
 *  TODO
 *  -   more linkage to (rus.conf)
 *  -   multiple cookies with different SameSite values
 *  -   sessions
 *
 *
 *
 *  WORKFLOW 
 *
 *  This modules pushed into (data.RU.signals.sendResponse.setCookies) a 
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
 *          ['Max-Age']:    undefined,                      //  3600 << seconds ; use INTEGERS (set-cookie.js) will check for integers >>
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
                                //      !!! WARNING !!! to the user, beside a continuation link * Note at the bottom
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
            throw Error (`(cookie.js) (cookie.checkId) argument (id) (usually the 2nd argument of Xset or Xexpire) was typeof neither (string) nor (object)`)
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
            
    if ( ! value ) throw Error ( `(cookie.js) (cookie.set) third argument (value) is falsy` )
    
    const checkedId = checkId ( id )

    // enforce defaults; give (checkedId) props precedence over (attribute)
    return { 
        
        ... defaultAttributes,
        ... attributes,
        ... checkedId,          // must have (name), but may be missing Path or Domain
        value : value           // goes last to ensure it isn't overwritten
    }
}

const expireCookieSignal = ( DATA, id ) => {
    
    const checkedId = checkId ( id )
    
    // enforce defaults; give (checkedId) props precedence over (attribute)
    return {
        
        ... defaultIdAttributes,
        ... checkedId,                  // must have (name), but may be missing Path or Domain
        Secure:         defaultAttributes.Secure,
        Expires:        new Date (0),   // << ['Max-Age'] has precedence >> // set-cookies.js is responsible for conversion to.toUTCString()
        ['Max-Age']:    -1,             // RFC 6265.4.1.1. "non-zero digit" thus encourages a negative number
        value:          'expired'
    }

}

const cookie = {

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
        async ( DATA, id, value, attributes ) => {
           
            const cookieSignal = setCookieSignal ( DATA, id, value, attributes ) 
            
            DATA.RU.signals.sendResponse.setCookies.push ( cookieSignal )
            
console.warn(`test cookie-value string='false' and check what happens`) 
            
        },
    
    __SecureSet:    
        async ( DATA, suffix, value, attributes ) => {
            
            const cookieSignal  = setCookieSignal ( DATA, suffix, value, attributes ) 
            
            cookieSignal.name   = `__Secure-` + cookieSignal.name
            cookieSignal.Secure = true
            
            DATA.RU.signals.sendResponse.setCookies.push ( cookieSignal )
        },
    
    __HostSet:      
        async ( DATA, suffix, value, attributes ) => {
        
            const cookieSignal  = setCookieSignal ( DATA, suffix, value, attributes ) 
            
            cookieSignal.name   = `__Host-` + cookieSignal.name
            cookieSignal.Secure = true
            cookieSignal.Path   = __HostDefaultIdAttributes.Path
            cookieSignal.Domain = __HostDefaultIdAttributes.Domain
            
            DATA.RU.signals.sendResponse.setCookies.push ( cookieSignal )
        },
    
    expire:         
        async ( DATA, id ) => {
            
            const cookieSignal  = expireCookieSignal ( DATA, id ) 
            
            DATA.RU.signals.sendResponse.setCookies.push ( cookieSignal )
        },
    
    __SecureExpire: 
        async ( DATA, suffix ) => {
        
            const cookieSignal  = expireCookieSignal ( DATA, suffix ) 
            cookieSignal.name   = `__Secure-` + cookieSignal.name
            cookieSignal.Secure = true
            
            DATA.RU.signals.sendResponse.setCookies.push ( cookieSignal )
        },
    
    __HostExpire:   
        async ( DATA, suffix ) => {
        
            const cookieSignal  = expireCookieSignal ( DATA, suffix ) 
            cookieSignal.name   = `__Host-` + cookieSignal.name
            cookieSignal.Secure = true
            cookieSignal.Path   = __HostDefaultIdAttributes.Path
            cookieSignal.Domain = __HostDefaultIdAttributes.Domain
            
            DATA.RU.signals.sendResponse.setCookies.push ( cookieSignal )
        },
    
}

module.exports  = cookie 
mark (`~/modules/cookie.js LOADED`)

/*
I'm not sure if it's relevant to your use case: affiliate
marketing links.

I was referring rather to cookies used for authorisation.

Preamble 1a.  [CASTLE.TLD serves a HTTP response, with a set-cookie header, to
CLIENT, where the value of the cookie contains the authority to access
ResourceR.]

Test.  [UNKNOWN.TLD serves a HTTP response, containing a HTML link to
CASTLE.TLD, to CLIENT.] When CLIENT follows this link, we shall call such events
XSR-link; analogously, XSR-iframe, and XSR-POST will refer to events where
UNKNOWN.TLD initiates the CLIENT to do any such cross-site request.

-

Test-Scenario 1.  [Cookie was set with attribute SameSite=Strict.] Result: all
the XSRs will NOT send the cookie.

Test-Scenario 2.  [Cookie was set with attribute SameSite=Lax.] Result: all the
XSR-link WILL send the cookie, but XSR-iframe and XSR-POST will NOT send the
cookie. UNKNOWN.TLD can now initiate requests to ResourceR on CASTLE.TLD - which
seems a little dangerous.

Test-Scenario 3.  [Cookie was set with attribute SameSite=None.] Result: all the
XSRs WILL send the cookie. This is very dangerous, and no one is supposed to do
this anymore.

-

How about if we modify Preamble 1a?

Preamble 1b.  [CASTLE.TLD serves a HTTP response, with a set-cookie header, to
CLIENT - this is the same authorisation header indicated in Preamble 1a, under
Scenario 1. 

A second set-cookie header is attached, similar to the one issued under Scenario
2, but this cookie does not contain authority - instead it only contains a mark
that basically says, "whomsoever bears me, is logged in - but I do not tell you
whom". OK? So now we have cookies 1bStrict-Authoritative and 1bLax-Obfuscated]

Now back to Test. 

Test-Scenario 4 (a.k.a. Scenario 1.1.).  [1bStrict-Authoritative,
1bLax-Obfuscated.] Result: all XSRs will NOT send 1bStrict-Authoritative ... but
XSR-link WILL send 1bLax-Obfuscated. CASTLE.TLD can react to 1bLax-Obfuscated by
serving a HTTP response to CLIENT: with a HTML page that says:

"Hey, you seem familiar, but we're not sure who you are. You also asked for
ResourceR, but we have to be sure that we know you. Here is a link to ResourceR
... now if you click this you are generating a new HTTP request from CASTLE.TLD
to CASTLE.TLD, so that new request WILL contain the cookie
1bStrict-Authoritative, and thereby grant you access to ResourceR ... which is
more access than we can grant the first request initiated by UNKNOWN.TLD."

-

So all I was saying is, Scenario 4 is slower than Scenario 2.

I think it's supposed to be like this. I'm almost sure some
sites already do it like this. New to me. Then again, a more efficient
implementation is CASTLE.TLD receives the request, then 300s the CLIENT to
CASTLE.TLD, unless you really need the user to eyeball the asset request. Hmm

A version of this is mentionedin RFC 6265bis.8.8.2.

*/

/*  TEST NOTES:
 *  
 *  'use strict'
 *  
 *  const rus = require ( '/var/task/modules/r-u-s.js' )
 *  
 *  /// This middleware looks in (data.RU.signals.sendResponse.setCookies)
 *  //
 *  /// Framework users may call (rus.cookie.<<various>>) to manipulate the above.
 *  ///
 *  
 *  
 *  const cookieTest = async ( data ) => {
 *  
 *      //rus.cookie.__HostSet ( data, 'cookie_name', 'cookie_value' )
 *      //rus.cookie.__SecureSet ( data, 'cookie_name', 'cookie_value' )
 *      //rus.cookie.set ( data, 'cookie_name', 'cookie_value', {
 *      //    Path:   false,
 *      //    //Path: '/',
 *      //    Domain: false,
 *      //    //Domain: 'ruthenium-v1.dev.sudo.coffee',
 *      //    Secure: false,
 *      //    HttpOnly:   false,
 *      //    Expires:    false,
 *      //    ['Max-Age']:false,
 *      //    SameSite:   false,
 *      //    //SameSite: 'None', // no problem
 *      //    //SameSite: 'Lax' // no problem
 *      //    SameSite: 'Strict' // bad
 *      //} )
 *      //rus.cookie.expire ( data, 'cookie_name' )
 *      //rus.cookie.__SecureExpire ( data, 'cookie_name' )
 *      //rus.cookie.__HostExpire ( data, 'cookie_name' )
 *      
 *      const body = `
 *          <h1>cookie debugging</h1>
 *          <pre>${
 *          await rus.print.stringify4 ( data.RU.request.headers.cookies )
 *          } </pre>`
 *  
 *      data.RU.signals.sendResponse
 *          = { ... data.RU.signals.sendResponse, body: body } 
 *  
 *      rus.mark ( `cookie-test.js EXECUTED` )
 *  }
 *  // manipulate (data.RU), for example
 *  // no need to return (data)
 *  
 *  module.exports = cookieTest
 *  rus.mark ( `~/tasks/cookie-test.js LOADED` )
 */