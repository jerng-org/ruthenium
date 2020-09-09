'use strict'

const conf = require(`/var/task/configuration.js`)

const mark = require('/var/task/modules/mark.js')

const fs = require('fs')

let models = {}
const modelFileNames = fs.readdirSync('/var/task/io/models')
modelFileNames.forEach((current, index, array) => {

    if (current[0] != '_' &&
        current.toLowerCase().slice(-3) == '.js') {
        models[current.slice(0, -3)] = require('/var/task/io/models/' + current)
    }
} /* , thisArg */ )

/*  See validate(), PARAMETER 2 - modelKey
 *
 *  -   the Array treatment is not yet implemented TODO
 */

const scopeModel = async _modelKey => {

    let _currentModel

    if (typeof _modelKey == 'string') {

        if (_modelKey in models) {

            _currentModel = models[_modelKey]
        }
        else {
            throw Error(`(validation.js:scopeModel) the requested 
                                modelKey (${_modelKey}) was not 
                                found in (models).
                                `)
        }

    }
    else if (_modelKey instanceof Array) {

        throw Error(`(validation.js:scopeModel) (_modelKey instanceof Array)
                      NOT YET IMPLEMENTED - TODO`)
    }
    return _currentModel
}

/*  In summary, (validate) walks through a tree of document 
 *  (models), and at each model looks for the corresponding 
 *  (unscopedData), then calls (validateRules) upon that pair.
 *  
 *  PARAMETER 1 - unscopedData 
 *          
 *      REQUIRED;
 *                          
 *          EXAMPLE
 *      
 *              { 'desk-schemas': { 
 *                  name:       'myName',
 *                  columns:    [
 *                      { name:     'iAmColumn1',
 *                        type:     'other'
 *                      },
 *                      { name:     'iAmColumn2',
 *                        type:     'S'
 *                      }
 *                  ]
 *              } }
 *  
 *  PARAMETER 2 - modelKey
 *  
 *      REQUIRED;
 *      
 *          String  -   string_key of the (models) object
 *  
 *              EXAMPLE 'desk-schemas'
 *          
 *          Array   -   [ string_key, string_sub_key, string_sub_sub_key, etc. ] 
 *          
 *              Where is the (models) object?
 *              
 *              Answer: framework should have loaded it already.
 *                      
 *  PARAMETER 3 - scopedModel         
 *                      
 *      OPTIONAL;
 *                      
 *          EXAMPLE
 *      
 *              models =        // built in (r-u-s.js)
 *              { 
 *                  'desk-schemas' : { 
 *                      self: etc.
 *                      subs: {
 *                          name:   { self: etc. },
 *                          columns:{ self: etc. }
 *                      }
 *                  } 
 *              }
 *          
 *              scopedModel =   // returned by (validation.js:scopeModel)
 *              { 
 *                  self: etc.
 *                  subs: {
 *                      name:   { self: etc. },
 *                      columns:{ 
 *                          self: etc. 
 *                          subs: {
 *                              name: { self, etc. },
 *                              type: { self, etc. }
 *                          }
 *                      }
 *                  }
 *              }    
 *              
 *  OPERATION 1
 *  
 *      If PARAMETER 3 is not filled by the user, infer it from PARAMETER 2.
 *      
 *      We don't want to be running (validation.js:scopeModel) on every recursing
 *      call, so here we control calls to happen only if (scopedModel)
 *      is not provided ... we then use (modelKey) to find 
 *      (scopedModel); but for the initiating call you can 
 *      (validate ( object, string, null) )
 *  
 *  OPERATION 2
 *  
 *      Use PARAMETER 1 and PARAMETER 2 to determine (_scopedData);
 *      (_scopedData) should be isomorphic with (scopedModel ... PARAMETER 3)
 *  
 *      "PARAMETER 4"
 *  
 *      EXAMPLE:
 *          
 *          _scopedData ==
 *          { 
 *              name:       'myName',
 *              columns:    [
 *                  { name:     'iAmColumn1',
 *                    type:     'other'
 *                  },
 *                  { name:     'iAmColumn2',
 *                    type:     'S'
 *                  }
 *              ]
 *          }
 *  
 *  OPERATION 3
 *  
 *      PARAMETERS 3,4 can now be compared; they are isomorphic.
 *  
 *      DISCUSSION:
 *                  
 *          CASE 1.0
 *          The following are to be checked against scopedModel:
 *      
 *          _scopedData == undefined   // ! ( modelKey key in unscopedData)
 *          _scopedData == value       // individual datum
 *          
 *              CASE 1.1
 *              The following are to be checked against 
 *                  _scopedModel.subs[ _subModelKey ]: 
 *
 *              _scopedData == {}              // empty POJO 
 *              _scopedData == { entries }     // non-empty POJO
 *              
 *              (entries) here are (scopedSubData) which may be mapped to 
 *              (subModels), but this is not done in (validateRule);
 *              instead it is done in (validate) AFTER (validate)
 *              has executed (validateRule) on the (scopedData)
 *                  
 *          CASE 2.0
 *          The following must have VALUES INDIVIDUALLY CHECKED against 
 *              scopedModel:     
 *              
 *              _scopedData == []              // empty Array object
 *              _scopedData == [ values ]      // non-empty Array object
 *      
 *  RETURNS     
 *      
 *      report                      //  enumerable;     Object
 *      report.shortReport          //  non-enumerable; Array
 *      report.shortReport.summary  //  non-enumerable; Boolean
 *      
 *      
 */


