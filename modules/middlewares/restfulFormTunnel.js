'use strict'

//  Addresses this issue by using a conventional tunnel approach: 
//  https://softwareengineering.stackexchange.com/questions/114156/why-are-there-are-no-put-and-delete-methods-on-html-forms

const mark      = require ( '/var/task/modules/mark' )            

//  Provide a debuggable function name, 
//  in order to avoid debuggin (function).toString()

const restfulFormTunnel = async ( data ) => {
    
    mark ( `restfulFormTunnel.js EXECUTED` )
    
    /return (data)

}

module.exports = restfulFormTunnel
mark ( `restfulFormTunnel.js LOADED` )