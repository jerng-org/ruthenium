'use strict'

//  Provide a debuggable function name, 
//  in order to avoid debuggin (function).toString()

const rus = require ( '/var/task/modules/r-u-s.js' )

const s3PostPolicyTest = async ( data ) => {

    // YOUR CODE HERE
    
    // set data in ( data.RU.io.thisIsMyName )


    data.RU.signals.sendResponse.body = 'temporary body (s3-post-policy-test.js)'

    rus.mark ( `~/tasks/s3-post-policy-test.js EXECUTED` )
}
// manipulate (data.RU), for example
// no need to return (data)

module.exports = s3PostPolicyTest
rus.mark ( `~/tasks/s3-post-policy-test.js LOADED` )