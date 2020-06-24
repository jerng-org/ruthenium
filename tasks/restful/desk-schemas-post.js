'use strict'

const rus               = require ( '/var/task/modules/r-u-s.js' )

const deskSchemasModel  = require (`/var/task/io/models/desk-schemas.js`)

const deskSchemasPost   = async ( data ) => {
  
    const candidate     = data.RU.request.formStringParameters

    if ( ! await rus.validateFormData ( data, 'desk-schemas' ) ) {
        data.RU.signals.redirectRoute = '&message=we received a form with invalid data'
        return
    }

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

    rus.conf.versbosity < 1
    || console.warn (`ddbdc.put returned:`, data.RU.io.put )
    
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
    // manipulate (data.RU), for example

    // no need to return (data)

}
module.exports = deskSchemasPost