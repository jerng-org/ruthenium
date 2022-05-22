'use strict'

//  require()       executes modules; 
//  require.res()   resolves paths without execution;

const conf = require(`/var/task/configuration.js`)
const rusMinus1 = require(`/var/task/modules/r-u-s-minus-one.js`)
const mark = require('/var/task/modules/mark.js')

mark(`~/modules/r-u-s.js (ruthenium utilities) LOADING ...`)

const fs = require('fs')
const url = require('url')

//////////
//      //
//  !!  //  Make way.
//      //
//////////


const rus = {

    //////////
    //      //
    //  !!  //  Make way.
    //      //
    //////////

    additionalRequestInformation: async _data => `
        ${ JSON.stringify( {
            
            signals:
                _data.RU.signals,
            
            http: 
                _data.RU.request.http,
            
            queryStringParameters:
                _data.RU.request.queryStringParameters,
            
            formStringParameters:
                _data.RU.request.formStringParameters,
            
            headers:
                _data.RU.request.headers,
                
            middlewares:
                _data.RU.middlewares,
                
            io:
                _data.RU.io
                
        } , null, 4 ) }`,

    appUrl: async pairArrays => {

        const URLObject = new(url.URL)(
            conf.app.uri.path,
            conf.app.uri.scheme + '://' + conf.app.uri.authority.host
        )

        const URLSearchParamsObject = URLObject.searchParams

        for (const [name, value] of pairArrays) {
            URLSearchParamsObject.append(name, value)
        }

        return URLObject

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
    },

    //////////
    //      //
    //  !!  //  Make way.
    //      //
    //////////

    aws: {
        ddbdc: require('/var/task/io/ddb-dc.js'),
        cognito: require(`/var/task/io/cognito-oidc-relying-party.js`),
        s3: require('/var/task/io/s3.js')
    },

    //////////
    //      //
    //  !!  //  Make way.
    //      //
    //////////

    cookie: require(`/var/task/modules/cookie.js`),

    conf: conf,

    // Please reconsider this design decision in the future 2022-04-26 :
    customLogger: conf.customLogging ?
        require(`/var/task/modules/custom-logger.js`) : undefined,

    frameworkDescriptionLogger: rusMinus1.frameworkDescriptionLogger,
    
    html: require('/var/task/modules/html.js'),

    //////////
    //      //
    //  !!  //  Make way.
    //      //
    //////////

    jsonwebtoken: require('jsonwebtoken'), // LAMBDA LAYER

    jwkToPem: require('jwk-to-pem'), // LAMBDA LAYER

    lambdaGitCommit: require('/var/task/io/lambda-git-commit'), // LAMBDA LAYER

    //////////
    //      //
    //  !!  //  Make way.
    //      //
    //////////

    /*  All sorts of rubbish for the time being; miscellaneous;
     *      until these are tidied into their proper place in future architecture;
     *      the name of the key provides a reminder to refactor;
     */

    limbo: {

        ddbDeskCellsByRowID: (_deskSchemaItem, _deskCellItems) => {

            //  Add property (D) if missing

            //  Check that _deskSchemaItem matches _deskCellItems

            let __deskColumnTypes = {}
            let __deskRows = {}

            _deskSchemaItem.columns
                .forEach((__column) => { __deskColumnTypes[__column.name] = __column.type })

            _deskCellItems
                .forEach((__cell) => {

                    // coherence check
                    if (!('DHC' in __cell)) {
                        throw Error(`r-u-s.js: ddbDeskCellsByRowID: key (DHC) not in __cell`)
                    }

                    const __dhcSplit = __cell.DHC.split('#')

                    // coherence check
                    if (!__dhcSplit.length == 2) {
                        throw Error(`r-u-s.js: ddbDeskCellsByRowID: '#' appears not exactly once, in __cell.DHC`)
                    }

                    const [_deskName, _colName] = __dhcSplit

                    // initialisation check
                    if (!(__cell.R in __deskRows)) {
                        __deskRows[__cell.R] = {}
                    }

                    const _colType = __deskColumnTypes[_colName]
                    __deskRows[__cell.R][_colName] = __cell[_colType]
                })
            return __deskRows
        },

    },

    //////////
    //      //
    //  !!  //  Make way.
    //      //
    //////////

    log: {

        error: (DATA, message) => {
            const err = new Error(message)
            DATA.RU.errors.push(err)
            console.error(err.stack)
        }
    },

    mark: mark,

    //////////
    //      //
    //  !!  //  Make way.
    //      //
    //////////

    node: {

        //childProcess : require('child_process'),

        fs: require('fs'),

        querystring: require('querystring'),

        url: url,

        util: require('util')
    },

    print: require(`/var/task/modules/print.js`),

    //////////
    //      //
    //  !!  //  Make way.
    //      //
    //////////

    oidcSession: require(`/var/task/modules/oidc-session.js`),

    //////////
    //      //
    //  !!  //  Make way.
    //      //
    //////////

    tag: async (DATA, string, optionalTruthyValue) => {
        DATA.RU.signals[`TAG_` + string.toUpperCase()] = optionalTruthyValue ? optionalTruthyValue : true
    },

    //////////
    //      //
    //  !!  //  Make way.
    //      //
    //////////

    //////////
    //      //
    //  !!  //  Make way.
    //      //
    //////////

    uuid4: require('/var/task/io/uuid4.js'),

    //////////
    //      //
    //  !!  //  Make way.
    //      //
    //////////

    validation: require(`/var/task/io/validation.js`),

    /*  VALIDATE_FORM_METHOD
     * 
     *  This is experimental. We may figure out how to combine this with 
     *      VALIDATE_FORM_METHOD at a later point in time.
     * 
     *  For now they are uncoupled. 
     * 
     * 
     * 
     * 
     */

    validateFormDataByMethod: async (data, httpMethodModelKey) => {

        const scopedModel = await rus.validation.scopeModel(httpMethodModelKey)

        const _report = await rus.validation.validate({
                [httpMethodModelKey]: data.RU.request.formStringParameters
            },
            httpMethodModelKey, // second parameter : modelKey ( where scopedData will be firstParameter[modelKey] )
            scopedModel // third parameter : scopedModel
        )
        data.RU.signals.formDataMethodValidationReport = _report
        //data.RU.signals.formDataMethodValidationShortReport = _report.shortReport
        //data.RU.signals.formDataMethodValidationShortReportSummary = _report.shortReport.summary
        return data.RU.signals.formDataMethodValidationReport.shortReport.summary
    },

    /*  VALIDATE_FORM_DATA
     *
     *  Returns (data.RU.signals.formDataValid); so you can use this call in
     *  a control structure like (if-else), but please don't go and assign its 
     *  returned value to some other variable; in your code simply refer to 
     *  (data.RU.signals.formDataValid); of course if you have not made this
     *  call during the current request, ('formDataValid' in data.RU.signals) 
     *  will be (false) and therefore (data.RU.signals.formDataValid) will be 
     *  (undefined), hence falsy;
     */

    validateFormData: async (data, modelKey) => {

        const _report = await rus.validation.validate(
            data.RU.request.formStringParameters,
            modelKey
        )
        data.RU.signals.formDataValidationReport = _report
        //data.RU.signals.formDataValidationShortReport = _report.shortReport
        //data.RU.signals.formDataValidationShortReportSummary = _report.shortReport.summary
        return data.RU.signals.formDataValidationReport.shortReport.summary
    },

    //////////
    //      //
    //  !!  //  Make way.
    //      //
    //////////


    wasteMilliseconds: async ms => {
        const start = new Date().getTime()
        while (new Date().getTime() < start + ms);
    },

}

//////////
//      //
//  !!  //  Make way.
//      //
//////////

module.exports = rus
mark(`~/modules/r-u-s.js (ruthenium utilities) LOADED`)
