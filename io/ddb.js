'use strict'

const rusMinus1 = require('/var/task/modules/r-u-s-minus-1.js')
const mark = rusMinus1.mark

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

/*
const aws = require('aws-sdk')
aws.config.apiVersions = { dynamodb: '2012-08-10' }

const ddb = new aws.DynamoDB()
*/

/*_______________________________!!
!!            \\                 !!
!!              \\               !!
!!  Make way   //\\    Make way  !!
!!            //  \\             !!
!!__________//______\\___________*/

// START : lock-stock-and-modified from : https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/modules/_aws_sdk_lib_dynamodb.html#configuration
const marshallOptions = {
    // Whether to automatically convert empty strings, blobs, and sets to `null`.
    convertEmptyValues: false, // false, by default.
    // Whether to remove undefined values while marshalling.
    removeUndefinedValues: true, // false, by default.
    // Whether to convert typeof object to map attribute.
    convertClassInstanceToMap: false, // false, by default.
}
const unmarshallOptions = {
    // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
    wrapNumbers: false, // false, by default.
}
const translateConfig = { marshallOptions, unmarshallOptions }
// END : lock-stock-and-modified

/*_______________________________!!
!!            \\                 !!
!!              \\               !!
!!  Make way   //\\    Make way  !!
!!            //  \\             !!
!!__________//______\\___________*/

/* WARNING : Options A,B : AWS nomenclature is semantically retarded */

// (Option A) This imports the "bare-bones" client
//*
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb")
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb")
const bareBonesClient = new DynamoDBClient()
const aDynamoDBDocumentClient = DynamoDBDocumentClient.from(bareBonesClient, translateConfig)
//*/

// (Option B) This imports the "full" client
/*
const { DynamoDB } = require("@aws-sdk/client-dynamodb")
const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb")
const fullClient = new DynamoDB()
const aDynamoDBDocumentClient = DynamoDBDocument.from(fullClient, translateConfig)
//*/

/*_______________________________!!
!!            \\                 !!
!!              \\               !!
!!  Make way   //\\    Make way  !!
!!            //  \\             !!
!!__________//______\\___________*/

const {
    BatchWriteCommand,
    DeleteCommand,
    GetCommand,
    PutCommand,
    ScanCommand,
    QueryCommand
} = require("@aws-sdk/lib-dynamodb")

module.exports = {
    aDynamoDBDocumentClient, // hi !!
    BatchWriteCommand,
    DeleteCommand,
    GetCommand,
    PutCommand,
    ScanCommand,
    QueryCommand
}

mark(`LOADED`)


/*  TODO

    -   ~/tasks/virtual/desk-cells-post.js
    -   ~/tasks/virtual/desk-cells-ge.js


*/

/*

Cheat sheet for reference: https://github.com/jerng/aws-studies/blob/master/dynamodb-notes.md

Schema design - 
Ghetto Relational Database on DynamoDB : 

    Where a user application "boolean" datatypes, it should be implemented as a
    "number:1|0", which is bulkier but more transparent than a "binary", and 
    arguably less open-ended than a "string" (which has more code-points).

    LEGEND  -   H       :   #           <<string:the hash character>> 
            -   D       :   deskID      <<string:readable>>
            -   C       :   columnID    <<string:readable>>
            -   R       :   rowID       <<string:UUID>>
            
            -   S       :   data        <<string>> 
            -   N       :   data        <<number>> 
            -   B       :   data        <<binary>>
            
            -   L       :   N/A         <<list>>
            -   M       :   N/A         <<map>>
            -   NULL    :   N/A         <<null>>
            -   BOOL    :   N/A         <<boolean>> 

            -   SS      :   N/A         <<set:string>>
            -   NS      :   N/A         <<set:number>>
            -   BS      :   N/A         <<set:binary>>

        Using conventions established at : https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Programming.LowLevelAPI.html

DRAFT 4.2

    Table : "desk-cells"  
            -   HASHKEY :   "DHC"       <<string:"deskID#columnID">>
                        :   This is the TABLE HASHKEY because, it is REUSED
                            as the HASHKEY for EVERY LSI where we do DHC filters;
            -   SORTKEY :   "R"         <<string:"rowID">>
            -   OTHER   :   "S", "N", "B", "D"
    
            Facilitated reads:
                -   SCAN    : gets all data for ALL DESKS
                -   QUERY   : on "DHC", gets all data for ONE COLUMN
                -   GETITEM : gets all data for ONE CELL
    
    GSI : "R-GSI"  
            -   HASHKEY :   "R"         <<string:"rowID">>
            -   OTHER   :   "S", "N", "B", ("DHC", "R")
    
            Facilitated reads:
                -   QUERY   : on "R", gets all data for ONE ROW

    GSI : "D-GSI"  
            -   HASHKEY :   "D"         <<string:"deskID">>
            -   OTHER   :   "S", "N", "B", ("DHC", "R")
    
            Facilitated reads:
                -   QUERY   : on "D", gets all data for ONE DESK

    LSI : "DHC-S-LSI"
            -   SORTKEY :   "S"
            -   OTHER   :   ("DHC", "R")
    
            Facilitated reads:
                -   QUERY   : on "DHC", gets RANGED data for ONE COLUMN
                            : rowIDs can be returned

    LSI : "DHC-N-LSI"
            -   SORTKEY :   "N"
            -   OTHER   :   ("DHC", "R")
    
            Facilitated reads:
                -   QUERY   : on "DHC", gets RANGED data for ONE COLUMN
                            : rowIDs can be returned

    LSI : "DHC-B-LSI"
            -   SORTKEY :   "B"
            -   OTHER   :   ("DHC", "R")

            Facilitated reads:
                -   QUERY   : on "DHC", gets RANGED data for ONE COLUMN
                            : rowIDs can be returned

    STORAGE -   DHC :   1x
                R   :   3x  -   times 36 string characters, HORRIBLE!
                S   :   2x
                N   :   2x
                B   :   2x

    CONSIDERATION   -   Yet flipping the TABLE's HASHKEY and SORTKEY don't seem
                        to solve much; that would prevent us from having LSIs
                        that can be queried with HASHKEY=DESK#COLUMN (we would
                        have to create GSIs to put DHC back as the HASHKEY, and 
                        we would then need one GSI per datatype for S/N/B)
DRAFT 5

    Table : "desk-cells"  
            -   HASHKEY :   "D"         <<string:"deskID">>
            -   SORTKEY :   "C#R"       <<string:"columnID#rowID">>
            -   OTHER   :   "S", "N", "B"
    
            Facilitated reads:
                -   SCAN    : gets all data for ALL DESKS
                -   QUERY   : on "D", gets all data for ONE DESK
                            : on "D", begins_with "C", gets all data for ONE COLUMN 
                -   GETITEM : gets all data for ONE ROW
    

*/
