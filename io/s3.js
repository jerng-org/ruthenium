import rusMinus1 from "../modules/r-u-s-minus-1.js";
import { S3Client } from "../node_modules/@aws-sdk/client-s3";

'use strict'
const mark = rusMinus1.mark 

//  Provide a debuggable function name, 
//  in order to avoid debuggin (function).toString()

export default new S3Client()

mark('LOADED')
