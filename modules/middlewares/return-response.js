'use strict'

const rus = require('/var/task/modules/r-u-s.js')

const returnResponse = async (data) => {

    rus.frameworkDescriptionLogger.callStarts()
    rus.frameworkDescriptionLogger.callEnds()

    return data.RU.response
}
module.exports = returnResponse
rus.mark(`~/modules/middlewares/return-response.js LOADED`)