const validate = async(

    unscopedData,

    modelKey,

    scopedModel = null,

    keyTrace = modelKey,

    report = {
        [modelKey]: {}
    },

    shortReport = Object.defineProperty([], 'summary', {
        configurable: true,
        enumerable: false,
        value: true, // defaults to 'pass'
        writable: true
    })

) => {
    scopedModel = (!scopedModel && modelKey) ? await scopeModel(modelKey) :
        scopedModel

    // Now, (scopedModel) should be !null under all circustances.

    if (!unscopedData) {
        throw Error(`validation.js: validate: (unscopedData was falsy): keyTrace ${keyTrace}`)
    }
    const _scopedData = unscopedData[modelKey]
    const _scopedDataIsArray = Array.isArray(_scopedData)

    //////////
    //      //
    //  !!  //  Make way.
    //      //
    //////////

    console.log(`(validation.validate) (modelKey) :`, modelKey)

    report[modelKey].self = await validateRules(

        _scopedData,
        scopedModel,
        keyTrace,
        shortReport
    )
    if (shortReport.summary) {

        //  If we reached here without a 'fail', it means (_scopedData)
        //  checks out. Now we traverse subModels, if the value is a
        //  non-Array object.

        report[modelKey].subs = scopedModel.self.many
            //(       'subs' in scopedModel 
            //    &&  Object.keys ( scopedModel.subs ).length )
            ?
            new Array(_scopedDataIsArray ? _scopedData.length : 0)
            .fill(0)
            .map(_ => ({})) : {}

        //////////
        //      //
        //  !!  //  Make way.
        //      //
        //////////

        for (const _scopedSubModelKey in scopedModel.subs) {
            // EXAMPLE: Iterates through 'name', 'columns' (keys in _scopedModel)

            if (_scopedDataIsArray) // double-check logic on this line; TODO; 
            {
                let _count = 0
                for (const _scopedDataSubItem of _scopedData) {
                    report[modelKey].subs[_count][_scopedSubModelKey] = (await validate(

                        _scopedDataSubItem,
                        //  Whereby, if the key is missing it will 
                        //  caught by the subsequent (call to
                        //  validateRules) in the body of 
                        //  (validate)

                        _scopedSubModelKey,

                        scopedModel.subs[_scopedSubModelKey],

                        keyTrace +
                        '[' + _count + '][' +
                        _scopedSubModelKey + ']',

                        undefined,

                        shortReport

                    ))[_scopedSubModelKey]
                    _count++
                }
            }
            else // ! scopedModel.self.many
            {
                report[modelKey].subs[_scopedSubModelKey] = (await validate(

                    _scopedData,
                    //  Whereby, if the key is missing it will 
                    //  caught by the subsequent (call to
                    //  validateRules) in the body of 
                    //  (validate)

                    _scopedSubModelKey,

                    scopedModel.subs[_scopedSubModelKey],

                    keyTrace + '[' + _scopedSubModelKey + ']',

                    undefined,

                    shortReport

                ))[_scopedSubModelKey]
            }
            // if scopedModel.self.many / else-block ends
        }
        // for _scopedSubModelKey
    }
    // if ( shortReport.summary )


    //shortReport.push ( [ keyTrace, 'something' ] )
    // Perhaps this would be more idiomatic as as Map, but I am avoiding thought about it for now.

    Object.defineProperty(report, 'shortReport', {
        enumerable: false,
        value: shortReport
    })

    return report
}
// (validate)


