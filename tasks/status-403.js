'use strict'

const rusMinus1 = require(`/var/task/modules/r-u-s-minus-one.js`)

const status403 = async ( data ) => {
    data.RU.signals.sendResponse.statusCode = 403
    data.RU.signals.sendResponse.body = '<h3>HTTP Response Status Code</h3><h2>403 Forbidden</h2>Perhaps this is not the right way to ask for that resource.'
}

module.exports = status403 
rusMinus1.mark ( `~/tasks/status-403.js LOADED` )