'use strict'

const rus = require ( '/var/task/modules/r-u-s.js' )

const status422 = async ( data ) => {
    data.RU.signals.sendResponse.statusCode = 422
    data.RU.signals.sendResponse.body = 'HTTP Response Status Code <h2>422 Unprocessable Entity</h2><h3>Syntax understood; Semantics ... not so much.</h3>'
}

module.exports = status422
rus.mark ( `~/tasks/status-422.js LOADED` )