/*  In summary, (validateRules) is called by (validate) which passes in
 *  a pair of isomorphic arguments.
 *
 *
 *  PARAMETER 1
 *  
 *      scopedDatum     =   'myName'
 *                  
 *      scopedDatum     =  
 *      
 *          { 
 *              id:         'some-id-string',
 *              name:       'myName',
 *              columns:    [
 *                  {   name:     'iAmColumn1',
 *                      type:     'other'
 *                  },
 *                  {   name:     'iAmColumn2',
 *                      type:     'S'
 *                  }
 *              ]
 *          }
 *                                      
 *          With reference to documentation in (validate):
 *  
 *              THESE ARE EXPECTED:
 *      
 *              scopedDatum == undefined       // ! ( modelKey key in unscopedData)
 *              scopedDatum == value           // individual datum
 *              scopedDatum == []              // empty Array object
 *              scopedDatum == [ values ]      // non-empty Array object
 *              scopedData == {}              // empty POJO 
 *              scopedData == { entries }     // non-empty POJO
 *  
 *  PARAMETER 2                    
 *      
 *      scopedModel     =   { 
 *                              self: etc.
 *                              subs: {
 *                                  name:   { self: etc. },
 *                                  columns:{ 
 *                                      self: etc. 
 *                                      subs: {
 *                                          name:   { self: etc. },
 *                                          type:   { self: etc. }
 *                                      }
 *                                  }
 *                              }
 *                          }
 *                      // returned by (validation.js:scopeModel) 
 *  
 *  OPERATION 1
 *  
 *      A giant switch runs through all the rules in scopedModel.self.rules.
 *      
 *      When it finds a match it tries to throw an Error; if no Error is thrown, 
 *      the function returns nothing and the model is assumed to have validated the
 *      data.
 *              
 *  case (rule):
 *  if ( scopedModel.self.many ) 
 *  {
 *    
 *  }        // if (many); if-block ends
 *  else     // not-'many', ergo is not an Array
 *  {
 *    
 *  }        // if (many); else-block ends
 *  break    // (rule)
 *           
 */

