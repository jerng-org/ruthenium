const liOfColumnButtons =  ( column ) => {
    
    let markup = `
        <li>
            ${ column.name }<br>
            <button title="click to rename this column" 
                    class="button-outline " 
                    onclick="return false;"> 
                <span class="toggle-set-1">
                    <i class="material-icons">lock</i>rename</span>
            </button>
            <button class="button-outline" onclick="return false;">
                <i class="material-icons">lock</i>destroy</button> 
        </li>`
        
    return markup
}

module.exports = liOfColumnButtons
const mark      = require ( '../modules/mark' )            
mark ( `liOfColumnButtons.js LOADED` )