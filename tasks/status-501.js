'use strict'

const rus = require ( '/var/task/modules/r-u-s.js' )

const status501 = async ( data ) => {
    data.RU.signals.sendResponse.statusCode = 501
    data.RU.signals.sendResponse.body = 'HTTP Response Status 501 : Not Implemented : Please report this to the system administrator.'
}

module.exports = status501 
rus.mark ( `~/tasks/status-501.js LOADED` )