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


<!---------------------------------------------------------------------------->        
<!--    grafted code begins here -->

                    <fieldset   onclick="toggler ( this, '.toggle-set-1', '#unlock-desk-schemas-delete-${ 1 }' )"
                                class="toggle-set-2"
                                >
                                
                        <label for="unlock-desk-schemas-delete-${ 1 }">
                            <button     title="show the link which deletes this schema" 
                                        class="button-outline" 
                                        onclick="return false;"
                                        > 
                                <span>
                                    <i class="material-icons">lock</i>
                                    <i class="material-icons">delete</i>
                                </span>
                                <span class="toggle-set-1" style="display:none;">
                                    code: 234806</span>
                            </button>
                        </label>
                        
                        <input  type="text" 
                                id="unlock-desk-schemas-delete-${ 1 }" 
                                placeholder="type the code, to show the link, which deletes this schema'" 
                                class="toggle-set-1"
                                style="display:none;"
                                onclick="(e=>e.stopImmediatePropagation())(event)"
                                oninput="if (this.value==234806) { 
                                
                                    this.value = ''
                                    toggler ( this.parentNode, '.toggle-set-1', '#unlock-desk-schemas-delete-${ 1 }' )
                                    
                                    const confirmed = window.confirm('WARNING : You are about to display a link which deletes the schema named \\'${ 1 }\\' forever - select CANCEL to reconsider.')
                                    if ( confirmed ) 
                                    {
                                        toggler ( this.closest('td'), '.toggle-set-2', '#desk-schemas-delete-${ 1 }' )
                                    } else {
                                        //alert ('dev: cleanup required ')
                                    }
                                }"
                                >
                    </fieldset>
                    
                    <div    class="ru-card toggle-set-2"
                            style="display:none;"
                            >
                    
                        <a  class="button" 
                            title="delete schema forever"
                            id="desk-schemas-delete-${ 1 }"
                            href="${
                        
                            await rus.appUrl ([
                                [ 'route', 'virtual' ],
                                [ 'type', 'forms' ],
                                [ 'thing', 'delete-desk-schema' ],
                                [ 'desk-schema-name', 999 ], 
                                [ 'reader', 'human']
                            ])
    
                        }"><i class="material-icons">delete_forever</i> this action cannot be undone</a>
                        
                        <button class="button-clear" 
                            title="hide the link, which deletes this schema"
                            onclick="toggler ( this.closest('td'), '.toggle-set-2', '#desk-schemas-delete-${ 1 }' )"
                        >
                        <i class="material-icons">lock_open</i> hide link </button>
                        
                    </div>
                    
<!--    grafted code ends here -->
<!---------------------------------------------------------------------------->        
    
    ${  await rus.html.input ( {
        value:  'POST it',
        type:   'submit'
    } ) }

</fieldset>

<script>
{   
    window.addEventListener("load", function(){
    
        // hydrate client-side form
    
        const appendingElem = document.querySelector('[data-ru-incrementable-group="column-definition"][data-ru-incrementable-role="append-one"]')
        const item = ${ JSON.stringify ( data.RU.io.deskSchemasGet.Item, null, 4 ) }
    
        for ( const column of item.columns )
        {
            // add a new row (depends on widget RU-INCREMENTAL loaded onDOMContentLoaded in the header library)
            appendingElem.click()
            
            console.log(appendingElem)
            
            // refer to new row
            const appendedElem = document.querySelector('[data-ru-incrementable-group="column-definition"][data-ru-incrementable-role="appended-child"]:last-of-type')
        
            appendedElem.querySelector('input[name*="[name]"]').value = column.name
            appendedElem.querySelector('select[name*="[type]"]').value = column.type
            
        }        
    })
}
</script>
        

`

    
    return `
    
        <h3>Desk Schema : <code>read one</code>, for reference : </h3>

        <pre><code>${ await rus.print.stringify4 ( data.RU.io.deskSchemasGet.Item ) }</code></pre>
    
        <h2>Desk Schema : <code>update</code> this schema, by submitting this form :</h2>
        
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