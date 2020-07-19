'use strict'

const deskSchemasGet = require('/var/task/tasks/restful/desk-schemas-get/desk-schemas-get.js')

const deskSchemasPost = require('/var/task/tasks/restful/desk-schemas-post.js')

const formsDeskSchemasPostMarkup = require(`/var/task/tasks/restful/forms-get/markup-desk-schemas-post.js`)

//const patchDeskSchema   = require ( '/var/task/tasks/restful/patchDeskSchema.js' )

console.warn(`(restful.js) we should really break up/curry the giant switch-case into a linear pipeline`)

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

            const queryScope = queryHasType ?
                (queryHasThing ? 'one' : 'all') :
                new Error(`Requested a (restful) task, but (type) was not specified.`)

            //  DIMENSION A
            //  (desk-schemas) and (forms) are special / meta
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
                                            break
                                        default:
                                            console.error(`(restful.js) (?type=forms) (GET) ... (?THING=), first value: ${data.RU.request.queryStringParameters.thing[0]} not in (switch-case)`)
                                    }
                                    break

                                default:
                                    console.error(`(restful.js) (?type=forms) (GET) ... (queryScope): ${queryScope} not in (switch-case)`)
                            }
                            // switch 
                            // ( queryScope )
                            break

                        default:
                            console.error(`(restful.js) Request query parameter (?type=forms), METHOD: (${data.RU.request.http.method}) has no (case) in (switch)`)
                    }
                    // switch
                    // ( .method )
                    break

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
                                    break

                                default:
                                    console.error(`(restful.js) (?type=desk-schemas) (GET) ... (queryScope): ${queryScope} not in (switch-case)`)
                            }
                            // switch
                            // ( queryScope )
                            break

                        case ('POST'):

                            //  DIMENSION C
                            //  POST (desk-schemas) ... all of them, or just one?
                            switch (queryScope) {

                                case ('all'):
                                    await deskSchemasPost(data)
                                    break

                                default:
                                    console.error(`(restful.js) (?type=desk-schemas) (POST) ... (queryScope): ${queryScope} not in (switch-case)`)
                            }
                            // switch
                            // ( queryScope )
                            break

                        default:
                            console.error(`(restful.js) Request query parameter (?type=desk-schemas), METHOD: (${data.RU.request.http.method}) has no (case) in (switch)`)
                    }
                    // switch 
                    // ( .method )
                    break

                default:
                    //  (NOT desk-schemas) and (NOT forms)
                    console.error(`(restful.js) Request query parameter (?TYPE=), first value: (${data.RU.request.queryStringParameters.type[0]}) has no (case) in (switch)`)
            }
            // switch
            // ( .type[0] )


        }
        catch (e) { throw e }



    } // non-transactional; single operation; not a batch - DEV THIS FIRST

}

module.exports = restful
