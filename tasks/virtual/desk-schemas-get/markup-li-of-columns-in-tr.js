const liOfColumnsInTr = async ( column ) => {
    
    let markup = `
        <li>
            ${ column.name }<br>
            <button title="click to rename this column" 
                    class="button-outline " 
                    onclick="return false;"> 
                <span class="toggle-set-1">
                    <i class="material-icons">lock</i>rename (stub) </span>
            </button>
            <button class="button-outline" onclick="return false;">
                <i class="material-icons">lock</i>destroy (stub) </button> 
        </li>`
        
    return markup
}
module.exports  = liOfColumnsInTr