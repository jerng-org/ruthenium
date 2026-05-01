import rus from "../../../modules/r-u-s.js";

'use strict'
const readDeskSchema = async ( data ) => {
    
    return `
    
        <h2>Desk Schema : <code>read one</code> </h2>
        
        <pre><code>${ await rus.print.stringify4 ( data.RU.io.deskSchemasGet.Item ) }</code></pre>
        
        <a  class="button"
            href="${                         
                        await rus.appUrl ([
                            [ 'route', 'virtual' ],
                            [ 'type', 'desk-cells' ],
                            [ 'desk-schema-name', data.RU.io.deskSchemasGet.Item.name ],
                            [ 'reader', 'human']
                        ])
            }"
            
            >
            <i class='material-icons'>table_chart</i> View Desk Cells
        </a>
        `
    
}

export default readDeskSchema;