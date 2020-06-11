'use strict'

//  require()       executes modules; 
//  require.res()   resolves paths without execution;

//  TEMPLATE : in-code technical debt warning
//  console.warn ( `⚠ DEBT_NOTE ⚠`, )

const mark  = require ( '/var/task/modules/mark.js' )
mark (`r-u-s.js (ruthenium utilities) LOADING ...`)

const fs = require ('fs')

let models = {}
const modelFileNames = fs.readdirSync ('/var/task/io/models')
modelFileNames.forEach ( ( current, index, array ) => {
    
    if (        current[0] != '_'
            &&  current.toLowerCase().slice ( -3 ) == '.js' )
    {
        models[ current.slice (0, -3) ] = require ( '/var/task/io/models/' + current )
    }
} /* , thisArg */ ) 
//const topLevelModels = models.map( m => m.name )

const url   = require ('url')

//////////
//      //
//  !!  //  Make way.
//      //
//////////

const rus   = {

    appUrl: async pairArrays => {   
        
        const URLObject = new ( url.URL ) ( '/test-middleware',
                                            'https://secure.api.sudo.coffee'
                                            )
                                            
        const URLSearchParamsObject = URLObject.searchParams
        
        for ( const [ name, value ] of pairArrays ) {
            URLSearchParamsObject.append ( name, value )
        }
        
        return URLObject
    },

    aws: {
        ddbdc: require ( '/var/task/io/ddbdc.js' ),
    },
    
    html : {
        
        //  Priorities for (rus.html.form) :
        //
        //  -   Throw errors if critical attributes, etc. are missing.
        //  -   Automatically close tags.
        //  -   Reduce markup to be typed.
        //  -   Do not be more specific than necessary.
        //
        //  Design decisions:
        //
        //  -   (fieldset) is used arbitrarily; so it is left out here;
        //  -   (label) is often adjacent to its (id)-ed element, but this is
        //      also not necessary, so it is also left out here;
        //
        //
        
        
        form :  async conf => {
            
            if ( ! conf.action ) {
                throw Error (`(rus.html.form) called, without (conf.action) `)
            }
            else
            if ( ! conf.innerHTML ) {
                throw Error (`(rus.html.form) called, without (conf.innerHTML) `)
            }
            
            const defaults = {
                method: 'POST'
            }
            
            const markup 
                = `<form    method=${ conf.method ? conf.method : defaults.method }
                            action=${ conf.action }
                            >
                            ${ conf.innerHTML }
                            </form>`
            return markup
        },
        
        input : async conf => {
            
            if ( ( ! conf.name ) && ( ! conf.type == 'submit' ) ) {
                throw Error (`(rus.html.input) called, without (conf.name) `)
            }
            else
            if ( conf.labelInnerHTML && ( ! conf.id ) ) {
                throw Error (`(rus.html.input) called, (conf.labelInnerHTML) without (conf.id)`)
            }
            
            const defaults = {
                type: 'text'
            }
            
            const markup 
                = ` ${  conf.label 
                        ? `<label   for="${ conf.id }"
                                    > 
                                    ${ conf.label }
                                    </label>` 
                        : ``
                    }
                    <input  type="${ conf.type ? conf.type : defaults.type }"
                            ${ conf.name        ? `name="${conf.name}"`     : '' }"
                            ${ conf.placeholder ? conf.placeholder          : '' }
                            ${ conf.id          ? conf.id                   : '' }
                            ${ conf.required    ? 'required'                : '' }
                            ${ conf.value       ? `value="${ conf.value }"` : '' }
                            >`
                            
            return markup
        },
/*        
        select : conf => {
            
            if ( ! conf.name ) {
                throw Error (`(rus.html.input) called, without (conf.name) `)
            }
            else
            if ( conf.labelInnerHTML && ( ! conf.id ) ) {
                throw Error (`(rus.html.input) called, (conf.labelInnerHTML) without (conf.id)`)
            }
            
            const defaults = {
                type: 'text'
            }
            
            const markup 
                = ` ${  conf.label 
                        ? `<label   for="${ conf.id }"
                                    > 
                                    ${ conf.label }
                                    </label>` 
                        : ``
                    }
                    <input  type="${ conf.type ? conf.type : defaults.type }"
                            name="${ conf.name }"
                            ${ conf.placeholder ? conf.placeholder : '' }
                            ${ conf.id ? conf.id : '' }
                            ${ conf.required ? 'required' : '' }
                            >`
                            
            return markup
        },

        table : conf => {
        }

*/        
    },
    
    lambdaGitCommit: 
        require ( '/var/task/modules/lambda-git-commit' ),
    
    mark: 
        mark,

    node: {
        
        //childProcess : require('child_process'),
        
        fs: require ( 'fs' ),
        
        querystring: require ( 'querystring' ),
        
        url: url,
        
        util: require ( 'util' )    
    },
    
    //  Add various options to customise all URL components;
    //  with useful defaults;
    
    //  Structure of (pairArrays) : 
    //  
    //      [
    //          [ name, value ],
    //          [ name, value ]
    //      ]
    
    //  Explitly DISALLOW usage of { name: value }
    //
    //      While this allows shorter code, it provides too many ways to
    //      do the same thing.
    //
    //      Furthermore it fails to accommodate duplicate (name)s
    
    stringify: 
        async data => JSON.stringify( data, null, 4 ).replace(/\\n/g, '\n'),
    
    uuid4:     
        require ( '/var/task/modules/uuid4.js' ),
    
    validate : 
    
        /*  First parameter:        ValidateMe object
        
                Example -   { 'desk-schemas': { 
                                
                                name:       'myName',
                                columns:    [
                                    
                                    { name:     'iAmColumn1',
                                      type:     'other'
                                    }
                                    
                                    { name:     'iAmColumn2',
                                      type:     'S'
                                    }
                                ]
                            } }
        
           
           
            Second parameter:       String | Array
            
                String  -   string_key of the Models object
                
                Array   -   [ string_key, string_sub_key, string_sub_sub_key, etc. ] 
                
                    Where is the Models object?
                    
                    Answer: framework should have loaded it already.
        
            
            
            Implicit parameter:     Models object
            
                Example -   models =
                
            {    
                'desk-schemas': {  
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
            }
            // models
        
        2020-06-11  Generally, I'm not pleased with development in this area of 
                    the project. Elegance in abstration seems to come with some
                    cognitive cost of twistyness.
        
        */
        async ( validateMe, modelKey ) => {

            const VALIDATE_ME = { 
                
                'desk-schemas': { 
                    name:       'myName',
                    columns:    [
                        { name:     'iAmColumn1',
                          type:     'other'
                        },
                        { name:     'iAmColumn2',
                          type:     'S'
                        }
                    ]
                } 
            }
        


            const testRule =    (   __dataToValidate, 
                                    __modelKey, 
                                    __currentModel,
                                    __ruleKey            ) => {
                
                switch ( __ruleKey ) {
                    
                    case ( 'count_gt' ) :
                    if ( __currentModel.rules[ __ruleKey ] === 0
                         && ! ( __modelKey in __dataToValidate )
                    ) 
                    {
                        throw Error ( `(rus.validate) required an Item keyed
                                      with (${ __modelKey }), but did not
                                      find this key in (_dataToValidate)
                                      `)        
                    }
                    break
                }
                // switch
            }

            const tempValidate =    (   _dataToValidate, 
                                        _modelKey, 
                                        _models         ) => {
                
///////////////////////////////////////////////////////////////////////////////
// OPERATION 1 : determine (_currentModel);
  
  // We should probably move this out of the way
                
                let _currentModel
                
                if ( typeof _modelKey == 'string' ) {
                    
                    if ( _modelKey in _models ) {
                        
                        _currentModel = _models[ _modelKey ]
                    }
                    else {  throw Error (   `(rus.validate) the requested 
                                            modelKey (${_modelKey}) was not 
                                            found in (models).
                                            `)
                    }
                    
                } else if ( _modelKey instanceof Array ) {
                    
                    throw Error ( `(rus.validate) (_modelKey instanceof Array)
                                  NOT YET IMPLEMENTED - TODO` )
                }
    
///////////////////////////////////////////////////////////////////////////////
// OPERATION 2 : 
//

                const _currentDatum = _dataToValidate[ _modelKey ]
                
                    /*  
                        { 
                            name:       'myName',
                            columns:    [
                                { name:     'iAmColumn1',
                                  type:     'other'
                                },
                                { name:     'iAmColumn2',
                                  type:     'S'
                                }
                            ]
                        }
                    */

                for ( const _subModelKey in _currentModel.subs ) {
                    // Iterates through 'name', 'columns' (models not data)

                    if ( _currentModel.subs[ _subModelKey ].self.leaf ) {
                    // a leaf
                    
                        _currentDatum[ _subModelKey ]
                            // 'myName'
                        _currentModel.subs[ _subModelKey ].self.rules
                            // desk-schemas.subs.name.self.rules 
                        
                        //  We can evaluate self.rules;
                        //  We would also want to pass _currentDatum so that 
                        //      checks such as (key in _currentDatum) can be 
                        //      accomplished.
                        //
                        //  So  ... sending in  _currentDatum
                        //                      _currentModel.subs[ _subModelKey ]
                        //      
                        //      ... seems isomorphic with
                        //              tempValidate ( _dataTovalidate, _modelKey, _models) 
                        
                    } else {                        
                    // not a leaf
                    
                        _currentDatum[ _subModelKey ]
                            // '[ columns ]'
                        _currentModel.subs[ _subModelKey ].self.rules
                            // desk-schemas.subs.columns.self.rules 
                        
                        //  We can first evaluate the self.rules, then
                        //  recurse into subs via tempValidate ();
                    }

                }

///////////////////////////////////////////////////////////////////////////////
// OPERATION 3 : iterate through (subModels, subDataToValidate) pairs;

            }
            // tempValidate ()

            tempValidate (  VALIDATE_ME,    //  temporary data, as above;
                            modelKey,       //  'desk-schemas' from (rus.validate)
                            models          //  (read from disk in this file)
                         )

            throw Error ( JSON.stringify ( [, models], null, 4 ) )
            
            
        },
        
    wasteMilliseconds: 
        async ms => { 
            const start = new Date().getTime() 
            while (new Date().getTime() < start + ms);
        },
    
}

//////////
//      //
//  !!  //  Make way.
//      //
//////////

module.exports  = rus
mark (`r-u-s.js (ruthenium utilities) LOADED`)