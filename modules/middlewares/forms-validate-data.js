import rus from "/var/task/modules/r-u-s.js";

'use strict'
const formsValidateData = async (data) => {

    rus.frameworkDescriptionLogger.callStarts()
    //  This doesn't do anything yet.

    //  throw Error ( data )

    rus.frameworkDescriptionLogger.callEnds()

    return data

}

export default formsValidateData;
rus.mark('LOADED')