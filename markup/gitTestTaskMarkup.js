'use strict'

const gitTestTaskMarkup = async ( data ) => {
    
    mark ( `gitTestTaskMarkup.js EXECUTED` )
    
    //  Return markup as string, and it will be assigned to
    //      (data.RU.response.body) by (composeResponse.js).
    //
    //  You may also manipulated (data) directly, but that would be semantically
    //  incoherent / unpretty.

    return `<pre><code>${ JSON.stringify ( data.RU.io, null, 4 ) }</code></pre>`
}

module.exports  = gitTestTaskMarkup
const mark      = require ( '../modules/mark' )
mark ( `gitTestTaskMarkup.js LOADED` )