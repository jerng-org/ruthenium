'use strict'

const reindexFormNames = async ( data ) => {

/*
    .matchAll(//g) returns anIterator, which you can pass as Array.from(anIterator) ... 
    
    ...  which in turn returns:
    
    [ //    Array: of matches
    
        [   //  Array: one per match
        
            ... [ all the capture groups],   
            
                    // become the numerically indexed elements;
            
            index,  // prop: index of the first result in the original string;
            
            input,  // prop: initial string;
            
            groups  // prop: Object
            
                        // { indices: values } ... named and unnamed capture groups 
        ]
    ]

///////////////////////////////////////////////////////////////////////////////

  Tool:           https://regexr.com/

    Related
    Public Query:   https://stackoverflow.com/questions/62111549/whats-the-best-way-to-validate-and-lex-a-string-that-looks-like-a-nested-array

            Is regex even the best approach?
    
                Some simple valid-character assumptions:
                
                the form xxx[xxx][xxx].yy must be adhered to
                'x' can be any non-uppercase letter, and non-square-bracket
                'y' must be Arabic numerals only
                the number of [xxx] blocks is undetermined, but must be greater than 0
                xxx segments cannot be zero-length, but may be any other length
                yy segments cannot be zero-length, but may be any other length
                newlines are not 
                Context: JavaScript (no look-behind?)            
    
///////////////////////////////////////////////////////////////////////////////
        
    Sample Input:   ^shoes[country][source]###567###[arbitrarily-many-boxed-strings]$
                    
                    ^HEAD[ASIS-1][ASIS-2]TOARRAYINDEX[ASIS-3][ASIS-N]$
                    
        Rules:      - HEAD must exist
                    - SEGMENT and ARRAYINDEX are optional
                    - max SEGMENTS      : Infinity
                    - max ARRAYINDEX    : 1
                    - HEAD & SEGMENT each have length > 0
                    - HEAD & SEGMENT disallow 
                        uppercase, line breaks, '[', ']'
                    - SEGMENT disallows 
                        ###
                    - ###\d+### can occur only once
                        implicitly, only outside [blocks]
                    
    Validation:     /^((?!###)[^A-Z\[\]\n\r])+(\[((?!###)[^A-Z\[\]\n\r])+\])*(###\d+###)*(\[((?!###)[^A-Z\[\]\n\r])+\])*$/
    
    Demarcation:    /(?<head>^((?!###)[^A-Z\[\]\n\r])+)|(\[(?<asIs>(?!###)[^A-Z\[\]\n\r]+)\]+?)|###(?<toArrayIndex>\d+)###/g
    
///////////////////////////////////////////////////////////////////////////////

`
    <h1>Test Markup ( legit values ) :</h1>

     <form method="POST" action="/test-middleware?route=restful&type=desk-schemas">
        <input type="text" name="desk-schemas[columns]###1###[name]" value="--a name--">
        <input type="text" name="desk-schemas[columns]###1###[type]" value="--a type--">
        <input type="text" name="desk-schemas[columns]###2###[name]" value="--another name--">
        <input type="text" name="desk-schemas[columns]###2###[type]" value="--another type--">
        <input type="submit" value="POST it">
    </form>
    
     <form method="POST" action="/test-middleware?route=restful&type=desk-schemas">
        <input type="text" name="###1###[name]" value="toarrayindex,asis">
        <input type="text" name="###1###[type]" value="toarrayindex,asis">
        <input type="text" name="###2###[name][metadata]" value="toarrayindex,asis,asis">
        <input type="text" name="###2###[type][metadata]" value="toarrayindex,asis,asis">
        <input type="submit" value="POST it">
    </form>
    
     <form method="POST" action="/test-middleware?route=restful&type=desk-schemas">
        <input type="text" name="desk-schemas[columns]###1###[name]" value="head,asis,toarrayindex,asis">
        <input type="text" name="[columns]###1###[name]" value="asis,toarrayindex,asis">
        <input type="text" name="desk-schemas###1###[name][anothername]" value="head,toarrayindex,asis,asis">
        <input type="text" name="desk-schemas[columns][name]###123###" value="head,asis,asis,toarrayindex">
        <input type="submit" value="POST it">
    </form>
    
    <h1>Test Markup ( bad values ) :</h1>

     <form method="POST" action="/test-middleware?route=restful&type=desk-schemas">
        <input type="text" name="desk-schemas[columns]###1###[name]" value="--a name--">
        <input type="text" name="desk-schemas[columns]###1###[type]" value="--a type--">
        <input type="text" name="desk-schemas[columns]###2###[name]" value="--another name--">
        <input type="text" name="desk-schemas[columns]###2###[type]" value="--another type--">
        <input type="submit" value="POST it">
    </form>
`

*/
    
    let temp1 = {}
    let temp2 = {}
    const validationRegex = /^((?!###)[^A-Z\[\]\n\r])+(\[((?!###)[^A-Z\[\]\n\r])+\])*(###\d+###)*(\[((?!###)[^A-Z\[\]\n\r])+\])*$/
    const lexerRegex = /(?<head>^((?!###)[^A-Z\[\]\n\r])+)|(\[(?<asIs>(?!###)[^A-Z\[\]\n\r]+)\]+?)|###(?<toArrayIndex>\d+)###/g
    
    for ( const name in data.RU.request.formStringParameters ) {
        
    // For each [name] :
        
        if (validationRegex.test (name)) {

            temp1[ name ] = []

            const groups = Array.from ( name.matchAll ( lexerRegex ), match => match.groups )
    
            for ( const group of groups ) {
                
    // For each /(match group-1)(group-N)/ in the regex :
                
                for ( const groupName in group ) {
                    
    //  Each (group object) contains keys for all (groups), and removal of 
    //      (null) values is necessary, to retain only the relevant (group) :
                
                    if ( group[ groupName ] ) {
                    
                        temp1[ name ].push ( {
                            keyType:    groupName,
                            key:        group[ groupName ]
                        } ) 
                    }
                }
            }
            
            const toArrayIndex = 'toArrayIndex' // GC hint ?
            const initiateAccumulator 
                = keyObjectList =>  ( keyObjectList.keyType == toArrayIndex )
                                    ? []
                                    : {}
            
            const build = ( htmlNameAttribute, keyObjectList, objectReference, htmlValue ) => {
                
                // order is crucial
                const finalKey  = keyObjectList.length == 1
                const keyObject = keyObjectList.shift()

                if ( finalKey )
                {
                    objectReference[ keyObject.key ] = htmlValue
                }
                else
                {
                    // recurse
                    if ( typeof objectReference[ keyObject.key ] != 'object' ) {
                        objectReference[ keyObject.key ] = {}
                    }
                    build ( htmlNameAttribute, keyObjectList, objectReference[ keyObject.key ], htmlValue )
                }
                
            } // const build
            
            //temp2 [ name ] = initiateAccumulator ( temp1 [ name ] )
            
            build ( name, 
                    temp1 [ name ], 
                    temp2 , 
                    data.RU.request.formStringParameters[name] 
            )
            
        } else {
            temp1[ name ] = new Error ( `(reindex-form-names.js) did not understand [name="${name}"]` )
        }
    }

    data.RU.request.formStringParameters = { temp2: temp2, temp1: temp1 }

    return data
}

module.exports  = reindexFormNames