'use strict'
            
/*
object  =>  Object.values ( object )    =>  array       // retains (null), discards (undefined)
object  <=  { ... array }               <=  array       // retails (null), 


FIRST, decide if (build) can be simplified
SECOND, decide how sparse array condensation may happen (optional parameter?)

*/            
            
const asIs          = 'asIs'
const toArrayIndex  = 'toArrayIndex'
const initiateAccumulator 
    = nextKeyObject =>  ( nextKeyObject.keyType == toArrayIndex )
                        ? Object.defineProperty ( [], 'isAnArray', {  value: true } ) 
                        : {}

const buildDeepObject = ( htmlNameAttribute, keyObjectList, objectReference, htmlValue ) => {
    
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
        if ( objectReference.isAnArray ) {                      // gets ( .isAnArray )
            objectReference.push ( htmlValue + ' (isAnArray)' ) 
        }
        else {
            objectReference[ keyObject.key ] = htmlValue + ' (! isAnArray)'
        }
    }
    else
    {
        const nextKeyObject = keyObjectList[0]
        
        // recurse
        
        if ( typeof objectReference[ keyObject.key ] != 'object' ) {
            
            // Not an Object, and therefore also not an Array
            
            objectReference[ keyObject.key ]
                = initiateAccumulator ( nextKeyObject )         // sets ( .isAnArray )
                    // must exist because, ! finalIteration
        }
        else 
        if ( objectReference[ keyObject.key ] instanceof Array )
        {
            // Is an Object. Is an Array.
            
            if ( nextKeyObject.keyType == asIs ) 
            {
                //  Violent
                throw Error (`(reindex-form-names.js) encountered conflicting [name]s;
                
                [name]  :   ${htmlNameAttribute}
                key     :   ${nextKeyObject.key}
                conflict:   This key is for a POJO; a previous [name] has already
                            asserted that this address should be keyed as an Array.
                            Please check the HTML markup for all [name]s in this form.
                            `) 
                            
                //  Docile reaction? Not for now.
            }
        }
        else 
        {
            // Is an Object. But NOT an Array.
            
            if ( nextKeyObject.keyType == toArrayIndex ) 
            {
                //  Violent
                throw Error (`(reindex-form-names.js) encountered conflicting [name]s;
                
                [name]  :   ${htmlNameAttribute}
                key     :   ${nextKeyObject.key}
                conflict:   This key is for an Array; a previous [name] has already
                            asserted that this address should be keyed as a POJO.
                            Please check the HTML markup for all [name]s in this form.
                            `) 
                            
                //  Docile reaction? Not for now.
            }
        }
        
        buildDeepObject ( htmlNameAttribute, keyObjectList, objectReference[ keyObject.key ], htmlValue )
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

`
    <h1>Test Markup ( legit values ) :</h1>
    
    <form method="POST" action="/test-middleware?route=restful&type=desk-schemas">
        <input type="text" name="desk-schemas[columns]###1###[name]" value="head=desk-schemas">
        <input type="text" name="desk-schemas[columns]###1###[type]" value="head=desk-schemas">
        <input type="text" name="not-a-desk[columns]###2###[name]" value="head=not-a-desk">
        <input type="text" name="something-else[columns]###2###[type]" value="head=something-else">
        <input type="submit" value="POST it">
    </form>

    <form method="POST" action="/test-middleware?route=restful&type=desk-schemas">
        <input type="text" name="desk-schemas[columns]###1###[name]" value="--a name--">
        <input type="text" name="desk-schemas[columns]###1###[type]" value="--a type--">
        <input type="text" name="desk-schemas[columns]###2###[name]" value="--another name--">
        <input type="text" name="desk-schemas[columns]###2###[type]" value="--another type--">
        <input type="submit" value="POST it">
    </form>
    
    <form method="POST" action="/test-middleware?route=restful&type=desk-schemas">
        <input type="text" name="desk-schemas###1###[name]" value="head,toarrayindex,asis">
        <input type="text" name="desk-schemas###1###[type]" value="head,toarrayindex,asis">
        <input type="text" name="desk-schemas###2###[name][metadata]" value="head,toarrayindex,asis,asis">
        <input type="text" name="desk-schemas###2###[type][metadata]" value="head,toarrayindex,asis,asis">
        <input type="submit" value="POST it">
    </form>
    
    <form method="POST" action="/test-middleware?route=restful&type=desk-schemas">
        <input type="text" name="desk-schemas###3###[name]" value="head,toarrayindex3,asis">
        <input type="text" name="desk-schemas###5###[name]" value="head,toarrayindex5,asis">
        <input type="text" name="desk-schemas###8###[name]" value="head,toarrayindex8,asis">
        <input type="text" name="desk-schemas###13###[name]" value="head,toarrayindex13,asis">
        <input type="submit" value="POST it">
    </form>
    
    <h1>Test Markup ( bad values ) :</h1>
     <form method="POST" action="/test-middleware?route=restful&type=desk-schemas">
        <input type="text" name="[columns]###1###[name]" value="(no head),asis,toarrayindex,asis">
        <input type="text" name="desk-schemas###1###[name][anothername]" value="head,toarrayindex,asis,asis">
        <input type="text" name="desk-schemas[columns][name]###123###" value="head,asis,asis,toarrayindex">
        <input type="submit" value="POST it">
    </form>
     <form method="POST" action="/test-middleware?route=restful&type=desk-schemas">
        <input type="text" name="desk-schemas###1###[name]" value="head,(toarrayindex !!),asis">
        <input type="text" name="desk-schemas[type]###1###" value="head,(asis !!),toarrayindex">
        <input type="text" name="desk-schemas###2###[name][metadata]" value="head,(toarrayindex !!),asis,asis">
        <input type="text" name="desk-schemas###2###[type][metadata]" value="head,(toarrayindex !!),asis,asis">
        <input type="submit" value="POST it">
    </form>
    
`

///////////////////////////////////////////////////////////////////////////////
*/
    data.RU.request.formStringParametersBeforeReindex = {}
    
    let temp1               = {}
    let objectifiedFormData = {}
    const validationRegex   = /^((?!###)[^A-Z\[\]\n\r])+(\[((?!###)[^A-Z\[\]\n\r])+\])*(###\d+###)*(\[((?!###)[^A-Z\[\]\n\r])+\])*$/
    const lexerRegex        = /(?<head>^((?!###)[^A-Z\[\]\n\r])+)|(\[(?<asIs>(?!###)[^A-Z\[\]\n\r]+)\]+?)|###(?<toArrayIndex>\d+)###/g

    for ( const name in data.RU.request.formStringParameters ) {
        
    // For each [name] HTML attribute :

        //  Document your work for downstream reference; 
        //  these are ASSUMED to be just strings;
        data.RU.request.formStringParametersBeforeReindex[ name ]
            = data.RU.request.formStringParameters[ name ]

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
            
            buildDeepObject ( 
                    name, 
                    temp1 [ name ], 
                    objectifiedFormData , 
                    data.RU.request.formStringParameters[name] 
            )
            
        } else {
            
            // Violent
            throw Error ( `(reindex-form-names.js) did not understand :
            
            [name="${name}"]
            
            Expected pattern: HEAD[ASIS-1][ASIS-2]###INTEGER###[ASIS-3][ASIS-N]
            Please check the HTML markup for this [name] in the form.
            ` )
            
            // Docile
            //temp1[ name ] = new Error ( `(reindex-form-names.js) did not understand [name="${name}"]` )
            //
            // Spare more thought for docile error collection, perhaps under (data.RU.errors.docile) TODO
            
        }
    }
/*
    const treeMap = ( root, fun ) => {

        if ( typeof root != 'object' ) {
            fun ( root )    // leaf node
        } else {
            
        }
        
    }
*/

    data.RU.request.formStringParameters = objectifiedFormData
    
    return data
}

module.exports  = reindexFormNames