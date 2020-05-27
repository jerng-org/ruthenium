'use strict'

const mark      = require ( '/var/task/modules/mark' )            

//  Provide a debuggable function name, 
//  in order to avoid debuggin (function).toString()

const fs                    = require ( 'fs' )
const htmlIndex             = fs.readFileSync ( 'io/blobs/index.html', { encoding: 'utf8' } )

const createSchema = async ( data ) => {
    
    mark ( `createSchema.js EXECUTED` )

    return `${ htmlIndex }

<form method="post" action="/test-middleware?ruthenium=restful&type=schemas">
<fieldset>
    
    <label      for="schema[desk-name].1">
        
        Name for this new Desk Schema
        </label>
    
    <input      type="text"  
                name="schema[desk-schema-name]"
                id="schema[desk-schema-name].1"
                placeholder="new desk schema name">       
    
    <table>
        <tr>
            <td>
                <i  class="material-icons"
                    onclick="
// Prepare                    
if ( !  (   columnDefinitionTemplate 
        &&  newColumnDefinition
        &&  relevantTable               ) )
{
    const columnDefinitionTemplate 
        = document.querySelector ( '#column-definition' )
    
    const newColumnDefinition 
        = columnDefinitionTemplate.content.cloneNode ( true )
    
    const relevantTable 
        = this.closest('table')
}

// Perform
relevantTable.append ( newColumnDefinition ) 

                    ">add_circle_outline</i>
            
            </td>
            <td>
                <label      for="column[name].all">
                    Add a Column for this new Desk Schema</label>
            </td>
            <td>
                <label for="column[type].all">
                    Type of data in this Column ('string' and 'number' are efficient)
                    </label>
            </td>
        </tr>

<!---------------------------------------------------------------------------->        
        <template id="column-definition">
        <tr>
            <td>
                <i class="material-icons">remove_circle_outline</i>
            </td>
            <td>
                <input      type="text"  
                            name="column[name]"
                            id="column[name].1">       
            </td>
            <td>
                <select id="column[type].1" 
                        name="column[type]
                        placeholder="new column name">
                    <option value="S">string</option>
                    <option value="N">number</option>
                    <option value="other">other</option>
                    </select>
            </td>
        </tr>
        <template>
<!---------------------------------------------------------------------------->        
        
    </table>
    
    <input      type="submit" 
                value="POST it">

</fieldset>
</form>`
    
    
}

module.exports = createSchema
mark ( `createSchema.js LOADED` )