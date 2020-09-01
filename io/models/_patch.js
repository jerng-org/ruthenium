'use strict'

/*

Our target data looks LIKE this:

    formStringParameters: {
      'desk-cells': {
        PUT: [
          { N: '99', DHC: 'shoes#size', D: 'shoes' },
          { S: 'hi', DHC: 'shoes#material', D: 'shoes' },
          { S: 'hihi', DHC: 'shoes#color', D: 'shoes' }
        ]
      }
    }

    Now we don't really care WHAT the modelNamesAsKeys are (e.g. 'desk-cells'),
    but we do care that under the modelNameAsKey, there are the subs:
    
        'PUT' and 'DELETE'


*/


// Types and Sub-types
const _patch = {

    self:   {
        many:   false,      // perhaps 'true' for a future "batchPatch"
        rules:  {
            count_gt:   0   // existence?
        },
        notes:  ''
    }
    
    /*
    
    We don't 
    
    */ 
    
}
// desk-schemas
    
module.exports = _patch