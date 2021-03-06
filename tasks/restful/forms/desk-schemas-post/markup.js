'use strict'

const fs                    = require ( 'fs' )
const htmlIndex             = fs.readFileSync ( 'io/blobs/index.html', { encoding: 'utf8' } )

const createDeskSchema = async ( data ) => {
    
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
    
    <table  data-ru-incrementable-group="column-definition"
            data-ru-incrementable-role="parent">
        <tr>
            <td>
                <i  class="material-icons"
                    data-ru-incrementable-group="column-definition"
                    data-ru-incrementable-role="append-one""
                    >
                    add_circle_outline</i>
            
            </td>
            <td>
                <label  for="column[name].all"
                        >
                        Add a Column for this new Desk Schema</label>
            </td>
            <td>
                <label  for="column[type].all"
                        >
                        Type of data in this Column ('string' and 'number' are efficient)
                        </label>
            </td>
        </tr>

<!---------------------------------------------------------------------------->        
        <template data-ru-incrementable-group="column-definition">
        <tr data-ru-incrementable-group="column-definition"
            data-ru-incrementable-role="appended-child"
            >
            <td>
                <i  class="material-icons"
                    data-ru-incrementable-group="column-definition"
                    data-ru-incrementable-role="remove-closest"
                    onclick="/*RU.removeClosestTr(this)removeClosest('tr')*/"
                    
                    >
                    remove_circle_outline</i>
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
        </template>
<!---------------------------------------------------------------------------->        
        
    </table>
    
    <input      type="submit" 
                value="POST it">

</fieldset>
</form>`
    
    
}
module.exports = createDeskSchema