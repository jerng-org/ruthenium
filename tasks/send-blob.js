'use strict'

// NODE
const fs    = require ( 'fs' )
const blobs = {}

// SAFELIST - until we add something like https://www.npmjs.com/package/mime
const blobMimeTypes = {
    'index.html':`text.html`,
    'milligram.min.css':`text/css`
}


const blobFileNames = fs.readdirSync ('/var/task/io/blobs')
blobFileNames.forEach ( ( current, index, array ) => {
    blobs[ current ] = fs.readFileSync ( '/var/task/io/blobs/' + current )
} /* , thisArg */ ) 


const sendBlobTask = async ( data ) => {
    
    data.RU.signals.sendBlob = {
        'body':         blobs [ data.RU.request.queryStringParameters.file ],
        'content-type': blobMimeTypes [ data.RU.request.queryStringParameters.file ]
    } 
        
    
    // no need to return data
}

module.exports  = sendBlobTask