'use strict'

const conf = require(`/var/task/configuration.js`)

// Types and Sub-types
const deskSchemas = {

    self: {
        many: false,
        rules: {
            count_gt: 0
        },
        notes: ''
    },
    subs: {

        name: {
            self: {
                many: false,
                rules: {
                    count_gt: 0,
                    regex_test: "/[^A-Z\\[\\]\\s]+/"
                }
            },
            notes: ''
        },
        // desk-schemas/name

        columns: {

            self: {
                many: true,
                rules: {
                    count_gt: 0
                },
                notes: ''
            },
            subs: {

                name: {
                    self: {
                        many: false,
                        rules: {
                            count_gt: 0,
                            regex_test: "/[^A-Z\\[\\]\\s]+/"
                        },
                        notes: ''
                    }
                },
                // desk-schemas/columns/name

                type: {
                    self: {
                        many: false,
                        rules: {
                            count_gt: 0,
                            included_in: conf.storage.deskCellTypeKeys
                        },
                        notes: ''
                    }
                }
                // desk-schemas/columns/type
            }
        }
        // desk-schemas/columns
    }
}
// desk-schemas

/*
    name:   "desk-schemas",
    
    self:   {
        notes:  '',
        rules:  {
            required: true
        }
    },
    
    subs:   [
      
        {   name: 'name',
            self: {
              notes:  '',
              rules: {
                required: true
              }
            }
        },
        // desk-schemas/name
        
        {   name: 'columns',
            self: {
                notes:  '',
                rules: {
                    required: true,
                    instance_of: Array,
                    length_gt: 0
                }
            },
            
            subs: [
              
                {   name: 'name',
                    self: {
                        notes:  '',
                        rules: {
                            regex_test: "/[^A-Z\\[\\]\\s]+/",
                        required: true
                        }
                    }
                },
                // desk-schemas/columns/name
              
                {   name: 'type',
                    self: {
                        notes:  '',
                        rules: {
                            required: true,
                            included_in: [
                                "S",
                                "N",
                                "other"
                            ]
                        }
                    }
                }
                // desk-schemas/columns/type
            ]
        } 
        // desk-schemas/columns
    ]
*/


module.exports = deskSchemas
