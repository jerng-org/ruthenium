'use strict'

const deskGet = require('/var/task/tasks/restful/desk-get.js')

const deskSchemasGet = require('/var/task/tasks/restful/desk-schemas-get/desk-schemas-get.js')

const deskSchemasPost = require('/var/task/tasks/restful/desk-schemas-post.js')

const formsDeskSchemasPostMarkup = require(`/var/task/tasks/restful/forms-get/markup-desk-schemas-post.js`)

const rus = require('/var/task/modules/r-u-s.js')

const status400 = require(`/var/task/tasks/status-400.js`)
const status403 = require(`/var/task/tasks/status-403.js`)
const status404 = require(`/var/task/tasks/status-404.js`)
const status501 = require(`/var/task/tasks/status-501.js`)

rus.conf.verbosity > 0 &&
    (console.warn(`(~/tasks/restful.js) all (types) are currently manually coded; RECONSIDER.`),
        console.warn(`(~/tasks/restful.js) (dimensions) may require a bit of restructuring.`)
    )

//const patchDeskSchema   = require ( '/var/task/tasks/restful/patchDeskSchema.js' )

console.warn(`(restful.js) we should really break up/curry the giant switch-case into a linear pipeline`)
console.warn(`TODO: implement status405, reading linked in comment :`) // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405


