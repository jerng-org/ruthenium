'use strict'

const mark      = require ( '/var/task/modules/mark' )            

//  Provide a debuggable function name, 
//  in order to avoid debuggin (function).toString()

const fs                    = require ( 'fs' )
const htmlIndex             = fs.readFileSync ( 'io/blobs/index.html', { encoding: 'utf8' } )

const createSchema = async ( data ) => {
    
    mark ( `createSchema.js EXECUTED` )

    return `${ htmlIndex }

<form method="post" action="/test-middleware?ruthenium=restful&type=schemas&thing=shoes">
<fieldset>
    
    <label      for="schema[desk-name].1">
        
        Name for this new Desk
        </label>
    
    <input      type="text"  
                name="schema[desk-name]"
                id="schema[desk-name].1">       
    
    <textarea   name="schema[columns]"></textarea>       
    
    <input      type="submit" 
                value="POST it">

</fieldset>
</form>`
    
    
}

module.exports = createSchema
mark ( `createSchema.js LOADED` )