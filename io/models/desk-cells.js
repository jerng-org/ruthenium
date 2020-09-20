'use strict'

const conf = require(`/var/task/configuration.js`)

console.error(`(desk-cells.js) WIP`)

const deskCells = {

    self: {
        //many: false,
        //notes: undefined,
        rules: {
            keys_included_counts: {
                //min: 1,
                min: 2,
                max: 1,
                keyList: conf.storage.deskCellTypeKeys
                //keyList: ['X','Y']
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

module.exports = deskCells
