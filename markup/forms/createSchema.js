'use strict'

const mark      = require ( '/var/task/modules/mark' )            

//  Provide a debuggable function name, 
//  in order to avoid debuggin (function).toString()

const createSchema = async ( data ) => {
    
    mark ( `createSchema.js EXECUTED` )

    return `SOME MARKUP FORM FOR SCHEMA CREATION`
}

module.exports = createSchema
mark ( `createSchema.js LOADED` )