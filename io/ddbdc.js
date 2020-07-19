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

    LEGEND  -   D       :   deskID      <<string:readable>>
            -   C       :   columnID    <<string:readable>>
            -   R       :   rowID       <<string:UUID>>
            
            -   S       :   data        <<string>> 
            -   N       :   data        <<number>> 
            -   BOOL    :   data        <<boolean>> 
            -   B       :   data        <<binary>>
            
            -   L       :   N/A         <<list>>
            -   M       :   N/A         <<map>>
            -   NULL    :   N/A         <<null>>

            -   SS      :   N/A         <<set:string>>
            -   NS      :   N/A         <<set:number>>
            -   BS      :   N/A         <<set:binary>>

        Using conventions established at : https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Programming.LowLevelAPI.html

    Table : "cells"  
            -   HASHKEY :   "D#C"
            -   SORTKEY :   "R"
            -   OTHER   :   "S", "N", "B", "BOOL" 
    
    LSI : "string-cells"
            -   SORTKEY :   "S"
            -   OTHER   :   "R"
    
    LSI : "number-cells"
            -   SORTKEY :   "N"
            -   OTHER   :   "R"
    
    LSI : "boolean-cells"
            -   SORTKEY :   "BOOL"
            -   OTHER   :   "R"
    
    LSI : "binary-cells"
            -   SORTKEY :   "B"
            -   OTHER   :   "R"
*/
