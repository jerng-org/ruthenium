'use strict'

import rusMinus1 from '/var/task/modules/r-u-s-minus-1.js'
const mark =rusMinus1.mark

const status409 = async ( data ) => {
    data.RU.signals.sendResponse.statusCode = 409
    data.RU.signals.sendResponse.body = '<h3>HTTP Response Status Code</h3><h2>409 Conflict</h2> ... with current state of the resource.'
}

export default status409;
mark('LOADED')