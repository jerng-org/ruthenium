'use strict'

const reindexFormNames = async ( data ) => {

    /*  Tool:           https://regexr.com/
    
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
            
        Sample Input:   shoes[country][source][arbitrarily-many-boxed-strings].69
        
        Validation:     /^[^A-Z\[\]\n\r]+(\[[^A-Z\[\]\n\r]+\])+\.[0-9]+$/
        
        Demarcation1    /(?<tailless>^[^A-Z\[\]\n\r]+(\[[^A-Z\[\]\n\r]+\])+)|(?<tail>[0-9]+)$/g
                        /^[^A-Z\[\]\n\r]+(\[[^A-Z\[\]\n\r]+\])+|[0-9]+$/g
        
                        This will separate the parts before and after the '.' 
                        delimiter.
        
        Demarcation2:   /(?<head>^[^A-Z\[\]\n\r]+)|\[(?<segment>[^A-Z\[\]\n\r]+)\]|\.(?<tail>[0-9]+)$/g
                        
                        This can identify every subsegment but we don't seem
                        to need it yet.
        
        Curiosity:      This has more explicit naming, but proves to be 
                        closer in use to the (Validation) rather than the
                        (Demarcation) example above:
                        
                        /(?<head>^[^A-Z\[\]\n\r]+)(?<x>\[(?<segment>[^A-Z\[\]\n\r]+)\])+?(?<y>\.(?<tail>[0-9]+)$)/g
    */
    
    let temp = {}
    let temp2 = {}
    const validationRegex = /^[^A-Z\[\]\n\r]+(\[[^A-Z\[\]\n\r]+\])+\.[0-9]+$/
    const lexerRegex = /^[^A-Z\[\]\n\r]+(\[[^A-Z\[\]\n\r]+\])+|[0-9]+$/g
    
    for ( const name in data.RU.request.formStringParameters ) {
        if (validationRegex.test (name)) {
            temp[ name ] = Array.from ( name.matchAll ( lexerRegex ), a => a.groups )
            //temp2 [ name ] = temp[name][0].head + 'segments' + temp[name][temp[name].length-1].tail
        } else {
            temp[ name ] = 'VALIDATION_FAILED'//new Error ( `(reindex-form-names.js) did not understand [name="${name}"]` )
        }
    }

    data.RU.request.formStringParameters = [ temp, temp2]
    
    return data
}

module.exports  = reindexFormNames