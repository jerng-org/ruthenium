'use strict'

const rus = require ( '/var/task/modules/r-u-s.js' )
rus.frameworkDescriptionLogger.callStarts('test out')

// AWS API Gateway, HTTP APIs, Lambda Integration, Payload Format 2.0

const lambdaNormalizeHeaders = async ( data ) => {

    if (data.LAMBDA.event.headers) {
        data.RU.request.headers = data.LAMBDA.event.headers
        
        if ( data.LAMBDA.event.cookies ) {
            data.LAMBDA.event.cookies.forEach (
                
                nameValue => {
                    
                    let position
                    if ( 1 > ( position = nameValue.indexOf ('=') ) ) {
                        return // where '=' is not found, -1, or in 0th position
                    }
                    else
                    {
                        
                        const name  = nameValue.slice ( 0 , position )
                        const value = nameValue.slice ( 1 + position )
                        
                        if ( ! data.RU.request.headers.cookies ) {
                            data.RU.request.headers.cookies = {}
                        }
                        
                        if ( ! data.RU.request.headers.cookies[ name ] ) {
                            data.RU.request.headers.cookies[ name ] = []
                        }
                        
                        data.RU.request.headers.cookies[ name ]
                            .push ( Buffer.from(value, 'base64').toString('utf8') )
                        //  Values with same key stored as: Array of values;
                        //  ensure that your (base64) implementation is
                        //  "URL and filename safe" (https://tools.ietf.org/html/rfc4648#section-5)
                        //  [RFC 4868.5];
                        //  Corresponds to (set-cookies.js)'s encoding of the value
                        //
                        //  TODO: do we want to encode (name) as well?
                        //  TODO: double check, do we want utf8 here, or US-ASCII?
                    }
                }
            )
        }
    }

    return data
}
module.exports = lambdaNormalizeHeaders

rus.frameworkDescriptionLogger.log('blah blah')

rus.frameworkDescriptionLogger.callEnds()