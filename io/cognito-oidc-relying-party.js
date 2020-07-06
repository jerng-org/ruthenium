'use strict'

const mark = require('/var/task/modules/mark.js')
const conf = require(`/var/task/configuration.js`)

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
    const issuerJwksUri = process.env.COGNITO_JWKS_URI

    //  2.3.
    //  OIDC redirect_url
    const issuerRedirectUri = process.env.COGNITO_REDIRECT_URI

    //  3.
    //  OIDC Relying Party (RP) / Client Application / sudo.coffee;
    const relyingPartyId = process.env.COGNITO_RELYING_PARTY_ID
    const relyingPartySecret = process.env.COGNITO_RELYING_PARTY_SECRET

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
        hostname: process.env.COGNITO_ISSUER_HOST, // 2. OAuth : AUTHORISATION SERVER ; OIDC : Issuer;
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

    //  7.
    //  (.all) resolves only if (all its children) resolve; if any child rejects
    //  , then (.all) rejects also. 
    return await Promise
        .all([
            issuerExchangeResponsePromise, // 4.4.
            issuerJwksResponsePromise, // 5.2.
            // idpConfigPromise // 6.2.
        ])

        //  (then)
        .then(resolvedValues => {

                const [issuerExchangeResponseBody, issuerJwksResponseBody] = resolvedValues

                conf.verbosity > 1 &&
                    console.log(`(cognito-oidc-relying-party.js) PROMISE.ALL.THEN :
                        (issuerExchangeResponseBody):`,
                        `<<${typeof issuerExchangeResponseBody}>>`,
                        issuerExchangeResponseBody,
                        `(issuerJwksResponseBody):`,
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
                if (!('id_token' in parsedIssuerExchangeResponseBody &&
                        'access_token' in parsedIssuerExchangeResponseBody &&
                        'refresh_token' in parsedIssuerExchangeResponseBody &&
                        'expires_in' in parsedIssuerExchangeResponseBody &&
                        'token_type' in parsedIssuerExchangeResponseBody)) {
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
                    return decodedSections
                }

                // 7.1.3.
                // Apply (7.1.2.) to (7.1.1.)

                //  What is expected here (specific to AWS Cognito, for now, 2020-07-06)

                const intermediateTokens = {
                    id_token: processToken(parsedIssuerExchangeResponseBody.id_token),
                    access_token: processToken(parsedIssuerExchangeResponseBody.access_token),
                    refresh_token: processToken(parsedIssuerExchangeResponseBody.refresh_token)
                }

                const processedTokens = {
                    id_token: {
                        header: JSON.parse(intermediateTokens.id_token[0]),
                        payload: JSON.parse(intermediateTokens.id_token[1]),
                        signature: intermediateTokens.id_token[2]
                    },
                    access_token: {
                        header: JSON.parse(intermediateTokens.access_token[0]),
                        payload: JSON.parse(intermediateTokens.access_token[1]),
                        signature: intermediateTokens.access_token[2]
                    },
                    refresh_token: {
                        header: JSON.parse(intermediateTokens.refresh_token[0]),
                        key: intermediateTokens.refresh_token[1],
                        vector: intermediateTokens.refresh_token[2],
                        cyphertext: intermediateTokens.refresh_token[3],
                        tag: intermediateTokens.refresh_token[4]

                    }
                }

                //*                
                conf.verbosity > 1 &&
                    console.log(`(cognito-oidc-relying-party.js)
                    
processedTokens:
`, processedTokens)
                //throw Error('artificial stop')

                //*/

                //  7.2.
                //  See (5.)
                //
                //  7.2.1.
                //  Variables to store extractions from (5.1.)
                //
                //  7.2.1.1.
                //  Indexed (5.) by (7.2.2.) to ease extraction at (7.3.)
                let issuerJwksIndexed = {}

                //  7.2.1.2.
                //  OAuth 2.0 : Transport Layer Security (TLS) Certificate;
                //  PEM or Privacy Enhanced Mail is a Base64 encoded DER certificate;
                let issuerPemFromJwksIndexed = {}

                //  7.2.2.
                //  OIDC : (JSON Web) Key Identifiers;
                //  from (5.);
                const parsedIssuerJwksResponseBody = JSON.parse(issuerJwksResponseBody)

                parsedIssuerJwksResponseBody.keys.forEach(k => {

                    //  7.2.2.1.
                    //  Corresponds to (7.2.1.1.);
                    issuerJwksIndexed[k.kid] = k

                    //  7.2.2.2.
                    //  Corresponds to (7.2.1.2.);
                    //  uses external depedency;
                    issuerPemFromJwksIndexed[k.kid] = jwkToPem(k)
                })

                //  7.3.
                //  Nicely arrange results from (7.1.3.); indexing everything by (4.)
                //  then use (7.1.3.) to get corresponding (7.2.2.2.) and arranges that nicely also;
                const tokenValidationArguments = {
                    id_token: {
                        token_as_string: parsedIssuerExchangeResponseBody.id_token,
                        kid: processedTokens.id_token.header.kid,
                        alg: processedTokens.id_token.header.alg,
                        pem: issuerPemFromJwksIndexed[processedTokens.id_token.header.kid],
                    },
                    access_token: {
                        token_as_string: parsedIssuerExchangeResponseBody.access_token,
                        kid: processedTokens.access_token.header.kid,
                        alg: processedTokens.access_token.header.alg,
                        pem: issuerPemFromJwksIndexed[processedTokens.access_token.header.kid],
                    }
                }
                conf.verbosity > 1 &&
                    console.log(`(io/cognito-oidc-relying-party.js) 7.4.2.: before conditionals :

tokenValidationArguments.id_token:
`, tokenValidationArguments.id_token, `

tokenValidationArguments.access_token:
`, tokenValidationArguments.access_token)

                //  7.4.
                //  OIDC : Cryptographically Validate JSON Web Token;
                //  uses external dependency;
                //
                //  7.4.1.
                //  Variable to hold results;
                let validatedTokenPayloads = {}

                //  7.4.2.
                //  Attempt validation;


                try {
                    validatedTokenPayloads.id_token = jsonwebtoken.verify(
                        tokenValidationArguments.id_token.token_as_string,
                        tokenValidationArguments.id_token.pem, { algorithms: [tokenValidationArguments.id_token.alg] }
                        // neglect callback for synchronous call: function ( error, decodedToken )
                    )
                }
                catch (e) {
                    console.error(`Failed to Validate ID_TOKEN`, e)
                }


                try {
                    validatedTokenPayloads.access_token = jsonwebtoken.verify(
                        tokenValidationArguments.access_token.token_as_string,
                        tokenValidationArguments.access_token.pem, { algorithms: [tokenValidationArguments.access_token.alg] }
                        // neglect callback for synchronous call: function ( error, decodedToken )
                    )
                }
                catch (e) {
                    console.error(`Failed to Validate ACCESS_TOKEN`, e)
                }

                conf.verbosity > 1 &&
                    console.log(`(io/cognito-oidc-relying-party.js) 7.4.2. (validatedTokenPayloads) :
`, validatedTokenPayloads)

                return validatedTokenPayloads

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
