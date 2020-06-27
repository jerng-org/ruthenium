'use strict'

//  Provide a debuggable function name, 
//  in order to avoid debuggin (function).toString()

const rus = require ( '/var/task/modules/r-u-s.js' )

const cookieTest = async ( data ) => {

    const body = `
    
    <h1>cookie debug</h1>
    <pre>${await rus.print.stringify4 ( data.RU.request.headers.cookies )} </pre>`

    data.RU.signals.sendResponse
        = { ... data.RU.signals.sendResponse, body: body } 

    rus.mark ( `cookie-test.js EXECUTED` )
}
// manipulate (data.RU), for example
// no need to return (data)

module.exports = cookieTest
rus.mark ( `~/tasks/cookie-test.js LOADED` ) 