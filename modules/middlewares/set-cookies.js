'use strict'

const rus = require('/var/task/modules/r-u-s.js')

/*  This middleware looks in (data.RU.signals.sendResponse.setCookies)
 *
 */

const setCookies = async (data) => {

    rus.conf.frameworkDescriptionLogger.callStarts()

    //  Nothing to do if there are no cookie signals
    if (!(data.RU.signals.sendResponse.setCookies &&
            data.RU.signals.sendResponse.setCookies.length
        )) return data


    // [] is initialised in ruthenium.js
    data.RU.response.cookies = data.RU.signals.sendResponse.setCookies.map(
        (signal, index, array) => {

            let cookie = signal.name +
                '="' +
                Buffer.from(`${ signal.value }`).toString('base64') +
                '"'

                //  ensure that your (base64) implementation is
                //  "URL and filename safe" (https://tools.ietf.org/html/rfc4648#section-5)
                //  [RFC 4868.5];
                //  Corresponds to (lambda-normalize-headers.js)'s decoding of the value
                //
                //  TODO: do we want to decode (name) as well?

                +
                ';' +
                (signal.Secure ?
                    ` Secure;` : ``) +
                (signal.HttpOnly ?
                    ` HttpOnly;` : ``) +
                (signal.Expires ?
                    ` Expires=${ signal.Expires.toUTCString() };` : ``) +
                (Number.isInteger(signal['Max-Age']) ?
                    ` Max-Age=${ signal['Max-Age'] };` : ``) +
                (signal.SameSite ?
                    ` SameSite=${ signal.SameSite };` : ``) +
                (signal.Domain ?
                    ` Domain=${ signal.Domain };` : ``) +
                (signal.Path ?
                    ` Path=${ signal.Path };` : ``)

            return cookie
        }
        //, thisArg 
    )

    rus.conf.frameworkDescriptionLogger.callEnds()

    return data
}

module.exports = setCookies
rus.mark(`~/modules/middlewares/set-cookies.js LOADED`)

/*  Ruthenium framework conventions
 *
 *  -   always double-quote cookie value; extend for opt-out later TODO;
 *  -   always base64 encode the quoted value; extend for opt-out later TODO;
 *  -   always use Max-Age, which has precedence; never use Expires; 
 *      (RFC 6265.4.1.2.2); extend for opt-out later TODO;
 *          - so for deletion, (Max-Age: 0) is most succint;
 *          - we may regret this later;
 *  -   always use (SameSite=Strict;); extend for opt-out later TODO;
 *  -   always use (HttpOnly;); extend for opt-out later TODO;
 *  -   always use (Secure;); extend for opt-out later TODO;
 *  -   always use (__Host-) which includes the functionality of (__Secure-);
 *      extend for opt-out later TODO;
 *      -   if the above is not applicable, try the item below;
 *      -   always use the app-level (Path=??;) for the specified application; 
 *          be neither more specific, nor more general than that path; this is 
 *          not useful if you can use (__Host-);
 *  
 *  
 *  Important general implementation notes:
 *  
 *  -   Do not combine multiple Set-Cookie header-field-values, with commas; 
 *      (RFC 6265.3.)
 *
 *  -   Set-Cookie header for Deletion must match Path and Date attribute values
 *      of the corresponding Creation header; (RFC 6265.3.1.)
 *
 *  -   Set-Cookie header with identical tuple {cookie-name, path-av, domain-av}
 *      will be interpreted as destructive update to the user agent (update/
 *      delete). (RFC 6265.4.1.2.)
 *
 *  //////////
 *  //      //
 *  //  !!  //  Make way.
 *  //      //
 *  //////////
 *
 *  -   (Set-Cookie)s with (domain-av) Cookies are ignored by user-agents if the 
 *      (domain-av) does not match (The algorithm is stated; BEWARE)
 *      (RFC 6265bis.4.1.2.3.)
 *
 *          ("origin server CAN SEND MALICIOUS COOKIES TO ancestor domains")
 *
 *          Example:        Origin Server at (X.Y.Z) CAN set a cookie
 *                          with the attribute value (Domain=X.Y.Z or Y.Z) 
 *                          but NOT (Domain=A.Y.Z or W.X.Y.Z);
 *                          ("self and ancestors, but not descendent domains")
 *                          
 *  -   (Cookie)s without (domain-av) are returned by the user-agent to the 
 *      origin-server's domain, BUT NOT to its sub-domains; 
 *
 *          ("origin server CAN SEND MALICIOUS COOKIES to cousins domains, by  
 *          setting ancestor domain's (domain-av)")
 *
 *          Example:
 *
 *  -   (Cookie)s with (domain-av) are returned by the user-agent to the 
 *      origin-server's domain, AND ITS SUB-DOMAINS. (RFC 6265.4.1.2.3.)
 *
 *  //////////
 *  //      //
 *  //  !!  //  Make way.
 *  //      //
 *  //////////
 *
 *  -   If the (path-av) is omitted, the user-agent will follow the path of the
 *      current URL as the default value. The cookie will be sent to the origin
 *      server only for URLs which have the same path, or a subpath of that 
 *      path; this has little security value; (RFC 6265.4.1.2.4.)
 *
 *  -   If (secure-av) is specified, the user-agent will decide when a request
 *      is secure enough to send the cookie (usually HTTPS/ HTTP over TLS) is 
 *      deemed sufficient (RFC 6265.4.1.2.5.)
 *
 *  -   If (httponly-av) is specified, the user-agent will hide cookies except
 *      when using HTTP to communicate. (RFC 6265.4.1.2.6.)
 *
 *  -   (samesite-av) algorithm:
 *      (RFC 6265bis.5.2., RFC 6265bis.5.3.7.1.)
 *
 *  -   (case-sensitive cookie name-prefixes)
 *      (RFC 6265bis.5.4.)
 *
 *          -   (__Secure-) For example, the following would be rejected:
 *
 *                  Set-Cookie: __Secure-SID=12345; Domain=site.example
 *
 *              Whereas the following "Set-Cookie" header would be accepted:
 * 
 *                  Set-Cookie: __Secure-SID=12345; Domain=site.example; Secure
 *
 *          -   (__Host-) "then the cookie will have been set with a "Secure"
 *              attribute, a "Path" attribute with a value of "/", and no "Domain"
 *              attribute.
 *      
 *         This combination yields a cookie that hews as closely as a cookie can
 *         to treating the origin as a security boundary.  The lack of a
 *         "Domain" attribute ensures that the cookie's "host-only-flag" is
 *         true, locking the cookie to a particular host, rather than allowing
 *         it to span subdomains.  Setting the "Path" to "/" means that the
 *         cookie is effective for the entire host, and won't be overridden for
 *         specific paths.  The "Secure" attribute ensures that the cookie is
 *         unaltered by non-secure origins, and won't span protocols."
 *
 *
 */

