'use strict'

const rusMinus1 = require('/var/task/modules/r-u-s-minus-1.js')
const conf = rusMinus1.conf
const mark = rusMinus1.mark

const print = require('/var/task/modules/print.js')

const fs = require('fs')

let models = {}
const modelFileNames = fs.readdirSync('/var/task/io/models')

rusMinus1.frameworkDescriptionLogger.callStarts()
modelFileNames.forEach((current, index, array) => {

    /* TODO : these naming assumptions : centralise the documentation */
    if (current[0] != '_' &&
        current.toLowerCase().slice(-3) == '.js') {
        models[current.slice(0, -3)] = require('/var/task/io/models/' + current)
    }
} /* , thisArg */ )
rusMinus1.frameworkDescriptionLogger.callEnds()

/*  See validate(), PARAMETER 2 - modelKey
 *
 *  -   the Array treatment is not yet implemented TODO
 */

const scopeModel = async _modelKey => {

    rusMinus1.frameworkDescriptionLogger.callStarts()

    let _currentModel

    if (typeof _modelKey == 'string') {

        if (_modelKey in models) {

            _currentModel = models[_modelKey]
        }
        else {
            rusMinus1.frameworkDescriptionLogger.callEnds()
            throw Error(`(validation.js:scopeModel) the requested 
                                modelKey (${_modelKey}) was not 
                                found in (models).
                                `)
        }

    }
    else if (_modelKey instanceof Array) {

        rusMinus1.frameworkDescriptionLogger.callEnds()
        throw Error(`(validation.js:scopeModel) (_modelKey instanceof Array)
                      NOT YET IMPLEMENTED - TODO`)
    }
    rusMinus1.frameworkDescriptionLogger.callEnds()
    return _currentModel
}

