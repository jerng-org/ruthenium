'use strict'

// Types and Sub-types
const deskSchemas = {

    self:   {
        // leaf:   true,
        rules:  {
            // count_gt:   0
        },
        notes:  ''
    },
    subs:   {
        
        name: {
            self:   {
                leaf:   true,
                rules: {
                    count_gt:   0
                }
            },
            notes:  ''
        },
        // desk-schemas/name
        
        columns: {
            
            self: {
                leaf:   false,
                rules:  {
                    count_gt:   0
                    /*  These should be the implementation of the above:
                        instance_of: Array,
                        length_gt: 0
                    */
                },
                notes:  ''
            },
            subs: {
              
                name: {
                    self: {
                        leaf:   true,
                        rules:  {
                            count_gt:   0,
                            regex_test: "/[^A-Z\\[\\]\\s]+/"
                        },
                        notes: ''
                    }
                },
                // desk-schemas/columns/name
              
                type: {
                    self: {
                        leaf:   true,
                        rules:  {
                            count_gt:       0,
                            included_in: [
                                "S",
                                "N",
                                "other"
                            ]
                        },
                        notes:  ''
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