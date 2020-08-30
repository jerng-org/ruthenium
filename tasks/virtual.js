'use strict'

const desksRead = require('/var/task/tasks/virtual/desks-read.js')
const desksCreateRow = require('/var/task/tasks/virtual/desk-create-row.js')

const deskSchemasGet = require('/var/task/tasks/virtual/desk-schemas-get/desk-schemas-get.js')
const deskSchemasPost = require('/var/task/tasks/virtual/desk-schemas-post.js')
const deskSchemasPut = require('/var/task/tasks/virtual/desk-schemas-put.js')

const formsMarkupCreateDeskSchema = require(`/var/task/tasks/virtual/forms-get/markup-create-desk-schema.js`)
const formsMarkupReadDeskSchema = require(`/var/task/tasks/virtual/forms-get/markup-read-desk-schema.js`)
const formsMarkupUpdateDeskSchema = require(`/var/task/tasks/virtual/forms-get/markup-update-desk-schema.js`)
const formsMarkupDeleteDeskSchema = require(`/var/task/tasks/virtual/forms-get/markup-delete-desk-schema.js`)

const formsMarkupCreateDeskRow = require(`/var/task/tasks/virtual/forms-get/markup-create-desk-row.js`)

const rus = require('/var/task/modules/r-u-s.js')

const status400 = require(`/var/task/tasks/status-400.js`)
const status403 = require(`/var/task/tasks/status-403.js`)
const status404 = require(`/var/task/tasks/status-404.js`)
const status500 = require(`/var/task/tasks/status-500.js`)
const status501 = require(`/var/task/tasks/status-501.js`)

rus.conf.verbosity > 0 &&
    (console.warn(`(~/tasks/virtual.js) all (types) are currently manually coded; RECONSIDER.`),
        console.warn(`(~/tasks/virtual.js) (dimensions) may require a bit of restructuring.`)
    )

//const patchDeskSchema   = require ( '/var/task/tasks/virtual/patchDeskSchema.js' )

console.warn(`(virtual.js) the (rus.log.error) function defined here is a framework-level anomaly; integrate this perhaps to (rus);`)
console.warn(`(virtual.js) we should really break up/curry the giant switch-case into a linear pipeline`)
console.warn(`TODO: implement status405, reading linked in comment :`) // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405

const deskSchemasGetSuccess = async(DATA, deskSchemaName) => {
    const params = {
        TableName: 'RUTHENIUM-V1-DESK-SCHEMAS',
        Key: {
            name: deskSchemaName
        },
        ReturnConsumedCapacity: 'TOTAL'
    }
    DATA.RU.io.deskSchemasGet = await rus.aws.ddbdc.get(params).promise()
    return ('Item' in DATA.RU.io.deskSchemasGet)
}

const deskSchemasDeleteSuccess = async(DATA, deskSchemaName) => {
    const params = {
        TableName: 'RUTHENIUM-V1-DESK-SCHEMAS',
        Key: {
            name: deskSchemaName
        },
        ReturnConsumedCapacity: 'TOTAL'
    }
    DATA.RU.io.deskSchemasDelete = await rus.aws.ddbdc.delete(params).promise()
    return DATA.RU.io.deskSchemasDelete
}

const deskRowGetSuccess = async(DATA, deskSchemaName) => {
    /*
    const params = {
        TableName: 'RUTHENIUM-V1-DESK-SCHEMAS',
        Key: {
            name: deskSchemaName
        },
        ReturnConsumedCapacity: 'TOTAL'
    }
    DATA.RU.io.deskSchemasGet = await rus.aws.ddbdc.get(params).promise()
    return ('Item' in DATA.RU.io.deskSchemasGet)
    */
}

