'use strict'

const mark = require('/var/task/modules/mark.js')

/*  The Authorization Server a.k.a. Issuer (Cognito) chooses within its rights
 *  granted by the OAuth 2.0 (RFC 6749.4.1.2.) to never accept the same (code)
 *  twice;
 */


const cognito =  require (`/var/task/io/oidc-relying-party.js`)
//  At this time (cognito.js) services as a documentation layer, as it directly
//  re-exports (oidc-relying-party.js), however, in the future this may not be
//  so simple;

module.exports = cognito
mark(`~/io/cognito.js LOADED`)

/*  

2020-07-03 Notes on Cognito integration go here, temporarily:  

Items below describe the Authorisation Server / Issuer implementation; for the 
Relying Party logic, refer to (oidc-relying-party.js).

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
    in (~/modules/oidc-relying-party.js)
  
 *
 *
 *
 *
 *
 *
 */