/*  In summary, (validate) walks through a tree of document 
 *  (models), and at each model looks for the corresponding 
 *  (unscopedData), then calls (validateRules) upon that pair
 *                                       << model, unscopedData >>
 *      
 *      We should PROBABLY FOR READABILITY ... migrate this to YAML. TODO.    
 *      
 *  PARAMETER 1 - unscopedData 
 *          
 *  REQUIRED;
 *                          
 *  EXAMPLE
 *      
 *              { 'DESK-SCHEMAS': { 
 *                  NAME:       'myName',
 *                  COLUMNS:    [
 *                      { NAME:     'iAmColumn1',
 *                        TYPE:     'other'
 *                      },
 *                      { NAME:     'iAmColumn2',
 *                        TYPE:     'S'
 *                      }
 *                  ]
 *              } }
 *  
 *  PARAMETER 2 - modelKey
 *  
 *  REQUIRED;
 *      
 *          String  -   string_key of the (models) object
 *  
 *                      EXAMPLE 'DESK-SCHEMAS'
 *              or
 *          
 *          Array   -   [ string_key, string_sub_key, string_sub_sub_key, etc. ] 
 *          
 *                      Where is the (models) object?
 *              
 *                      Answer: framework should have loaded it already.
 *                      
 *                      TODO : CHECK : I'm not sure that the code, for this 
 *                                           <<Array>> bit, has been written.
 *                      
 *  PARAMETER 3 - scopedModel         
 *                      
 *  OPTIONAL;
 *                      
 *  EXAMPLE
 *      
 *              models =        // built in (r-u-s.js)
 *              { 
 *                  'DESK-SCHEMAS' : { 
 *                      self: etc.
 *                      subs: {
 *                          NAME:   { self: etc. },
 *                          COLUMNS:{ self: etc. }
 *                      }
 *                  } 
 *              }
 *          
 *              scopedModel =   // returned by (validation.js:scopeModel)
 *              { 
 *                  self: etc.
 *                  subs: {
 *                      NAME:   { self: etc. },
 *                      COLUMNS:{ 
 *                          self: etc. 
 *                          subs: {
 *                              NAME: { self, etc. },
 *                              TYPE: { self, etc. }
 *                          }
 *                      }
 *                  }
 *              }    
 *              
 *  OPERATION 1
 *  
 *      If PARAMETER 3 is not filled by the user,       << scopedModel >>
 *          infer it from PARAMETER 2.                  << modelKey >>
 *      
 *      We don't want to be running (validation.js:scopeModel) on every recursing
 *      call, so here we control calls to happen only if (scopedModel)
 *      is not provided ... we then use (modelKey) to find 
 *      (scopedModel); but for the initiating call you can 
 *      (validate ( object, string, null) )
 *  
 *  OPERATION 2
 *  
 *      Use PARAMETER 1 and                     << unscopedData >>
 *          PARAMETER 2                         << modelKey >>
 *              to determine (_scopedData);
 *
 *      "PARAMETER 4"                           << _scopedData >>
 *  
 *      (_scopedData) should be isomorphic with (scopedModel ... PARAMETER 3)
 *  
 *      EXAMPLE:
 *          
 *          _scopedData ==
 *          { 
 *              NAME:       'myName',
 *              COLUMNS:    [
 *                  { NAME:     'iAmColumn1',
 *                    TYPE:     'other'
 *                  },
 *                  { NAME:     'iAmColumn2',
 *                    TYPE:     'S'
 *                  }
 *              ]
 *          }
 *  
 *  OPERATION 3
 *  
 *      PARAMETERS 3,4           << scopedModel>>, << _scopedData >>
 *          can now be compared; they are isomorphic.
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


const validate = async (

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

    rusMinus1.frameworkDescriptionLogger.callStarts()
    scopedModel = (!scopedModel && modelKey) ? await scopeModel(modelKey) :
        scopedModel

    // Now, (scopedModel) should be !null under all circustances.

    if (!unscopedData) {
        rusMinus1.frameworkDescriptionLogger.callEnds()
        throw Error(`validation.js: validate: (unscopedData was falsy): keyTrace ${keyTrace}`)
    }
    const _scopedData = unscopedData[modelKey]
    const _scopedDataIsArray = Array.isArray(_scopedData)

    //////////
    //      //
    //  !!  //  Make way.
    //      //
    //////////

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

    rusMinus1.frameworkDescriptionLogger.callEnds()
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

const validateRules = async (

    scopedDatum,

    scopedModel,

    keyTrace,

    shortReport

) => {

    rusMinus1.frameworkDescriptionLogger.callStarts()
    //////////
    //      //
    //  !!  //  Make way.
    //      //
    //////////

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

    //  There is a pre-rule:                self.many = << boolean >>,
    //  which must be 
    //  evaluated before the other rules:   self.rules = << object >>

    if (scopedModel.self.many) {
        // expect Array; apply rules to elements of scopedData
        if (Array.isArray(scopedDatum)) {
            report.many = ['pass', 'Expected Array; found Array.']
        }
        else {
            report.many = ['fail', Error(`Expected Array; found not-Array.`)]
            rusMinus1.frameworkDescriptionLogger.callEnds()
            return report
        }
    }
    else {
        // expect non-Array; apply rules to scopedData itself
        if (Array.isArray(scopedDatum)) {
            report.many = ['fail', Error(`Expected not-Array; found Array.`)]
            rusMinus1.frameworkDescriptionLogger.callEnds()
            return report
        }
        else {
            report.many = ['pass', 'Expected not-Array; found not-Array.']
        }
    }

    // After this line: (scopedModel.self.many) has been validated.

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
        shortReport.push([keyTrace, _ruleKey])


        const setResult = (_maybeError, _shortErrorMessage) => {

            rusMinus1.frameworkDescriptionLogger.callStarts()

            if (_maybeError instanceof Error) {
                shortReport.summary = false
                report.rules[_ruleKey].result = [`fail`, _maybeError]
                shortReport[shortReport.length - 1][2] = _shortErrorMessage ? [`fail`, _shortErrorMessage] : [`fail`, _maybeError.message + ` (This is a minimal error message; check the full report for more information.)`]
            }
            else {
                //  shortReport.summary is true by default; 
                //  if it is becomes false, it should not reset to true;
                report.rules[_ruleKey].result = [`pass`, _maybeError]
                shortReport[shortReport.length - 1][2] = report.rules[_ruleKey].result
            }

            rusMinus1.frameworkDescriptionLogger.callEnds()

        }
        /* Alternatively: 

        // _shortMaybeError is optional; used to keep shortReports ... short;
        const setResult = (_maybeError, _shortMaybeError) => {
            if (_maybeError instanceof Error) {
                shortReport.summary = false
                report.rules[_ruleKey].result = [`fail`, _maybeError]
            }
            else {
                //  shortReport.summary is true by default; 
                //  if it is becomes false, it should not reset to true;
                report.rules[_ruleKey].result = [`pass`, _maybeError]
            }

            let __shortResult
            shortReport[shortReport.length - 1][2] = _shortMaybeError ?
                (__shortResult = Array.from(report.rules[_ruleKey].result),
                    __shortResult[1] = _shortMaybeError,
                    __shortResult) :
                report.rules[_ruleKey].result

            //    _shortMaybeError.message :
            //  report.rules[_ruleKey].result
        }
        */
        setResult('default') // set: default pass

        /* STEP 2 : "DO THE RULE" */

        switch (_ruleKey) {

            //  Every CASE branch has to apply different logic to 
            //  scopedModel.self.many (true and false) (Ouch)

            /* TEMPLATE 
            
            case ('SOMETHING'):    
                if (scopedModel.self.many) {
    
                } // if (many); if-block ends
                else // not-'many', ergo is not an Array
                {
    
                } // if (many); else-block ends
                break // SOMETHING
            */

            /* TEMPLATE
            
                console.log(`${_ruleKey} debug: (scopedDatum, ${JSON.stringify(scopedDatum,null,4)}): (scopedModel, ${JSON.stringify(scopedModel,null,4)})`)
            
            */

            //////////
            //      //
            //  !!  //  Make way.
            //      //
            //////////

            case ('count_gt'):
                const ignoredValues = [undefined, '', null]
                if (scopedModel.self.many) // this pattern should recur for 'count_xyz'
                {
                    if (scopedDatum.filter(e => !ignoredValues.includes(e)).length <= _rulesToTest.count_gt) {
                        setResult(Error(`(validateRules) (${keyTrace}) (model.many:true) 
                      (model.rules.count_gt:${
                          _rulesToTest.count_gt
                      }) failed; scopedDatum had too few elements (values {undefined, null, ''} were excluded): (${
                          scopedDatum
                      })`))
                    }
                }
                else // not-'many', ergo is not an Array
                {
                    if (ignoredValues.includes(scopedDatum)) {
                        setResult(Error(`(validateRules) (${keyTrace}) (model.many:false)
                      (model.rules.count_gt:${
                          _rulesToTest.count_gt
                      }) failed; scopedDatum was: (${scopedDatum}))`))
                    }
                } // if (many), else [end of block]
                break // count_gt

                //////////
                //      //
                //  !!  //  Make way.
                //      //
                //////////

            case ('keys_included_counts'):

                /*
                    argument : {
                        min:    << integer : minimum allowed count of keys in keyList >>,
                        max:    << integer : maximum allowed count of keys in keyList >>,
                        keyList:<< array of {{ string }} keys >>
                    }
                */

                if (scopedModel.self.many) {

                    rusMinus1.frameworkDescriptionLogger.callEnds()
                    throw (`validation.js: validateRules: switch(_ruleKey): keys_included_counts: (model.many:true) BRANCH BODY UNDEFINED`)
                    // define later; case where {}

                } // if (many); if-block ends
                else // not-'many', ergo is not an Array
                {
                    let __keyCount = 0
                    for (const __key in scopedDatum) {
                        if (_rulesToTest.keys_included_counts.keyList.includes(__key)) {
                            __keyCount++
                        }
                    }

                    // 'undefined' min or max will error out;
                    if (__keyCount < _rulesToTest.keys_included_counts.min) {
                        setResult(Error(`validate.js: validateRules: switch(_ruleKey): keys_included_counts: 
                            scopedDatum keys (${Object.keys(scopedDatum)}) included
                            FEWER THAN ${_rulesToTest.keys_included_counts.min} elements of the 
                            keyList (${_rulesToTest.keys_included_counts.keyList})`))
                    }
                    else
                    if (__keyCount > _rulesToTest.keys_included_counts.max) {
                        setResult(Error(`validate.js: validateRules: switch(_ruleKey): keys_included_counts:
                            scopedDatum keys (${Object.keys(scopedDatum)}) included
                            MORE THAN ${_rulesToTest.keys_included_counts.min} elements of the 
                            keyList (${_rulesToTest.keys_included_counts.keyList})`))
                    }
                } // if (many); else-block ends
                break // keys_included_counts

            case ('only_allowed_keys'):

                if (scopedModel.self.many) {
                    rusMinus1.frameworkDescriptionLogger.callEnds()
                    throw (`validation.js: validateRules: switch(_ruleKey): only_allowed_keys: (model.many:true) BRANCH BODY UNDEFINED`)
                    // define later; case where {}
                } // if (many); if-block ends

                else // not-'many', ergo is not an Array
                {

                    // Perhaps this should be lifted up out of the if-else
                    rusMinus1.frameworkDescriptionLogger.backlog(`only_allowed_keys: see comment`)
                    const mapTest = (testFun, testModel, testDatum) => {

                        rusMinus1.frameworkDescriptionLogger.callStarts()

                        if (testModel.self.many) {
                            for (const testSubDatum of testDatum) {
                                testFun(testSubDatum)
                            }
                        } // if (many); if-block ends
                        else // not-'many', ergo is not an Array
                        {
                            testFun(testDatum)
                        } // if (many); else-block ends

                        rusMinus1.frameworkDescriptionLogger.callEnds()

                    }

                    const testFun1 = __datum => {

                        rusMinus1.frameworkDescriptionLogger.callStarts()

                        for (const __key in __datum) {
                            if (!scopedModel.self.rules.only_allowed_keys.includes(__key)) {
                                setResult(Error(`(validateRules) (${keyTrace}) 
(model.many: ${scopedModel.self.many}) 
(model.rules.only_allowed_keys: does not include the key (${__key}) found in the datum.)`))
                            }
                        }

                        /*console.log(`testFun1: `, {
                            shortReportSummary: shortReport.summary,
                            shortReport: shortReport,
                            report: report.rules[_ruleKey].resul
                        })*/

                        rusMinus1.frameworkDescriptionLogger.callEnds()

                    }

                    mapTest(testFun1, scopedModel, scopedDatum)

                } // if (many); else-block ends
                break // only_allowed_keys

                //////////
                //      //
                //  !!  //  Make way.
                //      //
                //////////

            case ('subs0_keys_applied_to_subs2'):

                /* There has got to be a prettier way to do this ... later. 2020-09-16 */

                //////////
                //      //
                //  !!  //  FORK:
                //      //
                //////////

                if (scopedModel.self.many) {
                    rusMinus1.frameworkDescriptionLogger.callEnds()
                    throw (`validation.js: validateRules: 
                        switch(_ruleKey): subs0_keys_applied_to_subs2: 
                        (model.many:true)
                        BRANCH BODY UNDEFINED`)
                } // if (many); if-block ends
                else // not-'many', ergo is not an Array
                {
                    const subs2Report = {}

                    const _branchDatum = {}

                    if (_rulesToTest.subs0_keys_applied_to_subs2.subs1 == 'all') {
                        Object.assign(_branchDatum, scopedDatum)
                    }
                    else
                    if (Array.isArray(_rulesToTest.subs0_keys_applied_to_subs2.subs1)) {
                        for (const __sub0Key of _rulesToTest.subs0_keys_applied_to_subs2.subs1) {

                            if (__sub0Key in scopedDatum) {
                                _branchDatum[__sub0Key] = scopedDatum[__sub0Key]
                            }
                            else {
                                /*
                                setResult(Error(`validate.js: validateRules:
                                    switch(_ruleKey): subs0_keys_applied_to_subs2: 
                                    (model.many:false) 
                                    (rule argument (Array):${ JSON.stringify(_rulesToTest.subs0_keys_applied_to_subs2) })
                                    required __sub0Key was not found in scopedDatum: (${ __sub0Key })`))
                                */
                            }
                        }
                    }
                    else {
                        setResult(Error(`validate.js: validateRules:
                            switch(_ruleKey): subs0_keys_applied_to_subs2: 
                            (model.many:false) 
                            (rule argument:${ JSON.stringify(_rulesToTest.subs0_keys_applied_to_subs2) })
                            BRANCH BODY UNDEFINED `))
                    }

                    for (const __sub0Key in _branchDatum) {
                        //////////
                        //      //
                        //  !!  //  FORK:
                        //      //
                        //////////
                        if (Array.isArray(_branchDatum[__sub0Key])) {
                            setResult(Error(`validate.js: validateRules:
                                switch(_ruleKey): subs0_keys_applied_to_subs2: 
                                (model.many:false) 
                                (rule argument:${ JSON.stringify(_rulesToTest.subs0_keys_applied_to_subs2)})
                                (_branchDatum[${__sub0Key}] is an Array) 
                                BRANCH BODY UNDEFINED `))
                        }
                        else {
                            subs2Report[__sub0Key] = {}
                            for (const __sub1Key in _branchDatum[__sub0Key]) {
                                //////////
                                //      //
                                //  !!  //  FORK:
                                //      //
                                //////////
                                if (Array.isArray(_branchDatum[__sub0Key][__sub1Key])) {
                                    subs2Report[__sub0Key][__sub1Key] = []
                                    for (const __sub2 of _branchDatum[__sub0Key][__sub1Key]) {

                                        const __sub2Report = await validate({
                                                [__sub0Key]: __sub2
                                            },
                                            __sub0Key,
                                            await scopeModel(__sub0Key)
                                        )
                                        subs2Report[__sub0Key][__sub1Key].push(__sub2Report)

                                        /* 
Reporting code copied from subs_all_fit_model, and not yet checked */

                                        // validation.js: validate: always checks shortReport.summary
                                        //  and when it is false, does not proceed, so this loop 
                                        //  should naturally follow that pattern; except for more 
                                        //  performance optimisation, there is no need to break here;

                                        if (__sub2Report.shortReport.summary) {
                                            setResult(subs2Report)

                                            // maybe rather redundant? check.
                                        }
                                        else {
                                            setResult(Error(`validate.js: validateRules:
                                                        switch(_ruleKey): subs0_keys_applied_to_subs2: 
                                                        (model.many:false)
                                                        (rule argument:${ JSON.stringify(_rulesToTest.subs0_keys_applied_to_subs2)})
                                                        (_branchDatum[${__sub0Key}] is NOT an Array) 
                                                        (_branchDatum[${__sub0Key}][${__sub1Key}] is an Array)
                                                        __sub2 element failed: 
                                                        
                                                            ${ await print.inspectInfinity ( subs2Report, null, 4) }
                                                        
                                                        `, __sub2Report.shortReport))
                                        }
                                        // end of inner-most loop


                                    }
                                }
                                else {
                                    setResult(Error(`validate.js: validateRules:
                                                switch(_ruleKey): subs0_keys_applied_to_subs2: 
                                                (model.many:false) 
                                                (rule argument:${ JSON.stringify(_rulesToTest.subs0_keys_applied_to_subs2)})
                                                (_branchDatum[${__sub0Key}] is NOT an Array) 
                                                (_branchDatum[${__sub0Key}][${__sub1Key}] is NOT an Array)
                                                BRANCH BODY UNDEFINED `))
                                }
                            }
                        }
                    }


                } // if (many); else-block ends
                break // subs0_keys_applied_to_subs2

                //////////
                //      //
                //  !!  //  Make way.
                //      //
                //////////

            case ('subs_all_fit_model'):
                if (scopedModel.self.many) {
                    rusMinus1.frameworkDescriptionLogger.callEnds()
                    throw (`validation.js: validateRules: switch(_ruleKey): subs_all_fit_model: scopedModel.self.many: BRANCH BODY UNDEFINED`)
                } // if (many); if-block ends
                else // not-'many', ergo is not an Array
                {

                    const subsReport = {}
                    for (const __key in scopedDatum) {
                        subsReport[__key] = await validate({
                                [__key]: scopedDatum[__key]
                            },
                            __key,
                            scopedModel.self.rules.subs_all_fit_model
                        )

                        // validation.js: validate: always checks shortReport.summary
                        //  and when it is false, does not proceed, so this loop 
                        //  should naturally follow that pattern; except for more 
                        //  performance optimisation, there is no need to break here;

                        if (subsReport[__key].shortReport.summary) {
                            setResult(subsReport)
                        }

                        else {
                            setResult(
                                Error(`
/---/
|validation.js:
| validateRules: 
|   ${keyTrace}: 
|     model.many==false: 
|       model.rules.subs_all_fit_model: failed
v
${ await print.inspectInfinity ( subsReport, null, 4) }
^
|---/`),
                                subsReport[__key].shortReport
                            )
                        }

                    }


                } // if (many); else-block ends
                break

                //////////
                //      //
                //  !!  //  Make way.
                //      //
                //////////

            case ('subs_all_test_true'):

                if (scopedModel.self.many) {

                    rusMinus1.frameworkDescriptionLogger.callEnds()
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
(model.many: false) 
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

                console.error(`(validate.js) (rule: included_in) BRANCH BODY UNDEFINED`)

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

                console.error(`(validate.js) (rule: regex_test) BRANCH BODY UNDEFINED`)

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

                rusMinus1.frameworkDescriptionLogger.callEnds()
                throw (Error(`(validation.js) (validateRules) : (_ruleKey : ${ _ruleKey } ) not found in (switch-case).`))


        }
        // switch _ruleKey

    }
    // _ruleKey in _rulesToTest

    rusMinus1.frameworkDescriptionLogger.callEnds()
    return report
}
// (validateRules)


module.exports = {
    validate: validate,
    validateRules: validateRules,
    models: models,
    scopeModel: scopeModel
}
mark('LOADED')