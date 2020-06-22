'use strict'

const rus = require ( '/var/task/modules/r-u-s.js' )

const config = async ( data ) => {
    
    data.config.verbosity = 1
    
    return data

}

module.exports = config
rus.mark (`~/modules/middlewares/config.js LOADED`)