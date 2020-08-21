'use strict'

const rus = require ( '/var/task/modules/r-u-s.js' )

const innerHTML = async () => `
<fieldset>

    ${ await rus.html.input ( {
        name:       `desk-schemas[name]`,
        id:         `desk-schemas[name]`,
        placeholder:`-- enter a schema name --`,
        required:   true,
        label:      `Name the schema :`
    } ) }
    
    <table  data-ru-incrementable-group="column-definition"
            data-ru-incrementable-role="parent"
            >
        <tr>
            <td>
                <i  class="material-icons"
                    data-ru-incrementable-group="column-definition"
                    data-ru-incrementable-role="append-one""
                    data-ru-incrementable-attributes='[
                        {   
                            "attribute":    "name",
                            "baseValue":    "desk-schemas[columns]###[name]"
                        },
                        {   
                            "attribute":    "name",
                            "baseValue":    "desk-schemas[columns]###[type]"
                        }
                    ]'
                    >
                    add_circle_outline</i>
            
            </td>
            <td>
                <label>
                    Add columns to the schema :
                    <h6>&nbsp;</h6>
                    </label>
            </td>
            <td>
                <label>
                    Specify column type :
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
                <i  class="material-icons"stub
                    data-ru-incrementable-group="column-definition"
                    data-ru-incrementable-role="remove-closest"
                    >
                    remove_circle_outline</i>
            </td>
            <td>
                ${ await rus.html.input ( {
                    name:       `desk-schemas[columns]###[name]`,
                    placeholder:`-- enter a column name --`,
                    required:   true
                } ) }
            </td>
            <td>
                <select name="desk-schemas[columns]###[type]"
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
    
    ${  await rus.html.input ( {
        value:  `POST it`,
        type:   `submit`
    } ) }

</fieldset>
`

const createDeskSchema = async ( data ) => {
    
    return `
    
        <h2>Desk Schema : <code>creation</code> </h2>
    
        ${  await rus.html.form ( {
                action: await rus.appUrl( [ 
                    [ 'route','virtual' ], 
                    [ 'type','desk-schemas' ] 
                ] ),
                innerHTML: await innerHTML()
            } ) 
        }
    `
}
module.exports = createDeskSchema