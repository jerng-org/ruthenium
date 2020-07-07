'use strict'

const rus = require ( '/var/task/modules/r-u-s.js' )

const test1 = async ( data ) => {

    data.RU.signals.sendResponse.body = 'test1.js TASK EXECUTED'

    rus.mark ( `~/tasks/test1.js EXECUTED` )
}

module.exports = test1
rus.mark ( `~/tasks/test1.js LOADED` )