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

    print: {

        dataDebug: async rutheniumDataObject => {

            return `
DEBUG HIGHLIGHTS:
                
[ data.RU.errors ] renders ${
    await rus.print.inspectInfinity ( rutheniumDataObject.RU.errors ) }                 

[ Object.keys ( data ) ] renders ${ 
    typeof rutheniumDataObject == 'object'
    && rutheniumDataObject != null
    ? JSON.stringify( Object.keys ( rutheniumDataObject ), null, 4 ) 
    : `<< not an object >> : ${ rutheniumDataObject }`
}                 

[ Object.keys ( data.RU ) ] renders ${ 
    typeof rutheniumDataObject.RU == 'object' 
    && rutheniumDataObject.RU != null
    ? JSON.stringify( Object.keys ( rutheniumDataObject.RU ), null, 4 ) 
    : `<< not an object >> : ${ rutheniumDataObject.RU }`
}                 

[ Object.keys ( data.RU.request ) ] renders ${
    typeof rutheniumDataObject.RU.request == 'object' 
    && rutheniumDataObject.RU.request != null
    ? JSON.stringify( Object.keys ( rutheniumDataObject.RU.request ), null, 4 ) 
    : `<< not an object >> : ${ rutheniumDataObject.RU.request }`
}

[ Object.keys ( data.RU.signals ) ] renders ${
    typeof rutheniumDataObject.RU.signals == 'object' 
    && rutheniumDataObject.RU.signals != null
    ? JSON.stringify( Object.keys ( rutheniumDataObject.RU.signals ), null, 4 ) 
    : `<< not an object >> : ${ rutheniumDataObject.RU.signals }`
}

[ Object.keys ( data.RU.io ) ] renders ${
    typeof rutheniumDataObject.RU.io == 'object' 
    && rutheniumDataObject.RU.io != null
    ? JSON.stringify( Object.keys ( rutheniumDataObject.RU.io ), null, 4 ) 
    : `<< not an object >> : ${ rutheniumDataObject.RU.io }`
}

[ Object.keys ( data.RU.response ) ] renders ${ // READONLY for DEBUG
    typeof rutheniumDataObject.RU.response == 'object' 
    && rutheniumDataObject.RU.response != null
    ? JSON.stringify( Object.keys ( rutheniumDataObject.RU.response ), null, 4 ) 
    : `<< not an object >> : ${ rutheniumDataObject.RU.response }`
}

DEBUG EVERYTHING:

[ data.RU ] renders ${
    await rus.print.inspectInfinity ( rutheniumDataObject.RU ) }                 

[ data.LAMBDA ] renders ${
    await rus.print.inspectInfinity ( rutheniumDataObject.LAMBDA ) }                 
`
            // end string
        },

        inspectInfinity: async object => rus.node.util.inspect(object, { depth: Infinity }),

        stringify4: async object => (`(rus.print.stringify4( object ) returned):
` + JSON.stringify(object, null, 4)).replace(/\\n/g, '\n'),

        xml300: async xmlString =>
            (xmlString.slice(0, 300) + '... [POSSIBLY TRUNCATED]')
            .replace(/</g, '[')
    },

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

    validate: require(`/var/task/io/validate.js`),

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
    
    validateFormMethod: async(data, modelKey, methodModelKey ) => {
        
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
        const _report = await rus.validate(
            data.RU.request.formStringParameters,
            modelKey
        )
        data.RU.signals.formDataValid = _report.shortReport.summary
        data.RU.signals.formReport = _report
        return data.RU.signals.formDataValid
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
