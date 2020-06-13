
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

console.warn (`(rus.validate) errors throw violently; consider a docile bubbling`) 

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

//////////
//      //
//  !!  //  Make way.
//      //
//////////
    
    newValidate :
        async () => {
            
        },
        
//////////
//      //
//  !!  //  Make way.
//      //
//////////

/*  In summary, (rus.validate) walks through a tree of document 
 *  (models), and at each model looks for the corresponding 
 *  (dataToValidate), then calls (rus.validateRules) upon that pair.

PARAMETER 1 - dataToValidate 
        
    REQUIRED;
                        
        EXAMPLE
    
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

PARAMETER 2 - modelKey

    REQUIRED;
    
        String  -   string_key of the (models) object

            EXAMPLE 'desk-schemas'
        
        Array   -   [ string_key, string_sub_key, string_sub_sub_key, etc. ] 
        
            Where is the (models) object?
            
            Answer: framework should have loaded it already.
                    
PARAMETER 3 - scopedModel         
                    
    OPTIONAL;
                    
        EXAMPLE
    
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
            
OPERATION 1

    If PARAMETER 3 is not filled by the user, infer it from PARAMETER 2.
    
        //  We don't want to be running (rus.scopeModel) on every recursing
        //  call, so here we control calls to happen only if (scopedModel)
        //  is not provided ... we then use (modelKey) to find 
        //  (scopedModel); but for the initiating call you can 
        //  (rus.validate ( object, string, null) )

OPERATION 2

    Use PARAMETER 1 and PARAMETER 2 to determine (_scopedData);
    (_scopedData) should be isomorphic with (scopedModel ... PARAMETER 3)

    "PARAMETER 4"

    EXAMPLE:
        
        _scopedData ==
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

OPERATION 3

    PARAMETERS 3,4 can now be compared; they are isomorphic.

    DISCUSSION:
                
        CASE 1.0
        The following are to be checked against scopedModel:
    
        _scopedData == undefined       // ! ( modelKey key in dataToValidate)
        _scopedData == value           // individual datum
        
            CASE 1.1
            The following are to be checked against _scopedModel.subs[ _subModelKey ]:
        
            _scopedData == {}              // empty POJO 
            _scopedData == { entries }     // non-empty POJO
            
            (entries) here are (scopedSubData) which may be mapped to 
            (subModels), but this is not done in (rus.validateRule);
            instead it is done in (rus.validate) AFTER (rus.validate)
            has executed (rus.validateRule) on the (scopedData)
                
        CASE 2.0
        The following must have VALUES INDIVIDUALLY CHECKED against scopedModel:     
            
            _scopedData == []              // empty Array object
            _scopedData == [ values ]      // non-empty Array object
    


 */
    
    
    validate : 
        async (     dataToValidate, 
                    modelKey, 
                    scopedModel         ) => 
        {
            
            scopedModel = ( ! scopedModel && modelKey )
                ? await rus.scopeModel( modelKey )
                : scopedModel
                // Now, (scopedModel) should be !null under all circustances.

            const _scopedData = dataToValidate[ modelKey ]
                
            /*
                    throw Error (await rus.stringify({
                        scopedModel: scopedModel,
                        scopedDatum: _scopedData
                    }))
            */
            
            await rus.validateRules ( _scopedData, scopedModel )

            //  If we reached here without throwing, it means (_scopedData)
            //  checks out. Now we traverse subModels, if the value is a
            //  non-Array object.
            
            for ( const _scopedSubModelKey in scopedModel.subs ) {
                // EXAMPLE: Iterates through 'name', 'columns' (keys in _scopedModel)
                
                rus.validate (  _scopedData[ _scopedSubModelKey ],
                                    //  Whereby, if the key is missing it will 
                                    //  caught by the subsequent (call to
                                    //  rus.validateRules) in the body of 
                                    //  (rus.validate)
                
                                _scopedSubModelKey,
                                scopedModel.subs[ _scopedSubModelKey ]
                             ) 
            }
        },
        // (rus.validate)
        
//////////
//      //
//  !!  //  Make way.
//      //
//////////

