'use strict'

const reindexFormNames = async ( data ) => {

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
            
        Sample Input:   ^shoes[country][source]###[arbitrarily-many-boxed-strings]$
                        
                        ^HEAD[SEGMENT-1][SEGMENT-2]###[SEGMENT-3][SEGMENT-N]$
                        
            Rules:      - HEAD & SEGMENT each have length > 0
                        - HEAD & SEGMENT disallow 
                            uppercase, line breaks, '[', ']'
                        - SEGMENT disallows 
                            ###
                        - ###\d+### can occur only once
                            implicitly, only outside [blocks]
                        
        Validation:     /^((?!###)[^A-Z\[\]\n\r])+(\[((?!###)[^A-Z\[\]\n\r])+\])*(###\d+###)*(\[((?!###)[^A-Z\[\]\n\r])+\])*$/
        
        Demarcation:    /(?<head>^((?!###)[^A-Z\[\]\n\r])+)|(\[(?<asIs>(?!###)[^A-Z\[\]\n\r]+)\]+?)|(?<toArray>###\d+###)/g
        
    */
    /*
    let temp = {}
    let temp2 = {}
    const validationRegex = /^[^A-Z\[\]\n\r]+(\[[^A-Z\[\]\n\r]+\])+\.[0-9]+$/
    const lexerRegex = /^[^A-Z\[\]\n\r]+(\[[^A-Z\[\]\n\r]+\])+|[0-9]+$/g
    
    for ( const name in data.RU.request.formStringParameters ) {
        if (validationRegex.test (name)) {
            const lexed     = Array.from ( name.matchAll ( lexerRegex ), a => a[0] )
            const tailless  = lexed[0]
            //const tail      = lexed[1]
            
            temp2[ tailless ] = temp2[ tailless ] ? temp2[ tailless ] : []
            
            temp2[ tailless ].push( data.RU.request.formStringParameters[ name ] )

        } else {
            temp[ name ] = 'VALIDATION_FAILED'//new Error ( `(reindex-form-names.js) did not understand [name="${name}"]` )
        }
    }

    data.RU.request.formStringParameters = [ temp, temp2]
    */
    return data
}

module.exports  = reindexFormNames