/*  COOKIE SPECIFICATION
 *
 *  RFC 822 - https://tools.ietf.org/html/rfc822 - (1982)
 *      [ <- RFC 1123 points at ]
 *      [ <- RFC 2616 points at ]
 *
 *      "STANDARD FOR THE FORMAT OF ARPA INTERNET TEXT MESSAGES"
 *
 *  RFC 1123 - (1989)
 *      [ <- RFC 6265 points at ]
 *
 *      For the relevant date / time format. But this points back to RFC 822.
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
 *              "Header fields can be extended over multiple lines by preceding 
 *              each extra line with at least one SP or HT."
 * 
 *      !!! WARNING !!!
 *              
 * Multiple message-header fields with the same field-name MAY be
 * present in a message if and only if the entire field-value for that
 * header field is defined as a comma-separated list [i.e., #(values)].
 * It MUST be possible to combine the multiple header fields into one
 * "field-name: field-value" pair, without changing the semantics of the
 * message, by appending each subsequent field-value to the first, each
 * separated by a comma. The order in which header fields with the same
 * field-name are received is therefore significant to the
 * interpretation of the combined field value, and thus a proxy MUST NOT
 * change the order of these field values when a message is forwarded.
 *
 *      ... this is explicitly contradicted in RFC 6265.3.
 *
 *  RFC 6265 - https://tools.ietf.org/html/rfc6265 - (2011)
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
 *      !!! WARNING !!!
 *
 *              "Origin servers SHOULD NOT fold multiple Set-Cookie header 
 *              fields into a single header field.  The usual mechanism for
 *              folding HTTP headers fields (i.e., as defined in [RFC2616]) 
 *              might change the semantics of the Set-Cookie header field
 *              because the %x2C (",") character is used by Set-Cookie in a way 
 *              that conflicts with such folding.
 *      
 *      3.1.    Examples
 
   For example,
   the server can send the user agent a "session identifier" named SID
   with the value 31d4d96e407aad42.  The user agent then returns the
   session identifier in subsequent requests.

           == Server -> User Agent ==
        
           Set-Cookie: SID=31d4d96e407aad42
        
           == User Agent -> Server ==
        
           Cookie: SID=31d4d96e407aad42

   The server can alter the default scope of the cookie using the Path
   and Domain attributes.  For example, the server can instruct the user
   agent to return the cookie to every path and every subdomain of
   example.com.

           == Server -> User Agent ==
        
           Set-Cookie: SID=31d4d96e407aad42; Path=/; Domain=example.com
        
           == User Agent -> Server ==
        
           Cookie: SID=31d4d96e407aad42

   As shown in the next example, the server can store multiple cookies
   at the user agent.  For example, the server can store a session
   identifier as well as the user's preferred language by returning two
   Set-Cookie header fields.  Notice that the server uses the Secure and
   HttpOnly attributes to provide additional security protections for
   the more sensitive session identifier (see Section 4.1.2.)

           == Server -> User Agent ==
        
           Set-Cookie: SID=31d4d96e407aad42; Path=/; Secure; HttpOnly
           Set-Cookie: lang=en-US; Path=/; Domain=example.com
        
           == User Agent -> Server ==
        
           Cookie: SID=31d4d96e407aad42; lang=en-US

   Notice that the Cookie header above contains two cookies, one named
   SID and one named lang.  If the server wishes the user agent to
   persist the cookie over multiple "sessions" (e.g., user agent
   restarts), the server can specify an expiration date in the Expires
   attribute.  Note that the user agent might delete the cookie before
   the expiration date if the user agent's cookie store exceeds its
   quota or if the user manually deletes the server's cookie.

           == Server -> User Agent ==
        
           Set-Cookie: lang=en-US; Expires=Wed, 09 Jun 2021 10:18:14 GMT
        
           == User Agent -> Server ==
        
           Cookie: SID=31d4d96e407aad42; lang=en-US

   Finally, to remove a cookie, the server returns a Set-Cookie header
   with an expiration date in the past.  The server will be successful
   in removing the cookie only if the Path and the Domain attribute in
   the Set-Cookie header match the values used when the cookie was
   created.

           == Server -> User Agent ==
        
           Set-Cookie: lang=; Expires=Sun, 06 Nov 1994 08:49:37 GMT
        
           == User Agent -> Server ==
        
           Cookie: SID=31d4d96e407aad42
 
 
 *
 *      4.1.1.  Syntax
 *
 set-cookie-header = "Set-Cookie:" SP set-cookie-string
 set-cookie-string = cookie-pair *( ";" SP cookie-av )
 cookie-pair       = cookie-name "=" cookie-value
 cookie-name       = token
 cookie-value      = *cookie-octet / ( DQUOTE *cookie-octet DQUOTE )
 cookie-octet      = %x21 / %x23-2B / %x2D-3A / %x3C-5B / %x5D-7E
                       ; US-ASCII characters excluding CTLs,
                       ; whitespace DQUOTE, comma, semicolon,
                       ; and backslash
 token             = <token, defined in [RFC2616], Section 2.2>

 cookie-av         = expires-av / max-age-av / domain-av /
                     path-av / secure-av / httponly-av /
                     extension-av
 expires-av        = "Expires=" sane-cookie-date
 sane-cookie-date  = <rfc1123-date, defined in [RFC2616], Section 3.3.1>
 max-age-av        = "Max-Age=" non-zero-digit *DIGIT
                       ; In practice, both expires-av and max-age-av
                       ; are limited to dates representable by the
                       ; user agent.
 non-zero-digit    = %x31-39
                       ; digits 1 through 9
 domain-av         = "Domain=" domain-value
 domain-value      = <subdomain>
                       ; defined in [RFC1034], Section 3.5, as
                       ; enhanced by [RFC1123], Section 2.1
 path-av           = "Path=" path-value
 path-value        = <any CHAR except CTLs or ";">
 secure-av         = "Secure"
 httponly-av       = "HttpOnly"
 extension-av      = <any CHAR except CTLs or ";">

   Note that some of the grammatical terms above reference documents
   that use different grammatical notations than this document (which
   uses ABNF from [RFC5234]).

   The semantics of the cookie-value are not defined by this document.

   To maximize compatibility with user agents, servers that wish to
   store arbitrary data in a cookie-value SHOULD encode that data, for
   example, using Base64 [RFC4648].

   The portions of the set-cookie-string produced by the cookie-av term
   are known as attributes.  To maximize compatibility with user agents,
   servers SHOULD NOT produce two attributes with the same name in the
   same set-cookie-string.  (See Section 5.3 for how user agents handle
   this case.)

   Servers SHOULD NOT include more than one Set-Cookie header field in
   the same response with the same cookie-name.  (See Section 5.2 for
   how user agents handle this case.)

   If a server sends multiple responses containing Set-Cookie headers
   concurrently to the user agent (e.g., when communicating with the
   user agent over multiple sockets), these responses create a "race
   condition" that can lead to unpredictable behavior.

   NOTE: Some existing user agents differ in their interpretation of
   two-digit years.  To avoid compatibility issues, servers SHOULD use
   the rfc1123-date format, which requires a four-digit year.

   NOTE: Some user agents store and process dates in cookies as 32-bit
   UNIX time_t values.  Implementation bugs in the libraries supporting
   time_t processing on some systems might cause such user agents to
   process dates after the year 2038 incorrectly.
   
 *
 *      4.1.3.  Cookie Name Prefixes
 *
 *      DRAFT https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-06#section-4.1.3
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
