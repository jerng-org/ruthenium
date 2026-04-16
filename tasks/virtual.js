'use strict'

/*  This TASK is special.
 *
 *   The project here refers to TYPES called DESK-SCHEMAS, which can be CRUD-ed
 *   from a web GUI. 
 *
 *
 */

const desksGet = require('/var/task/tasks/virtual/desks-get.js')
const desksPatch = require('/var/task/tasks/virtual/desks-patch.js')

const deskSchemasGet = require('/var/task/tasks/virtual/desk-schemas-get/desk-schemas-get.js')
const deskSchemasPut = require('/var/task/tasks/virtual/desk-schemas-put.js')

const formsMarkupCreateDeskSchema = require(`/var/task/tasks/virtual/forms-get/markup-create-desk-schema.js`)
const formsMarkupReadDeskSchema = require(`/var/task/tasks/virtual/forms-get/markup-read-desk-schema.js`)
const formsMarkupUpdateDeskSchema = require(`/var/task/tasks/virtual/forms-get/markup-update-desk-schema.js`)
const formsMarkupDeleteDeskSchema = require(`/var/task/tasks/virtual/forms-get/markup-delete-desk-schema.js`)

const formsMarkupCreateDeskRow = require(`/var/task/tasks/virtual/forms-get/markup-create-desk-row.js`)
const formsMarkupUpdateDeskRow = require(`/var/task/tasks/virtual/forms-get/markup-update-desk-row.js`)

const rus = require('/var/task/modules/r-u-s.js')

rus.frameworkDescriptionLogger.backlog(`(~/tasks/virtual.js) all (types) are currently manually coded; RECONSIDER.`)
rus.frameworkDescriptionLogger.backlog(`(~/tasks/virtual.js) (dimensions) may require a bit of restructuring.`)

//const patchDeskSchema   = require ( '/var/task/tasks/virtual/patchDeskSchema.js' )

rus.frameworkDescriptionLogger.fixme(`we should really break up/curry the giant switch-case into a linear pipeline`)
rus.frameworkDescriptionLogger.backlog(`implement status405, reading linked in comment :`) // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405

//////////
//      //
//  !!  //  Make way.
//      //
//////////

const deskSchemasGetSuccess = async (DATA, deskSchemaName) => {
    rus.frameworkDescriptionLogger.callStarts()
    const params = {
        TableName: 'RUTHENIUM-V1-DESK-SCHEMAS',
        Key: {
            name: deskSchemaName
        },
        //ReturnConsumedCapacity: 'INDEXES'
    }
    DATA.RU.io.deskSchemasGet = await rus.aws.ddb.aDynamoDBDocumentClient.send(
        new rus.aws.ddb.GetCommand(params)
    )
    rus.frameworkDescriptionLogger.callEnds()
    return ('Item' in DATA.RU.io.deskSchemasGet)
}

const deskSchemasDeleteSuccess = async (DATA, deskSchemaName) => {
    rus.frameworkDescriptionLogger.callStarts()
    const params = {
        TableName: 'RUTHENIUM-V1-DESK-SCHEMAS',
        Key: {
            name: deskSchemaName
        },
        ReturnValues: 'ALL_OLD'
        //ReturnConsumedCapacity: 'INDEXES'
    }
    DATA.RU.io.deskSchemasDelete = await rus.aws.ddb.aDynamoDBDocumentClient.send(
        new rus.aws.ddb.DeleteCommand(params)
    )
    rus.frameworkDescriptionLogger.callEnds()
    return ('Attributes' in DATA.RU.io.deskSchemasDelete)
}

const deskCellsGetSuccess = async (DATA, deskRowID) => {
    rus.frameworkDescriptionLogger.callStarts()
    const params = {
        TableName: 'TEST-APP-DESK-CELLS',
        IndexName: 'R-GSI',
        KeyConditionExpression: 'R = :deskRowID',
        ExpressionAttributeValues: { ':deskRowID': deskRowID },
        //ReturnConsumedCapacity: 'INDEXES'
    }
    DATA.RU.io.deskCellsQuery = await rus.aws.ddb.aDynamoDBDocumentClient.send(
        new rus.aws.ddb.QueryCommand(params)
    )
    rus.frameworkDescriptionLogger.callEnds()
    return (DATA.RU.io.deskCellsQuery.Items.length > 0)
}

