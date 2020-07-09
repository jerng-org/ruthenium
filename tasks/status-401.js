'use strict'

const rus = require ( '/var/task/modules/r-u-s.js' )

const status404 = async ( data ) => {
    data.RU.signals.sendResponse.statusCode = 401
    data.RU.signals.sendResponse.body = 'HTTP Response Status 401 : Unauthorized : Perhaps you have not logged in.'
}

module.exports = status404 
rus.mark ( `~/tasks/status-404.js LOADED` )