/*  In summary, (rus.validateRules) is called by (rus.validate) which passes in
 *  a pair of isomorphic arguments.
 *
 
PARAMETER 1

    scopedDatum     =   'myName'
                
    scopedDatum     =  
    
        { 
            id:         'some-id-string',
            name:       'myName',
            columns:    [
                {   name:     'iAmColumn1',
                    type:     'other'
                },
                {   name:     'iAmColumn2',
                    type:     'S'
                }
            ]
        }
                                    
        With reference to documentation in (rus.validate):

            THESE ARE EXPECTED:
    
            scopedDatum == undefined       // ! ( modelKey key in dataToValidate)
            scopedDatum == value           // individual datum
            scopedDatum == []              // empty Array object
            scopedDatum == [ values ]      // non-empty Array object
            scopedData == {}              // empty POJO 
            scopedData == { entries }     // non-empty POJO

PARAMETER 2                    
    
    scopedModel     =   { 
                            self: etc.
                            subs: {
                                name:   { self: etc. },
                                columns:{ 
                                    self: etc. 
                                    subs: {
                                        name:   { self: etc. },
                                        type:   { self: etc. }
                                    }
                                }
                            }
                        }
                    // returned by (rus.scopeModel) 

OPERATION 1

    A giant switch runs through all the rules in scopedModel.self.rules.
    
    When it finds a match it tries to throw an Error; if no Error is thrown, 
    the function returns nothing and the model is assumed to have validated the
    data.
            
case (rule):
if ( scopedModel.self.many ) 
{
  
}        // if (many); if-block ends
else     // not-'many', ergo is not an Array
{
  
}        // if (many); else-block ends
break    // (rule)
         
             
    */
    
    validateRules:
        async ( scopedDatum, scopedModel ) => {

            const _rulesToTest = scopedModel.self.rules
            
            for ( const _ruleKey in _rulesToTest ) {
                
switch ( _ruleKey ) {

case ( 'count_gt' ):
/*  This is a really stupendous amount of code just to check if something exists
 *  or not. I really have no faith in this design at the moment. But it should
 *  work. -2020-06-12
 */    
if ( scopedModel.self.many ) // this pattern should recur for 'count_xyz'
{
            // existential quantifier
            if  (   _rulesToTest.count_gt === 0
                    && 
                    (       ! Array.isArray( scopedDatum )
                        ||  (   scopedDatum = scopedDatum.filter(
                                    e => ! [ undefined, null, NaN ].includes(e)
                                ),
                                scopedDatum == 0
                             )
                    )
                ) 
            {
                throw Error ( `(rus.validateRules) (model.self.many:true) failed rule
                              'count_gt:0' (scopedDatum) was not an Array, or
                              had length == 1, after (null, undefined, and NaN)
                              elements were removed;
                              `)        
            }

            // naive comparison
            if (        ! Array.isArray( scopedDatum )
                    &&  scopedDatum.length <= _rulesToTest.count_gt )
            {
                throw Error ( `(rus.validateRules) (model.self.many:false)
                              (model.rules.count_gt:${
                                scopedModel.rules.count_gt
                              }) failed; scopedDatum.length was: (${
                                scopedDatum.length
                              })` )
            }
}
else // not-'many', ergo is not an Array
{
            // existential quantifier
            if  (   _rulesToTest.count_gt === 0 
                    && 
                    [ undefined, null, NaN ].includes ( scopedDatum )
                )   
            {
                throw Error ( `(rus.validateRules) (model.self.many:false) failed rule 
                              'count_gt:0' ... ( scopedDatum ) was (null, 
                              undefined, or NaN);
                              `)        
            }
            
            // naive comparison
            if ( _rulesToTest.count_gt > 1 ) {
                throw Error ( `(rus.validateRules) (model.self.many:false)
                              (model.rules.count_gt was greater than 1) so this
                              is a contradiction.` )
            }
} // if (many), else [end of block]
break // count_gt

case ('regex_text'):
if ( scopedModel.self.many ) 
{
  
}       // if (many); if-block ends
else    // not-'many', ergo is not an Array
{
  
}       // if (many); else-block ends
break   // regex_text

    
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