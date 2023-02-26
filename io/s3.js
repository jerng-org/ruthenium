'use strict'

const mark = require('/var/task/modules/mark.js')

//  Provide a debuggable function name, 
//  in order to avoid debuggin (function).toString()


const { S3Client } = require("@aws-sdk/client-s3")

module.exports = new S3Client()

mark ( `~/io/s3.js LOADED` )