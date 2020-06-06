'use strict'

//  require()       executes modules; 
//  require.res()   resolves paths without execution;

//  TEMPLATE : in-code technical debt warning
//  console.warn ( `⚠ DEBT_NOTE ⚠`, )

const mark  = require ( '/var/task/modules/mark.js' )
mark (`r-u-s.js (ruthenium utilities) LOADING ...`)

const url   = require ('url')

//////////
//      //
//  !!  //  Make way.
//      //
//////////

console.warn ( `fixme: rus.rurl (determine how to build a URL`)
const rutheniumUtilities= {

    aws: {
        ddbdc: require ( '/var/task/io/ddbdc.js' ),
    },
    
    gitCommit: 
        require ( '/var/task/modules/git-commit' ),
    
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
    
    appUrl: pairArrays => {   
        
        const URLObject = new ( url.URL ) ( '/test-middleware',
                                            'https://secureapi.sudo.coffee'
                                            )
                                            
        const URLSearchParamsObject = URLObject.searchParams
        
        for ( const [ name, value ] of pairArrays ) {
            URLSearchParamsObject.append ( name, value )
        }
        
        return URLObject
    },

    stringify: 
        data => JSON.stringify( data, null, 4 ).replace(/\\n/g, '\n'),
    
    uuid4:     
        require ( '/var/task/modules/uuid4.js' ),

    wasteMilliseconds: 
        ms => { 
            const start = new Date().getTime() 
            while (new Date().getTime() < start + ms);
        },
    
}

//////////
//      //
//  !!  //  Make way.
//      //
//////////

module.exports  = rutheniumUtilities
mark (`r-u-s.js (ruthenium utilities) LOADED`)