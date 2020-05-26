const liOfColumnButtons = require (`../markup/liOfColumnButtons.js`) 

const trOfDeskSchemas =   ( item ) => {
    
    let markup = `
            <tr>
                <td>
    <!----------------------------------------------------------------------------->
    <!-- contentEditable
                onclick="
                this.contentEditable = true;
                const text = this.firstChild,
                    r = document.createRange(),
                    s = window.getSelection();
                r.setStart(text,0);
                r.setEnd(text,text.length);
                s.removeAllRanges();
                s.addRange(r);
    -->        
    
    <blockquote>

    <script>
        const toggler = ( element, classString, focusSelector ) => {
        
        Array.prototype.forEach.call( 
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
            <h1> ${ item['desk-name'] } </h1>
            <button title="click to rename this desk" class="button-outline" onclick="return false;"> 
                <span>rename <i class="material-icons">lock</i></span>
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

    <form method="post" action="/test-middleware?ruthenium=restful&type=schemas&thing=shoes&form-method=patch">
    <fieldset   class="toggle-set-2" 
                style="display:none;"
                >
        <label>New Name for this Desk</label>
        <input type="text" name="desk-rename-shoes">       
        <input type="submit" value="PATCH it">
    </fieldset>
    </form>
    
    </blockquote>
    <!--
    <a class="button" href="https://a.scriptless.webpage" title="rename this desk" onclick="return false;">Rename</a> 
    -->
    
    <!----------------------------------------------------------------------------->
                </td>
                <td>
                    <h2>
                    <ul class="float-left">
                    ${  item['columns'].reduce ( async  ( acc, column, ind ) => {
                        return  await acc +  await liOfColumnButtons ( column )
                    }, '' ) }
                    </ul>
                    </h2>
                    <a class="button float-right" href="#">Create Column</a>
                </td>
            </tr>`
        
    return markup
}

module.exports  = trOfDeskSchemas
const mark      = require ( '../modules/mark' )            
mark ( `trOfDeskSchemas.js LOADED` )