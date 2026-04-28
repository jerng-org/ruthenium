import rus from "/var/task/modules/r-u-s.js";

'use strict'
const returnResponse = async (data) => {

    rus.frameworkDescriptionLogger.callStarts()
    rus.frameworkDescriptionLogger.callEnds()

    return data.RU.response
}

export default returnResponse;
rus.mark('LOADED')