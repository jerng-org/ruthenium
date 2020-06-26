'use strict'

const rus = require ( '/var/task/modules/r-u-s.js' )

const setCookies = async ( data ) => {
    
    // rutheniumReducer.js will mark() execution, you don't have to
    
    return data
}

module.exports = setCookies
rus.mark (`~/modules/middlewares/set-cookies.js LOADED`)

/*  COOKIE SPECIFICATION
 *
 *  RFC 822 - https://tools.ietf.org/html/rfc822 - (1982)
 *      [ <- RFC 2616 points at ]
 *
 *      "STANDARD FOR THE FORMAT OF ARPA INTERNET TEXT MESSAGES"
 *
 *  RFC 2616 - https://www.ietf.org/rfc/rfc2616.txt - (1999)
 *      [ <- RFC 6265 points at ]
 *
 *      "Hypertext Transfer Protocol -- HTTP/1.1"
 *
 *      2.1 Augmented BNF
 *
 *      Later promoted to   RFC 5234 - https://tools.ietf.org/html/rfc5234
 *                              [ <- RFC 6265 points at ]
 *
 *      !!! IMPORTANT !!!
 *          
 *              name = definition   
 *              "literal text"      => case-insensitive unless stated
 *              rule1 | rule2       => alternatives
 *              ( rule1 rule2 )     => treated as a single element
 *              
 *              n*mrule             => repetitions, n=minimum, m=maximum
 *              *rule               => repetitions, equivalent to 0*INFINITYrule 
 *              Nrule               => repetitions, equivalent to N*Nrule
 *              [rule]              => optional, equivalent to *1(rule)
 *              
 *              #rule               => similar to *, but for contracting lists
 *                                  of elements, where elements are separated 
 *                                  from each other by REQUIRED commas AND 
 *                                  OPTIONAL LWS. NULL ELEMENTS are allowed but
 *                                  DO NOT contribute to the COUNT of elements
 *
 *              ; comment           => always to the right of rule text
 *              implied *LWS        => MAY be included between adjacent words
 *                                  and separators
 *
 *              OCTET       = <any 8-bit sequence of data>
 *              CHAR        = <any US-ASCII character (octets 0 - 127)>
 *              UPALPHA     = <any US-ASCII uppercase letter "A".."Z">
 *              LOALPHA     = <any US-ASCII lowercase letter "a".."z">
 *              ALPHA       = UPALPHA | LOALPHA
 *              DIGIT       = <any US-ASCII digit "0".."9">
 *              CTL         = <any US-ASCII control character
 *                            (octets 0 - 31) and DEL (127)>
 *              CR          = <US-ASCII CR, carriage return (13)>
 *              LF          = <US-ASCII LF, linefeed (10)>
 *              SP          = <US-ASCII SP, space (32)>
 *              HT          = <US-ASCII HT, horizontal-tab (9)>
 *              <">         = <US-ASCII double-quote mark (34)>
 *
 *              CRLF        = CR LF
 *              LWS         = [CRLF] 1*( SP | HT )
 *              TEXT        = <any OCTET except CTLs, but including LWS>
 *              HEX         = "A" | "B" | "C" | "D" | "E" | "F"
 *                          | "a" | "b" | "c" | "d" | "e" | "f" | DIGIT
 *
 *              token       = 1*<any CHAR except CTLs or separators>
 *              separators  = "(" | ")" | "<" | ">" | "@"
 *                          | "," | ";" | ":" | "\" | <">
 *                          | "/" | "[" | "]" | "?" | "="
 *                          | "{" | "}" | SP | HT
 *
 *              comment, ctext, quoted-string, qdtext, quoted-pair
 *              ... definitions have been left out until further notice
 *
 *              delimiter   = LWS | separator ; (jerng's note) 
 *
 *
 *
 *      4.      HTTP Message
 *      4.1.    Message Types
 *
 *              "HTTP-message       = Request | Response
 *                                      ; HTTP/1.1 messages using RFC 822"
 *
 *              "generic-message    = start-line
 *                                    *(message-header CRLF)"
 *                         
 *      4.2     Message Headers
 *
 *              "message-header = field-name ":" [ field-value ]"
 *
 *  RFC 6265 - https://tools.ietf.org/html/rfc6265
 *
 *      "This document defines the HTTP Cookie and Set-Cookie header fields."
 *
 *      2.2.    Syntax Notation
 *
 *              "This specification uses the Augmented Backus-Naur Form (ABNF)
 *              notation of [RFC5234]."
 *
 *      3.      Overview
 *
 *              "Origin servers SHOULD NOT fold multiple Set-Cookie header 
 *              fields into a single header field."
 *
 *      4       HTTP Message
 *
 *
 *
 *
 */
