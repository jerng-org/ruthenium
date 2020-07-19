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

Schema design - 
Ghetto Relational Database on DynamoDB : 
DRAFT 4

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

    Table : "desk-cells"  
            -   HASHKEY :   "DHC"       <<string:"deskID#columnID">>
            -   SORTKEY :   "R"         <<string:"rowID">>
            -   OTHER   :   "S", "N", "B"
    
    LSI : "DHC-S-LSI"
            -   SORTKEY :   "S"
            -   OTHER   :   "R"
    
    LSI : "DHC-N-LSI"
            -   SORTKEY :   "N"
            -   OTHER   :   "R"
    
    LSI : "DHC-B-LSI"
            -   SORTKEY :   "B"
            -   OTHER   :   "R"

    Where a user application "boolean" datatypes, it should be implemented as a
    "number:1|0", which is bulkier but more transparent than a "binary", and 
    arguably less open-ended than a "string" (which has more code-points).

*/


/*

-   https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/CapacityUnitCalculations.html

    [The total size of an item] is [the sum of the lengths of its attribute 
    names and values.]
    
    You can use the following guidelines to estimate attribute sizes:

    -   A binary value  must be encoded in base64 format
        (length of attribute name) 
        + (number of raw bytes)

    -   Strings         Unicode with UTF-8 binary encoding. 
        (length of attribute name)
        + (number of UTF-8-encoded bytes)

    -   Numbers         are variable length, with up to 38 significant digits. 
        Leading and trailing zeroes are trimmed. 
        (length of attribute name)
        + (1 byte per two significant digits) 
        + (1 byte)

    -   List or Map
        (length of attribute name) 
        + sum (size of nested elements) 
        + (3 bytes)
        
    -   a null or a Boolean
        (length of attribute name) 
        + (1 byte)

-   https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ExpressionAttributeValues.html
-   https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ExpressionAttributeNames.html
-   https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html

    Do not use  ':', 
                '#', or 
                '.' 
    
    But do use  '0-9',
                'a-z',
                'A-Z',
                '-', and
                '_'
    
    in  table names,
        index names, and 
        attribute names.
        
-   R / rowID is currently a UUID

    UUIDs are represented as 36-character strings.
    32 are data, and 4 are for readability.
    Characters are hexadecimal, but strings are UTF-8.
    Therefore UUIDs could be de/encoded to binary for space savings, if CPU
    demands are not too high. TODO : CONSIDER ONLY
*/