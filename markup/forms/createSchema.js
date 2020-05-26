'use strict'

const mark      = require ( '/var/task/modules/mark' )            

//  Provide a debuggable function name, 
//  in order to avoid debuggin (function).toString()

const createSchema = async ( data ) => {
    
    mark ( `createSchema.js EXECUTED` )

    return `

<form method="post" action="/test-middleware?ruthenium=restful&type=schemas&thing=shoes">
<fieldset>
    <label>Name for this new Table</label>
    <input type="text" name="schema[desk]">       
    <input type="submit" value="Send PATCH">
</fieldset>
</form>`
    
    
}

module.exports = createSchema
mark ( `createSchema.js LOADED` )