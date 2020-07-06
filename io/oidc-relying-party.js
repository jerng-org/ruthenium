'use strict'

const mark = require('/var/task/modules/mark.js')

const authorizationCodeFlowJwtValidation = async code => {

    //  EXIT_OPPORTUNITY_1
    if (!code) throw Error(`(oidc-relying-party.js) 0. : (code) was falsy`)

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

    console.log(`(oidc-relying-party.js) BEFORE PROMISE.ALL`)

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

                console.log(`(oidc-relying-party.js) PROMISE.ALL.THEN`,
                    `IERB:`,
                    `<<${typeof issuerExchangeResponseBody}>>`,
                    issuerExchangeResponseBody,
                    `IJRB:`,
                    `<<${typeof issuerJwksResponseBody}>>`,
                    issuerJwksResponseBody
                )

                //  EXIT_OPPORTUNITY_2
                if (!issuerExchangeResponseBody) throw Error(`(oidc-relying-party.js) 
                7. : (issuerExchangeResponseBody) was falsy : we sent a HTTP request 
                containing (code) to the OIDC issuer, its HTTP response body
                was falsy;`)

                //  7.1.
                //  See (4.)
                //
                //  7.1.1.
                //  Extract unprocessed tokens from 4.3.
                const parsedIssuerExchangeResponseBody = JSON.parse(issuerExchangeResponseBody)

                if (!parsedIssuerExchangeResponseBody) {
                    // EXIT_OPPORTUNITY_3
                    throw Error(`(oidc-relying-party.js) 7.1.2.
                    (parsedIssuerExchangeResponseBody) was found to be falsy;`)
                }
                else
                if ('error' in parsedIssuerExchangeResponseBody) {
                    // EXIT_OPPORTUNITY_4
                    throw Error(`(oidc-relying-party.js) 7. 
                    (parsedIssuerExchangeResponseBody.error) was found to be 
                    "${ parsedIssuerExchangeResponseBody.error }";`)

                    // Expected error values: https://tools.ietf.org/html/rfc6749#section-5.2
                }
                
                console.log(`(oidc-relying-party.js)`,
                    `parsedIssuerExchangeResponseBody.id_token:
                    
                    `,
                    parsedIssuerExchangeResponseBody.id_token.split('.'),
                    `parsedIssuerExchangeResponseBody.access_token:
                    
                    `,
                    parsedIssuerExchangeResponseBody.access_token.split('.'),
                    `parsedIssuerExchangeResponseBody.refresh_token:
                    
                    `,
                    parsedIssuerExchangeResponseBody.refresh_token.split('.'),
                )
                
                console.log(`(oidc-relying-party.js)`,
                    `parsedIssuerExchangeResponseBody.id_token:
                    
                    `,
                    parsedIssuerExchangeResponseBody.id_token.split('.').map(s => {
                        let decodedSection = Buffer.from(s, 'base64').toString('utf8')
                        return [typeof decodedSection, decodedSection ]
                    }),
                    `parsedIssuerExchangeResponseBody.access_token:
                    
                    `,
                    parsedIssuerExchangeResponseBody.access_token.split('.').map(s => {
                        let decodedSection = Buffer.from(s, 'base64').toString('utf8')
                        return [typeof decodedSection, decodedSection ]
                    }),
                    `parsedIssuerExchangeResponseBody.refresh_token:
                    
                    `,
                    parsedIssuerExchangeResponseBody.refresh_token.split('.').map(s => {
                        let decodedSection = Buffer.from(s, 'base64').toString('utf8')
                        return [typeof decodedSection, decodedSection ]
                    }),
                )
                
throw Error ('artificial stop')

                // If checks pass, then default:
                const tokens = parsedIssuerExchangeResponseBody

                //  7.1.2.
                //  Define operations to process (7.1.)
                const processToken = token => {

                    let splitJwt = token.split('.')

                    // EXIT_OPPORTUNITY_5
                    if (splitJwt.length != 3) { throw Error(`
                    (oidc-relying-party.js) 7.1.2. (processToken) tried to split
                    (token), expected to find three (3) sections, but did not 
                    find (3) sections; the Sections found: ${ JSON.stringify(splitJwt,null,4) }`) }

                    let decodedSections = splitJwt.map(s => {
                        let decodedSection = Buffer.from(s, 'base64').toString('utf8')
                        return decodedSection
                    })

                    let parsedSections = {
                        header: JSON.parse(decodedSections[0]),
                        payload: JSON.parse(decodedSections[1]),
                        signature: decodedSections[2]
                    }

                    return parsedSections
                }

                // 7.1.3.
                // Apply (7.1.2.) to (7.1.1.)

                let processedTokens = {}
                for (const key in tokens) {
                    processedTokens[key] = processToken(tokens[key])
                }
                console.log(`(io/oidc-relying-party.js) 7.1.3.: (processedTokens):`, processedTokens)

                /*
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
                console.log(`(io/oidc-relying-party.js) 7.4.2.: before conditionals`,
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
                    console.log(`(io/oidc-relying-party.js) 7.4.2.: before try, to validate (id_token)`)
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
                    console.log(`(io/oidc-relying-party.js) 7.4.2.: before try, to validate (access_token)`)
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

                console.log(`(io/oidc-relying-party.js) 7.4.2.:`, tokenValidatedPayloads)

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
                console.error(`(~/io/oidc-relying-party.js) algorithm section 
                                7.x; Promise.all was rejected with 
                                reason:`, rejectedReason)
                return 'placeholder-return-value-for:authorizationCodeFlowJwtValidation: Promise.all REJECTED'
            }
        )
    // end section (7.x) 
    console.log(`(oidc-relying-party.js) AFTER PROMISE.ALL`)

    return 'placeholder-return-value-for:authorizationCodeFlowJwtValidation DEFAULT'
}

const oidcRelyingParty = {
    authorizationCodeFlowJwtValidation: authorizationCodeFlowJwtValidation
}

module.exports = oidcRelyingParty
mark(`~/io/oidcRelyingParty.js LOADED`)
