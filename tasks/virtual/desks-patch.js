'use strict'

const rus = require('/var/task/modules/r-u-s.js')

const deskSchemasModel = require(`/var/task/io/models/desk-schemas.js`)

const status400 = require(`/var/task/tasks/status-400.js`)
//const status409 = require(`/var/task/tasks/status-409.js`)
const status500 = require(`/var/task/tasks/status-500.js`)

const desksPatch = async(data) => {

    const candidates = data.RU.request.formStringParameters

    if (!await rus.validateFormDataByMethod(data, 'http-patch')) {
        await status400(data)
        return
    }

    //  end PROTOTYPICAL data validation process.

    console.warn(`WIP: desks-patch.js: "patching" 
        
        COMPLETE:
        0.  PUT should be hitting DynamoDB
        1.  DELETE should be hitting DynamoDB
        2.  DDB-JS-DocumentClient "max 25 items"
        5.  Also ... coercion to Number types acceptable by the DDB-JS-DocumentClient
            needs to be softcoded into (4)
        6.  ... we need a more regular way to deal with empty strings 
            (where row[S] = ''); the current hack is to slap in a (space)
        
        INCOMPLETE:
        3.  size limits have not been coded for here
        4.  By the time we want to code for 3,4, we should probably have a 
            generalised framework-wise method for this
        7.  "UnprocessedItems" are not yet handled.
        8.  Multiple BatchWrites are not yet parallelised.
        9.  Atomicity is not yet enforced (transactions needed).
        `)

    let putItems, deleteItems

    if ('PUT' in data.RU.request.formStringParameters['desk-cells']) {

        let putIndex = 0

        // WIP: hardcoded
        for (const __deskCell of data.RU.request.formStringParameters['desk-cells'].PUT) {

            //  WIP Issue 5. 
            if ('N' in __deskCell) 
            {
                 const coercedNumber = Number(__deskCell.N)
                 if (isNaN(coercedNumber)) {
                     
                    if ( ! ( 'DELETE' in data.RU.request.formStringParameters['desk-cells'] ) ) {
                         data.RU.request.formStringParameters['desk-cells'].DELETE = []
                    } 
                    data.RU.request.formStringParameters['desk-cells'].DELETE.push(
                       {
                           DHC: __deskCell.DHC,
                           R:__deskCell.R
                       }
                    )
                    
                    data.RU.request.formStringParameters['desk-cells'].PUT.splice(putIndex, 1)
                 }
                 else {
                     __deskCell.N = coercedNumber
                 }
            }
            //  WIP Issue 6.
            if ('S' in __deskCell && __deskCell.S == '') __deskCell.S = ' '
            
            putIndex++
        }
        // WIP: hardcoded (end)

        putItems = data.RU.request.formStringParameters['desk-cells'].PUT.map(
            __element => { return { PutRequest: { Item: __element } } }
        )

    }
    else {
        putItems = []
    }

    if ('DELETE' in data.RU.request.formStringParameters['desk-cells']) {

        deleteItems = data.RU.request.formStringParameters['desk-cells'].DELETE.map(
            __element => {
                return {
                    DeleteRequest: {
                        Key: { ...__element }
                        //  which is to say, __element should be an object
                        //  containing the primary key components of the items
                        //  to be deleted from DDB
                    }
                }
            }
        )
    }
    else {
        deleteItems = []
    }

    const unlimitedRequestItems = [...putItems, ...deleteItems]

    //  WIP Issue 2.
    let processedCount, totalCount, limitedRequestItems, chunk = 25, batchCount = 0

    data.RU.io.deskCellsBatchWrite = {}

    rus.mark(`desks-patch.js: before batchWrites`)

    for (processedCount = 0, totalCount = unlimitedRequestItems.length; processedCount < totalCount; processedCount += chunk) {

        batchCount++

        limitedRequestItems = unlimitedRequestItems.slice(processedCount, processedCount + chunk)

        // Configure DB client parameters
        const params = {
            RequestItems: {
                'TEST-APP-DESK-CELLS': limitedRequestItems
            },
            //ReturnConsumedCapacity: `INDEXES`,
            //ReturnItemCollectionMetrics: `SIZE`
        }

        // Call storage layer
        try {
            data.RU.io.deskCellsBatchWrite[ `batch-${ batchCount }` ] = await rus.aws.ddbdc.batchWrite(params).promise()
        }
        catch (e) {
            console.error(e)
            switch (e.code) {
                default: // do nothing
                    await status500(data)
                return
            }
        }
        
        rus.mark(`desks-patch.js: end batchWrite ${ batchCount }`)
    }
    //  chunking logic from: https://stackoverflow.com/posts/8495740/revisions
    
    //  WIP Issue 2. (end)



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
                for example, "__NEW__" ... or more REST-fully, an actual UUID
                could be generated by the server with the form, and submitted
                by the form. 
                
    `)

    // CONTINUE HERE


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
            //ReturnConsumedCapacity: 'INDEXES'

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
