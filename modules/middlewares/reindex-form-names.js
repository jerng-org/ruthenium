'use strict'

const reindexFormNames = async ( data ) => {

    /*  https://stackoverflow.com/questions/62111549/whats-the-best-way-to-validate-and-lex-a-string-that-looks-like-a-nested-array
    
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
    
        Sample Input:   shoes[country][source][arbitrarily-many-boxed-strings].69
        
        Validation:     /^[^A-Z\[\]\n\r]+(\[[^A-Z\[\]\n\r]+\])+\.[0-9]+$/
        
        Demarcation:    /(?<head>^[^A-Z\[\]\n\r]+)|\[(?<segment>[^A-Z\[\]\n\r]+)\]|\.(?<tail>[0-9]+)$/g
        
        Curiosity:      This has more explicit naming, but proves to be 
                        closer in use to the (Validation) rather than the
                        (Demarcation) example above:
                        
                        /(?<head>^[^A-Z\[\]\n\r]+)(?<x>\[(?<segment>[^A-Z\[\]\n\r]+)\])+?(?<y>\.(?<tail>[0-9]+)$)/g
    */
    
    let temp = {}
    let temp2 = {}
    const validationRegex = /^[^A-Z\[\]\n\r]+(\[[^A-Z\[\]\n\r]+\])+\.[0-9]+$/
    const lexerRegex = /(?<head>^[^A-Z\[\]\n\r]+)|\[(?<segment>[^A-Z\[\]\n\r]+)\]|\.(?<tail>[0-9]+)$/g
    
    for ( const name in data.RU.request.formStringParameters ) {
        temp[name] 
            =   validationRegex.test (name)
                ? Array
                    .from ( name.matchAll ( lexerRegex ), a => a.groups )
                    /*.map ( group => {
                        const head = group[0]
                        const tail = group[group.length-1]
                        return {
                            head : head,
                            tail : tail
                        }
                    } )*/
                : new Error ( `(reindex-form-names.js) did not understand [name="${name}"]` )
    }

    data.RU.request.formStringParameters = temp
    
    return data
}

module.exports  = reindexFormNames