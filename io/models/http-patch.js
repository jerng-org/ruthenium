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

    subs: undefined, //  We don't really care 
    //  about the subs, BUT

    self: {
        many: false,
        rules: {

            count_gt: 0,

            /* Approach 3 */
            subs_all_fit_model: {

                
                self: {
                    many: false,
                    rules: {
                        //only_allowed_keys: ['PUT', 'DELETE']
                        only_allowed_keys: [ 'DELETE']
                        //  ... we DO care about the grand-subs;
                    }
                },
                
                subs: undefined
                // but it remains to be observed whether we should do it here or in
                // the usual main model tree of (model.subs[?].subs).
            }

            /* Approach 2
            only_allowed_keys: ['PUT','DELETE']
            */

            /*  Approach 1
            subs_all_test_true: _scopedDatumSubItem => {

                const _candidateMethodKeys = Object.keys(_scopedDatumSubItem)
                //  Where, for example: expectedMethodKeys = [ 'PUT' ] 
                const _allowedMethodKeys = ['PUT', 'DELETE']
                return _candidateMethodKeys.every(cmk => _allowedMethodKeys.includes(cmk))

            }
            */

        },
        notes: ''
    }

}
// desk-schemas

module.exports = httpPatch
