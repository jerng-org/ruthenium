'use strict'

const rus = require ( '/var/task/modules/r-u-s.js' )

const updateDeskSchema = async ( data ) => {


const innerHTML = async () => `
<fieldset>

    ${ await rus.html.input ( {
        name:       'desk-schemas[name]',
        id:         'desk-schemas[name]',
        value:      data.RU.io.deskSchemasGet.Item.name,
        required:   true,
        label:      'Name of the schema :'
    } ) }
    
    <table  data-ru-incrementable-group="column-definition"
            data-ru-incrementable-role="parent"
            >
        <tr>
            <td>
                <i  class="material-icons"
                    data-ru-incrementable-group="column-definition"
                    data-ru-incrementable-role="append-one"
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
                    name:       'desk-schemas[columns]###[name]',
                    placeholder:'-- enter a column name --',
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
        value:  'POST it',
        type:   'submit'
    } ) }

</fieldset>

<script>
{   // hydrate client-side form

    const appendingElem = document.querySelector('[data-ru-incrementable-group="column-definition"][data-ru-incrementable-role="append-one"]')
    const item = ${ JSON.stringify ( data.RU.io.deskSchemasGet.Item, null, 4 ) }

    for ( const column of item.columns )
    {
        // add a new row
        appendingElem.click()
        
        // refer to new row
        const appendedElem = document.querySelector('[data-ru-incrementable-group="column-definition"][data-ru-incrementable-role="appended-child"]:last-of-type')
    
        appendedElem.querySelector('input[name*="[name]"]').value = column.name
        appendedElem.querySelector('input[name*="[type]"]').value = column.type
        
    }
    
}
</script>
        

`

    
    return `
    
        <h2>Desk Schema : <code>update one</code> </h2>
    
        ${  await rus.html.form ( {
                action: await rus.appUrl( [ 
                    [ 'route','virtual' ], 
                    [ 'type','desk-schemas' ] 
                ] ),
                innerHTML: await innerHTML(),
                class: 'ru-card'
            } ) 
        }
    `
    
}
module.exports = updateDeskSchema