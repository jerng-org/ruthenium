'use strict'

//  require()       executes modules; 
//  require.res()   resolves paths without execution;

const mark = require('/var/task/modules/mark.js')
const conf = require(`/var/task/configuration.js`)

mark(`r-u-s.js (ruthenium utilities) LOADING ...`)

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
        ddbdc: require('/var/task/io/ddbdc.js'),
        cognito: require(`/var/task/io/cognito-oidc-relying-party.js`)
    },

    //////////
    //      //
    //  !!  //  Make way.
    //      //
    //////////

    cookie: require(`/var/task/modules/cookie.js`),

    conf: conf,

    html: require('/var/task/modules/html'),

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

    tag: async(DATA, string, optionalTruthyValue) => {
        DATA.RU.signals[`TAG_` + string.toUpperCase()] = optionalTruthyValue ? optionalTruthyValue : true
    },

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

    validateFormDataByMethod: async(data, httpMethodModelKey) => {

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

    validateFormData: async(data, modelKey) => {

        const _report = await rus.validation.validate(
            data.RU.request.formStringParameters,
            modelKey
        )
        data.RU.signals.formDataValidationReport = _report
        //data.RU.signals.formDataValidationShortReport = _report.shortReport
        //data.RU.signals.formDataValidationShortReportSummary = _report.shortReport.summary
        return data.RU.signals.formDataValidationReport .shortReport.summary
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
