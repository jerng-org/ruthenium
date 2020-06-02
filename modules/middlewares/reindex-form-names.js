'use strict'
            
const toArrayIndex = 'toArrayIndex' // GC hint ?
const initiateAccumulator 
    = nextKeyObject =>  ( nextKeyObject.keyType == toArrayIndex )
                        ? []
                        : {}

const build = ( htmlNameAttribute, keyObjectList, objectReference, htmlValue ) => {
    
    // order is crucial
    const finalIteration    = keyObjectList.length == 1
    const keyObject         = keyObjectList.shift()
    
        /*  This block of code is not necessary, as the value of 
            (keyObject.key) will be cast (?) based on the actual
            inheritance of (objectReference), which may or may not be
            Array.
        
        const key               = keyObject.keyType == toArrayIndex
                                    ? parseInt ( keyObject.key )
                                    : keyObject.key
        */
    
    if ( finalIteration )
    {
        objectReference[ keyObject.key ] = htmlValue
    }
    else
    {
        // recurse
        if ( typeof objectReference[ keyObject.key ] != 'object' ) {
            
            // Not an Object, and therefore also not an Array
            
            objectReference[ keyObject.key ]
                = initiateAccumulator ( keyObjectList[0] )
                    // must exist because, ! finalIteration
        }
        
        build ( htmlNameAttribute, keyObjectList, objectReference[ keyObject.key ], htmlValue )
    }
    
} // const build

const reindexFormNames = async ( data ) => {

/*
///////////////////////////////////////////////////////////////////////////////

WARNING :   the code as implemented CAN produce SPARSE arrays;
            consider using Array.prototpye.filter() to remove nulls;
            
///////////////////////////////////////////////////////////////////////////////

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

///////////////////////////////////////////////////////////////////////////////
*/
    
    let temp1 = {}
    let temp2 = {}
    const validationRegex = /^((?!###)[^A-Z\[\]\n\r])+(\[((?!###)[^A-Z\[\]\n\r])+\])*(###\d+###)*(\[((?!###)[^A-Z\[\]\n\r])+\])*$/
    const lexerRegex = /(?<head>^((?!###)[^A-Z\[\]\n\r])+)|(\[(?<asIs>(?!###)[^A-Z\[\]\n\r]+)\]+?)|###(?<toArrayIndex>\d+)###/g
    
    for ( const name in data.RU.request.formStringParameters ) {
        
    // For each [name] HTML attribute :
        
        if (validationRegex.test (name)) {

            temp1[ name ] = []

            const groups = Array.from ( name.matchAll ( lexerRegex ), match => match.groups )
    
            for ( const group of groups ) {
                
    // For each /(match group-1)(group-N)/ in the regex :
                
                for ( const groupName in group ) {
                    
    //  Each (group object) contains keys for all sibling (groups), and removal  
    //  of (null) values is necessary, to retain only the relevant (group) :
                
                    if ( group[ groupName ] ) {
                    
                        temp1[ name ].push ( {
                            keyType:    groupName,
                            key:        group[ groupName ]
                        } ) 
                    }
                }
            }
            
            // FIRE !!
            
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