//////////
//      //
//  !!  //  Make way.
//      //
//////////

const virtual = async (data) => {
    rus.frameworkDescriptionLogger.callStarts()
    const IIFEResult = await ( async _ => {
        //  ?batch=1
        if (data.RU.request.queryStringParameters.batch &&
            data.RU.request.queryStringParameters.batch[0]) {
            //  ?transaction=1
            if (data.RU.request.queryStringParameters.transaction &&
                data.RU.request.queryStringParameters.transaction[0]) {
                // transactional batch - DEV THIS LAST
            }
            //  ?transaction=0
            else {
                // non-transactional batch - DEV THIS SECOND
            }
        }
        //  ?batch=0
        else {

            try {
                const queryHasType = data.RU.request.queryStringParameters.type &&
                    data.RU.request.queryStringParameters.type[0]

                const queryHasThing = data.RU.request.queryStringParameters.thing &&
                    data.RU.request.queryStringParameters.thing[0]

                let queryScope
                if (queryHasType) {
                    queryScope = (queryHasThing ? 'item' : 'collection')
                }
                else {
                    rus.log.error(data, `(virtual.js) (?type=) was not provided.`)
                    await rus.http.status400(data)
                    return 
                }

                //  DIMENSION A
                //  (desk-schemas), (desk-cells) and (forms) are special / meta
                //  TODO: reconsider: is this really necessary?
                switch (data.RU.request.queryStringParameters.type[0]) {

                    case ('forms'): {

                        //  DIMENSION B
                        //  METHODS for (forms)
                        switch (data.RU.request.http.method) {

                            case ('GET'):

                                //  DIMENSION C
                                //  GET (forms) ... all of them, or just one?
                                switch (queryScope) {

                                    case ('item'):

                                        //  DIMENSION D
                                        //  GET (forms), which one? 
                                        switch (data.RU.request.queryStringParameters.thing[0]) {
                                            //////////
                                            //      //
                                            //  !!  //  special (cases) don't require (deskSchemaGetSuccess)
                                            //      //
                                            //////////
                                            case (`create-desk-schema`):
                                                data.RU.signals.sendResponse.body = await formsMarkupCreateDeskSchema()
                                                return
                                            default:
                                                //////////
                                                //      //
                                                //  !!  //  the following (things of type 'form') require (deskSchemaGetSuccess)
                                                //      //
                                                //////////

                                                if (!data.RU.request.queryStringParameters['desk-schema-name'] ||
                                                    !data.RU.request.queryStringParameters['desk-schema-name'][0]) {
                                                    rus.log.error(data, `(virtual.js) (?type=forms) (GET) (?desk-schema-name ... was unspecified.)`)
                                                }

                                                if (!await deskSchemasGetSuccess(data, data.RU.request.queryStringParameters['desk-schema-name'][0])) {
                                                    await rus.http.status404(data)
                                                    return
                                                }

                                                rus.frameworkDescriptionLogger.backlog(`(virtual.js) manipulation of (desk-schemas) 
                                                        is not RESTful (current arrangement is just to colocate code by filename); 
                                                        some RESTful adjustments are suggested.`)

                                                rus.frameworkDescriptionLogger.backlog(`(virtual.js) manipulation of (desk-schemas) 
                                                        is not RESTful (all CRUD is implemented via GET).`)

                                                rus.frameworkDescriptionLogger.backlog(`(virtual.js) manipulation of (desk-schemas) 
                                                        is not RESTful (HTML forms should not be their own resource/URI, 
                                                        but rather they should be REPRESENTATIONS of given resources, 
                                                        e.g. a request to POST (create) a desk-schema which is malformed 
                                                        should result in a response which says "fill in this form".).`)

                                                switch (data.RU.request.queryStringParameters.thing[0]) {
                                                    //////////
                                                    //      //
                                                    //  !!  //  special (cases) don't require (deskCellsGetSuccess)
                                                    //      //
                                                    //////////

                                                    //  This is RESTful;
                                                    case (`update-desk-schema`):
                                                        data.RU.signals.sendResponse.body = await formsMarkupUpdateDeskSchema(data)
                                                        return

                                                    //  This is not RESTful; the following may be RESTful: ?type=desk-schema &thing=x, method: DELETE

                                                    case (`create-desk-row`):
                                                        data.RU.signals.sendResponse.body = await formsMarkupCreateDeskRow(data)
                                                        return
                                                    default:
                                                        //////////
                                                        //      //
                                                        //  !!  //  the following (things of type 'form') require (deskCellsGetSuccess)
                                                        //      //
                                                        //////////

                                                        if (!data.RU.request.queryStringParameters['desk-row-id'] ||
                                                            !data.RU.request.queryStringParameters['desk-row-id'][0]) {
                                                            rus.log.error(data, `(virtual.js) (?type=forms) (GET) (?desk-row-id ... was unspecified.)`)
                                                        }
                                                        /*

                                                        WIP HERE ----v

                                                        */
                                                        if (!await deskCellsGetSuccess(data, data.RU.request.queryStringParameters['desk-row-id'][0])) {
                                                            await rus.http.status404(data)
                                                            return
                                                        }

                                                        switch (data.RU.request.queryStringParameters.thing[0]) {
                                                            case (`update-desk-row`):
                                                                data.RU.signals.sendResponse.body = await formsMarkupUpdateDeskRow(data)
                                                                return
                                                            default:
                                                                rus.log.error(data, `(virtual.js) (?type=forms) (GET) ... (?THING=), first value: ${data.RU.request.queryStringParameters.thing[0]} not in (switch-case tree)`)
                                                                await rus.http.status404(data)
                                                                return
                                                        }
                                                }
                                        }

                                    default:
                                        rus.log.error(data, `(virtual.js) (?type=forms) (GET) ... (queryScope): '${queryScope}' not in (switch-case)`)
                                        await rus.http.status404(data)
                                        return
                                }
                            // switch 
                            // ( queryScope )

                            default:
                                rus.log.error(data, `(virtual.js) Request query parameter (?type=forms), METHOD: (${data.RU.request.http.method}) has no (case) in (switch)`)
                                await rus.http.status404(data)
                                rus.frameworkDescriptionLogger.backlog(`TODO: implement status405`)
                                return
                        }
                        // switch
                        // ( .method )
                    }
                    case ('desk-schemas'): {

                        //  DIMENSION B
                        //  METHODS for (desk-schemas)
                        switch (data.RU.request.http.method) {

                            case ('GET'): {
                                //  DIMENSION C
                                //  GET (desk-schemas) ... all of them, or just one?
                                switch (queryScope) {
                                    case ('collection'):
                                        await deskSchemasGet(data)
                                        return
                                    case ('item'):
                                        if (!await deskSchemasGetSuccess(data, data.RU.request.queryStringParameters['thing'][0])) {
                                            await rus.http.status404(data)
                                            return
                                        }
                                        data.RU.signals.sendResponse.body = await formsMarkupReadDeskSchema(data)
                                        return
                                    default:
                                        rus.log.error(data, `(virtual.js) (?type=desk-schemas) (GET) ... (queryScope): '${queryScope}' not in (switch-case)`)
                                        await rus.http.status404(data)
                                        return
                                }
                                // switch
                                // ( queryScope )
                            }
                            case ('PUT'): {
                                //  PROTOCOL: HTTP PUT - request encloses an entity, for server to accept as a 
                                //              CREATION or DESTRUCTIVE UPDATE of the URI's resource 

                                //  DIMENSION C
                                //  PUT (desk-schemas) ... no check for (queryScope)
                                if (queryHasThing) {
                                    // NAME WAS SPECIFIED : this is an UPDATE, which must fail if NAME cannot be found
                                    if (!await deskSchemasGetSuccess(data, data.RU.request.queryStringParameters['thing'][0])) {
                                        await rus.http.status403(data)
                                        return
                                    }
                                }
                                else {
                                    /* NOTE THIS A BREAKAGE : of the 'item' 'collection' dichotomy */

                                    // NO NAME WAS SPECIFIED : this is a CREATION, which must fail if NAME already exists
                                    //  Philosophical : should the method be POST not PUT ?
                                    if (await deskSchemasGetSuccess(data, data.RU.request.formStringParameters['desk-schemas'].name)) {
                                        await rus.http.status409(data)
                                        return
                                    }
                                }
                                await deskSchemasPut(data)
                                return
                            }
                            case ('DELETE'): {
                                //  DIMENSION C
                                //  DELETE (desk-schemas) ... all or just one?
                                switch (queryScope) {
                                    case ('item'): {
                                        if (!await deskSchemasDeleteSuccess(data, data.RU.request.queryStringParameters['thing'][0])) {
                                            await rus.http.status404(data)
                                            return
                                        }
                                        data.RU.signals.sendResponse.body = await formsMarkupDeleteDeskSchema(data)
                                        return
                                    }
                                    case ('collection'): {
                                        rus.log.error(data, `(virtual.js) (?type=desk-schemas) (DELETE) ... (queryScope): '${queryScope}' branch in (switch-case) does nothing`)
                                        await rus.http.status404(data)
                                        return
                                    }
                                    default: {
                                        rus.log.error(data, `(virtual.js) (?type=desk-schemas) (DELETE) ... (queryScope): '${queryScope}' branch missing in (switch-case)`)
                                        await rus.http.status404(data)
                                        return
                                    }
                                }
                            }
                            default: {
                                rus.log.error(data, `(virtual.js) Request query parameter (?type=desk-schemas), METHOD: (${data.RU.request.http.method}) has no (case) in (switch)`)
                                await rus.http.status404(data)
                                rus.frameworkDescriptionLogger.backlog(`TODO: implement status405`)
                                return
                            }
                        }
                        // switch 
                        // ( .method )
                    }
                    case ('desk-cells'): {
                        //  DIMENSION B
                        //  METHODS for (desks)
                        switch (data.RU.request.http.method) {
                            case ('GET'): {
                                //  DIMENSION C
                                //  PUT (desk-cells) (queryScope) not checked for item/collection
                                if (!data.RU.request.queryStringParameters['desk-schema-name'] ||
                                    !data.RU.request.queryStringParameters['desk-schema-name'][0]) {
                                    rus.log.error(data, `(virtual.js) (?type=desk-rows) (GET) (?desk-schema-name ... was unspecified.)`)
                                }
                                await desksGet(data)
                                return
                            }
                            case ('PUT'):
                            case ('DELETE'): {
                                //  PROTOCOL: HTTP PUT - request encloses an entity, for server to accept as a 
                                //              CREATION or DESTRUCTIVE UPDATE of the URI's resource 

                                //  DIMENSION C
                                //  PUT (desk-cells) ... no check for (queryScope)
                                if (queryHasThing) {
                                    // NAME WAS SPECIFIED : this is an UPDATE, which must fail if NAME cannot be found
                                    if (    !await deskCellsGetSuccess(data, data.RU.request.queryStringParameters['thing'][0])
                                            || !await deskSchemasGetSuccess(data, data.RU.request.queryStringParameters['desk-schema-name'][0]))
                                    {
                                        await rus.http.status403(data)
                                        return
                                    }
                                }
                                else {
                                    /* NOTE THIS A BREAKAGE : of the 'item' 'collection' dichotomy */

                                    // NO NAME WAS SPECIFIED : this is a CREATION, which must fail if NAME already exists
                                    //  Philosophical : should the method be POST not PUT ?
                                    if (await deskCellsGetSuccess(data, data.RU.request.formStringParameters['desk-cells'].PUT[0].R)) {
                                        await rus.http.status409(data)
                                        return
                                    }
                                }
                                await desksPatch(data)
                                return
                            }
                            default: {
                                rus.log.error(data, `(virtual.js) Request query parameter (?type=desk-rows), METHOD: (${data.RU.request.http.method}) has no (case) in (switch)`)
                                await rus.http.status404(data)
                                return
                            }
                        }
                    }
                    default: {
                        //  (NOT desk-schemas) (NOT desk-cells) (NOT desks) and (NOT forms)

                        // Expect a valid (desk-schema.name)

                        rus.log.error(data, `(virtual.js) Request query parameter (?TYPE=), first value: (${data.RU.request.queryStringParameters.type[0]}) has no (case) in (switch)`)
                        await rus.http.status404(data)
                        return
                    }
                }
                // switch
                // ( .type[0] )


            }
            catch (e) { throw e }



        } // non-transactional; single operation; not a batch - DEV THIS FIRST

        // manipulate (data.RU), for example
        // no need to return (data)

    })()
    rus.frameworkDescriptionLogger.callEnds()
    return IIFEResult
}

module.exports = virtual
