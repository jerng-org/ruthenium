'use strict'

const rus = require ( '/var/task/modules/r-u-s.js' )

const thisIsMyName =   { 
        self:{ 
            many: undefined, // boolean
            notes: '', 
            rules: {} 
        }, 
        subs:{ 
            sub1_node_name: {
                self: {},
                subs: {}
            }, 
            sub2_node_name: {
                self: {},
                subs: {}
            }, 
        } 
    }

module.exports = thisIsMyName