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
    */

    /*  Tool:           https://regexr.com/
    
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
        
        //////////////////////////////////////////////////////////////////////
            
        Sample Input:   ^shoes[country][source]###567###[arbitrarily-many-boxed-strings]$
                        
                        ^HEAD[SEGMENT-1][SEGMENT-2]toArray[SEGMENT-3][SEGMENT-N]$
                        
            Rules:      - HEAD & SEGMENT each have length > 0
                        - HEAD & SEGMENT disallow 
                            uppercase, line breaks, '[', ']'
                        - SEGMENT disallows 
                            ###
                        - ###\d+### can occur only once
                            implicitly, only outside [blocks]
                        
        Validation:     /^((?!###)[^A-Z\[\]\n\r])+(\[((?!###)[^A-Z\[\]\n\r])+\])*(###\d+###)*(\[((?!###)[^A-Z\[\]\n\r])+\])*$/
        
        Demarcation:    /(?<head>^((?!###)[^A-Z\[\]\n\r])+)|(\[(?<asIs>(?!###)[^A-Z\[\]\n\r]+)\]+?)|###(?<toArray>\d+)###/g
        
    */
    ///*
    let temp1 = {}
    let temp2 = {}
    const validationRegex = /^((?!###)[^A-Z\[\]\n\r])+(\[((?!###)[^A-Z\[\]\n\r])+\])*(###\d+###)*(\[((?!###)[^A-Z\[\]\n\r])+\])*$/
    const lexerRegex = /(?<head>^((?!###)[^A-Z\[\]\n\r])+)|(\[(?<asIs>(?!###)[^A-Z\[\]\n\r]+)\]+?)|###(?<toArray>\d+)###/g
    
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
            
            const build = ( storeObject, keyObjectList, value ) => {
                
                // order is crucial
                const finalKey  = keyObjectList.length == 1
                const keyObject = keyObjectList.unshift()

                storeObject[keyObject.key] = 'questionable'


                switch ( keyObject.keyType ) {
                    
                    case ( 'asIs' ) :       //  frequent

                        //  Confirm that we have a POJO not an Array :
                        
                        if (    typeof storeObject[ keyObject.key ] == 'object'
                             && ( ! storeObject[ keyObject.key ] instanceof Array ) ) 
                        { 
                            //  no problem
                            /*storeObject[ keyObject.key ]
                                =   finalKey
                                    ?   value
                                    :   build ( 
                                            storeObject[ keyObject.key ], 
                                            keyObjectList,
                                            value
                                        )
                            */
                            
                            storeObject[keyObject.key]['arb'] = value
                            
                        } else {
                            //  Perhaps we have to create a new item here.
                            throw Error (
`(reindex-form-names.js), regex group name (asIs), but (storeObject) isn't a POJO.`
                            )
                        }
                        break
                    
                    case ( 'toArray' ) :    //  infrequent
                    
                        //  Confirm that we have an Arrray :
                    
                        if ( storeObject[ keyObject.key ] instanceof Array ) 
                        {  
                            /*//  no problem
                            const intKey = parseInt ( keyObject.key )
                            storeObject[ intKey ]
                                =   finalKey
                                    ?   value
                                    :   build ( 
                                            storeObject[ keyObject.key ], 
                                            keyObjectList,
                                            value
                                        )
                            */        
                            
                            storeObject[keyObject.key][2] = value
                            
                        } else {
                            //  Perhaps we have to create a new item here.
                            throw Error (
`(reindex-form-names.js), regex group name (toArray), but (storeObject) isn't an Array.`
                            )
                        }
                        break
                        
                } // switch; no default
                
                
            } // const build
            
            build ( temp2[ name ], temp1[ name ], data.RU.request.formStringParameters[ name ] )
            
        } else {
            temp1[ name ] = new Error ( `(reindex-form-names.js) did not understand [name="${name}"]` )
        }
    }

    data.RU.request.formStringParameters = { temp2: temp2, temp1: temp1 }
    //*/
    return data
}

module.exports  = reindexFormNames