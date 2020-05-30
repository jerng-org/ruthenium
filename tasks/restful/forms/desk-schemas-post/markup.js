'use strict'

/* Today's fixes will proceed as follows

OK - dump LAMBDA.event.queryStringParameters because it overhandles ","
OK - manually parse queryString with (querystring)

- check form POST behaviour, compared to above
- check form GET behaviour, compared to above


test data: 11%2C22,33;44+55!66$77%2788(99)00"11

*/

const fs                    = require ( 'fs' )
const htmlIndex             = fs.readFileSync ( 'io/blobs/index.html', { encoding: 'utf8' } )

const createDeskSchema = async ( data ) => {
    
    return `${ htmlIndex }

<form method="post" action="/test-middleware?route=restful&type=desk-schemas">
<fieldset>
    
    <label      for="desk-schemas[name].1">
        
        Name for this new Desk Schema
        </label>
    
    <input      type="text"  
                name="desk-schemas[name]"
                id="desk-schemas[name].1"
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
                <label  for="desk-schemas[column][name].all"
                        >
                        Add a Column for this new Desk Schema</label>
            </td>
            <td>
                <label  for="desk-schemas[column][type].all"
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
                            name="desk-schemas[column][name]"
                            id="desk-schemas[column][name].1">       
            </td>
            <td>
                <select id="desk-schemas[column][type].1" 
                        name="desk-schemas[column][type]"
                        >
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