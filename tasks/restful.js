'use strict'

const mark              = require ( '/var/task/modules/mark' )            
const getAllSchemas     = require ( '/var/task/tasks/restful/getAllSchemas.js' )
const patchSchema       = require ( '/var/task/tasks/restful/patchSchema.js' )


const restful = async ( data ) => {
    
    if (        data.RU.request.queryStringParameters.batch
            &&  data.RU.request.queryStringParameters.batch[0] ) 
    {
        // batch
        
        if (        data.RU.request.queryStringParameters.transaction 
                &&  data.RU.request.queryStringParameters.transaction[0] ) 
        {
            // transactional batch - DEV THIS LAST
        }
        else
        {
            
            // non-transactional batch - DEV THIS SECOND
        }
    }
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

POST	Create	201 (Created), ‘Location’   Avoid using POST on single resource
                header with link to 
                /users/{id} containing 
                new ID.	

GET	    Read	200 (OK), list of users.    200 (OK), single user. 
#               Use pagination, sorting     404 (Not Found), if ID not found or 
safe            and filtering to navigate   invalid.
                big lists.	
                
PUT	    Update/ 405 (Method not allowed),   200 (OK) or 204 (No Content).  
#       Replace	unless you want to update   Use 404 (Not Found), 
                every resource in the       if ID not found or invalid.
                entire collection of 
                resource.	

PATCH	Partial 405 (Method not allowed),   200 (OK) or 204 (No Content). 
        Update/ unless you want to modify   Use 404 (Not Found), 
        Modify	the collection itself.	    if ID not found or invalid.
 
DELETE	Delete	405 (Method not allowed),   200 (OK). 404 (Not Found), 
#               unless you want to delete   if ID not found or invalid.
                the whole collection 
                — use with caution.	
HEAD
#
safe

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
                        // (schemas) and (forms) are special / meta
                        //data.RU.metadata['desk-data-types'] = ;
                        data.RU.signals.markupName = 'forms/createSchema'
                        break
                    default:
                        // GET the Virtual ROW
                }

            } 
            else 
            {
                switch (data.RU.request.queryStringParameters.type[0]) {
                    case ('schemas'):
                        // (schemas) and (forms) are special / meta
                        await getAllSchemas ( data ) 
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
                if ( data.RU.request.queryStringParameters.type[0] == 'schemas' ) {
                    await patchSchema ( data ) // (schemas) are meta ... i.e. special
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
    
    mark ( `restfulTask.js EXECUTED` )
}

module.exports = restful
mark ( `restful.js LOADED` )