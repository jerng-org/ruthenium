'use strict'

const rus = require ( '/var/task/modules/r-u-s.js' )

const status403 = async ( data ) => {
    data.RU.signals.sendResponse.statusCode = 403
    data.RU.signals.sendResponse.body = 'HTTP Response Status 403 : Forbidden : Perhaps this is not the right way to ask for that resource.'
}

module.exports = status403 
rus.mark ( `~/tasks/status-403.js LOADED` )