'use strict'

const mark = require('/var/task/modules/mark.js')

const aws = require('aws-sdk')
aws.config.apiVersions = { dynamodb: '2012-08-10' }

const ddb = new aws.DynamoDB()

// 2020-07-11 : failed attempt to wrap (ddbdc) in a (try-catch) via Proxy. Using a 
//                  (get) handler for ddbdc's methods returned the error 'method 
//                  name is not a property of undefined'
//
//              Also failed to get this to work using (extends) and (super) :(
//
//  TODO - get help, or figure it out;
//
//  All this does is make debugging easier; moreover it is rather platform
//  specific; so it doesn't really matter if this
//  is not implemented in other language patterns of the Ruthenium pattern.

const ddbdc = new aws.DynamoDB.DocumentClient()

module.exports = ddbdc
mark(`~/io/ddbdc.js LOADED`)

/*

Cheat sheet for reference: https://github.com/jerng/aws-studies/blob/master/dynamodb-notes.md

Schema design - Ghetto Relational Database on DynamoDB : DRAFT 4

    LEGEND  -   d       :   deskID      <<string:readable>>
            -   c       :   columnID    <<string:readable>>
            -   r       :   rowID       <<string:UUID>>
            
            -   st      :   data        <<string>> 
            -   nu      :   data        <<number>> 
            -   bo      :   data        <<boolean>> 
            -   bi      :   data        <<binary>>
            
            -   li      :   N/A         <<list>>
            -   ma      :   N/A         <<map>>
            -   se      :   N/A         <<set>>
            -   nu      :   N/A         <<null>>

    Table : "cells"  
            -   HASHKEY :   "d#c"
            -   SORTKEY :   "r"
            -   OTHER   :   "st", "nu", "bo", "bi"
    
    LSI : "string-cells"
            -   SORTKEY :   "st"
            -   OTHER   :   "r"
    
    LSI : "number-cells"
            -   SORTKEY :   "nu"
            -   OTHER   :   "r"
    
    LSI : "boolean-cells"
            -   SORTKEY :   "bo"
            -   OTHER   :   "r"
    
    LSI : "binary-cells"
            -   SORTKEY :   "bi"
            -   OTHER   :   "r"
*/
