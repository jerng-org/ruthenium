const rus = require('/var/task/modules/r-u-s.js')

const liOfColumnsInTr = require(`/var/task/tasks/virtual/desk-schemas-get/markup-li-of-columns-in-tr.js`)

const trInTable = async(item) => {

    let markup = `
            <tr>
                <td>
    <!----------------------------------------------------------------------------->
    
    <h3 class="ru-card">
    
        ${ item['name'] }
        
    <!--
    
        <script>
            const toggler = ( element, classString, focusSelector ) => {
            
            Array.prototype.forEach.call ( 
                element.querySelectorAll( classString ), 
                e => {
                    const wasVisible = ['','initial'].includes(e.style.display);
                    e.style.display = wasVisible ? 'none' : 'initial';
                    if ( (! wasVisible) ) { 
                        const input = element.querySelector ( focusSelector )
                        input.focus();
                        input.select();
                    };
                } 
            );
            
            };
        </script>
    
        <fieldset onclick="toggler ( this, '.toggle-set-1', '#unlock-desk-rename-NAME' )">
            <label for="unlock-desk-rename-NAME">
                <h1> ${ item['name'] } </h1>
                <button title="click to rename this desk" class="button-outline" onclick="return false;"> 
                    <span>rename (WIP) <i class="material-icons">lock</i></span>
                    <span class="toggle-set-1" style="display:none;">
                        code: 234806</span>
                </button>
            </label>
            <input  type="text" 
                    id="unlock-desk-rename-NAME" 
                    placeholder="type the code, to unlock this form" 
                    class="toggle-set-1"
                    style="display:none;"
                    onclick="(e=>e.stopImmediatePropagation())(event)"
                    oninput="if (this.value==234806) { 
                    
                        this.value = ''
                        toggler ( this.parentNode, '.toggle-set-1', '#unlock-desk-rename-NAME' )
                        
                        const confirmed = window.confirm('WARNING : renaming the SHOES desk will perform an expensive database operation - select CANCEL to reconsider.')
                        if ( confirmed ) 
                        {
                        
                            toggler ( this.closest('td'), '.toggle-set-2', 'input[name=desk-rename-shoes]' )
    
                            /*
                            const submission = prompt ('Submit a new name for SHOES:')
                            if ( submission ) {
                                alert ('dev: finally POST here ')
                            } else {
                                alert ('dev: cleanup required ')
                            }
                            */
                            
                        } else {
        
                            alert ('dev: cleanup required ')
                        }
                    }"
                    >
        </fieldset>
    
        <form method="post" action="${ 
    
            await rus.appUrl ( [
                [ 'route', 'virtual' ],
                [ 'type', 'schemas' ],
                [ 'thing', 'shoes' ],
                [ 'form-method', 'patch' ]
            ] )
            
        }">
        <fieldset   class="toggle-set-2" 
                    style="display:none;"
                    >
            <label>New Name for this Desk</label>
            <input type="text" name="desk-rename-shoes">       
            <input type="submit" value="PATCH it">
        </fieldset>
        </form>
        
        <a class="button" href="https://a.scriptless.webpage" title="rename this desk" onclick="return false;">Rename</a> 
    -->
    
    </h3>
    
    <!----------------------------------------------------------------------------->
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
                    <a  class="button" 
                        title="read schema"
                        href="${
                    
                        await rus.appUrl ([
                            [ 'route', 'virtual' ],
                            [ 'type', 'forms' ],
                            [ 'thing', 'read-desk-schema' ],
                            [ 'desk-schema-name', item['name'] ], 
                            [ 'reader', 'human']
                        ])

                    }"><i class="material-icons">preview</i></a>
                    
                    <a  class="button" 
                        title="edit schema"
                        href="${
                    
                        await rus.appUrl ([
                            [ 'route', 'virtual' ],
                            [ 'type', 'forms' ],
                            [ 'thing', 'update-desk-schema' ],
                            [ 'desk-schema-name', item['name'] ], 
                            [ 'reader', 'human']
                        ])

                    }"><i class="material-icons">edit</i> <i class="material-icons">construction</i></a>
                    
                    
                    <fieldset   onclick="toggler ( this, '.toggle-set-1', '#unlock-desk-schemas-delete-${ item['name'] }' )"
                                class="toggle-set-2"
                                >
                                
                        <label for="unlock-desk-schemas-delete-${ item['name'] }">
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
                                id="unlock-desk-schemas-delete-${ item['name'] }" 
                                placeholder="type the code, to show the link, which deletes this schema'" 
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
                                        alert ('dev: cleanup required ')
                                    }
                                }"
                                >
                    </fieldset>
                    
                    <a  class="button toggle-set-2" 
                        style="display:none;"
                        title="delete schema forever"
                        id="desk-schemas-delete-${ item['name'] }"
                        onfocus="(e => console.log('focused', e.target))(event)"
                        onblur="(e => console.log('blurred', e.target))(event)"
                        href="${
                    
                        await rus.appUrl ([
                            [ 'route', 'virtual' ],
                            [ 'type', 'forms' ],
                            [ 'thing', 'delete-desk-schema' ],
                            [ 'desk-schema-name', item['name'] ], 
                            [ 'reader', 'human']
                        ])

                    }"><i class="material-icons">delete_forever</i></a>

                    
                </td>
                
            </tr>`

    return markup
}

module.exports = trInTable
