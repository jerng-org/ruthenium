const liOfColumnButtons = require (`../markup/liOfColumnButtons.js`) 

const trOfTableSchema =  ( item ) => {
    
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
    <form method="post" action="/test-middleware?ruthenium=restful&type=grid&thing=shoes">
    <fieldset onclick=" 
        Array.prototype.forEach.call( 
            this.querySelectorAll('.toggle-set-1'), 
            e => {
                const wasVisible = ['','initial'].includes(e.style.display);
                e.style.display = wasVisible ? 'none' : 'initial';
                if ( (! wasVisible) ) { 
                    const input = this.querySelector('#unlock-table-rename-NAME')
                    input.focus();
                    input.select();
                };
            } 
        );
    ">
        <label for="unlock-table-rename-NAME">
            <h1> ${ item.grid } </h1>
            <button title="click to rename this table" class="button-outline" onclick="return false;"> 
                <span class="toggle-set-1">
                    <i class="material-icons">lock</i>rename</span>
                <span class="toggle-set-1" style="display:none;">
                    lock code: 234806</span>
            </button>
        </label>
        <input  type="text" 
                id="unlock-table-rename-NAME" 
                placeholder="type the code, to unlock this form" 
                class="toggle-set-1"
                style="display:none;"
                onclick="(e=>e.stopImmediatePropagation())(event)"
                oninput="if (this.value==234806) { 
                    alert ('dev: reset required ')
                    const confirmed = window.confirm('WARNING : renaming the SHOES table will perform an expensive database operation - select CANCEL to reconsider.')
                    if ( confirmed ) 
                    {
                        const submission = prompt ('Submit a new name for SHOES:')
                        if ( submission ) {
                            alert ('dev: finally POST here ')
                        } else {
                            alert ('dev: cleanup required ')
                        }
                    } else {
    
                        alert ('dev: cleanup required ')
                    }
                }"
                >
        <input type="hidden" name="table-rename-shoes" value="newName">       
        <input type="submit" value="Send PATCH">
    </fieldset>
    </form>
    </blockquote>
    <!--
    <a class="button" href="https://a.scriptless.webpage" title="rename this table" onclick="return false;">Rename</a> 
    -->
    
    <!----------------------------------------------------------------------------->
                </td>
                <td>
                    <h2>
                    <ul class="float-left">
                    ${  item.columns.reduce (  ( acc, column, ind ) => {
                        return  acc +  liOfColumnButtons ( column )
                    }, '' ) }
                    </ul>
                    </h2>
                    <a class="button float-right" href="#">Create Column</a>
                </td>
            </tr>`
        
    return markup
}

module.exports  = trOfTableSchema
const mark      = require ( '../modules/mark' )            
mark ( `trOfTableSchema.js LOADED` )