'use strict'
const mark      = require ( '../modules/mark' )            

// NODE
const fs                    = require ( 'fs' )
const util                  = require ('util')
// MARKUP
const htmlIndex             = fs.readFileSync ( 'io/blobs/index.html', { encoding: 'utf8' } )
mark( `index.html READ`)
const tableOfTableSchemas   = require (`../markup/tableOfTableSchemas.js`) 

const initialTaskMarkup = async ( data ) => {

    return  ( 
        
        htmlIndex 
    
        + tableOfTableSchemas ( data.RU.io.gridSchemasScan )
    
        + ` <h6>initialTaskMarkup.js:</h6>
            <pre><code>${ JSON.stringify( data.RU.io.gridSchemasScan, null, 4 ) }</code></pre>`
    )
}

module.exports  = initialTaskMarkup
mark ( `initialTaskMarkup.js LOADED` )