'use strict'

const rus = require('/var/task/modules/r-u-s.js')

// AWS API Gateway, HTTP APIs, Lambda Integration, Payload Format 2.0

const lambdaCopyRequestParameters = async (data) => {
    rus.frameworkDescriptionLogger.callStarts( console.trace('hi') )

    //  Section on reserved characters:
    //  -   https://tools.ietf.org/html/rfc3986#section-2.2
    //
    //  !! WARNING !!
    //  AWS LAMBDA (host) will interprete queryString values idiosyncretically:
    //
    //  -   "key=string1,string2,string3" 
    //          will parse to 
    //              { key : [ "string1", "string2", "string3"]
    //
    //  -   "key=string1%2Cstring2%2Cstring3" 
    //          will ALSO parse to 
    //              { key : [ "string1", "string2", "string3"]
    //
    //  -   BOTH OF THESE ARE APPLICATION-SPECIFIC INTEPRETATIONS, and while  
    //      commas are reserved characters in the RFC, the RFC contains no
    //      specific requirement for how commas should be interpreted; AWS
    //      Lambda however, appears to follow the requirement that the encoded
    //      and unencoded ', or %2C' both behave the same way.

    // Maybe move this to firstGuard or something like that - its own .js
    if (!data.LAMBDA.event.requestContext) {
        console.warn(`Are you in the Test Environment? This does not look like a HTTP request event.`)
        return data
    }

    data.RU.request.queryStringParameters =
        data.LAMBDA.event.queryStringParameters ?
        JSON.parse(JSON.stringify(data.LAMBDA.event.queryStringParameters)) : {}
    // Values with same key stored as: CSV string

    data.RU.request.rawPath =
        data.LAMBDA.event.rawPath ?
        data.LAMBDA.event.rawPath :
        '/'

    data.RU.request.rawQueryString =
        data.LAMBDA.event.rawQueryString ?
        data.LAMBDA.event.rawQueryString :
        ''

    data.RU.request.http =
        data.LAMBDA.event.requestContext ?
        (data.LAMBDA.event.requestContext.http ?
            JSON.parse(JSON.stringify(data.LAMBDA.event.requestContext.http)) : {}
        ) : {}

    rus.frameworkDescriptionLogger.log('blah blah')

    rus.frameworkDescriptionLogger.callEnds()

    return data
}

module.exports = lambdaCopyRequestParameters
