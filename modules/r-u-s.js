
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
    
        /*  (rus.validate):
        
            First parameter:        dataToValidate = Object
        
                EXAMPLE -   
                
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
           
            Second parameter:       modelKey = String | Array
            
                String  -   string_key of the (models) object
                
                Array   -   [ string_key, string_sub_key, string_sub_sub_key, etc. ] 
                
                    Where is the (models) object?
                    
                    Answer: framework should have loaded it already.
        
            Third parameter:        scopedModel object
            
                EXAMPLE -   
                
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
                            columns:{ self: etc. }
                        }
                         
                    }
        */
        
    validate : 
        async (     dataToValidate, 
                    modelKey, 
                    scopedModel         ) => {
            
            //  We don't want to be running (rus.scopeModel) on every recursing
            //  call, so here we control calls to happen only if (scopedModel)
            //  is not provided ... we then use (modelKey) to find 
            //  (scopedModel); but for the initiating call you can 
            //  (rus.validate ( object, string, null) )
            scopedModel = ( ! scopedModel && modelKey )
                ? await rus.scopeModel( modelKey )
                : scopedModel
                
                // Now, (scopedModel) should be !null under all circustances.


///////////////////////////////////////////////////////////////////////////////
// OPERATION 1 :
//
    
///////////////////////////////////////////////////////////////////////////////
// OPERATION 2 : 
//
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

                    const _rulesToTest = scopedModel.subs[ _subModelKey ].self.rules
                            // EXAMPLE: desk-schemas.subs.name.self.rules 
                            // EXAMPLE: desk-schemas.subs.columns.self.rules 
                        

                    if ( scopedModel.subs[ _subModelKey ].self.leaf )
                    {
// a leaf (in a model)
                            // EXAMPLE: desk-schemas.subs.name.self.leaf == true

                        //  CONSIDERATION:                    
                        //      We should put the 'datum is required' test out
                        //  here, because it requires (_scopedModel.subs);
                        //  the opportunity cost is that it gives us more than 
                        //  one place where code checks rules.
                        //      In fact, any rule in the 'count_' family should 
                        //  placed here because it requires checking the array,
                        //  not the contents of the array.
                        //      This uncovers an aberration in our design ...
                        //  arrays are special.
                        //      The 'count_' family for the time being consists
                        //  foreseeably of:
                        //      - 'count_gt'    (greater    than    x)
                        //      - 'count_lt'    (less       than    x)
                        //      - 'count_eq'    (equal      to      x)
                        //  ... where the value of any key is the x).
                        if (    _rulesToTest.count_gt === 0
                                && 
                                (   ( ! ( _subModelKey in _scopedDatum ) ) 
                                      || _scopedDatum[ _subModelKey ] == undefined
                                      || _scopedDatum[ _subModelKey ] == null  
                                    ) 
                                )
                        {
                            throw Error ( `(rus.validate) required an Item keyed
                                          with (${ _subModelKey }), but did not
                                          find this key in ( _scopedDatum ), or
                                          this key's value was (null or 
                                          undefined);
                                          `)        
                        }
                        
                        //  UNIMPLEMENTED TODO
                        //  else if ( ) { 'count_gt', 'count_lt', 'count_eq' }
                        
                        else
                        {
                            const valueToTest = _scopedDatum[ _subModelKey ]
                                    // EXAMPLE: _scopedDatum.name    = 'myName'
                        }
                        
                        rus.validateRule ( valueToTest, _rulesToTest )
                        
                        /* ALTERNATIVELY */
                        /*
                        
                        
                        */
                        /* END_ALTERNATIVELY */

                    }
                    else
                    {                        
// not a leaf (in a model; probably an array of leaves)
                            // EXAMPLE: desk-schemas.subs.columns.self.leaf == false
                    
                        
                        if (    _rulesToTest.count_gt === 0
                                && 
                                (   ( ! ( _subModelKey in _scopedDatum ) ) 
                                      || ! ( _scopedDatum[ _subModelKey ] instanceof Array )
                                      || (  _scopedDatum[ _subModelKey ]
                                                = _scopedDatum[ _subModelKey ].filter(
                                                    e =>    ( e != null ) 
                                                            && 
                                                            ( e != undefined )
                                            ),
                                            _scopedDatum[ _subModelKey ].length == 0
                                         )
                                ) 
                        )
                        {
                            throw Error ( `(rus.validate) required an Array of 
                                          items keyed with (${ _subModelKey }), 
                                          but did not
                                          find this key in ( _scopedDatum ), or
                                          the value was not an Array, or the Array 
                                          contained no non-null, non-undefined
                                          elements);
                                          `)        
                        }
                        
                        //  UNIMPLEMENTED TODO
                        //  else if ( ) { 'count_gt', 'count_lt', 'count_eq' }
                        
                        else
                        {
                                    // EXAMPLE: _scopedDatum.columns = '[ columns ]'
                            for (const valueToTest of _scopedDatum[ _subModelKey ] ) 
                            {
                                rus.validateRule ( valueToTest, _rulesToTest )
                            }
                            
    
                        }
    
                        /* ALTERNATIVELY */
                        /*
                        
                        
                        */
                        /* END_ALTERNATIVELY */

                        
                    
                    
                    

                        //  We can first evaluate the self.rules, then
                        //  recurse into subs via tempValidate ();
                    }
                    // if (leaf)
// end if (leaf)                    

                }

///////////////////////////////////////////////////////////////////////////////
// OPERATION 3 : iterate through (subModels, subDataToValidate) pairs;


/*
            rus.validate (  dataToValidate, //  (desk-schemas-post.js)      ;
                            modelKey,       //  'desk-schemas'              ;
                            scopedModel     //  <-  passing an object here 
                                            //      avoids a second call to
                                            //      (rus.scopeModel)
                         )
*/
            throw Error ( JSON.stringify ( [, models], null, 4 ) )
            
            
        },
        
    validateRule:
        async () => {
            
        }
        /*
        async ( __dataToValidate, 
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
        }*/,
        
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