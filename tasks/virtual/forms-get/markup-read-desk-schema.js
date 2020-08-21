'use strict'

const rus = require ( '/var/task/modules/r-u-s.js' )

const readDeskSchema = async ( data ) => {
    
    return `
    
        <h2>Desk Schema : <code>read one</code> </h2>
        
        <h3><code>pre</code></h3>
        <pre>
            ${ rus.print.stringify4 ( data.RU.io.deskSchemasGet ) }
        </pre>    
        
        <h3><code>code</code></h3>
        <code>
            ${ rus.print.stringify4 ( data.RU.io.deskSchemasGet ) }
        </code>    

        <h3><code>pre > code</code></h3>
        <pre>
        <code>
            ${ rus.print.stringify4 ( data.RU.io.deskSchemasGet ) }
        </code>
        </pre>    
        
        <h3><code>code > pre</code></h3>
        <code>
        <pre>
            ${ rus.print.stringify4 ( data.RU.io.deskSchemasGet ) }
        </pre>    
        </code>
    `
    
}
module.exports = readDeskSchema