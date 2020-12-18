'use strict'

const mark = require('/var/task/modules/mark.js')

//  Provide a debuggable function name, 
//  in order to avoid debuggin (function).toString()

const s3pre = async ( data ) => {
    
    // manipulate (data.RU.io.s3pre), for example
    // no need to return (data)



    mark ( `(s3pre.js) EXECUTED` )
}

module.exports = s3pre
mark ( `(s3pre.js) LOADED` )