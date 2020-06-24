
'use strict'

//  require()       executes modules; 
//  require.res()   resolves paths without execution;

const mark  =   require ( '/var/task/modules/mark.js' )
                
mark (`r-u-s.js (ruthenium utilities) LOADING ...`)

const fs    = require ('fs')
const url   = require ('url')

//////////
//      //
//  !!  //  Make way.
//      //
//////////


const rus   = {

//////////
//      //
//  !!  //  Make way.
//      //
//////////

    additionalRequestInformation : async _data => `
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
        
        const URLObject = new ( url.URL ) ( '/test-middleware',
                                            'https://secure.api.sudo.coffee'
                                            )
                                            
        const URLSearchParamsObject = URLObject.searchParams
        
        for ( const [ name, value ] of pairArrays ) {
            URLSearchParamsObject.append ( name, value )
        }
        
        return URLObject
    },

//////////
//      //
//  !!  //  Make way.
//      //
//////////

    aws: {
        ddbdc: require ( '/var/task/io/ddbdc.js' ),
    },
    
//////////
//      //
//  !!  //  Make way.
//      //
//////////

    conf: 
        require (`/var/task/configuration.js`),

    html:
        require ( '/var/task/modules/html' ),
    
//////////
//      //
//  !!  //  Make way.
//      //
//////////

    lambdaGitCommit: 
        require ( '/var/task/modules/lambda-git-commit' ),
    
//////////
//      //
//  !!  //  Make way.
//      //
//////////

    mark: 
        mark,

//////////
//      //
//  !!  //  Make way.
//      //
//////////

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

    print: {
        
        dataDebug:
            async rutheniumDataObject => {
                
                return `
DEBUG HIGHLIGHTS:
                
[ data.RU.errors ] renders ${
    await rus.print.inspectInfinity ( rutheniumDataObject.RU.errors ) }                 

[ Object.keys ( data ) ] renders ${ 
    JSON.stringify( Object.keys ( rutheniumDataObject ), null, 4 ) }                 

[ Object.keys ( data.RU.request ) ] renders ${
    JSON.stringify( Object.keys ( rutheniumDataObject.RU.request ), null, 4 ) }                 

[ Object.keys ( data.RU.signals ) ] renders ${
    JSON.stringify( Object.keys ( rutheniumDataObject.RU.signals ), null, 4 ) }                 

[ Object.keys ( data.RU.io ) ] renders ${
    JSON.stringify( Object.keys ( rutheniumDataObject.RU.io ), null, 4 ) }                 

[ Object.keys ( data.RU.response ) ] renders ${
    JSON.stringify( Object.keys ( rutheniumDataObject.RU.response ), null, 4 ) }                 

DEBUG EVERYTHING:

[ data.RU ] renders ${
    await rus.print.inspectInfinity ( rutheniumDataObject.RU ) }                 

[ data.LAMBDA ] renders ${
    await rus.print.inspectInfinity ( rutheniumDataObject.LAMBDA ) }                 
`
// end string
            },
        
        inspectInfinity:
            async object => rus.node.util.inspect( object, { depth: Infinity } ),
        
        stringify4:
            async object => JSON.stringify( object, null, 4 ).replace(/\\n/g, '\n'),

        xml300:
            async xmlString => 
                ( xmlString.slice(0,300) + '... [POSSIBLY TRUNCATED]' )
                .replace(/</g, '[')
    },
    
//////////
//      //
//  !!  //  Make way.
//      //
//////////

    uuid4:     
        require ( '/var/task/modules/uuid4.js' ),

//////////
//      //
//  !!  //  Make way.
//      //
//////////

    validate:
        require ( `/var/task/modules/validate.js` ),
    
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
     
    validateFormData:
        async (data, modelKey) =>
        {
            const _report   =   await rus.validate (    
                                        data.RU.request.formStringParameters, 
                                        modelKey 
                                )
            data.RU.signals.formDataValid   = _report.shortReport.summary
            data.RU.signals.formReport      = _report
            return data.RU.signals.formDataValid
        },
        
//////////
//      //
//  !!  //  Make way.
//      //
//////////

        
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
mark (`~/modules/r-u-s.js (ruthenium utilities) LOADED`)