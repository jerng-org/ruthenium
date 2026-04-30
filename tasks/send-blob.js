import rus from "/var/task/modules/r-u-s.js";

'use strict'
const blobs = {}

// SAFELIST - until we add something like https://www.npmjs.com/package/mime
const blobMimeTypes = {
    'milligram.min.css':`text/css`,
    'ruthenium-web-client.mjs':`text/javascript`,
    'csv-validation-demo.html':'text/html'
}

let blobFileNames 
switch ( rus.conf.platform.javascriptEngine ) {
    case ( 'NODEJS' ) : {
        blobFileNames = rus.node.fs.readdirSync ('/var/task/io/blobs')
        blobFileNames.forEach ( ( current, index, array ) => {
            blobs[ current ] = rus.node.fs.readFileSync ( '/var/task/io/blobs/' + current, 'utf8' )
        } /* , thisArg */ ) 
        break
    }
    case ( 'TXIKIJS' ) : {
        blobFileNames = await tjs.readDir('/var/task/io/blobs')
        for await (current of blobFileNames) {
            blobs[ current ] = await tjs.readFile ( '/var/task/io/blobs/' + current)
        }  
        break
    }
    default : {
        throw new Error ('send-blob.js : branch undefined')
    }
}

const sendBlob = async ( data ) => {
    
    data.RU.signals.sendBlob = {
        'body':         blobs [ data.RU.request.queryStringParameters.file ],
        'content-type': blobMimeTypes [ data.RU.request.queryStringParameters.file ]
    } 
        
    
    // no need to return data
}

export default sendBlob;