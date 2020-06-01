'use strict'

/* Today's fixes will proceed as follows

OK - dump LAMBDA.event.queryStringParameters because it overhandles ","
OK - manually parse queryString with (querystring)

OK - check form POST behaviour, compared to above
- check form GET behaviour, compared to above


test data: 11%2C22,33;44+55!66$77%2788(99)00"11

*/

const fs                    = require ( 'fs' )
const htmlIndex             = fs.readFileSync ( 'io/blobs/index.html', { encoding: 'utf8' } )

const createDeskSchema = async ( data ) => {
    
    return `${ htmlIndex }

<form method="POST" action="/test-middleware?route=restful&type=desk-schemas">
<fieldset>
    
    <label      for="desk-schemas[name].1">
        
        Name for this new Desk Schema
        </label>
    
    <input      type="text"  
                name="desk-schemas[name]"
                id="desk-schemas[name].1"
                placeholder="-- enter a name --"
                required
                >       
    
    <table  data-ru-incrementable-group="column-definition"
            data-ru-incrementable-role="parent">
        <tr>
            <td>
                <i  class="material-icons"
                    data-ru-incrementable-group="column-definition"
                    data-ru-incrementable-role="append-one""
                    data-ru-incrementable-attributes='[
                        {   
                            "attribute":    "name",
                            "baseValue":    "desk-schemas[columns][###][name]"
                        },
                        {   
                            "attribute":    "name",
                            "baseValue":    "desk-schemas[columns][###][type]"
                        }
                    ]'
                    >
                    add_circle_outline</i>
            
            </td>
            <td>
                <label>
                    Add a Column for this new Desk Schema
                    <h6>&nbsp;</h6>
                    </label>
            </td>
            <td>
                <label>
                    Specify the type of data in this Column
                    <h6>'string' and 'number' are efficient</h6>
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
                    >
                    remove_circle_outline</i>
            </td>
            <td>
                <input      type="text"  
                            name="desk-schemas[columns][###][name]"
                            placeholder="-- enter a name --"
                            required
                            >       
            </td>
            <td>
                <select name="desk-schemas[columns][###][type]"
                        required
                        >
                    <option disabled selected value> -- select an option -- </option>
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