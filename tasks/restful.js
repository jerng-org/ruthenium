'use strict'

const deskSchemasGet 
    = require ( '/var/task/tasks/restful/desk-schemas-get/desk-schemas-get.js' )

const deskSchemasPost 
    = require ( '/var/task/tasks/restful/desk-schemas-postdesk-schemas-post.js' )

const formsDeskSchemasPostMarkup
    = require ( `/var/task/tasks/restful/forms-get/markup-desk-schemas-post.js` )

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
    
const queryType     =   data.RU.request.queryStringParameters.type 
                    &&  data.RU.request.queryStringParameters.type[0]     
    
const queryThing    =   data.RU.request.queryStringParameters.thing 
                    &&  data.RU.request.queryStringParameters.thing[0]     

const queryScope    =   queryType

                        ?   ( queryThing
                            ? 'virtual-row'        //  resource is a Virtual Row
                            : 'virtual-table' )    //  resource is a Virtual Table
                        
                        :   new Error (     `Requested a (restful) task, 
                                            but (type) was not specified.` )

// DIMENSION A
// (desk-schemas) and (forms) are special / meta
switch
( data.RU.request.queryStringParameters.type[0] ) {

case
('forms'):
                // DIMENSION B
                switch
                ( data.RU.request.http.method ) {
                    
                case
                ( 'GET' ):
                                // DIMENSION C
                                switch
                                ( queryScope ) {
                                
                                case
                                ('virtual-row'): 
                                    // Which individual Thing?
                                data.RU.signals.sendResponse = {
                                    body: await formsDeskSchemasPostMarkup()
                                }
                                break
                                
                                default:
                                throw queryScope
                                    // current pattern: always do this
                                    
                                } 
                                // switch 
                                // ( queryScope )
                break
                
                default:
                
                }
                // switch
                // ( .method )
break
        
case
('desk-schemas'):
    
                // DIMENSION B
                switch
                ( data.RU.request.http.method ) {
                    
                case
                ( 'GET' ):
                    
                                // DIMENSION C
                                switch
                                ( queryScope ) {
                                
                                case
                                ('virtual-table'):
                                    // Which Type (set, group) of things?
                                await deskSchemasGet ( data ) 
                                break
                                
                                default:
                                throw queryScope
                                    // current pattern: always do this
                                }        
                                // switch
                                // ( queryScope )
                break
            
                case
                ( 'POST' ):
                    
                                // DIMENSION C
                                switch
                                ( queryScope ) {
                                
                                case
                                ('virtual-table'):
                                    // Which Type (set, group) of things?
                                await deskSchemasPost ( data ) 
                                break
                                
                                default:
                                throw queryScope
                                    // current pattern: always do this
                                }        
                                // switch
                                // ( queryScope )
                break
            
                default:
                }
                // switch 
                // ( .method )
break
        
default:
// GET the Virtual ROW

}
// switch
// ( .type[0] )


/* DIMENSION A

switch (data.RU.request.queryStringParameters.type[0]) {
    case ('forms'):
        // (desk-schemas) and (forms) are special / meta
        break
    default:
        // GET the Virtual ROW
}
*/

/* DIMENSION B

switch (queryScope) {
    case ('virtual-row'):
    
        // Which individual Thing?
        break
    case ('virtual-table'):
    
        // Which Type (set, group) of things?
        break
    default:
        throw queryScope
}
*/

/* DIMENSION C

switch ( data.RU.request.http.method ) {
    case ( 'HEAD' ):
        break
    case ( 'GET' ):
        break
    case ( 'PUT' ):
        break
    case ( 'DELETE' ):
        break
    case ( 'POST' ):
        break
    case ( 'PATCH' ):
        break
    default:
} // switch ( data.RU.request.http.method )
*/



} catch (e) { throw e }


        
    } // non-transactional; single operation; not a batch - DEV THIS FIRST
    
}

module.exports = restful