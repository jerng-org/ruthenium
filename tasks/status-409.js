'use strict'

const rusMinus1 = require(`/var/task/modules/r-u-s-minus-1.js`)
const mark =rusMinus1.mark

const status409 = async ( data ) => {
    data.RU.signals.sendResponse.statusCode = 409
    data.RU.signals.sendResponse.body = '<h3>HTTP Response Status Code</h3><h2>409 Conflict</h2> ... with current state of the resource.'
}

module.exports = status409
mark ( `~/tasks/status-409.js LOADED` )