'use strict'

const mark  = require ( '../modules/mark' )         

const initialTask = async ( data ) => {

    data.RU.signals.redirectRoute = 'restful&type=schemas'
    
    // no need to return data
    
}
module.exports = initialTask
mark ( `initialTask.js LOADED` )