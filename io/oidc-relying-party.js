'use strict'

const mark = require('/var/task/modules/mark.js')

const authorizationCodeFlowJwtValidation = async code => {

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
    const idpJwksUrl = `***REMOVED***`

    //  2.3.
    //  OIDC redirect_url
    const idpRedirectUri = `https://dehwoetvsljgieghlskhgs.sudo.coffee?referer=signInCallback`

    //  3.
    //  OIDC Relying Party (RP) / Client Application / sudo.coffee;
    const appId = `***REMOVED***`
    const appSecret = `***REMOVED***`

    //  4.
    //  OAuth : Access Token, ID Token, Refresh Token
    //  Obtained by using the (https) module to make a request to (2.);
    //
    //  4.1.
    //  Configuration for (4.);
    //  URI is obtained from (2.1.)
    //  UPSTREAM_FROM > https.request() > idpExchangeReq;
    const idpExchangeReqOptions = {
        protocol: 'https:',
        hostname: '***REMOVED***', // 2. OAuth : AUTHORISATION SERVER ; OIDC : Issuer;
        port: 443,
        path: '/oauth2/token',
        method: 'POST',
        headers: {
            'Authorization': appSecret ? `Basic ` + (Buffer.from(appId + ':' + appSecret)).toString('base64') : null,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }

    //  4.2.
    //  The request body for (4.)
    //  UPSTREAM_FROM > https.request() > idpExchangeReq;
    const idpExchangeReqBody = {
        grant_type: 'authorization_code',
        client_id: appId,

        ////////
        //   ////
        //  //  //
        // //    //     Take note:
        ////  !!  //
        ///        //
        //////////////

        code: code,
        redirect_uri: idpRedirectUri,
        client_secret: appSecret ? appSecret : null
    }
    // TODO: extend with PKCE

    //  4.3.
    //  Variable which stores the response (result of) (4.);
    let idpExchangeResBody

    //  4.4.
    //  Promise containing the result of (4.);
    //  REMEMBER: Promise executors are executed immediately;
    let idpExchangePromise = new Promise((F, R) => {

        const idpExchangeReq = https.request(idpExchangeReqOptions, res => {

            let data = ''

            res.on('data', chunk => {
                data += chunk
            })

            res.on('end', () => {
                idpExchangeResBody = data
                F('idpExchangePromise fulfilment value')
            })

        })
        idpExchangeReq.on('error', e => console.error(`IDP Token Exchange Request Error`, e, R(e)))
        idpExchangeReq.write(querystring.stringify(idpExchangeReqBody)) // documented under Node's (http.write)
        idpExchangeReq.end()
    })

    //  5.
    //  OIDC : JSON Web Key Set  
    //
    //  Obtained by using the (https) module to make a request to (2.2.);
    //
    //  5.1.
    //  Variable which store the response (result of) (5.);
    let idpJwksResBody

    //  5.2
    //  Promise containing the result of (5.);
    //  REMEMBER: Promise executors are executed immediately;
    let idpJwksPromise = new Promise((F, R) => {

        https.get(idpJwksUrl, resp => {

            let data = ''

            resp.on('data', chunk => {
                data += chunk;
            });

            resp.on('end', () => {
                idpJwksResBody = JSON.parse(data)
                F('idpJwksPromise fulfilment value')
            })

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
    //  Wait for (all) to be (Settled)
    Promise
        .allSettled([
            idpExchangePromise, // 4.4.
            idpJwksPromise, // 5.2.
            // idpConfigPromise // 6.2.
        ])

        //  (then)
        .then(fValue => {

                //  7.1.
                //  See (4.)
                //
                //  7.1.1.
                //  Extract unprocessed tokens from 4.3.
                const tokens = JSON.parse(idpExchangeResBody, null, 4)

                //  7.1.2.
                //  Define operations to process (7.1.)
                const processToken = token => {

                    if (!token) return 'no token'

                    let splitJwt = token.split('.')
                    if (splitJwt.length != 3) return token

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
                const processedTokens = {
                    id_token: processToken(tokens.id_token),
                    access_token: processToken(tokens.access_token),
                    refresh_token: processToken(tokens.refresh_token)
                }

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
                idpJwksResBody.keys.forEach(k => {

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
                if (tokenValidationArguments.id_token &&
                    tokenValidationArguments.id_token.pem &&
                    tokenValidationArguments.id_token.alg) {
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

                console.log(`(io/oidc-relying-party.js):`,tokenValidatedPayloads)

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

            },

            rReason => {
                //callback(rReason)
                console.error(`(~/io/oidc-relying-party.js) algorithm section 
                                7.x; Promise.allSettled was rejected with 
                                reason:`, rReason)
            }
        )
    // end section (7.x) 

}

const oidcRelyingParty = {
    authorizationCodeFlowJwtValidation: authorizationCodeFlowJwtValidation
}

module.exports = oidcRelyingParty
mark(`~/io/oidcRelyingParty.js LOADED`)
