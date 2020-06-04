'use strict'

const ddbdc     
    = require ( '/var/task/io/ddbdc.js' )

const uuid4     
    = require ( '/var/task/modules/uuid4.js' )

const deskSchemasPost = async ( data ) => {
  
    //  throw new Error ( JSON.stringify( data.RU.request.formStringParameters, null, 4 ) ) 

    const candidate = data.RU.request.formStringParameters

    //  begin PROTOTYPICAL data validation process:
    
    //  VAL_OP#1
    if ( !  (   'desk-schemas'  in candidate 
                && 'name'       in candidate[ 'desk-schemas' ]
                && 'columns'    in candidate[ 'desk-schemas' ]
                && candidate[ 'desk-schemas' ]['columns'] instanceof Array
                && candidate[ 'desk-schemas' ]['columns'].length > 0
            ) 
    ) {
        throw Error (   `(~/tasks/restful/desk-schemas-post/) candidate 
                        insertion to (desk-schemas) did not pass validation.` ) 
    }

    //  VAL_OP#2
    for ( const column of candidate[ 'desk-schemas' ]['columns'] ) {
        
        if ( !  (      'name'   in column
                    && 'type'   in column
                    && /[^A-Z\[\]\s]+/.test( column[ 'name' ] ) // reuse blacklist in (reindex-form-names.js)
                    && [ 'S', 'N', 'other' ].includes( column[ 'type' ] ) 
                ) 
        ) {
          
            throw Error (   `(~/tasks/restful/desk-schemas-post/) candidate 
                            insertion to (desk-schemas.columns) did not pass 
                            validation.` ) 
        }
    }

    //  end PROTOTYPICAL data validation process.

    // Provide ID
    candidate['desk-schemas'].id = uuid4()

    const params = {
        
        TableName: 'TEST-APP-DESK-SCHEMAS',
        
        Item: candidate['desk-schemas'],            
        
        ConditionExpression : 'attribute_not_exists(id)',
          //  This checks data already in the DB;
          //  it seems we do not use this for validating data that has yet to
          //  be inserted into the DB.
          
        ReturnConsumedCapacity : 'TOTAL'
      
    }
    
console.warn ( params )

    // Call storage layer
    data.RU.io.put = await ddbdc.put ( params ).promise()

    console.warn (`ddbdc.put returned:`, data.RU.io.put ) 

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