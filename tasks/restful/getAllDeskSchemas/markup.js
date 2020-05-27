'use strict'

const mark 
    = require ( '/var/task/modules/mark' )            

const fs
    = require ( 'fs' )

const htmlIndex
    = fs.readFileSync ( '/var/task/io/blobs/index.html', { encoding: 'utf8' } )

const tableInMarkup
    = require (`/var/task/tasks/restful/getAllDeskSchemas/tableInMarkup.js`) 

const allDeskSchemasMarkup = async ( data ) => {

    const markup 
    
        = htmlIndex 
    
        + await tableInMarkup ( data.RU.io.deskSchemasScan )
    
        + ` <h6>initialTaskMarkup.js:</h6>
            <pre><code>${ JSON.stringify( data.RU.io.deskSchemasScan, null, 4 ) }</code></pre>`

    return markup
}

module.exports  = allDeskSchemasMarkup
mark ( `restful/allDeskSchemasMarkup/index.js LOADED` )