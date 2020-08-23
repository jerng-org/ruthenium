'use strict'

const rus = require ( '/var/task/modules/r-u-s.js' )

const status400 = async ( data ) => {
    data.RU.signals.sendResponse.statusCode = 400
    data.RU.signals.sendResponse.body = 
        'HTTP Response Status Code <h2>400 Bad Request</h2><h3>What were you trying to do?</h3>'
}

module.exports = status400 
rus.mark ( `~/tasks/status-400.js LOADED` )