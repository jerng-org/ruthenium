'use strict'

const mark = require('/var/task/modules/mark.js')

/*  Given any DATA, exerts control over DATA.RU.signals.session;
 *
 */

const session = {
    set: async DATA => {
        DATA.RU.signals.session = {
            id: 'placeholders_session_id-(session.js)'
        }
    },
    expire: async DATA => {
        delete DATA.RU.signals.session
    },
}

module.exports = session
mark(`~/modules/session.js LOADED`)
