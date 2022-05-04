'use strict'

const rus = require('/var/task/modules/r-u-s.js')

const formsValidateData = async (data) => {

    rus.frameworkDescriptionLogger.callStarts()
    //  This doesn't do anything yet.

    //  throw Error ( data )

    rus.frameworkDescriptionLogger.callEnds()

    return data

}

module.exports = formsValidateData
rus.mark(`~/modules/middlewares/forms-validate-data.js LOADED`)
