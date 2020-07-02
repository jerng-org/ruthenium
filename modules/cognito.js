'use strict'

const mark      = require ( '/var/task/modules/mark.js' )

const cognito     = async () => {
  
}

module.exports  = cognito
mark (`~/modules/cognito.js LOADED`)

/*  

2020-07-03 Notes on Cognito integration go here, temporarily:  

1. Setting up AWS Cognito: at a glance
        
   -Cognito
    |
    +-User Pools :  "for authentication, including federated
    |               identification via third-party IdP (Identity
    |               Provider)"
    |
    +-Identity Pools :  "for authorization to AWS resources"
      |
      +-<< STRING0 >> : "a pool name"
        +
        +-General Settings
        |
        +-App Integration
        | |
        | +-App Client Settings
        | | |
        | | +-ID : << STRING6 >>
        | | |
        | | +-Enabled Identity Providers : << CHECKBOXES >>
        | | |
        | | +-URLs
        | | | |
        | | | +-Callback URL(s) : << STRING7 >> "comma separated"
        | | | |
        | | | +-Sign Out URL(s) : << STRING8 >> "comma separated"
        | | |
        | | +-OAuth2.0
        | |   |
        | |   +-Allowed OAuth Flows : << CHECKBOXES >>
        | |   |
        | |   +-Allowed OAuth Scopes : << CHECKBOXES >>
        | |   |
        | |   +-Hosted UI : << URL >> from << STRING1 >>
        | |
        | |
        | +-Domain Name
        |   |
        |   +-Amazon Cognito Domain :   "https://<< STRING1 >>.auth.<< AWS_REGION >>.amazoncognito.com"
        |   |
        |   +-Your Own Domain : "Must have associated certificate in ACM (AWS Certificate Manager)"
        |     |
        |     +-Domain Status : "ACTIVE" ?
        |     |
        |     +-Domain Name : << STRING2 >>
        |     |
        |     +-ACM Certificate : << STRING3 >>
        |     |
        |     +-Alias Target : << STRING4 >> "must be added to << STRING2 >>'s DNS record";
        |                      this seems to take the form of a << STRING5 >>.cloudfront.net
        |
        +-Federation

2.  Establish first that <<test user's state>> is <<logged out>>.

3.  GET https://<< STRING2 >>/login ?client_id=
                                    &response_type=
                                    &scope=
                                    &redirect_uri=

 *
 *  -   https://***REMOVED***/login?client_id=***REMOVED***&response_type=code&scope=aws.cognito.signin.user.admin+openid&redirect_uri=https%3A%2F%2Fdehwoetvsljgieghlskhgs.sudo.coffee%3Freferer%3DsignInCallback
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
 *
 *
 *
 *
 */