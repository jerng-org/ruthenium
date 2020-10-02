'use strict'

//  Provide a debuggable function name, 
//  in order to avoid debuggin (function).toString()

const rus = require('/var/task/modules/r-u-s.js')

const uuid4Create = async(data) => {

    data.RU.signals.noLayout = true

    const quantity = data.RU.request.queryStringParameters.quantity ?
        data.RU.request.queryStringParameters.quantity :
        1

    data.RU.signals.sendResponse = { body: Array.from ( Array( quantity )).map( _ => await rus.uuid4() ) } 

    rus.mark(`~/tasks/_template-task.js EXECUTED`)
}
// manipulate (data.RU), for example
// no need to return (data)

module.exports = uuid4Create
rus.mark(`~/tasks/uuid4Create.js LOADED`)