const validateRules = async(

    scopedDatum,

    scopedModel,

    keyTrace,

    shortReport

) => {

    console.log(`(validation.js) (validateRules) (scopedModel)`, scopedModel)

    const _rulesToTest = scopedModel.self.rules
    const report = {
        rules: {}

        //candidate: scopedDatum, 
        // we could add the candidate data here, but this does not seem 
        // helpful yet; 
    }

    //////////
    //      //
    //  !!  //  Make way.
    //      //
    //////////

    for (const _ruleKey in _rulesToTest) {

        /* STEP 1 : INITIALISE REPORTING FUNCTION, INITIALISE REPORT */

        report.rules[_ruleKey] = {
            argument: _rulesToTest[_ruleKey],
            result: undefined, // 'ok' or new Error
        }
        shortReport.push([keyTrace])

        const setResult = _maybeError => {
            if (_maybeError instanceof Error) {
                shortReport.summary = false
                report.rules[_ruleKey].result =
                    shortReport[shortReport.length - 1][1] = [`fail`, _maybeError]
            }
            else {
                //  shortReport.summary is true by default; 
                //  if it is becomes false, it should not reset to true;
                report.rules[_ruleKey].result =
                    shortReport[shortReport.length - 1][1] = ['pass']
            }
        }
        setResult() // set: default pass

        /* STEP 2 : "DO THE RULE" */

        switch (_ruleKey) {


            /* TEMPLATE 
            
            case ('SOMETHING'):    
                if (scopedModel.self.many) {
    
                } // if (many); if-block ends
                else // not-'many', ergo is not an Array
                {
    
                } // if (many); else-block ends
                break // SOMETHING
            */

            //////////
            //      //
            //  !!  //  Make way.
            //      //
            //////////

            case ('count_gt'):
                /*  This is a really stupendous amount of code just to check if something exists
                 *   or not. I really have no faith in this design at the moment. But it should
                 *   work. -2020-06-12
                 *
                 *   We should probably combine the "existential quantifier" and "naive 
                 *   comparison" checks. -2020-06-19
                 */
                if (scopedModel.self.many) // this pattern should recur for 'count_xyz'
                {
                    // existential quantifier
                    if (_rulesToTest.count_gt === 0 &&
                        (!Array.isArray(scopedDatum) ||
                            (scopedDatum = scopedDatum.filter(
                                    e => ![undefined, null, NaN].includes(e)
                                ),
                                scopedDatum.length == 0
                            )
                        )
                    ) {
                        setResult(Error(`(validateRules) (${keyTrace}) (model.self.many:true) 
                      (model.rules.count_gt:${
                          scopedModel.self.rules.count_gt
                      }) failed; scopedDatum was: (${
                          scopedDatum
                      })`))
                    }

                    // naive comparison
                    if (!Array.isArray(scopedDatum) ||
                        scopedDatum.length <= _rulesToTest.count_gt) {
                        setResult(Error(`(validateRules) (${keyTrace}) (model.self.many:false)
                      (model.rules.count_gt:${
                        scopedModel.self.rules.count_gt
                      }) failed; scopedDatum was: (${
                        scopedDatum
                      })`))
                    }
                }
                else // not-'many', ergo is not an Array
                {
                    // existential quantifier
                    if (_rulesToTest.count_gt === 0 && [undefined, null, NaN].includes(scopedDatum)) {
                        setResult(Error(`(validateRules) (${keyTrace}) (model.self.many:false)
                      (model.rules.count_gt:${
                          scopedModel.self.rules.count_gt
                      }) failed; scopedDatum was: (${
                          scopedDatum
                      })`))
                    }

                    // naive comparison
                    if (_rulesToTest.count_gt > 1) {
                        setResult(Error(`(validateRules) (${keyTrace}) (model.self.many:false)
                      (model.rules.count_gt was greater than 1) so this
                      is a contradiction; your actual data may or may 
                      not be ok.`))
                    }
                } // if (many), else [end of block]
                break // count_gt

                //////////
                //      //
                //  !!  //  Make way.
                //      //
                //////////

            case ('only_allowed_keys'):

                if (scopedModel.self.many) {

                    throw (`validation.js: validateRules: switch(_ruleKey): only_allowed_keys: scopedModel.self.many: BRANCH BODY UNDEFINED`)
                    // define later; case where {}

                } // if (many); if-block ends

                else // not-'many', ergo is not an Array
                {

                    // Perhaps this should be lifted up to a higher level in this
                    //  file for general use?
                    const mapTest = (testFun, testModel, testDatum) => {
                        if (testModel.self.many) {
                            for (const testSubDatum of testDatum) {
                                testFun(testSubDatum)
                            }
                        } // if (many); if-block ends
                        else // not-'many', ergo is not an Array
                        {
                            testFun(testDatum)
                        } // if (many); else-block ends
                    }

                    const testFun1 = __datum => {
                        for (const __key in __datum) {
                            if (!scopedModel.self.rules.only_allowed_keys.includes(__key)) {
                                setResult(Error(`(validateRules) (${keyTrace}) 
                            (model.self.many: ${scopedModel.self.many}) 
                            (model.rules.only_allowed_keys does not include
                            the key (${__key}) found in the datum.`))
                            }
                        }
                    }

                    mapTest(testFun1, scopedModel, scopedDatum)

                } // if (many); else-block ends
                break // only_allowed_keys

                //////////
                //      //
                //  !!  //  Make way.
                //      //
                //////////

            case ('subs_all_fit_model'):
                if (scopedModel.self.many) {

                    throw (`validation.js: validateRules: switch(_ruleKey): subs_all_fit_model: scopedModel.self.many: BRANCH BODY UNDEFINED`)
                    // define later; case where {}

                } // if (many); if-block ends
                else // not-'many', ergo is not an Array
                {
                    for (const __key in scopedDatum) {



                        report.rules[_ruleKey].__report = await validateRules(
                            scopedDatum[__key],
                            scopedModel.self.rules.subs_all_fit_model,

                            keyTrace + `[${ __key }]`,
                            shortReport

                        )
                        console.warn(`validation.js: ...: subs_all_fit_model: validateRules FUNCTION CALL:
                        
                            // 2020-09 : I have legit forgotten how to use these
                            //              last two parameters, and shall have
                            //              to revisit this later; present usage
                            //              might screw up the reports.
                            `)





                    }
                } // if (many); else-block ends
                break

                //////////
                //      //
                //  !!  //  Make way.
                //      //
                //////////

            case ('subs_all_test_true'):

                conf.verbosity > 0 && console.log(`(validation.js) (rule: subs_all_test_true) PARTIALLY ... UNDEFINED`)

                if (scopedModel.self.many) {

                    throw (`validation.js: validateRules: switch(_ruleKey): subs_all_test_true: scopedModel.self.many: BRANCH BODY UNDEFINED`)
                    // define later; case where {}
                }
                else {

                    /*  Where, for example:
                        
                        scopedDatum = 
                        {
                          'desk-cells': {
                            PUT: [
                              { N: '99', DHC: 'shoes#size', D: 'shoes' },
                              { S: 'hihi', DHC: 'shoes#material', D: 'shoes' },
                              { S: 'hi', DHC: 'shoes#color', D: 'shoes' }
                            ]
                          }
                        },
                    
                    */

                    for (const __modelKey in scopedDatum) {
                        /*  Where, for example: __modelKey = 'desk-cells' */

                        if (!_rulesToTest.subs_all_test_true(scopedDatum[__modelKey])) {
                            setResult(
                                Error(`
(validateRules)
(keyTrace: ${ keyTrace }) 
(model.self.many: false) 
(model.rules.subs_all_test_true:

    ${ scopedModel.self.rules.subs_all_test_true }

) failed; scopedDatum [ __modelKey ]  was: (
    
    ${ JSON.stringify( scopedDatum[ __modelKey ], null, 4 ) }

)
                                `)
                            )
                        }
                    }


                }
                break

                //*
            case ('included_in'):

                conf.verbosity > 0 && console.log(`(validate.js) (rule: included_in) UNDEFINED`)

                if (scopedModel.self.many) {

                } // if (many); if-block ends
                else // not-'many', ergo is not an Array
                {

                } // if (many); else-block ends
                break // regex_test

                //////////
                //      //
                //  !!  //  Make way.
                //      //
                //////////

            case ('regex_test'):

                conf.verbosity > 0 && console.log(`(validate.js) (rule: regex_test) UNDEFINED`)

                if (scopedModel.self.many) {

                } // if (many); if-block ends
                else // not-'many', ergo is not an Array
                {

                } // if (many); else-block ends
                break // regex_test
                //*/

                //////////
                //      //
                //  !!  //  Make way.
                //      //
                //////////

            default:

                throw (Error(`(validation.js) (validateRules) : (_ruleKey : ${ _ruleKey } ) not found in (switch-case).`))


        }
        // switch _ruleKey

    }
    // _ruleKey in _rulesToTest

    return report
}
// (validateRules)


module.exports = {
    validate: validate,
    validateRules: validateRules,
    models: models,
    scopeModel: scopeModel
}
mark(`~/modules/validation.js LOADED`)