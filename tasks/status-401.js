'use strict'

const rusMinus1 = require(`/var/task/modules/r-u-s-minus-one.js`)

const status401 = async ( data ) => {
    data.RU.signals.sendResponse.statusCode = 401
    data.RU.signals.sendResponse.body = '<h3>HTTP Response Status Code</h3><h2>401 Unauthorized</h2>Perhaps you have not logged in.'
}

module.exports = status401 
rusMinus1.mark ( `~/tasks/status-401.js LOADED` )