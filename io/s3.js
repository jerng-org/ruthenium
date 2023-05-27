'use strict'

const rusMinus1 = require('/var/task/modules/r-u-s-minus-1.js')
const mark = rusMinus1.mark 

//  Provide a debuggable function name, 
//  in order to avoid debuggin (function).toString()


const { S3Client } = require("@aws-sdk/client-s3")

module.exports = new S3Client()

mark ( `~/io/s3.js LOADED` )