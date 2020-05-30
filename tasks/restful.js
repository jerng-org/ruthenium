'use strict'

const getAllDeskSchemas 
    = require ( '/var/task/tasks/restful/desk-schemas-get/index.js' )

const formsDeskSchemasPostMarkup
    = require ( `/var/task/tasks/restful/forms/desk-schemas-post/markup.js` )

//const patchDeskSchema   = require ( '/var/task/tasks/restful/patchDeskSchema.js' )


const restful = async ( data ) => {
    
    //  ?batch=1
    if (        data.RU.request.queryStringParameters.batch
            &&  data.RU.request.queryStringParameters.batch[0] ) 
    {

        //  ?transaction=1
        if (        data.RU.request.queryStringParameters.transaction 
                &&  data.RU.request.queryStringParameters.transaction[0] ) 
        {
            // transactional batch - DEV THIS LAST
        }
        //  ?transaction=0
        else
        {
            
            // non-transactional batch - DEV THIS SECOND
        }
    }
    //  ?batch=0
    else 
    {
        
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
switch ( data.RU.request.http.method ) {
    case ( 'HEAD' ):
        break
    
    case ( 'GET' ):
        
        if (data.RU.request.queryStringParameters.type 
            &&  data.RU.request.queryStringParameters.type[0] ) 
        { 
            if (data.RU.request.queryStringParameters.thing
                &&  data.RU.request.queryStringParameters.thing[0] ) 
            {
                switch (data.RU.request.queryStringParameters.type[0]) {
                    case ('forms'):
                        // (desks) and (forms) are special / meta
                        data.RU.signals.sendResponse = {
                            body: await formsDeskSchemasPostMarkup()
                        }
                        break
                    default:
                        // GET the Virtual ROW
                }

            } 
            else 
            {
                switch (data.RU.request.queryStringParameters.type[0]) {
                    case ('desk-schemas'):
                        // (desks) and (forms) are special / meta
                        await getAllDeskSchemas ( data ) 
                        break
                    default:
                       // GET the Virtual TABLE   
                }
                
            } 
        } 
        else {

            //  ERROR : TYPE not specified
        }
        break
    
    case ( 'PUT' ):
        break
    case ( 'DELETE' ):
        break
    case ( 'POST' ):
        throw data.RU.formStringParameters
        break
    case ( 'PATCH' ):
        if (data.RU.request.queryStringParameters.type
            &&  data.RU.request.queryStringParameters.type[0] ) 
        {
            if (data.RU.request.queryStringParameters.thing
                &&  data.RU.request.queryStringParameters.thing[0] ) 
            {
                // PATCH the Virtual ROW
            } 
            else {
                
                // convert to switch/case
                if ( data.RU.request.queryStringParameters.type[0] == 'desk-schemas' ) {
                   // await patchDeskSchema ( data ) // (desks) are meta ... i.e. special
                } else {
                    // PATCH the Virtual TABLE   
                }
            } 
        } 
        else {
            
            //  ERROR : TYPE not specified
        }
        break
    default:
} // switch ( data.RU.request.http.method )
} catch (e) { throw e }


        
    } // non-transactional; single operation; not a batch - DEV THIS FIRST
    
}

module.exports = restful