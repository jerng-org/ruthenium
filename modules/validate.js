'use strict'


const mark      = require ( '/var/task/modules/mark.js' )

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


const scopeModel = async _modelKey => {
            
    let _currentModel
    
    if ( typeof _modelKey == 'string' ) {
        
        if ( _modelKey in models ) {
            
            _currentModel = models[ _modelKey ]
        }
        else {  throw Error (   `(validate.js:scopeModel) the requested 
                                modelKey (${_modelKey}) was not 
                                found in (models).
                                `)
        }
        
    } else if ( _modelKey instanceof Array ) {
        
        throw Error ( `(validate.js:scopeModel) (_modelKey instanceof Array)
                      NOT YET IMPLEMENTED - TODO` )
    }
    return _currentModel
}

/*  In summary, (validate) walks through a tree of document 
 *  (models), and at each model looks for the corresponding 
 *  (dataToValidate), then calls (validateRules) upon that pair.

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
        
            scopedModel =   // returned by (validate.js:scopeModel)
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
    
        //  We don't want to be running (validate.js:scopeModel) on every recursing
        //  call, so here we control calls to happen only if (scopedModel)
        //  is not provided ... we then use (modelKey) to find 
        //  (scopedModel); but for the initiating call you can 
        //  (validate ( object, string, null) )

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
            (subModels), but this is not done in (validateRule);
            instead it is done in (validate) AFTER (validate)
            has executed (validateRule) on the (scopedData)
                
        CASE 2.0
        The following must have VALUES INDIVIDUALLY CHECKED against scopedModel:     
            
            _scopedData == []              // empty Array object
            _scopedData == [ values ]      // non-empty Array object
    


 */
    
    
const validate = async (    dataToValidate, 
                            modelKey, 
                            scopedModel = null,
                            keyTrace    = modelKey,
                            report      = { [modelKey]: {} },
                            shortReport = []
                            
                        ) => 
{
    
    scopedModel = ( ! scopedModel && modelKey )
        ? await scopeModel( modelKey )
        : scopedModel
        // Now, (scopedModel) should be !null under all circustances.

    const _scopedData = dataToValidate[ modelKey ]

//////////
//      //
//  !!  //  Make way.
//      //
//////////


    report[ modelKey ].self = await validateRules (  _scopedData, 
                                                    scopedModel, 
                                                    keyTrace, 
                                                    //report[ scopedModel ]   
                                                    )
                                                    
    //  If we reached here without throwing, it means (_scopedData)
    //  checks out. Now we traverse subModels, if the value is a
    //  non-Array object.
    
    report[ modelKey ].subs 
        =   scopedModel.self.many 
            //(       'subs' in scopedModel 
            //    &&  Object.keys ( scopedModel.subs ).length )
            ? new Array ( _scopedData.length )
                    .fill(0)
                    .map( _ => ({}) )  
            : {}

    for ( const _scopedSubModelKey in scopedModel.subs ) {
        // EXAMPLE: Iterates through 'name', 'columns' (keys in _scopedModel)

        //console.warn (`validate.js:_scopedSubModelKey: ${_scopedSubModelKey}`)
        if ( scopedModel.self.many )
        {
            let _count = 0
            for ( const _scopedDataSubItem of _scopedData )
            {
                //console.warn (`validate.js:_scopedDataSubItem: ${modelKey} / ${_count} / ${_scopedSubModelKey}`)
                report[ modelKey ].subs[ _count ][ _scopedSubModelKey ]
                    = ( await validate (_scopedDataSubItem, 
                                        //  Whereby, if the key is missing it will 
                                        //  caught by the subsequent (call to
                                        //  validateRules) in the body of 
                                        //  (validate)
                
                                        _scopedSubModelKey,
                                        scopedModel.subs[ _scopedSubModelKey ],
                                        keyTrace 
                                            + '.[' + _count + '].' 
                                            + _scopedSubModelKey
                    
                    )   ) [ _scopedSubModelKey ]
                _count ++
            }
        }
        else    // ! scopedModel.self.many
        {   
            report[ modelKey ].subs[ _scopedSubModelKey ]
                =   ( await validate(   _scopedData, 
                                        //  Whereby, if the key is missing it will 
                                        //  caught by the subsequent (call to
                                        //  validateRules) in the body of 
                                        //  (validate)
            
                                        _scopedSubModelKey,
                                        scopedModel.subs[ _scopedSubModelKey ],
                                        keyTrace + '.' + _scopedSubModelKey
                    
                    ) ) [ _scopedSubModelKey ]
        }
        // if scopedModel.self.many / else-block ends

//////////
//      //
//  !!  //  Make way.
//      //
//////////
    }
    // _scopedSubModelKey
    
    return { shortReport: shortReport, report: report }
}
// (validate)


/*  In summary, (validateRules) is called by (validate) which passes in
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
                                    
        With reference to documentation in (validate):

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
                    // returned by (validate.js:scopeModel) 

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
    
const validateRules = async (   scopedDatum, 
                                scopedModel, 
                                keyTrace, 
                                //report          
                                                ) => {
                                                    
    const _rulesToTest  = scopedModel.self.rules
    let report          = {
        rules:      {},
        
        //candidate: scopedDatum, 
            // we could add the candidate data here, but this does not seem 
            // helpful yet; 
    }
    
    for ( const _ruleKey in _rulesToTest ) {
        
        report.rules[ _ruleKey ] = {
            argument:   _rulesToTest[ _ruleKey ],
            result:     undefined, // 'ok' or new Error
        }
        
        const setResult = _maybeError => {
            report.rules[ _ruleKey ].result =   ( _maybeError instanceof Error )
                                                ? [ `error`, _maybeError ]
                                                : 'valid'
        }
        setResult() // default pass
        
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
                        scopedDatum.length == 0
                     )
            )
        ) 
    {
        setResult ( Error ( `(validateRules) (${keyTrace}) (model.self.many:true) 
                      (model.rules.count_gt:${
                          scopedModel.self.rules.count_gt
                      }) failed; scopedDatum.length was: (${
                          scopedDatum.length
                      })`) )        
    }

    // naive comparison
    if (        ! Array.isArray( scopedDatum )
            ||  scopedDatum.length <= _rulesToTest.count_gt )
    {
        setResult ( Error ( `(validateRules) (${keyTrace}) (model.self.many:false)
                      (model.rules.count_gt:${
                        scopedModel.self.rules.count_gt
                      }) failed; scopedDatum.length was: (${
                        scopedDatum.length
                      })` ) )
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
        setResult ( Error ( `(validateRules) (${keyTrace}) (model.self.many:false)
                      (model.rules.count_gt:${
                          scopedModel.self.rules.count_gt
                      }) failed; scopedDatum was: (${
                          scopedDatum
                      })`) )
    }
    
    // naive comparison
    if ( _rulesToTest.count_gt > 1 ) {
        setResult ( Error ( `(validateRules) (${keyTrace}) (model.self.many:false)
                      (model.rules.count_gt was greater than 1) so this
                      is a contradiction; your actual data may or may 
                      not be ok.` ) )
    }
} // if (many), else [end of block]
break // count_gt

case ('included_in'):
if ( scopedModel.self.many ) 
{

}       // if (many); if-block ends
else    // not-'many', ergo is not an Array
{

}       // if (many); else-block ends
break   // regex_text

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
    
    return report
}
// (validateRules)


module.exports  = validate
mark (`validate.js LOADED`)