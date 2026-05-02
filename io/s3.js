console.log(`s3 : TOP`)
import rusMinus1 from "../modules/r-u-s-minus-1.js";

let S3Client

switch (rusMinus1.conf.platform.javascriptEngine) {
    case ('NODEJS'): {
        ({ S3Client } = await import ("@aws-sdk/client-s3"));
        break
    }
    case ('TXIKIJS'): {
        ({ S3Client } = await import ("../node_modules/@aws-sdk/client-s3"));
        break
    }
    default: { throw new Error('s3 : branch not implemented') }
}

const mark = rusMinus1.mark 

//  Provide a debuggable function name, 
//  in order to avoid debuggin (function).toString()

export default new S3Client()

mark('LOADED')
