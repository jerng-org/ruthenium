'use strict'

const rus = require ( '/var/task/modules/r-u-s.js' )

const status422 = async ( data ) => {
    data.RU.signals.sendResponse.statusCode = 422
    data.RU.signals.sendResponse.body = '<h3>HTTP Response Status Code</h3><h2>422 Unprocessable Entity</h2>Syntax understood; Semantics ... not so much.'
}

module.exports = status422
rus.mark ( `~/tasks/status-422.js LOADED` )