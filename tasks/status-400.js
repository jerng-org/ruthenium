'use strict'

const rus = require ( '/var/task/modules/r-u-s.js' )

const status400 = async ( data ) => {
    data.RU.signals.sendResponse.statusCode = 400
    data.RU.signals.sendResponse.body = 'HTTP Response Status 400 : Bad Request : What were you trying to do?'
}

module.exports = status400 
rus.mark ( `~/tasks/status-400.js LOADED` )