const virtual = async(data) => {

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
                queryScope = (queryHasThing ? 'individual' : 'collection')
            }
            else {
                rus.log.error(data, `(virtual.js) (?type=) was not provided.`)
                await status400(data)
                return data
            }

            //  DIMENSION A
            //  (desk-schemas), (desk-cells) and (forms) are special / meta
            //  TODO: reconsider: is this really necessary?
            switch (data.RU.request.queryStringParameters.type[0]) {

                case ('forms'):

                    //  DIMENSION B
                    //  METHODS for (forms)
                    switch (data.RU.request.http.method) {

                        case ('GET'):

                            //  DIMENSION C
                            //  GET (forms) ... all of them, or just one?
                            switch (queryScope) {

                                case ('individual'):

                                    //  DIMENSION D
                                    //  GET (forms), which one? 
                                    switch (data.RU.request.queryStringParameters.thing[0]) {

                                        case (`create-desk-schema`):
                                            data.RU.signals.sendResponse.body = await formsMarkupCreateDeskSchema()
                                            return

                                            // (thing) switch level 1
                                        default:
                                            if (!data.RU.request.queryStringParameters['desk-schema-name'] ||
                                                !data.RU.request.queryStringParameters['desk-schema-name'][0]) {
                                                rus.log.error(data, `(virtual.js) (?type=forms) (GET) (?desk-schema-name ... was unspecified.)`)
                                            }

                                            if (!await deskSchemasGetSuccess(data, data.RU.request.queryStringParameters['desk-schema-name'][0])) {
                                                await status404(data)
                                                return
                                            }

                                            rus.conf.verbosity > 0 &&
                                                console.warn(`(virtual.js) manipulation of (desk-schemas) 
                                                    is not RESTful (current arrangement is just to colocate code by filename); 
                                                    some RESTful adjustments are suggested.`) &&
                                                console.warn(`(virtual.js) manipulation of (desk-schemas) 
                                                    is not RESTful (all CRUD is implemented via GET).`) &&
                                                console.warn(`(virtual.js) manipulation of (desk-schemas) 
                                                    is not RESTful (HTML forms should not be their own resource/URI, 
                                                    but rather they should be REPRESENTATIONS of given resources, 
                                                    e.g. a request to POST (create) a desk-schema which is malformed 
                                                    should result in a response which says "fill in this form".).`)

                                            switch (data.RU.request.queryStringParameters.thing[0]) {

                                                //  This is not RESTful; the following may be RESTful: ?type=desk-schema &thing=x, method: GET
                                                case (`read-desk-schema`):
                                                    data.RU.signals.sendResponse.body = await formsMarkupReadDeskSchema(data)
                                                    return

                                                    //  This is RESTful;
                                                case (`update-desk-schema`):
                                                    //data.RU.signals.sendResponse.body = await formsMarkupUpdateDeskSchema(data)
                                                    await status404(data)
                                                    console.error('re-enable this when schema-cell semantics have been ironed out')
                                                    return

                                                    //  This is not RESTful; the following may be RESTful: ?type=desk-schema &thing=x, method: DELETE
                                                case (`delete-desk-schema`):

                                                    if (!await deskSchemasDeleteSuccess(data, data.RU.request.queryStringParameters['desk-schema-name'][0])) {
                                                        await status500(data)
                                                        return
                                                    }

                                                    data.RU.signals.sendResponse.body = await formsMarkupDeleteDeskSchema(data)
                                                    return

                                                case (`create-desk-row`):
                                                    data.RU.signals.sendResponse.body = await formsMarkupCreateDeskRow(data)

                                                    /* UNIMPLEMENTED POST to DESK-CELLS */
                                                    return

                                                    // (thing) switch level 2
                                                default:

                                                    if (!data.RU.request.queryStringParameters['desk-row-id'] ||
                                                        !data.RU.request.queryStringParameters['desk-row-id'][0]) {
                                                        rus.log.error(data, `(virtual.js) (?type=forms) (GET) (?desk-row-id ... was unspecified.)`)
                                                    }

                                                    if (!await deskRowGetSuccess(data, data.RU.request.queryStringParameters['desk-row-id'][0])) {
                                                        await status404(data)
                                                        return
                                                    }

                                                    switch (data.RU.request.queryStringParameters.thing[0]) {

                                                        case ('update-desk-cell'):
                                                            /* UNIMPLEMENTED PUT to DESK-CELLS */
                                                            return

                                                        case ('delete-desk-row'):
                                                            /* UNIMPLEMENTED DELETE to DESK-CELLS */
                                                            return

                                                            // (thing) switch level 3
                                                        default:
                                                            rus.log.error(data, `(virtual.js) (?type=forms) (GET) ... (?THING=), first value: ${data.RU.request.queryStringParameters.thing[0]} not in (switch-case tree)`)
                                                            await status404(data)
                                                            return

                                                    }
                                            }
                                    }

                                default:
                                    rus.log.error(data, `(virtual.js) (?type=forms) (GET) ... (queryScope): '${queryScope}' not in (switch-case)`)
                                    await status404(data)
                                    return
                            }
                            // switch 
                            // ( queryScope )

                        default:
                            rus.log.error(data, `(virtual.js) Request query parameter (?type=forms), METHOD: (${data.RU.request.http.method}) has no (case) in (switch)`)
                            await status404(data)
                            console.warn(`TODO: implement status405`)
                            return
                    }
                    // switch
                    // ( .method )

                case ('desk-schemas'):

                    //  DIMENSION B
                    //  METHODS for (desk-schemas)
                    switch (data.RU.request.http.method) {

                        case ('GET'):

                            //  DIMENSION C
                            //  GET (desk-schemas) ... all of them, or just one?
                            switch (queryScope) {

                                case ('collection'):
                                    await deskSchemasGet(data)
                                    return

                                default:
                                    rus.log.error(data, `(virtual.js) (?type=desk-schemas) (GET) ... (queryScope): '${queryScope}' not in (switch-case)`)
                                    await status404(data)
                                    return
                            }
                            // switch
                            // ( queryScope )

                        case ('POST'):

                            //  DIMENSION C
                            //  POST (desk-schemas) ... all of them, or just one?
                            switch (queryScope) {

                                case ('collection'):

                                    //  PROTOCOL: HTTP POST - request encloses an entity, for server to accept as a 
                                    //              SUBORDINATE of the URI's resource 
                                    await deskSchemasPost(data)
                                    return

                                default:
                                    rus.log.error(data, `(virtual.js) (?type=desk-schemas) (POST) ... (queryScope): '${queryScope}' not in (switch-case)`)
                                    await status404(data)
                                    return
                            }
                            // switch
                            // ( queryScope )

                        case ('PUT'):

                            //  DIMENSION C
                            //  POST (desk-schemas) ... all of them, or just one?
                            switch (queryScope) {

                                case ('individual'):

                                    //  PROTOCOL: HTTP PUT - request encloses an entity, for server to accept as a 
                                    //              REPLACEMENT of the URI's resource 
                                    await deskSchemasPut(data)
                                    return

                                default:
                                    rus.log.error(data, `(virtual.js) (?type=desk-schemas) (POST) ... (queryScope): '${queryScope}' not in (switch-case)`)
                                    await status404(data)
                                    return
                            }
                            // switch
                            // ( queryScope )

                        default:
                            rus.log.error(data, `(virtual.js) Request query parameter (?type=desk-schemas), METHOD: (${data.RU.request.http.method}) has no (case) in (switch)`)
                            await status404(data)
                            console.warn(`TODO: implement status405`)
                            return
                    }
                    // switch 
                    // ( .method )


                /*
                case ('desk-cells'):

                    //  DIMENSION B
                    //  METHODS for (desk-cells)
                    switch (data.RU.request.http.method) {

                        case ('GET'):

                            //  DIMENSION C
                            //  GET (desk-cells) ... all of them, or just one?
                            switch (queryScope) {

                                case ('collection'):
                                    rus.log.error(data, `(virtual.js) (?type=desk-cells) (GET) (?thing=) was not provided. You should specify the (desk) whose (cells) you wish to GET.`)
                                    await status403(data)
                                    return

                                default:

                                    rus.log.error(data, `(virtual.js) (?type=desk-cells) (GET) ... (queryScope): '${queryScope}' not in (switch-case)`)
                                    await status404(data)


                                    return
                            }
                            // switch
                            // ( queryScope )

                        case ('PATCH'):

                            //  DIMENSION C
                            //  PATCH (desk-cells) ... all of them, or just one?
                            switch (queryScope) {

                                case ('collection'):
                                    await deskCellsPatch(data)
                                    return
                                    
                                default:
                                    rus.log.error(data, `(virtual.js) (?type=desk-cells) (PATCH) ... (queryScope): '${queryScope}' not in (switch-case)`)
                                    await status404(data)
                                    return
                            }
                            // switch
                            // ( queryScope )

                        case ('POST'):

//console.error(await rus.print.dataDebug(data))

                            //  DIMENSION C
                            //  POST (desk-cells) ... all of them, or just one?
                            switch (queryScope) {

                                default: rus.log.error(data, `(virtual.js) (?type=desk-cells) (POST) ... (queryScope): '${queryScope}' not in (switch-case)`)
                                await status404(data)
                                return
                            }
                            // switch
                            // ( queryScope )



                        default:
                            rus.log.error(data, `(virtual.js) Request query parameter (?type=desk-cells), METHOD: (${data.RU.request.http.method}) has no (case) in (switch)`)
                            await status404(data)
                            console.warn(`TODO: implement status405`)
                            return
                    }
                    // switch 
                    // ( .method )
                */
                
                case ('desks'):

                    //  DIMENSION B
                    //  METHODS for (desks)
                    switch (data.RU.request.http.method) {

                        case ('GET'):

                            //  DIMENSION C
                            //  GET (desks) ... all of them, or just one?
                            switch (queryScope) {

                                case ('collection'):
                                    rus.log.error(data, `(virtual.js) (?type=desks) (GET) (?thing=) was not provided. You should specify the (desk) you wish to GET.`)
                                    await status403(data)
                                    return

                                case ('individual'):

                                    //  DIMENSION D
                                    //  GET (desks), which one? 
                                    await desksRead(data)
                                    return

                                default:
                                    rus.log.error(data, `(virtual.js) (?type=desks) (GET) ... (queryScope): '${queryScope}' not in (switch-case)`)
                                    await status404(data)
                                    return
                            }

                        case ('PATCH'):

                            //  DIMENSION C
                            //  GET (desks) ... all of them, or just one?
                            switch (queryScope) {

                                case ('collection'):
                                    rus.log.error(data, `(virtual.js) (?type=desks) (PATCH) (?thing=) was not provided. You should specify the (desk) you wish to GET.`)
                                    await status403(data)
                                    return

                                case ('individual'):

                                    //  DIMENSION D
                                    //  GET (desks), which one? 
                                    await desksCreateRow(data)
                                    return

                                default:
                                    rus.log.error(data, `(virtual.js) (?type=desks) (PATCH) ... (queryScope): '${queryScope}' not in (switch-case)`)
                                    await status404(data)
                                    return
                            }

                        default:
                            rus.log.error(data, `(virtual.js) Request query parameter (?type=desks), METHOD: (${data.RU.request.http.method}) has no (case) in (switch)`)
                            await status404(data)
                            console.warn(`TODO: implement status405`)
                            return
                    }
                    // switch 
                    // ( .method )

                default:
                    //  (NOT desk-schemas) (NOT desk-cells) (NOT desks) and (NOT forms)

                    // Expect a valid (desk-schema.name)

                    rus.log.error(data, `(virtual.js) Request query parameter (?TYPE=), first value: (${data.RU.request.queryStringParameters.type[0]}) has no (case) in (switch)`)
                    await status404(data)
                    return
            }
            // switch
            // ( .type[0] )


        }
        catch (e) { throw e }



    } // non-transactional; single operation; not a batch - DEV THIS FIRST

    // manipulate (data.RU), for example
    // no need to return (data)
}

module.exports = virtual
