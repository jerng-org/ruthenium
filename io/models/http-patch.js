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
const httpPatch = {

    self: {
        many: false,
        rules: {

            count_gt: 0,

            //only_allowed_keys: ['PUT','DELETE']

            subs_all_test_true: _scopedDatumSubItem => {

                const _candidateMethodKeys = Object.keys(_scopedDatumSubItem)
                //  Where, for example: expectedMethodKeys = [ 'PUT' ] 
                const _allowedMethodKeys = ['PUT', 'DELETE']
                return _candidateMethodKeys.every(cmk => _allowedMethodKeys.includes(cmk))

            }

        },
        notes: ''
    },

    subs: undefined

}
// desk-schemas

module.exports = httpPatch
