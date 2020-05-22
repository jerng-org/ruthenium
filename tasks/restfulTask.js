'use strict'

const mark      = require ( '../modules/mark' )            
const DDBDC     = require ( '../io/DDBDC.js' )

const restfulTask = async ( data ) => {
    
    if ( data.RU.request.queryStringParameters.batch ) {
        
        // batch
        
        if ( data.RU.request.queryStringParameters.transaction ) {
            
            // transactional batch - DEV THIS LAST
        }
        else {
            
            // non-transactional batch - DEV THIS SECOND
        }
    }
    else 
    {
        
/******************************************************************************  
*       Literary Review : https://restfulapi.net/http-methods/
*******************************************************************************  
*       safe => 'read only', * => idempotent
*******************************************************************************  
HTTP    CRUD	ENTIRE COLLECTION           SPECIFIC ITEM  
METHOD          (E.G. /USERS)               (E.G. /USERS/123)
*******************************************************************************  

POST	Create	201 (Created), ‘Location’   Avoid using POST on single resource
                header with link to 
                /users/{id} containing 
                new ID.	

GET	    Read	200 (OK), list of users.    200 (OK), single user. 
*               Use pagination, sorting     404 (Not Found), if ID not found or 
safe            and filtering to navigate   invalid.
                big lists.	
                
PUT	    Update/ 405 (Method not allowed),   200 (OK) or 204 (No Content).  
*       Replace	unless you want to update   Use 404 (Not Found), 
                every resource in the       if ID not found or invalid.
                entire collection of 
                resource.	

PATCH	Partial 405 (Method not allowed),   200 (OK) or 204 (No Content). 
        Update/ unless you want to modify   Use 404 (Not Found), 
        Modify	the collection itself.	    if ID not found or invalid.
 
DELETE	Delete	405 (Method not allowed),   200 (OK). 404 (Not Found), 
*               unless you want to delete   if ID not found or invalid.
                the whole collection 
                — use with caution.	
HEAD
*
safe

******************************************************************************
*   IMPLEMENTED ?
******************************************************************************
*   BROKEN UP TO SUBFOLDER FILES ?
******************************************************************************/
        
switch ( data.RU.request.http.method ) {
    case ( 'HEAD' ):
        break
    case ( 'GET' ):
        if ( data.RU.request.queryStringParameters.type ) { 
            
            if ( data.RU.request.queryStringParameters.thing ) {
    
                // GET the Virtual ROW
            } 
            else {
                
                if ( data.RU.request.queryStringParameters.type == 'schemas' ) {
                
                    // (schemas) are meta ... i.e. special
                    
                    data.RU.io.gridSchemasScan = await DDBDC.scan ( {
                        TableName: 'TEST-APP-GRID-SCHEMAS',
                        ReturnConsumedCapacity : 'TOTAL'
                    } ).promise()
                    
                    data.RU.response.markupName = 'initialTaskMarkup'

                }
                else {
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
        break
    default:
}



        
    }
    
    mark ( `restfulTask.js EXECUTED` )
}

module.exports = restfulTask
mark ( `restfulTask.js LOADED` )