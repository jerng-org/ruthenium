'use strict'

const rus = require ( '/var/task/modules/r-u-s.js' )

const deskSchemasModel = require (`/var/task/io/models/desk-schemas.js`)

const deskSchemasPost = async ( data ) => {
  
    //  throw new Error ( JSON.stringify( data.RU.request.formStringParameters, null, 4 ) ) 

    const candidate = data.RU.request.formStringParameters

    //  begin PROTOTYPICAL data validation process:
    
    const TEST_VALIDATE_ME = { 
        
        'desk-schemas': { 
            id:         'some-id-string',
            name:       'myName',
            columns:    [
                {   name:     'iAmColumn1',
                    type:     'other'
                },
                {   name:     'iAmColumn2',
                    type:     'S'
                }
            ]
        }
    }
    
    //const scopedModel = await rus.scopeModel  ( 'desk-schemas' )
    const validity    = await rus.validate    ( TEST_VALIDATE_ME, //data.RU.request.formStringParameters, 
                                                'desk-schemas'
                                              )
    
    throw Error ( [`(desk-schemas-post.js) validity :`, validity, `data:`, data] )
    /*
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
    */
    
    
    //  end PROTOTYPICAL data validation process.

    // Provide ID
    candidate['desk-schemas'].id = await rus.uuid4()

    // Configure DB client parameters
    const params = {
        
        TableName: 'TEST-APP-DESK-SCHEMAS',
        
        Item: candidate['desk-schemas'],            
        
        ConditionExpression : 'attribute_not_exists(id)',
          //  This checks data already in the DB;
          //  it seems we do not use this for validating data that has yet to
          //  be inserted into the DB.
          
        ReturnConsumedCapacity : 'TOTAL'
      
    }

    // Call storage layer
    data.RU.io.put = await rus.aws.ddbdc.put ( params ).promise()

    console.warn (`ddbdc.put returned:`, data.RU.io.put )
    
    // View
    data.RU.signals.redirectRoute = 'initial'

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