import rusMinus1 from '/var/task/modules/r-u-s-minus-1.js'

let fs, querystring, url, util

switch(rusMinus1.conf.platform.javascriptEngine) {
    case ('NODEJS'): {
        fs = await import ( "node:fs" )
        querystring = await import ( "node:querystring")
        url = await import ( "node:url")
        util = await import ( "node:util")
        break
    }
    case ('TXIKIJS'): {
        break
    }
    default : { throw new Error('r-u-s.js : branch not implemented') }
}

const mark = rusMinus1.mark 
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

    additionalRequestInformation: async _data => {

        rusMinus1.frameworkDescriptionLogger.callStarts()

        const _returned = `
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
                
        } , null, 4 ) }`

        rusMinus1.frameworkDescriptionLogger.callEnds()

        return _returned
    },

    appUrl: async pairArrays => {

        rusMinus1.frameworkDescriptionLogger.callStarts()

        const URLObject = new(url.URL)(
            rusMinus1.conf.app.uri.path,
            rusMinus1.conf.app.uri.scheme + '://' + rusMinus1.conf.app.uri.authority.host
        )

        const URLSearchParamsObject = URLObject.searchParams

        for (const [name, value] of pairArrays) {
            URLSearchParamsObject.append(name, value)
        }

        rusMinus1.frameworkDescriptionLogger.callEnds()

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
        // CRASHY 
        ddb: await import('/var/task/io/ddb.js'),
        // CRASHY : uses jsonwebtoken which seems to be CJS
        cognito: (await import('/var/task/io/cognito-oidc-relying-party.js')).default,
        // CRASHY 
        s3: await import('/var/task/io/s3.js')
    },

    //////////
    //      //
    //  !!  //  Make way.
    //      //
    //////////

    // CRASHY 
    cookie: (await import('/var/task/modules/cookie.js')).default,

    conf: rusMinus1.conf,

    // Please reconsider this design decision in the future 2022-04-26 :
    customLogger: rusMinus1.customLogger,

    frameworkDescriptionLogger: rusMinus1.frameworkDescriptionLogger,

    // CRASHY 
    html: (await import('/var/task/modules/html.js')).default,

    http: {

        // CRASHY 
        status400: (await import('/var/task/tasks/status-400.js')).default,
        status401: (await import('/var/task/tasks/status-401.js')).default,
        status403: (await import('/var/task/tasks/status-403.js')).default,
        status404: (await import('/var/task/tasks/status-404.js')).default,
        status409: (await import('/var/task/tasks/status-409.js')).default,
        status500: (await import('/var/task/tasks/status-500.js')).default,
        status501: (await import('/var/task/tasks/status-501.js')).default,

    },
    //////////
    //      //
    //  !!  //  Make way.
    //      //
    //////////

    // CRASHY 
    jsonwebtoken: (await import('jsonwebtoken')).default, // LAMBDA LAYER arn:aws:lambda:us-east-1:ABC:layer:oidc-jwt-validation-tools:1

    // CRASHY 
    jwkToPem: (await import('jwk-to-pem')).default, // LAMBDA LAYER arn:aws:lambda:us-east-1:ABC:layer:oidc-jwt-validation-tools:1

    // CRASHY 
    lambdaGitCommit: (await import('/var/task/io/lambda-git-commit.js')).default, // LAMBDA LAYER arn:aws:lambda:us-east-1:ABC:layer:git-arm-lambda:12

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

            rusMinus1.frameworkDescriptionLogger.callStarts()

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

            rusMinus1.frameworkDescriptionLogger.callEnds()

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

            rusMinus1.frameworkDescriptionLogger.callStarts()

            const err = new Error(message)
            DATA.RU.errors.push(err)
            console.error(err.stack)

            rusMinus1.frameworkDescriptionLogger.callEnds()
        }
    },

    mark: mark,

    //////////
    //      //
    //  !!  //  Make way.
    //      //
    //////////

    node: {

        fs: fs,

        querystring: querystring,

        url: url,

        util: util 
    },

    // CRASHY 
    print: (await import('/var/task/modules/print.js')).default,

    //////////
    //      //
    //  !!  //  Make way.
    //      //
    //////////

    // CRASHY 
    oidcSession: (await import('/var/task/modules/oidc-session.js')).default,

    //////////
    //      //
    //  !!  //  Make way.
    //      //
    //////////

    tag: async (DATA, string, optionalTruthyValue) => {

        rusMinus1.frameworkDescriptionLogger.callStarts()

        DATA.RU.signals[`TAG_` + string.toUpperCase()] = optionalTruthyValue ? optionalTruthyValue : true

        rusMinus1.frameworkDescriptionLogger.callEnds()

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

    // CRASHY  : crypto
    uuid4: (await import('/var/task/io/uuid4.js')).default,

    //////////
    //      //
    //  !!  //  Make way.
    //      //
    //////////

    // CRASHY  : fs 
    validation: (await import('/var/task/io/validation.js')).default,

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

        rusMinus1.frameworkDescriptionLogger.callStarts()

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

        rusMinus1.frameworkDescriptionLogger.callEnds()

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

        rusMinus1.frameworkDescriptionLogger.callStarts()

        const _report = await rus.validation.validate(
            data.RU.request.formStringParameters,
            modelKey
        )
        data.RU.signals.formDataValidationReport = _report
        //data.RU.signals.formDataValidationShortReport = _report.shortReport
        //data.RU.signals.formDataValidationShortReportSummary = _report.shortReport.summary

        rusMinus1.frameworkDescriptionLogger.callEnds()

        return data.RU.signals.formDataValidationReport.shortReport.summary
    },

    //////////
    //      //
    //  !!  //  Make way.
    //      //
    //////////


    wasteMilliseconds: async ms => {

        rusMinus1.frameworkDescriptionLogger.callStarts()

        const start = new Date().getTime()
        while (new Date().getTime() < start + ms);

        rusMinus1.frameworkDescriptionLogger.callEnds()

    },

}

//////////
//      //
//  !!  //  Make way.
//      //
//////////
export default rus;
mark(`LOADED`)