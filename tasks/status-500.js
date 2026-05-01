'use strict'

import rusMinus1 from '../modules/r-u-s-minus-1.js'
const mark =rusMinus1.mark

const status500 = async ( data ) => {
    data.RU.signals.sendResponse.statusCode = 500
    data.RU.signals.sendResponse.body = '<h3>HTTP Response Status Code</h3><h2>500 Internal Server Error</h2>Please report this to the system administrator.'
}

export default status500;
mark('LOADED')