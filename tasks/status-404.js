'use strict'

const rus = require ( '/var/task/modules/r-u-s.js' )

const status401 = async ( data ) => {
    data.RU.signals.sendResponse.statusCode = 404
    data.RU.signals.sendResponse.body = 'HTTP Response Status 404 : Not Found : Unqualified'
}

module.exports = status401
rus.mark ( `~/tasks/status-401.js LOADED` )