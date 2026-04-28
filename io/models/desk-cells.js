import rusMinus1 from "/var/task/modules/r-u-s-minus-1.js";

'use strict'
const conf = rusMinus1.conf 
const mark = rusMinus1.mark 

const deskCells = {

    self: {
        //many: false,
        //notes: undefined,
        rules: {
            keys_included_counts: {
                min: 1,
                max: 1,
                keyList: conf.storage.deskCellTypeKeys
            } 
        }
    },
    subs: {
        DHC: {                      // 1ry-part-key
            self: {
                //many: false,
                rules: {
                    count_gt: 0
                }
            },
            //subs: false
        },
        R: {                        // 1ry-sort-key
            self: {
                //many: false,
                rules: {
                    count_gt: 0
                }
            },
            //subs: false
        },
    }
}

export default deskCells;
mark('LOADED')