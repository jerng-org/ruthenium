'use strict'

const rus = require ( '/var/task/modules/r-u-s.js' )

const status500 = async ( data ) => {
    data.RU.signals.sendResponse.statusCode = 500
    data.RU.signals.sendResponse.body = 'HTTP Response Status Code <h2>500 Internal Server Error</h2><h3>Please report this to the system administrator.</h3>'
}

module.exports = status500 
rus.mark ( `~/tasks/status-500.js LOADED` )