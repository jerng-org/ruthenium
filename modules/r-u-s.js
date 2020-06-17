
'use strict'

//  require()       executes modules; 
//  require.res()   resolves paths without execution;

const mark  = require ( '/var/task/modules/mark.js' )
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

    stringify: 
        async data =>   JSON.stringify( data, null, 4 )
                        //.replace(/\\n/g, '\n')
                        .replace(/\\/g, '\\'),
    
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
mark (`r-u-s.js (ruthenium utilities) LOADED`)