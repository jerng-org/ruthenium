'use strict'

const rusMinus1 = require('/var/task/modules/r-u-s-minus-1.js')
const mark = rusMinus1.mark 

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
const httpPatch = {

    //subs: undefined, //  We don't really care 
    //  about the subs, BUT

    self: {
        many: false,
        rules: {
            count_gt: 0,
            subs_all_fit_model: {
                self: {
                    many: false,
                    rules: {
                        only_allowed_keys: ['PUT', 'DELETE']
                        //only_allowed_keys: [ 'DELETE']
                        //  ... we DO care about the grand-subs;
                    }
                },
                // subs: undefined
            },
            subs0_keys_applied_to_subs2: { subs1: ['PUT'] } 


        },
        notes: ''
    }

}
// desk-schemas

module.exports = httpPatch

mark ( `~/io/models/http-patch.js LOADED` )