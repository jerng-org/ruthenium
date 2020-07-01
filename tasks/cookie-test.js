'use strict'

const rus = require ( '/var/task/modules/r-u-s.js' )

/*  This middleware looks in (data.RU.signals.sendResponse.setCookies)
 *
 *  Framework users may call (rus.cookie.<<various>>) to manipulate the above.
 */


const cookieTest = async ( data ) => {

    //rus.cookie.__HostSet ( data, 'cookie_name', 'cookie_value' )
    //rus.cookie.__SecureSet ( data, 'cookie_name', 'cookie_value' )
    /*
    rus.cookie.set ( data, 'cookie_name', 'cookie_value', {
        Path:   false,
        //Path: '/test-middleware',
        Domain: false,
        //Domain: 'secure.api.sudo.coffee',
        Secure: false,
        HttpOnly:   false,
        Expires:    false,
        ['Max-Age']:false,
        SameSite:   false,
        //SameSite: 'None', // no problem
        //SameSite: 'Lax' // no problem
        SameSite: 'Strict' // bad
    } )
    //*/
    //rus.cookie.expire ( data, 'cookie_name' )
    //rus.cookie.__SecureExpire ( data, 'cookie_name' )
    rus.cookie.__HostExpire ( data, 'cookie_name' )
    
    const body = `
        <h1>cookie debugging</h1>
        <pre>${
        await rus.print.stringify4 ( data.RU.request.headers.cookies )
        } </pre>`

    data.RU.signals.sendResponse
        = { ... data.RU.signals.sendResponse, body: body } 

    rus.mark ( `cookie-test.js EXECUTED` )
}
// manipulate (data.RU), for example
// no need to return (data)

module.exports = cookieTest
rus.mark ( `~/tasks/cookie-test.js LOADED` ) 