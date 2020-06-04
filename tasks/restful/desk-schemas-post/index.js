'use strict'

const ddbdc     
    = require ( '/var/task/io/ddbdc.js' )

const deskSchemasPost = async ( data ) => {
  
  throw new Error ( JSON.stringify( data.RU.request.formStringParameters, null, 4 ) ) 
/*

(new)
    TEST-APP-DESK-SCHEMAS
        1ryPartKey : id
        1rySortKey : desk-name
        
        
{
  "columns": [
    {
      "name": "size",
      "type": "N"
    },
    {
      "name": "material",
      "type": "S"
    },
    {
      "name": "color",
      "type": "S"
    }
  ],
  "desk-name": "shoes"
}

*/

}
module.exports = deskSchemasPost