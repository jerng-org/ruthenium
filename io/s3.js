'use strict'

const mark = require('/var/task/modules/mark.js')

//  Provide a debuggable function name, 
//  in order to avoid debuggin (function).toString()

const s3 = require(`aws-sdk/clients/s3`)

module.exports = s3

mark ( `~/io/s3.js LOADED` )