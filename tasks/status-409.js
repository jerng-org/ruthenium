'use strict'

const rus = require ( '/var/task/modules/r-u-s.js' )

const status409 = async ( data ) => {
    data.RU.signals.sendResponse.statusCode = 409
    data.RU.signals.sendResponse.body = '<h2>HTTP Response Status 409 : Conflict</h2><h3>with current state of the resource.</h3>'
}

module.exports = status409
rus.mark ( `~/tasks/status-409.js LOADED` )