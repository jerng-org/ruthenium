'use strict'

const rusMinus1 = require(`/var/task/modules/r-u-s-minus-one.js`)

const status501 = async ( data ) => {
    data.RU.signals.sendResponse.statusCode = 501
    data.RU.signals.sendResponse.body = 
    '<h3>HTTP Response Status Code</h3><h2>501 Not Implemented</h2>Please report this to the system administrator.'
}

module.exports = status501 
rusMinus1.mark ( `~/tasks/status-501.js LOADED` )