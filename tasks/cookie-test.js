'use strict'

const rus = require ( '/var/task/modules/r-u-s.js' )

/*  This middleware looks in (data.RU.signals.sendResponse.setCookies)
 *
 *  Framework users may call (rus.cookie.<<various>>) to manipulate the above.
 */


const cookieTest = async ( data ) => {

    rus.cookie.set ( data, 'cookie_name', 'cookie_value' )
    //rus.cookie.expire ( data, 'session' )
    
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