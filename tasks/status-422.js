'use strict'

const rus = require ( '/var/task/modules/r-u-s.js' )

const status422 = async ( data ) => {
    data.RU.signals.sendResponse.statusCode = 422
    data.RU.signals.sendResponse.body = '<h2>HTTP Response Status 422 : Unprocessable Entity</h2><h3>Syntax understood; Semantics ... not so much.</h3>'
}

module.exports = status422
rus.mark ( `~/tasks/status-422.js LOADED` )