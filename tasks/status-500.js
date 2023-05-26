'use strict'

const rusMinus1 = require(`/var/task/modules/r-u-s-minus-one.js`)

const status500 = async ( data ) => {
    data.RU.signals.sendResponse.statusCode = 500
    data.RU.signals.sendResponse.body = '<h3>HTTP Response Status Code</h3><h2>500 Internal Server Error</h2>Please report this to the system administrator.'
}

module.exports = status500 
rusMinus1.mark ( `~/tasks/status-500.js LOADED` )