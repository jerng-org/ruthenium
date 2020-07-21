'use strict'

const rus = require ( '/var/task/modules/r-u-s.js' )

const status404 = async ( data ) => {
    data.RU.signals.sendResponse.statusCode = 404
    data.RU.signals.sendResponse.body = 'HTTP Response Status 404 : Not Found : What were you looking for?'
}

module.exports = status404
rus.mark ( `~/tasks/status-404.js LOADED` )