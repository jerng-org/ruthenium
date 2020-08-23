'use strict'

const rus = require ( '/var/task/modules/r-u-s.js' )

const status423 = async ( data ) => {
    data.RU.signals.sendResponse.statusCode = 423
    data.RU.signals.sendResponse.body = '<h3>HTTP Response Status Code</h3><h2>423 Locked</h2>You may not proceed.'
}

module.exports = status423
rus.mark ( `~/tasks/status-423.js LOADED` )