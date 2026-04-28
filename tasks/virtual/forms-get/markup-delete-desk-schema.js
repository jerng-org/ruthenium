import rus from "/var/task/modules/r-u-s.js";

'use strict'
const deleteDeskSchema = async ( data ) => {
    
    return `
    
        <h2>Desk Schema : <code>delete one</code> </h2>
        
        <h3>
            The following item was deleted from the server.<br>
            Please save this transcription if you wish to reimport it later.
        </h3>
        
        <pre><code>
            ${ await JSON.stringify(data.RU.io.deskSchemasDelete.Attributes, null, 4) }
        </code></pre>
        
        `
        
}

export default deleteDeskSchema;