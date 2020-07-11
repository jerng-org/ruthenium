'use strict'

const mark = require('/var/task/modules/mark.js')

const aws = require('aws-sdk')
aws.config.apiVersions = { dynamodb: '2012-08-10' }

const ddb = new aws.DynamoDB()
const ddbdc = new Proxy(new aws.DynamoDB.DocumentClient(), {
    get: function(target, prop, receiver) {

        if (typeof target[prop] == 'function') {
            return new Proxy(target[prop], {
                apply: function(_target, _thisArg, _argumentsList) {
                    try {
                        return _target.apply(_thisArg, _argumentsList)
                    }
                    catch (e) {
                        throw Error(`(ddbdc.js) (${_target.name}) was called;`)
                    }

                }
            })
        }
        return target['prop']
    }
})

module.exports = ddbdc
mark(`~/io/ddbdc.js LOADED`)

/*

In general:

    1ryKeys are unique on base tables, but not on secondary indices.
    
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
        
        (1ryPartKey: desk-name_column-name ... perhaps this will also need one)
        
    TEST-APP-DESK-(type)-ANALYSIS
    
    1ryPartKey  :   (desk-name#column-name)  -> somewhat sharded
    1rySortKey  :   (value)
    Attribute   :   (row-id)
    
        So for example. If we wanted to find (entires rows) from a specific desk
        based on a (criteria upon a specific column), then we might:
        
        1.  Query the DESK-SCHEMAS table, to find out which table, TX, stores
            the values for our column of interest.
            
        2.  Query TX, using a range-query on (value). Obtain (row-ids).
            
            (perhaps do step 2. a few times if we need to find intersections
            and unions)
            
        3.  Query the DESKS table to batch/get the final data.
        
    OK - cool, this looks comprehensive.
    
        Generally inserts are fast, but consistent reflection will be laggy.
        This seems acceptable for the purpose of our prototyping meta-app.
            
*/
