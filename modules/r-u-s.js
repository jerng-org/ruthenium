
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

    scopeModel:
        async _modelKey => {
            
            let _currentModel
            
            if ( typeof _modelKey == 'string' ) {
                
                if ( _modelKey in models ) {
                    
                    _currentModel = models[ _modelKey ]
                }
                else {  throw Error (   `(rus.scopeModel) the requested 
                                        modelKey (${_modelKey}) was not 
                                        found in (models).
                                        `)
                }
                
            } else if ( _modelKey instanceof Array ) {
                
                throw Error ( `(rus.scopeModel) (_modelKey instanceof Array)
                              NOT YET IMPLEMENTED - TODO` )
            }
            return _currentModel
        },
        
    stringify: 
        async data => JSON.stringify( data, null, 4 ).replace(/\\n/g, '\n'),
    
    uuid4:     
        require ( '/var/task/modules/uuid4.js' ),
    
            
    validate : 
    
        /*  In summary, (rus.validate) walks through a tree of document 
         *  (models), and at each model looks for the corresponding 
         *  (dataToValidate), then calls (rus.validateRules) upon that pair.
         */
    
        async (     dataToValidate, 
        
                    /*  EXAMPLE
                    
                            { 'desk-schemas': { 
                                name:       'myName',
                                columns:    [
                                    { name:     'iAmColumn1',
                                      type:     'other'
                                    },
                                    { name:     'iAmColumn2',
                                      type:     'S'
                                    }
                                ]
                            } }
                    */
        
                    modelKey, 
                    
                    /*  EXAMPLE 'desk-schemas'
                    
                    
                        String  -   string_key of the (models) object
                        
                        Array   -   [ string_key, string_sub_key, string_sub_sub_key, etc. ] 
                        
                            Where is the (models) object?
                            
                            Answer: framework should have loaded it already.
                    */
                    
                    scopedModel         
                    
                    /*  EXAMPLE
                    
                            models =        // built in (r-u-s.js)
                            { 
                                'desk-schemas' : { 
                                    self: etc.
                                    subs: {
                                        name:   { self: etc. },
                                        columns:{ self: etc. }
                                    }
                                } 
                            }
                        
                            scopedModel =   // returned by (rus.scopeModel)
                            { 
                                self: etc.
                                subs: {
                                    name:   { self: etc. },
                                    columns:{ 
                                        self: etc. 
                                        subs: {
                                            name: { self, etc. },
                                            type: { self, etc. }
                                        }
                                    }
                                }
                            }                    
                    */
                    

                    
                    ) => {
            
            //  We don't want to be running (rus.scopeModel) on every recursing
            //  call, so here we control calls to happen only if (scopedModel)
            //  is not provided ... we then use (modelKey) to find 
            //  (scopedModel); but for the initiating call you can 
            //  (rus.validate ( object, string, null) )
            scopedModel = ( ! scopedModel && modelKey )
                ? await rus.scopeModel( modelKey )
                : scopedModel
                
                // Now, (scopedModel) should be !null under all circustances.

            const _scopedDatum = dataToValidate[ modelKey ]
            
                /*  EXAMPLE:
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

            for ( const _subModelKey in scopedModel.subs ) 
            {
                // EXAMPLE: Iterates through 'name', 'columns' (keys in _scopedModel)
                rus.validateRules ( _scopedDatum, _subModelKey, scopedModel )
            
                /*  In this example, the leaf 'name' is fed to (rus.validateRules);
                 *
                 *  After that, the non-leaf 'columns' is fed to (rus.validateRules);
                 *
                 *  If (rus.validateRules) does not throw, then it returns nothing.
                 *
                 *  We would still need to feed 'columns.name' and 'columns.type'
                 *  to (rus.validateRules). Therefore ...
                 */
                
                /*  Currently this appears to be written WRONG.
                 *  This is supposed to check (dataToValidate) against
                 *  (scopedModel.self)
                 *
                 */
                
                
                
                
                
                                    //for ( const _scopedSubDatum of _scopedDatum[ _subModelKey ] ) {
                                    //    
                                    //    rus.validate (  dataToValidate[ modelKey ], 
                                    //                        
                                    //                        /* EXAMPLE:
                                    //                        
                                    //                        { 
                                    //                            name:       'myName',
                                    //                            columns:    [
                                    //                                { name:     'iAmColumn1',
                                    //                                  type:     'other'
                                    //                                },
                                    //                                { name:     'iAmColumn2',
                                    //                                  type:     'S'
                                    //                                }
                                    //                            ]
                                    //                        }
                                    //                        
                                    //                        */
                                    //                        
                                    //                    _subModelKey, 
                                    //                        
                                    //                        /* EXAMPLE:  'name', 'columns' */
                                    //                        
                                    //                    scopedModel.subs[ _subModelKey ]    
                                    //                        
                                    //                        /* EXAMPLE:
                                    //                        
                                    //                        name:   { self: etc. },
                                    //                        
                                    //                            OR
                                    //                        
                                    //                        columns:{ 
                                    //                            self: etc. 
                                    //                            subs: {
                                    //                                name: { self, etc. },
                                    //                                type: { self, etc. }
                                    //                            }
                                    //                        }
                                    //                        
                                    //                        */
                                    //                        
                                    //                 ) 
                                    //}
                
            }

            throw Error ( JSON.stringify ( [, models], null, 4 ) )
            
            
        },
    
    
    validateRules:
        async ( scopedDatum, subModelKey, scopedModel ) => {

            /*  (rus.validateRules) EXAMPLE:
            
                scopedDatum     =   { 
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
                
                subModelKey     =   'name' or 'columns'
                
                scopedModel     =   { 
                                        self: etc.
                                        subs: {
                                            name:   { self: etc. },
                                            columns:{ self: etc. }
                                        }
                                    }
                                    
                                    // returned by (rus.scopeModel)
            
            */    
            
            const _rulesToTest = scopedModel.subs[ subModelKey ].self.rules
                    // EXAMPLE: desk-schemas.subs.name.self.rules 
                    // EXAMPLE: desk-schemas.subs.columns.self.rules 
                
            for ( const _ruleKey in _rulesToTest ) {
                
switch ( _ruleKey ) {
/*  Try to throw an Error; if no Error is thrown, the function returns nothing
 *  and the model is assumed to have validated the data.
 */

case ( 'count_gt' ):
/*  This is a really stupendous amount of code just to check if something exists
 *  or not. I really have no faith in this design at the moment. But it should
 *  work. -2020-06-12
 */    
if ( scopedModel.subs[ subModelKey ].self.leaf ) // this pattern should recur for 'count_xyz'
{
            if  (   _rulesToTest.count_gt === 0 
                    && 
                    (   ( ! ( subModelKey in scopedDatum ) ) 
                          || scopedDatum[ subModelKey ] == undefined
                          || scopedDatum[ subModelKey ] == null  
                        ) 
                ) // existential quantifier
            {
                throw Error ( `(rus.validateRules) required an Item keyed
                              with (${ subModelKey }), but did not
                              find this key in ( scopedDatum ), or
                              this key's value was (null or 
                              undefined);
                              `)        
            }

            //  You might proceed as such:
            //      const valueToTest = scopedDatum[ subModelKey ]
                        // EXAMPLE: _scopedDatum.name    = 'myName'

}
else    // is not a leaf, ergo is an Array; this pattern should recur for 'count_xyz'
{
            if  (   _rulesToTest.count_gt === 0
                    && 
                    (   ( ! ( subModelKey in scopedDatum ) ) 
                          || ! ( scopedDatum[ subModelKey ] instanceof Array )
                          || (  scopedDatum[ subModelKey ]
                                    = scopedDatum[ subModelKey ].filter(
                                        e =>    ( e != null ) 
                                                && 
                                                ( e != undefined )
                                ),
                                scopedDatum[ subModelKey ].length == 0
                             )
                    ) 
                ) // existential quantifier
            {
                throw Error ( `(rus.validateRules) required an Array of 
                              items keyed with (${ subModelKey }), 
                              but did not
                              find this key in ( scopedDatum ), or
                              the value was not an Array, or the Array 
                              contained no non-null, non-undefined
                              elements);
                              `)        
            }
            
            //  You might proceed as such:
            //      for ( const valueToTest of scopedDatum[ subModelKey ] ) 
                        // EXAMPLE: _scopedDatum.columns = '[ columns ]'
            
}
// if (leaf), else [end of block]

break
// count_gt


}
// switch _ruleKey

            }
            // _ruleKey in _rulesToTest
            
        },
        // (rus.validateRules)
        
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