const restful = async(data) => {

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

        /******************************************************************************  
        *       Literary Review : https://restfulapi.net/http-methods/
        *******************************************************************************  
        *       safe => 'read only', # => idempotent
        *******************************************************************************  
        HTTP    CRUD	ENTIRE COLLECTION           SPECIFIC ITEM  
        METHOD          (E.G. /USERS)               (E.G. /USERS/123)
        *******************************************************************************  

        HEAD
        #
        safe

        GET	    Read	200 (OK), list of users.    200 (OK), single user. 
        #               Use pagination, sorting     404 (Not Found), if ID not found or 
        safe            and filtering to navigate   invalid.
                        big lists.	

        PUT	    Update/ 405 (Method not allowed),   200 (OK) or 204 (No Content).  
        #       Replace	unless you want to update   Use 404 (Not Found), 
                        every resource in the       if ID not found or invalid.
                        entire collection of 
                        resource.	

        DELETE	Delete	405 (Method not allowed),   200 (OK). 404 (Not Found), 
        #               unless you want to delete   if ID not found or invalid.
                        the whole collection 
                        — use with caution.	
                        
        POST	Create	201 (Created), ‘Location’   Avoid using POST on single resource
                        header with link to 
                        /users/{id} containing 
                        new ID.	

        PATCH	Partial 405 (Method not allowed),   200 (OK) or 204 (No Content). 
                Update/ unless you want to modify   Use 404 (Not Found), 
                Modify	the collection itself.	    if ID not found or invalid.
         
        ******************************************************************************
        *   IMPLEMENTED ?
        ******************************************************************************
        *   BROKEN UP TO SUBFOLDER FILES ?
        ******************************************************************************/

        try {

            const queryHasType = data.RU.request.queryStringParameters.type &&
                data.RU.request.queryStringParameters.type[0]

            const queryHasThing = data.RU.request.queryStringParameters.thing &&
                data.RU.request.queryStringParameters.thing[0]

            let queryScope
            if (queryHasType) {
                queryScope = (queryHasThing ? 'one' : 'all')
            }
            else {
                console.error(`(restful.js) (?type=) was not provided.`)
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

                                case ('one'):

                                    //  DIMENSION D
                                    //  GET (forms), which one? 
                                    switch (data.RU.request.queryStringParameters.thing[0]) {
                                        case (`create-desk-schema`):
                                            data.RU.signals.sendResponse.body = await formsDeskSchemasPostMarkup()
                                            return
                                        default:
                                            console.error(`(restful.js) (?type=forms) (GET) ... (?THING=), first value: ${data.RU.request.queryStringParameters.thing[0]} not in (switch-case)`)
                                            await status404(data)
                                            return
                                    }

                                default:
                                    console.error(`(restful.js) (?type=forms) (GET) ... (queryScope): ${queryScope} not in (switch-case)`)
                                    await status404(data)
                                    return
                            }
                            // switch 
                            // ( queryScope )

                        default:
                            console.error(`(restful.js) Request query parameter (?type=forms), METHOD: (${data.RU.request.http.method}) has no (case) in (switch)`)
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

                                case ('all'):
                                    await deskSchemasGet(data)
                                    return

                                default:
                                    console.error(`(restful.js) (?type=desk-schemas) (GET) ... (queryScope): ${queryScope} not in (switch-case)`)
                                    await status404(data)
                                    return
                            }
                            // switch
                            // ( queryScope )

                        case ('POST'):

                            //  DIMENSION C
                            //  POST (desk-schemas) ... all of them, or just one?
                            switch (queryScope) {

                                case ('all'):
                                    await deskSchemasPost(data)
                                    return

                                default:
                                    console.error(`(restful.js) (?type=desk-schemas) (POST) ... (queryScope): ${queryScope} not in (switch-case)`)
                                    await status404(data)
                                    return
                            }
                            // switch
                            // ( queryScope )

                        default:
                            console.error(`(restful.js) Request query parameter (?type=desk-schemas), METHOD: (${data.RU.request.http.method}) has no (case) in (switch)`)
                            await status404(data)
                            console.warn(`TODO: implement status405`)
                            return
                    }
                    // switch 
                    // ( .method )

                case ('desk-cells'):

                    //  DIMENSION B
                    //  METHODS for (desk-cells)
                    switch (data.RU.request.http.method) {

                        case ('GET'):

                            //  DIMENSION C
                            //  GET (desk-cells) ... all of them, or just one?
                            switch (queryScope) {

                                case ('all'):
                                    console.error(`(restful.js) (?type=desk-cells) (GET) (?thing=) was not provided. You should specify the (desk) whose (cells) you wish to GET.`)
                                    await status403(data)
                                    return

                                default:

                                    console.error(`(restful.js) (?type=desk-cells) (GET) ... (queryScope): ${queryScope} not in (switch-case)`)
                                    await status404(data)


                                    /*  Validation for (thing) should allow:
                                    
                                        LITERAL
                                        -   GET one entire desk-column-row

                                        ABSTRACTION
                                        -   GET one entire desk
                                        -   GET one entire desk-column
                                        -   GET one entire desk-row
            
                                    */

                                    return
                            }
                            // switch
                            // ( queryScope )

                        case ('POST'):

                            //  DIMENSION C
                            //  POST (desk-cells) ... all of them, or just one?
                            switch (queryScope) {

                                default: console.error(`(restful.js) (?type=desk-cells) (POST) ... (queryScope): ${queryScope} not in (switch-case)`)
                                await status404(data)
                                return
                            }
                            // switch
                            // ( queryScope )

                        default:
                            console.error(`(restful.js) Request query parameter (?type=desk-cells), METHOD: (${data.RU.request.http.method}) has no (case) in (switch)`)
                            await status404(data)
                            console.warn(`TODO: implement status405`)
                            return
                    }
                    // switch 
                    // ( .method )

                case ('desks'):

                    //  DIMENSION B
                    //  METHODS for (desks)
                    switch (data.RU.request.http.method) {

                        case ('GET'):

                            //  DIMENSION C
                            //  GET (desks) ... all of them, or just one?
                            switch (queryScope) {

                                case ('all'):
                                    console.error(`(restful.js) (?type=desks) (GET) (?thing=) was not provided. You should specify the (desk) you wish to GET.`)
                                    await status403(data)
                                    return

                                case ('one'):

                                    //  DIMENSION D
                                    //  GET (desks), which one? 
                                    await deskGet (data)
                                    

                                    /*
                                    
                                        ddbdc lookups here;
                                        
                                        
                                        
                                        if not found, fail:
                                    
                                    
                                        console.error(`(restful.js) (?type=forms) (GET) ... (?THING=), first value: ${data.RU.request.queryStringParameters.thing[0]} not in (switch-case)`)
                                        await status404(data)
                                    */
                                    return

                                default:
                                    console.error(`(restful.js) (?type=desk-cells) (POST) ... (queryScope): ${queryScope} not in (switch-case)`)
                                    await status404(data)
                                    return
                            }
                            // switch
                            // ( queryScope )


                        default:
                            console.error(`(restful.js) Request query parameter (?type=desks), METHOD: (${data.RU.request.http.method}) has no (case) in (switch)`)
                            await status404(data)
                            console.warn(`TODO: implement status405`)
                            return
                    }
                    // switch 
                    // ( .method )

                default:
                    //  (NOT desk-schemas) (NOT desk-cells) (NOT desks) and (NOT forms)

                    console.error(`(restful.js) Request query parameter (?TYPE=), first value: (${data.RU.request.queryStringParameters.type[0]}) has no (case) in (switch)`)
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

module.exports = restful
