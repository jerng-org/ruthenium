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
    
    <label      for="schema[desk-name].1">
        
        Columns for this new Desk
        </label>
    
    <textarea   name="schema[columns]"
                id="schema[columns].1"
                style="height:20rem;"
                placeholder=
"[   
    {   
        name:   STRING,
        type:   'string' | 'number' | 'other'
    },
    {   
        name:   STRING,
        type:   'string' | 'number' | 'other'
    },
    ... etc.
]"></textarea>       
    
    <label for="column[type].1">
    
        Type of data in this column ('string' and 'number' are efficient):
        </label>
    
    <select id="column[type].1" 
            name="column[type]">
            
        <option value="string">string</option>
        <option value="number">number</option>
        <option value="other">other</option>

        </select>
    
    <input      type="submit" 
                value="POST it">

</fieldset>
</form>`
    
    
}

module.exports = createSchema
mark ( `createSchema.js LOADED` )