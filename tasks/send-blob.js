'use strict'

const rus   = require ( '/var/task/modules/r-u-s.js' )
const blobs = {}

// SAFELIST - until we add something like https://www.npmjs.com/package/mime
const blobMimeTypes = {
    'index.html':`text/html`,
    'milligram.min.css':`text/css`,
    'ruthenium-web-client.mjs':`text/javascript`,
}

if ( rus.conf.verbosity > 0 )
{   
    const stack = (new Error).stack; 
    console.warn ( `⚠ DEBT_NOTE ⚠`, 
        stack.substring( stack.indexOf( '(' ), stack.indexOf( ')' ) + 1 ) )
}

const blobFileNames = rus.node.fs.readdirSync ('/var/task/io/blobs')
blobFileNames.forEach ( ( current, index, array ) => {
    blobs[ current ] = rus.node.fs.readFileSync ( '/var/task/io/blobs/' + current, 'utf8' )
} /* , thisArg */ ) 


const sendBlob = async ( data ) => {
    
    data.RU.signals.sendBlob = {
        'body':         blobs [ data.RU.request.queryStringParameters.file ],
        'content-type': blobMimeTypes [ data.RU.request.queryStringParameters.file ]
    } 
        
    
    // no need to return data
}

module.exports  = sendBlob