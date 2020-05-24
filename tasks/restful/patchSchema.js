'use strict'

const mark      = require ( '/var/task/modules/mark' )            
const DDBDC     = require ( '/var/task/io/DDBDC.js' )

const patchSchemaTask = async ( data ) => {
    
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#update-property

    data.RU.io.gridSchemasScan = await DDBDC.update ( {
        TableName: 'TEST-APP-GRID-SCHEMAS',
        Key: {
/*
- rename GRID to DESK

- rename TEST-APP-GRID-SCHEMAS to TEST-APP-DESK-SCHEMAS
    - rename 1ryPartKey attribute from (grid) to (desk-name)
    - rename attribute from (columns) to (column-names)

- rename TEST-APP-CELLS's 1PartKey attribute from (grid) to (desk-name)
    - rename 1rySortKey attribute from (row) to (row-id)
    
    - rename GSI-1ryPartKey attribute from (row) to (row-id)
    - rename GSI-1rySortKey attribute from (column_value) to (column-name#value-head)
        - 1rySortKey length limit is 1KB, but item size limit is 400KB, so
          we store the main data in the attribute (value) but its initial 
          characters as the attribute (value-head)
        - we project the attribute (value) into the GSI
        
            So we can search the GSI by 
            
                (row-id)                -> (all columns)    ->  (values)
                (column-name)           -> (all rows)       ->  (values)
                (column-name#value-head)-> (only some rows) ->  (values)
                
                type::Number values should be stored as full-precision: 38 chars
            
Recap, we may want:

    1ryPartKey  :   (desk-name)             ->  for any desk ...
    1rySortKey  :   (row-id)                ->  pagination via range-query on rows;
    Attribute   :   (column-name)               or, retrieve entire row;
    Attribute   :   (value) 
    
    1ryPartKey  :   (desk-name)             ->  for any desk ...
    L2rySortKey :   (column-name)           ->  retrieve entire column;
    PAttributes :   (row-id), (value)

    G2ryPartKey :   (desk-name#column-name) ->  for any (desk, column) ...
    G2rySortKey :   (value)                 ->  range-query on value;
    PAttributes :   (row-id), (desk-name)

*/            
        },
        
        ReturnConsumedCapacity : 'TOTAL'
    } ).promise()

    data.RU.response.markupName = 'allSchemasMarkup'


    // data.RU.response.markupName = 'allSchemasMarkup'

    mark ( `patchSchema.js EXECUTED` )
}

module.exports = patchSchemaTask
mark ( `patchSchema.js LOADED` )