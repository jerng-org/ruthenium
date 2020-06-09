'use strict'

const deskSchemas = {

    self:   {
        notes:  '',
        rules:  {
            required: true
        }
    },
    subs:   {
        
        name: {
            self: {
                notes:  '',
                rules: {
                    required: true
                }
            }
        },
        // desk-schemas/name
        
        columns: {
            
            self: {
                notes:  '',
                rules: {
                    required: true,
                    instance_of: Array,
                    length_gt: 0
                }
            },
            subs: {
              
                name: {
                    self: {
                        notes:  '',
                        rules: {
                            regex_test: "/[^A-Z\\[\\]\\s]+/",
                        required: true
                        }
                    }
                },
                // desk-schemas/columns/name
              
                type: {
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