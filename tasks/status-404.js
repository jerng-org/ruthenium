'use strict'

const rus = require ( '/var/task/modules/r-u-s.js' )

const status404 = async ( data ) => {
    data.RU.signals.sendResponse.statusCode = 404
    data.RU.signals.sendResponse.body = '<h3>HTTP Response Status Code</h3><h2>404 Not Found</h2>What were you looking for?'
}

module.exports = status404
rus.mark ( `~/tasks/status-404.js LOADED` )