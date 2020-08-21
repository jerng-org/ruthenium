'use strict'

const rus = require ( '/var/task/modules/r-u-s.js' )

const deleteDeskSchema = async ( data ) => {
    
    return `
    
        <h2>Desk Schema : <code>delete one</code> </h2>
        
        <pre><code>${ await rus.print.stringify4 ( data.RU.io.deskSchemasGet.Item ) }</code></pre>
        
        `
        
}
module.exports = deleteDeskSchema