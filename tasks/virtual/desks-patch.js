
'use strict'

const rus = require('/var/task/modules/r-u-s.js')

const deskSchemasModel = require(`/var/task/io/models/desk-schemas.js`)

const status400 = require(`/var/task/tasks/status-400.js`)
//const status409 = require(`/var/task/tasks/status-409.js`)
//const status500 = require(`/var/task/tasks/status-500.js`)

const desksPatch = async(data) => {

    const candidates = data.RU.request.formStringParameters

    console.warn('(desks-patch.js) form input validation skipped for now; fixme')

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
        */

    rus.conf.verbosity > 6 && console.log(` Discussion:
            We should really nail down how a client requests for a CREATE
                versus how to request for an UPDATE. For example, a common
                convention which we follow here for the time being is to simply
                "not specify the primary key" in which case the system interprets
                the PUT as (CREATE RESOURCE); however it seems more normalised
                to have the client explicitly specify a primary key as, 
                for example, "__NEW__". The question remains about whether this
                is a corruption of how PUTs in general should be used.
                
    `)

    if (!await rus.validateFormDataByMethod(data, 'http-patch')) {
        await status400(data)
        return
    }

    /*  
        if (!await rus.validateFormData(data, 'desk-schemas')) {
            await status400(data)
            return
        }
    */




    /*                
        1.  get the keys of desk-cells, K
        2.  loads schemas of K; if schemas is not found, THROW EXCEPTION
        3.  validate (0.) against (2.); THROW ANY EXCEPTIONS
      
        << all cells now validated >>

        4.    

        << implement CREATE child/row/cells with (DynamoDB's PutItem) >>
      
        << implement UPDATE child/row/cells with (DynamoDB's PutItem) >>

            When a future more detailed set of verbs is standardised, we can
            use UpdateItem's extensive API:
            
                https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.UpdateExpressions.html

            ... meanwhile, that API will need to be hidden behind other URLs
            
                (Also it's still not clear to me how we should tunnel specific
                verbs over the standard few verbs; example of a custom verb ...
                "increment this resource by 1")
            
        << implement DELETE child/row/cells with (DynamoDB's DeleteItem) >>
        
        5a,5b.  Array.reduce cells to batches of 25
        
        6a. Where missing, generate a UUID, and append it to all relevant items;
        
        6a, 6b. 
        
            ASYNCHRONOUSLY  TransactWriteItems ... PutItem each batch;
                configure   ReturnValues=ALL_OLD
                
            OR
            
            ASYNCHRONOUSLY  TransactWriteItems ... DeleteItem each batch;
                configure   ReturnValues=ALL_OLD
        
        7.  If NO BATCHES ARE REJECTED, then return success;
            
            If ANY BATCHES ARE REJECTED, then TransactWriteItems DELETE all
            items by R=UUID; if this deletion transaction fails, report a
            massive error;
                
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
