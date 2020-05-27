'use strict'

const mark      = require ( '/var/task/modules/mark' )            

//  Provide a debuggable function name, 
//  in order to avoid debuggin (function).toString()

const fs                    = require ( 'fs' )
const htmlIndex             = fs.readFileSync ( 'io/blobs/index.html', { encoding: 'utf8' } )

const createSchema = async ( data ) => {
    
    mark ( `createSchema.js EXECUTED` )

    return `${ htmlIndex }

<form method="post" action="/test-middleware?ruthenium=restful&type=schemas">
<fieldset>
    
    <label      for="schema[desk-name].1">
        
        Name for this new Desk
        </label>
    
    <input      type="text"  
                name="schema[desk-name]"
                id="schema[desk-name].1">       
    
    <label      for="column[name].1">
        
        Add a Columns for this new Desk
        </label>
    
    <label for="column[type].1">
    
        Type of data in this column ('string' and 'number' are efficient):
        </label>
    
    <select id="column[type].1" 
            name="column[type]">
            
        <option value="S">string</option>
        <option value="N">number</option>
        <option value="other">other</option>

        </select>
    
    <input      type="submit" 
                value="POST it">

</fieldset>
</form>`
    
    
}

module.exports = createSchema
mark ( `createSchema.js LOADED` )