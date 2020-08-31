'use strict'

const rus = require('/var/task/modules/r-u-s.js')

const deskSchemasModel = require(`/var/task/io/models/desk-schemas.js`)

//const status409 = require(`/var/task/tasks/status-409.js`)
//const status400 = require(`/var/task/tasks/status-400.js`)
//const status500 = require(`/var/task/tasks/status-500.js`)

const desksPatch = async(data) => {

    const candidates = data.RU.request.formStringParameters

    console.warn ('(desks-patch.js) form input validation skipped for now; fixme')

    /*  THIS SHOULD PROCEED UNDER THE ASSUMPTION THAT (desk-cells items) are
        MECE with respective (desk-schema items); currenlty (desk-schema) items
        cannot be updated, and future code which allows updates should lock 
        relevant (desk-cells columns) and complete implied maintenance CRUD
        before releasing the lock;
        
        This is (desks-patch), so formStringParameters are expected to be
        explicitly cell-by-cell; this is NOT (desk-rows-patch), so it cannot be 
        simply assumed that an absent [desk-name#column-name,row-id] implies 
        deletion of that row; deletion of a row should only be conducted on
        explicit specification from the form values;
        
        !!! WARNING !!! - read above first;
    
        0.  Backend storage is the (desk-cells) DynamoDB table, where each Item
            is a cell.
        
            Expect formStringParameters of the form 
        
            -   desk-cells[PUT]   INDEX [ << desk-schema.name >> ][ << ITEMS >> ]
            -   desk-cells[DELETE]INDEX [ << desk-schema.name >> ][ << ITEMS >> ]
            
            DynamoDB's UpdateItem interface is much more flexible and would 
            support more complex verbs/operations such as:

            -   desk-cells[INCREMENT_BY_ONE]   INDEX [ << desk-schema.name >> ][ << ITEMS >> ]
            
            ... but these should be left to a future implementation which is
            more detailed, as we are rushing for basic CRUD of desk-cells at
            the moment.
                
        1.  get the keys of desk-cells, K
        2.  loads schemas of K; if schemas is not found, THROW EXCEPTION
        3.  validate (0.) against (2.); THROW ANY EXCEPTIONS
      
        << all cells now validated >>

        << implement CREATE child/row/cells with (DynamoDB's PutItem) >>
      
        << implement UPDATE child/row/cells with (DynamoDB's UpdateItem) >>
            https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.UpdateExpressions.html
            
        << implement DELETE child/row/cells with (DynamoDB's DeleteItem) >>
        
        4.  -   separate items without 'R'      : to be CREATED (6a.)
            -   separate items with 'R'         : to be UPDATED (6b.)
      
        5a,5b.  Array.reduce cells to batches of 25
        
        6a. Generate UUID;
        
            If 1 batch, then TransactWriteItems;
        
            If > 1 batches, then ASYNCHRONOUSLY TransactWriteItems ... PUT each
                batch;
            
        6b. Compile a list of UUIDs ('R's) to be updated;
            
                -   check for lock on << desk-cells >> table
                -   if table is locked, THROW EXCEPTION
                -   otherwise lock table with UUID key as << string >>
                -   draft object example:
                
                    { 
                        DHC:    'DESK#COLUMN',     // Partition Key--+
                        R:      '__COLUMN_LOCK__'// Sort Key     --+- Primary Key
                        LOCK_ID:<< uuid >>,
                        EXPIRES:<< table TTL >>
                    }
                
                -   TransactWriteItems
        
        7.  If NO BATCHES ARE REJECTED, then return success;
            
            If ANY BATCHES ARE REJECTED, then TransactWriteItems DELETE all
            items by R=UUID; if this deletion transaction fails, report a
            massive error;
                
    */ 

/*  
    if (!await rus.validateFormData(data, 'desk-schemas')) {
        await status400(data)
        return
    }
*/


/*  NEXT:

-   count incoming cells
-   break into batches of 25
-   validate
-   figure out how to transactionally write multiple batches of 25

*/


/*  homologous code, from copied code, needs to be customised:



    // Configure DB client parameters
    const params = {

        TableName: 'RUTHENIUM-V1-DESK-SCHEMAS',
        Item: candidate['desk-schemas'],
        ExpressionAttributeNames: { '#name': 'name' },
        ConditionExpression: 'attribute_not_exists(#name)',
        ReturnConsumedCapacity: 'TOTAL'

    }

    // Call storage layer

    try {
        data.RU.io.deskSchemasPost = await rus.aws.ddbdc.put(params).promise()
    }
    catch (e) {
        console.error(e)
        switch (e.code) {
            case 'ConditionalCheckFailedException':
                await status409(data)
                return
            default: // do nothing
                await status500(data)
                return
        }
    }
*/

    // View
    data.RU.signals.sendResponse.body = '(desks-patch.js) WIP' 


    // manipulate (data.RU), for example

    // no need to return (data)
}
module.exports = desksPatch