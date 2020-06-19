'use strict'

const rus = require ( '/var/task/modules/r-u-s.js' )

const setDefaultLayout = async ( data ) => {

    data.RU.signals.layout =    require (`/var/task/tasks/layout.js`)
                                //  ^ this is a questionably designed line of code; HACK

    // We have NOT YET figured out WHEN to run (layout.js), which could be 
    //  before (router.js), or after (router.js) has run its task; and WHERE to store
    // its output (presumably to data.RU.signals.layoutData) or to skip that
    //  and directly render using (layout-markup.js), and the storing the markup
    //  somewhere like (data.RU.signals.renderedLayout)
    
    return data
}

module.exports = setDefaultLayout
rus.mark (`set-default-layout.js LOADED`)