const rus = require('/var/task/modules/r-u-s.js')

const liOfColumnsInTr = require(`/var/task/tasks/virtual/desk-schemas-get/markup-li-of-columns-in-tr.js`)

const trInTable = async(item) => {

    let markup = `
            <tr>
                <td>
                    <h3 class="ru-card">
                        ${ item['name'] }
                    </h3>
                </td>
                
                <td>
                
                    <!--
                        <a class="button float-right" href="#">Create Column (stub) </a>
                    -->
                    
                    
                    <ul class="float-left">
                    ${  
                        await item['columns'].reduce (  
                            async ( acc, column, ind ) => {
                                return  await acc + 
                                        await liOfColumnsInTr ( column )
                            }, 
                            '' 
                        )
                    }
                    </ul>
                    
                </td>
                
                <td>
                    <fieldset   onclick="toggler ( this, '.toggle-set-1', '#unlock-desk-schemas-delete-${ item['name'] }' )"
                                class="toggle-set-2"
                                >
                                
                    <a  class="button toggle-set-1" 
                        title="READ schema"
                    onclick = "(e=>e.stopImmediatePropagation())(event)"
                        href="${
                    
                        await rus.appUrl ([
                            [ 'route', 'virtual' ],
                            [ 'type', 'forms' ],
                            [ 'thing', 'read-desk-schema' ],
                            [ 'desk-schema-name', item['name'] ], 
                            [ 'reader', 'human']
                        ])

                    }"><i class="material-icons">preview</i> READ</a>
                   
                    <a  class="button toggle-set-1" 
                        title="UPDATE schema"
                    onclick = "(e=>e.stopImmediatePropagation())(event)"
                        href="${
                    
                        await rus.appUrl ([
                            [ 'route', 'virtual' ],
                            [ 'type', 'forms' ],
                            [ 'thing', 'update-desk-schema' ],
                            [ 'desk-schema-name', item['name'] ], 
                            [ 'reader', 'human']
                        ])

                    }"><i class="material-icons">edit</i> UPDATE</a>

                        <label for="unlock-desk-schemas-delete-${ item['name'] }">
                            <button     title="show the link which deletes this schema" 
                                        class="button-outline" 
                                        onclick="return false;"
                                        > 
                                <span>
                                    <i class="material-icons">lock</i>
                                    <i class="material-icons">delete</i>
                                    DELETE
                                </span>
                                <span class="toggle-set-1" style="display:none;">
                                    code: 234806</span>
                            </button>
                        </label>
                        
                        <input  type="text" 
                                id="unlock-desk-schemas-delete-${ item['name'] }" 
                                placeholder="type the code, to show the link, which deletes this schema" 
                                class="toggle-set-1"
                                style="display:none;"
                                onclick="(e=>e.stopImmediatePropagation())(event)"
                                oninput="if (this.value==234806) { 
                                
                                    this.value = ''
                                    toggler ( this.parentNode, '.toggle-set-1', '#unlock-desk-schemas-delete-${ item['name'] }' )
                                    
                                    const confirmed = window.confirm('WARNING : You are about to display a link which deletes the schema named \\'${ item['name'] }\\' forever - select CANCEL to reconsider.')
                                    if ( confirmed ) 
                                    {
                                        toggler ( this.closest('td'), '.toggle-set-2', '#desk-schemas-delete-${ item['name'] }' )
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
                            id="desk-schemas-delete-${ item['name'] }"
                            href="${
                        
                            await rus.appUrl ([
                                [ 'route', 'virtual' ],
                                [ 'type', 'forms' ],
                                [ 'thing', 'delete-desk-schema' ],
                                [ 'desk-schema-name', item['name'] ], 
                                [ 'reader', 'human']
                            ])
    
                        }"><i class="material-icons">delete_forever</i> this action cannot be undone</a>
                        
                        <button class="button-clear" 
                            title="hide the link, which deletes this schema"
                            onclick="toggler ( this.closest('td'), '.toggle-set-2', '#desk-schemas-delete-${ item['name'] }' )"
                        >
                        <i class="material-icons">lock_open</i> hide link </button>
                        
                    </div>
                    
                </td>
                
            </tr>`

    return markup
}

module.exports = trInTable