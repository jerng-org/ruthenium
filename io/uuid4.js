'use strict'

/*    https://stackoverflow.com/posts/2117523/revisions
 *   
 *    This function my block while it waits for entropy. (?)
 */

const rusMinus1 = require('/var/task/modules/r-u-s-minus-1.js')
const mark = rusMinus1.mark 
const crypto = require('crypto')

const uuid4 = async () => {

  rusMinus1.frameworkDescriptionLogger.callStarts()

  const _returned =
    ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      // (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      (c ^ crypto.randomFillSync(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
    
  rusMinus1.frameworkDescriptionLogger.callEnds()

  return _returned
}

module.exports = uuid4

mark('LOADED')