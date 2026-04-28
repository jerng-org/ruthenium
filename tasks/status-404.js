'use strict'

import rusMinus1 from '/var/task/modules/r-u-s-minus-1.js'
const mark =rusMinus1.mark

const status404 = async ( data ) => {
    data.RU.signals.sendResponse.statusCode = 404
    data.RU.signals.sendResponse.body = '<h3>HTTP Response Status Code</h3><h2>404 Not Found</h2>What were you looking for?'
}

export default status404;
mark('LOADED')