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

/*  TODO

    -   ~/tasks/restful/desk-cells-post.js
    -   ~/tasks/restful/desk-cells-ge.js


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

DRAFT 4

    Table : "desk-cells"  
            -   HASHKEY :   "DHC"       <<string:"deskID#columnID">>
            -   SORTKEY :   "R"         <<string:"rowID">>
            -   OTHER   :   "S", "N", "B"
    
            Facilitated reads:
                -   SCAN    : gets all data for ALL DESKS
                -   QUERY   : on "DHC", gets all data for ONE COLUMN
                            : can be compounded to build ONE DESK 
                -   GETITEM : gets all data for ONE ROW
    
    LSI : "DHC-S-LSI"
            -   SORTKEY :   "S"
            -   OTHER   :   "R"
    
            Facilitated reads:
                -   QUERY   : on "DHC", gets RANGED data for ONE COLUMN
                            : rowIDs can be returned

    LSI : "DHC-N-LSI"
            -   SORTKEY :   "N"
            -   OTHER   :   "R"
    
            Facilitated reads:
                -   QUERY   : on "DHC", gets RANGED data for ONE COLUMN
                            : rowIDs can be returned

    LSI : "DHC-B-LSI"
            -   SORTKEY :   "B"
            -   OTHER   :   "R"

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
    
-   https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Operations_Amazon_DynamoDB.html

    API REFERENCE
    

    GETITEM -   returns     -   one ITEMs
            -   applies to  -   TABLE
            -   requires    -   Key -   ENTIRE PRIMARY KEY
            
            -   RCUs charged    -   are based on total size of the ITEM returned;
                                    ITEMs are limited to 400KB; 
            -   ProjectionExpression-   specifies which ATTRIBUTES to return;
                                        neither consumes RCUs, nor reduces RCUs 
                                        consumed by KeyConditionExpression 
                                        results from the current TABLE or INDEX;
                                    -   CONSUMES ADDITIONAL RCUs if called on
                                        an INDEX, and including NON-PROJECTED
                                        ATTRIBUTES in the return value;
            -   SELECT              -   returns a COUNT or specific ATTRIBUTES;
            
    QUERY   -   returns     -   multiple ITEMs
            -   applies to  -   TABLE, GSI, LSI
            -   requires    -   KeyConditionExpression  -   HASHKEY
                https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Query.html
                
            -   allows      -                           -   HASHKEY, SORTKEY
            -   RCUs charged    -   are based on total size of ITEMs returned by
                                    KeyConditionExpression; 1 MB MAXIMUM;
            -   FilterExpression-   neither consumes RCUs, nor reduces RCUs 
                                    consumed by KeyConditionExpression results;
                                -   returns a subset of KeyConditionExpression
                                    results to the application;
            -   ProjectionExpression-   specifies which ATTRIBUTES to return;
                                        neither consumes RCUs, nor reduces RCUs 
                                        consumed by KeyConditionExpression 
                                        results from the current TABLE or INDEX;
                                    -   CONSUMES ADDITIONAL RCUs if called on
                                        an INDEX, and including NON-PROJECTED
                                        ATTRIBUTES in the return value;
            -   SELECT              -   returns a COUNT or specific ATTRIBUTES;
            
    SCAN    -   returns     -   all ITEMs
            -   applies to  -   TABLE, GSI, LSI
            -   RCUs charged    -   are based on total size of ITEMs returned; 
                                    1 MB MAXIMUM;
            -   FilterExpression-   neither consumes RCUs, nor reduces RCUs 
                                    consumed by KeyConditionExpression results;
                                -   returns a subset of KeyConditionExpression
                                    results to the application;
            -   ProjectionExpression-   specifies which ATTRIBUTES to return;
                                        neither consumes RCUs, nor reduces RCUs 
                                        consumed by KeyConditionExpression 
                                        results from the current TABLE or INDEX;
                                    -   CONSUMES ADDITIONAL RCUs if called on
                                        an INDEX, and including NON-PROJECTED
                                        ATTRIBUTES in the return value;
            -   Parallel Scans      -   useful for large TABLEs / INDICEs;
                                    -   invoked by Segments / TotalSegments;
            -   SELECT              -   returns a COUNT or specific ATTRIBUTES;
    
    ExclusiveStartKey           -   used in pagination;

    ExpressionAttributeNames    -   defines substitution values in attribute
                                    names which can be dereferenced with a
                                    '#'-prefixed token in the attribute name;
    
    ExpressionAttributeValues   -   defines substitution values in attribute
                                    values which can be dereferenced with a
                                    ':'-prefixed token in the attribute name;
    
    ConditionExpression         -   for WRITE requests, rules can be
                                    provided as a guard against undesired
                                    destruction;
    
    READING NON-PROJECTED ATTRIBUTES FROM SECONDARY INDICES !!! WARNING !!!
    
    -   Projecting an attribute from a TABLE to SECONDARY INDEX makes a copy of
        that attribute in the INDEX; when an ITEM in an INDEX is returned, all the
        ITEM's projected attributes count towards the CONSUMED READ CAPACITY, 
        regardless of whether those attributes are presented to the application;
        
    -   If any NON-PROJECTED ATTRIBUTES are returned at this time, the BASE TABLE
        ITEM IS READ and its entire size is added to the CONSUMED READ CAPACITY;
*/