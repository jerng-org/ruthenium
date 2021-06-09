'use strict'

const rus = require ( '/var/task/modules/r-u-s.js' )

const status409 = async ( data ) => {
    data.RU.signals.sendResponse.statusCode = 409
    data.RU.signals.sendResponse.body = '<h3>HTTP Response Status Code</h3><h2>409 Conflict</h2> ... with current state of the resource.'
}

module.exports = status409
rus.mark ( `~/tasks/status-409.js LOADED` )