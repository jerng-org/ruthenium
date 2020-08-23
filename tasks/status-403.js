'use strict'

const rus = require ( '/var/task/modules/r-u-s.js' )

const status403 = async ( data ) => {
    data.RU.signals.sendResponse.statusCode = 403
    data.RU.signals.sendResponse.body = 'HTTP Response Status Code <h2>403 Forbidden</h2><h3>Perhaps this is not the right way to ask for that resource.</h3>'
}

module.exports = status403 
rus.mark ( `~/tasks/status-403.js LOADED` )