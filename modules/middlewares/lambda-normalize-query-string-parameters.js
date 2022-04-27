'use strict'

const rus = require ( '/var/task/modules/r-u-s.js' )
rus.frameworkDescriptionLogger.callStarts(console.trace())

// AWS API Gateway, HTTP APIs, Lambda Integration, Payload Format 2.0

/*      AWS API Gateway's (event.queryStringParameters) treats comma literals as
        value-delimiters; this is allowed but not required in RFC 3986
        ( https://tools.ietf.org/html/rfc3986 ) therefore we should not assume 
        it as a norm. This middleware parses the (event.rawQueryString) without
        the special treatment of comma literals.
        
        //////////
        //      //
        //  !!  //  Make way.
        //      //
        //////////
        
        Web APIs (to be distinguished from NodeJS convention):
        
        (encodeURI) and (encodeURIComponent) have different purposes.
        
        (encodeURIComponent) should be used to encode URI QueryString Values,
        therefore it WILL encode:
        
            ;,/?:@&=+$# and SPACE
        
        .. whereas (encodeURI) will not encode these characters above.
        
        NEITHER function encodes the following characters:
        
            -_.!~*'()
            
        NEITHER function is compliant with RFC 3986 (link above).
        
        A function example which is compliant is given at :
        
        https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent

        //////////
        //      //
        //  !!  //  Make way.
        //      //
        //////////
        
        ALL OF THE ABOVE differ from the specification for encoded POST method
        form data in a request body.

        The previous link above also guides:
        
            For application/x-www-form-urlencoded, spaces are to be replaced 
            by "+", so one may wish to follow a encodeURIComponent() 
            replacement with an additional replacement of "%20" with "+"."
                
        HTML5 has a special configuration for form-data sent via the GET method
        -   https://www.w3.org/TR/html52/sec-forms.html#form-submission-algorithm    
        
*/

const lambdaNormalizeQueryStringParameters = async ( data ) => {

    if (data.LAMBDA.event.rawQueryString) {
        
        data.RU.request.queryStringParameters = rus.node.querystring.parse ( data.LAMBDA.event.rawQueryString )  
        
        for ( const prop in data.RU.request.queryStringParameters ) {
            

            if ( typeof data.RU.request.queryStringParameters[ prop ] == 'string' ) {
                data.RU.request.queryStringParameters[ prop ] 
                    =   [ 
                            data.RU.request.queryStringParameters[ prop ] 
                        ]
            }
            
        }
        
    }
    return data
}
module.exports = lambdaNormalizeQueryStringParameters

rus.frameworkDescriptionLogger.log('blah blah')

rus.frameworkDescriptionLogger.callEnds()