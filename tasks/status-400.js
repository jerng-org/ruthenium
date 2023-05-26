'use strict'

const rusMinus1 = require(`/var/task/modules/r-u-s-minus-one.js`)

const status400 = async ( data ) => {
    data.RU.signals.sendResponse.statusCode = 400
    data.RU.signals.sendResponse.body = 
        '<h3>HTTP Response Status Code</h3><h2>400 Bad Request</h2>What were you trying to do?'
}

module.exports = status400 
rusMinus1.mark ( `~/tasks/status-400.js LOADED` )