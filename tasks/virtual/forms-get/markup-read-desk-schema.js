'use strict'

const rus = require ( '/var/task/modules/r-u-s.js' )

const readDeskSchema = async ( data ) => {
    
    return `
    
        <h2>Desk Schema : <code>read one</code> </h2>
        
        <h3><code><pre></code></h3>
        <pre>
            ${ 'placeholder' }
        </pre>    
        
        <h3><code><code></code></h3>
        <pre>
            ${ 'placeholder' }
        </pre>    

        <h3><code><pre> > <code></code></h3>
        <pre>
            ${ 'placeholder' }
        </pre>    
    `
    
}
module.exports = readDeskSchema