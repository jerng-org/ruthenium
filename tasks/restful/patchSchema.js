'use strict'

const mark      = require ( '/var/task/modules/mark' )            
const DDBDC     = require ( '/var/task/io/DDBDC.js' )

const patchSchemaTask = async ( data ) => {
    
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#update-property

    data.RU.io.gridSchemasScan = await DDBDC.update ( {
        TableName: 'TEST-APP-GRID-SCHEMAS',
        Key: {
/*

In general:

    1ryKeys are unique.
    
        To get one,     GET ( 1ryKey );
        To get many,    BATCH_GET ( [ 1ryKey ] );
        
    1ryPartKeys consolidated data at the storage layer.
    
    1rySortKeys allow quicker querying of ranges.

    You want to store data close together for monolithic speed-up, until 
    partition IO limits are hit, then you want to store data apart (sharding) 
    for parallelised speed-up.

Try again:

    TEST-APP-DESKS

    1ryPartKey  :   (desk-name)             ->  for (any) desk ...
    1rySortKey  :   (row-id)                ->  pagination via range-query on rows;
    Attribute   :   (column-name1)              or, retrieve (1) entire row;
    Attribute   :   (column-name2) 
    Attribute   :   (column-nameN)          ->  Here, the SCHEMAS TABLE would
                                                know the TYPES of each COLUMN,
                                                however the CELLS TABLE does not.
    
        (1ryKey:desk-name,row-id) allows entire rows to be quickly retrieved,
            and the schema (1ryPartKey:row-id) would achieve little, because 
            row-ids are unique per-desk. (1ryPartKey:desk-name_row-id) would
            similarly achieve little.
            
        (we just want range queries on column-nameNs, and it would be simple to
        put [all columns, of the same time, from all desks] in the same 
        table/GSI, but then we would need to scope queries per-desk, finally
        returning only the relevant row-ids to BATCHGET from the initial table)

        (1ryPartKey: desk-name will need a sharding suffix later)

    TEST-APP-DESK-REFLECTION-(type)
    
    1ryPartKey  :   (desk-name_column-name_row-id)  -> quite sharded
    1rySortKey  :   (value)

        So for example. If we wanted to find (entires rows) from a specific desk
        based on a (criteria upon a specific column), then we might:
        
        1.  Query the DESK-SCHEMAS table, to find out which table, TX, stores
            the values for our column of interest.
            
        2.  Query TX, using a range-query on (value). Obtain (row-ids).
            
            (perhaps do step 2. a few times if we need to find intersections
            and unions)

        3.  Query the DESKS table to batch-get the final data.
        
    OK - cool, this looks comprehensive.
    
        (all fields) are stored in 3+N_types places.
        Changing (desk-name, column-name) is very expensive.
        Generally inserts are fast, but consistent reflection will be laggy.
        This seems acceptable for the purpose of our prototyping meta-app.
        
Overall, the abstraction seems to fail for this reason:

    Structurally, a 1ryKey must be unique. If we store data from multiple 
    columns of multiple desks together, we need a way to retrieve (data specific
    to a desk-column), and it may contain redundant data. We then want to be 
    to do TWO range lookups on our data, FIRST a BEGINSWITH() to scope our
    dataset to a desk-column, SECOND a RANGE() to scope our data to the relevant
    subset of rows in that desk-column. But this seems to be impossible. There
    is no way to efficiently do N>1 range lookups on one table or GSI. An N>1 
    range lookup will always over-query data on the first lookup, then throw
    it away on subsequent lookups.
    
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