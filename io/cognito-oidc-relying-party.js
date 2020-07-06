'use strict'

const mark = require('/var/task/modules/mark.js')

/*  The Authorization Server a.k.a. Issuer (Cognito) chooses within its rights
 *  granted by the OAuth 2.0 (RFC 6749.4.1.2.) to never accept the same (code)
 *  twice;
 */

const authorizationCodeFlowJwtValidation = async code => {

    //  EXIT_OPPORTUNITY_1
    if (!code) throw Error(`(cognito-oidc-relying-party.js) 0. : (code) was falsy`)

    //  1.1.  
    //  Node modules
    const https = require('https')
    const querystring = require('querystring')

    //  1.2.  
    //  Other modules
    //
    //  Related manuals:
    //  https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-verifying-a-jwt.html
    const jsonwebtoken = require('jsonwebtoken')
    const jwkToPem = require('jwk-to-pem')

    //  2.
    //  OAuth : AUTHORISATION SERVER ; OIDC : Issuer
    //
    //  2.1.
    //  OIDC Discovery : OpenID Provider Configuration
    //  We are skipping this because it does not change frequently; 
    //  Production may want to actually execute a query, then cache this value;
    //
    //  const idpConfigUrl =    `***REMOVED***/.well-known/openid-configuration`

    //  2.2.
    //  OIDC Discovery : JSON Web Key : https://tools.ietf.org/html/draft-ietf-jose-json-web-key-41
    const issuerJwksUri = `***REMOVED***`

    //  2.3.
    //  OIDC redirect_url
    const issuerRedirectUri = `https://secure.api.sudo.coffee/test-middleware?route=restful&type=desk-schemas&reader=human`

    //  3.
    //  OIDC Relying Party (RP) / Client Application / sudo.coffee;
    const relyingPartyId = `***REMOVED***`
    const relyingPartySecret = `***REMOVED***`

    //  4.
    //  OAuth : Access Token, ID Token, Refresh Token
    //  Obtained by using the (https) module to make a request to (2.);
    //
    //  4.1.
    //  Configuration for (4.);
    //  URI is obtained from (2.1.)
    //  UPSTREAM_FROM > https.request() > issuerExchangeRequest;
    const issuerExchangeRequestOptions = {
        protocol: 'https:',
        hostname: '***REMOVED***', // 2. OAuth : AUTHORISATION SERVER ; OIDC : Issuer;
        port: 443,
        path: '/oauth2/token',
        method: 'POST',
        headers: {
            'Authorization': relyingPartySecret ? `Basic ` + (Buffer.from(relyingPartyId + ':' + relyingPartySecret)).toString('base64') : null,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }

    //  4.2.
    //  The request body for (4.)
    //  UPSTREAM_FROM > https.request() > issuerExchangeRequest;
    const issuerExchangeRequestBody = querystring.stringify({
        grant_type: 'authorization_code',
        client_id: relyingPartyId,
        code: code,
        redirect_uri: issuerRedirectUri,
        client_secret: relyingPartySecret ? relyingPartySecret : null
    })
    // TODO: extend with PKCE

    //  4.3.
    //  Variable which stores the response (result of) (4.);
    //  See 7. : issuerExchangeResponseBody

    //  4.4.
    //  Promise containing the result of (4.);
    //  REMEMBER: Promise executors are executed immediately;
    let issuerExchangeResponsePromise = new Promise((F, R) => {

        const issuerExchangeRequest = https.request(issuerExchangeRequestOptions, response => {
            let data = ''
            response.on('data', chunk => { data += chunk })
            response.on('end', () => { F(data) })
        })
        issuerExchangeRequest.on('error', e => console.error(`IDP Token Exchange Request Error`, e, R(e)))
        issuerExchangeRequest.write(issuerExchangeRequestBody) // documented under Node's (http.write)
        issuerExchangeRequest.end()
    })

    //  5.
    //  OIDC : JSON Web Key Set  
    //
    //  Obtained by using the (https) module to make a request to (2.2.);
    //
    //  5.1.
    //  Variable which store the response (result of) (5.);
    //  See 7. : issuerJwksResponseBody

    //  5.2
    //  Promise containing the result of (5.);
    //  REMEMBER: Promise executors are executed immediately;
    let issuerJwksResponsePromise = new Promise((F, R) => {

        https.get(issuerJwksUri, resp => {
            let data = ''
            resp.on('data', chunk => { data += chunk; })
            resp.on('end', () => { F(data) })
        }).on("error", e => console.error(`IDP JWKS Request Error`, e, R(e)))

    })

    //  6.
    //  Using the (https) module to make a request to (2.1.);
    //
    //  6.1.
    //  Variable which store the response (result of) (6.);
    //  let idpConfigResBody
    //
    //  6.2
    //  Promise containing the result of (6.);
    //  REMEMBER: Promise executors are executed immediately;
    //  let idpConfigPromise = new Promise((F, R) => {
    //  
    //      https.get(idpConfigUrl, resp => {
    //  
    //          let data = ''
    //  
    //          resp.on('data', chunk => {
    //              data += chunk;
    //          });
    //  
    //          resp.on('end', () => {
    //              idpConfigResBody = JSON.parse(data)
    //              F('idpConfigPromise fulfilment value')
    //          })
    //  
    //      }).on("error", e => console.error(`IDP Config Request Error`, e, R(e)))
    //  
    //  })

    console.log(`(cognito-oidc-relying-party.js) BEFORE PROMISE.ALL`)

    //  7.
    //  (.all) resolves only if (all its children) resolve; if any child rejects
    //  , then (.all) rejects also. 
    await Promise
        .all([
            issuerExchangeResponsePromise, // 4.4.
            issuerJwksResponsePromise, // 5.2.
            // idpConfigPromise // 6.2.
        ])

        //  (then)
        .then(resolvedValues => {

                const [issuerExchangeResponseBody, issuerJwksResponseBody] = resolvedValues

                console.log(`(cognito-oidc-relying-party.js) PROMISE.ALL.THEN`,
                    `IERB:`,
                    `<<${typeof issuerExchangeResponseBody}>>`,
                    issuerExchangeResponseBody,
                    `IJRB:`,
                    `<<${typeof issuerJwksResponseBody}>>`,
                    issuerJwksResponseBody
                )

                //  EXIT_OPPORTUNITY_2
                if (!issuerExchangeResponseBody) throw Error(`(cognito-oidc-relying-party.js) 
                7. : (issuerExchangeResponseBody) was falsy : we sent a HTTP request 
                containing (code) to the OIDC issuer, its HTTP response body
                was falsy;`)

                //  7.1.
                //  See (4.)
                //
                //  7.1.1.
                //  Extract unprocessed tokens from 4.3.
                const parsedIssuerExchangeResponseBody = JSON.parse(issuerExchangeResponseBody)

                /*  What is expected here (specific to AWS Cognito, for now, 2020-07-06)
                 *  {   
                 *      id_token:       << string, delimited by '.', three segments >>>
                 *                      << RFC 7515, JSON Web Signature, Compact Serialization https://tools.ietf.org/html/rfc7515#section-3.1 >>
                 * 
                 *                      BASE64URL(UTF8(JWS Protected Header)) || '.' ||
                 *                      BASE64URL(JWS Payload) || '.' ||
                 *                      BASE64URL(JWS Signature)
                 *
                 *      access_token:  << as above (see id_token) >> 
                 *
                 *      refresh_token:  << string, delimited by '.', FIVE segments >>>
                 *                      << RFC 7516.3.1, JSON Web Encryption Compact Serialization https://tools.ietf.org/html/rfc7516#section-3.1 >>
                 *
                 *                      BASE64URL(UTF8(JWE Protected Header)) || '.' ||
                 *                      BASE64URL(JWE Encrypted Key) || '.' ||
                 *                      BASE64URL(JWE Initialization Vector) || '.' ||
                 *                      BASE64URL(JWE Ciphertext) || '.' ||
                 *                      BASE64URL(JWE Authentication Tag)
                 *
                 *      expires_in:     << SECONDS, integer >>
                 *
                 *      token_type:     "Bearer"
                 *
                 */

                /*  TODO use the Ruthenium JSON validator here later: */

                if (typeof parsedIssuerExchangeResponseBody != 'object') {
                    // EXIT_OPPORTUNITY_3
                    throw Error(`(cognito-oidc-relying-party.js) 7.1.2.
                    (typeof parsedIssuerExchangeResponseBody) was (not 'object');`)
                }
                else
                if ('error' in parsedIssuerExchangeResponseBody) {
                    // EXIT_OPPORTUNITY_4
                    throw Error(`(cognito-oidc-relying-party.js) 7. 
                    (parsedIssuerExchangeResponseBody.error) was 
                    ("${ parsedIssuerExchangeResponseBody.error }");`)

                    // Expected error values: https://tools.ietf.org/html/rfc6749#section-5.2
                }
                else
                if ('id_token' in parsedIssuerExchangeResponseBody &&
                    'access_token' in parsedIssuerExchangeResponseBody &&
                    'refresh_token' in parsedIssuerExchangeResponseBody &&
                    'expires_in' in parsedIssuerExchangeResponseBody &&
                    'token_type' in parsedIssuerExchangeResponseBody) {
                    // EXIT_OPPORTUNITY_5
                    throw Error(`(cognito-oidc-relying-party.js) 7. 
                    (parsedIssuerExchangeResponseBody) did not have all expected
                    keys; found keys:
                    ("${ Object.keys( parsedIssuerExchangeResponseBody ) }");`)


                }

                //  7.1.2.
                //  Define operations to process (7.1.)
                const processToken = compactSerialization => {

                    let decodedSections = compactSerialization.split('.').map(s => {
                        return Buffer.from(s, 'base64').toString('utf8')
                    })
                    /*
                                        let parsedSections = {
                                            header: JSON.parse(decodedSections[0]),
                                            payload: JSON.parse(decodedSections[1]),
                                            signature: decodedSections[2]
                                        }
                                        return parsedSections
                    */
                    return decodedSections
                }
                
                // 7.1.3.
                // Apply (7.1.2.) to (7.1.1.)

                //  What is expected here (specific to AWS Cognito, for now, 2020-07-06)

                const processedTokens = {
                    id_token: processToken(parsedIssuerExchangeResponseBody.id_token),
                    access_token: processToken(parsedIssuerExchangeResponseBody.access_token),
                    refresh_token: processToken(parsedIssuerExchangeResponseBody.refresh_token)
                }

                //*                
                console.log(`(cognito-oidc-relying-party.js)
                    
                    processedTokens:
                                    
                                    `,
                    processedTokens
                )
                throw Error('artificial stop')
                //*/


                /*
                                    // EXIT_OPPORTUNITY_5
                                    if (splitJwt.length != 3) { throw Error(`
                                    (cognito-oidc-relying-party.js) 7.1.2. (processToken) tried to split
                                    (token), expected to find three (3) sections, but did not 
                                    find (3) sections; the Sections found: ${ JSON.stringify(splitJwt,null,4) }`) }
                */
                /*
                let processedTokens = {}
                for (const key in tokens) {
                    processedTokens[key] = processToken(tokens[key])
                }
                console.log(`(io/cognito-oidc-relying-party.js) 7.1.3.: (processedTokens):`, processedTokens)

                const processedTokens = {
                    id_token: processToken(tokens.id_token),
                    access_token: processToken(tokens.access_token),
                    refresh_token: processToken(tokens.refresh_token)
                }
                */

                //  7.2.
                //  See (5.)
                //
                //  7.2.1.
                //  Variables to store extractions from (5.1.)
                //
                //  7.2.1.1.
                //  Indexed (5.) by (7.2.2.) to ease extraction at (7.3.)
                let idpJwksIndexed = {}

                //  7.2.1.2.
                //  OAuth 2.0 : Transport Layer Security (TLS) Certificate;
                //  PEM or Privacy Enhanced Mail is a Base64 encoded DER certificate;
                let idpPemFromJwksIndexed = {}

                //  7.2.2.
                //  OIDC : (JSON Web) Key Identifiers;
                //  from (5.);
                const parsedIssuerJwksResponseBody = JSON.parse(issuerJwksResponseBody)

                parsedIssuerJwksResponseBody.keys.forEach(k => {

                    //  7.2.2.1.
                    //  Corresponds to (7.2.1.1.);
                    idpJwksIndexed[k.kid] = k

                    //  7.2.2.2.
                    //  Corresponds to (7.2.1.2.);
                    //  uses external depedency;
                    idpPemFromJwksIndexed[k.kid] = jwkToPem(k)
                })

                //  7.3.
                //  Nicely arrange results from (7.1.3.); indexing everything by (4.)
                //  then use (7.1.3.) to get corresponding (7.2.2.2.) and arranges that nicely also;
                const tokenValidationArguments = {
                    id_token: {
                        token: tokens.id_token,
                        kid: processedTokens.id_token.header ? processedTokens.id_token.header.kid : null,
                        alg: processedTokens.id_token.header ? processedTokens.id_token.header.alg : null,
                        pem: processedTokens.id_token.header ? idpPemFromJwksIndexed[processedTokens.id_token.header.kid] : null,


                    },
                    access_token: {
                        token: tokens.access_token,
                        kid: processedTokens.access_token.header ? processedTokens.access_token.header.kid : null,
                        alg: processedTokens.access_token.header ? processedTokens.access_token.header.alg : null,
                        pem: processedTokens.access_token.header ? idpPemFromJwksIndexed[processedTokens.access_token.header.kid] : null,


                    }
                }

                //  7.4.
                //  OIDC : Cryptographically Validate JSON Web Token;
                //  uses external dependency;
                //
                //  7.4.1.
                //  Variable to hold results;
                let tokenValidatedPayloads = {}

                //  7.4.2.
                //  Attempt validation;
                console.log(`(io/cognito-oidc-relying-party.js) 7.4.2.: before conditionals`,
                    `

tokenValidationArguments.id_token:`,
                    tokenValidationArguments.id_token,
                    `

tokenValidationArguments.access_token:`,
                    tokenValidationArguments.access_token

                )

                if (tokenValidationArguments.id_token &&
                    tokenValidationArguments.id_token.pem &&
                    tokenValidationArguments.id_token.alg) {
                    console.log(`(io/cognito-oidc-relying-party.js) 7.4.2.: before try, to validate (id_token)`)
                    try {
                        tokenValidatedPayloads.id_token = jsonwebtoken.verify(
                            tokenValidationArguments.id_token.token,
                            idpPemFromJwksIndexed[tokenValidationArguments.id_token.kid], { algorithms: [tokenValidationArguments.id_token.alg] }
                            // neglect callback for synchronous call: function ( error, decodedToken )
                        )
                    }
                    catch (e) {
                        console.error(`Failed to Validate ID_TOKEN`, e)
                    }
                }
                if (tokenValidationArguments.access_token &&
                    tokenValidationArguments.access_token.pem &&
                    tokenValidationArguments.access_token.alg) {
                    console.log(`(io/cognito-oidc-relying-party.js) 7.4.2.: before try, to validate (access_token)`)
                    try {
                        tokenValidatedPayloads.access_token = jsonwebtoken.verify(
                            tokenValidationArguments.access_token.token,
                            idpPemFromJwksIndexed[tokenValidationArguments.access_token.kid], { algorithms: [tokenValidationArguments.access_token.alg] }
                            // neglect callback for synchronous call: function ( error, decodedToken )
                        )
                    }
                    catch (e) {
                        console.error(`Failed to Validate ACCESS_TOKEN`, e)
                    }
                }

                console.log(`(io/cognito-oidc-relying-party.js) 7.4.2.:`, tokenValidatedPayloads)

                //  THE FOLLOWING SECTIONS ARE MORE USEFUL WHEN THIS SCRIPT IS BEING 
                //  TESTED IN A STANDALONE CONTEXT; HERE IT IS WRAPPED IN A WEB 
                //  APPLICATION, AND THUS HAS NO UTLITY;

                //  7.5.
                //  Consolidate data operated upon on this file;
                //  const bigDump = JSON.stringify({
                //  
                //      authorizerEvent: event,
                //      authorizerContext: context,
                //  
                //      idpJwksIndexed: idpJwksIndexed, // 7.2.2.1.
                //      idpPemFromJwksIndexed: idpPemFromJwksIndexed, // 7.2.2.2.
                //      //idpConfigResponse: idpConfigResBody, // 6.1.
                //  
                //      idpTokenExchangeResponse: {
                //          tokens: tokens, // 7.1.1.
                //          processedTokens: processedTokens // 7.1.3.
                //      },
                //  
                //      tokenValidationArguments: tokenValidationArguments, // 7.3.
                //  
                //      tokenValidatedPayloads: tokenValidatedPayloads, // 7.4.2
                //  
                //      reminders: [
                //          'Cognito Console settings may have changed.',
                //          'Refer to Cognito Token Endpoint reference for troubleshooting step-through.'
                //      ]
                //  }, null, 4)

                //  7.6.
                //  Here, you would want to kill specific cookies left in the client;
                //  You might always want to set << session and other cookies >> here;


                //  UTILS
                //
                //  const normalCookieParams = '; HttpOnly; Secure; Domain=sudo.coffee; SameSite=Lax;'
                //  const killCookieParams = '; Max-Age=-1;'
                //  const response = processedTokens.id_token == 'no token'
                //
                //      // unauthorized
                //      ?
                //      {
                //          statusCode: 401,
                //          body: bigDump,
                //      }
                //
                //      // authorized
                //      :
                //      {
                //          statusCode: 302,
                //          headers: {
                //              'location': 'https://secure.api.sudo.coffee/after-session-is-set'
                //          },
                //          cookies: [
                //              `accessToken=${killCookieParams}`,
                //              `refreshToken=${killCookieParams}`,
                //              //`session=${ sessionId };${ normalCookieParams }`,
                //              //`antiCSRFToken=iNeedToBePersisted`
                //          ]
                //      }
                //  
                //  //  7.7.
                //  //  Sends a response to AWS Lambda
                //  //  callback(null, response)

                return 'placeholder-return-value-for:authorizationCodeFlowJwtValidation: Promise.all RESOLVED'

            },

            rejectedReason => {
                //callback(rReason)
                console.error(`(~/io/cognito-oidc-relying-party.js) algorithm section 
                                7.x; Promise.all was rejected with 
                                reason:`, rejectedReason)
                return 'placeholder-return-value-for:authorizationCodeFlowJwtValidation: Promise.all REJECTED'
            }
        )
    // end section (7.x) 
    console.log(`(cognito-oidc-relying-party.js) AFTER PROMISE.ALL`)

    return 'placeholder-return-value-for:authorizationCodeFlowJwtValidation DEFAULT'
}

const cognitoOidcRelyingParty = {
    authorizationCodeFlowJwtValidation: authorizationCodeFlowJwtValidation
}

module.exports = cognitoOidcRelyingParty
mark(`~/io/cognitoOidcRelyingParty.js LOADED`)

/*  

2020-07-03 Notes on Cognito integration go here, temporarily:  

Items below describe the Authorisation Server / Issuer implementation; for the 
Relying Party logic, refer to (cognito-oidc-relying-party.js).

Things which appear to be missing from the Cognito user experience:

    -   Entity Relationship Diagram for its entire OIDC Issuer implementation,
        hosted UI, and platform specific ontologies;
        
    -   OIDC Relying Party client libraries customised to match its Issuer 
        implementation;

1. Setting up AWS Cognito: at a glance
   
    Cognito > has many User Pools > each User Pool has many Apps
        
   -Cognito
    |
    +-User Pools :  "for authentication, including federated
    |               identification via third-party IdP (Identity
    |               Provider)"
    |
    +-Identity Pools :  "for authorization to AWS resources"
      |
      +-<< STRING0 >> : "a user pool name" (one of many)
        |
        |     //////////
        |     //      //
        |     //  !!  //  Make way.
        |     //      //
        |     //////////
        | 
        +-General Settings
        | |
        | +-<< MANY ITEMS UNDOCUMENTED >>
        |
        |     //////////
        |     //      //
        |     //  !!  //  Make way.
        |     //      //
        |     //////////
        | 
        +-Federation
        | |
        | +-<< MANY ITEMS UNDOCUMENTED >>
        |
        |     //////////
        |     //      //
        |     //  !!  //  Make way.
        |     //      //
        |     //////////
        | 
        +-App Integration
          |
          +-UI Customisation
          |
          +-Resource Servers
          |
          +-App Client Settings
          | |
          | +-<< STRING9 >> : "an app name" (each user pool has many apps)
          |   |
          |   +-ID : << STRING6 >>
          |   |
          |   +-Enabled Identity Providers : << CHECKBOXES >>
          |   |
          |   +-URLs
          |   | |
          |   | +-Callback URL(s) : << STRING7 >> "comma separated"
          |   | |
          |   | +-Sign Out URL(s) : << STRING8 >> "comma separated"
          |   |
          |   +-OAuth2.0
          |     |
          |     +-Allowed OAuth Flows : << CHECKBOXES >>
          |     |
          |     +-Allowed OAuth Scopes : << CHECKBOXES >>
          |     |
          |     +-Hosted UI : << STRING1 >>, and << STRING2 >>
          |
          |
          +-Domain Name
            |
            +-Amazon Cognito Domain : << STRING1 >> "https://<< STRING1.1 >>.auth.<< AWS_REGION >>.amazoncognito.com"
            |
            +-Your Own Domain : "Must have associated certificate in ACM (AWS Certificate Manager)"
              |
              +-Domain Status : "ACTIVE" ?
              |
              +-Domain Name : << STRING2 >>
              |
              +-ACM Certificate : << STRING3 >>
              |
              +-Alias Target : << STRING4 >> "must be added to << STRING2 >>'s DNS record";
                               this seems to take the form of a << STRING5 >>.cloudfront.net
         

2.  Establish first that <<test user's state>> is <<logged out>>.

3.  View the Login form at << Hosted UI >> at << STRING1 >> or << STRING2 >>

    GET https://<< STRING2 >>/login ?client_id=             << STRING6 >>
                                    &response_type= code    << limited by Allowed OAuth Flows >>
                                    &scope=                 << limited by Allowed OAuth Scopes >>
                                    &redirect_uri=          << STRING7 >> (URL Encoded)

    3a. Optionally launch to (3.) from a prepared link in a webpage at URL 
        << STRING11 >>; this can be the same as << STRING7 >> for example;

4.  Submit the Login form including fields  << username >>
                                            << password >>
                                            << _csrf >>>
                                            << cognitoAsfData >> (???)
                                            << signInSubmitButton >>

        via POST << to the URL in (3.) above >>>
    
    Server will respond with:
    
        302 which redirects to << STRING7 >>    &code=  << STRING10 >>

5.  Back at << STRING7 >>, a script has been monitoring (document.readyState and 
    the  DOMContentLoaded event), and upon the specified conditions, checks
    (window.location.search) for the string "code", and IF it finds it:

        THEN, the script sets (document.location) i.e. a GET request to the URI:
        
        << STRING12 >> "which represents the Application "

    GET https://<< STRING12 >>/login ?code= << STRING10 >>
        
6.  Over at << STRING12 >>, the Application performs the operations, enumerated
    in (~/io/cognito-oidc-relying-party.js)
  
 *
 *
 *
 *
 *
 *
 */
