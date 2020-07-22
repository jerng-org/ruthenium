'use strict'

const rus = require('/var/task/modules/r-u-s.js')



const desksGetMarkup = async(data) => {

    let markup = ''

    for (const column of data.RU.io.deskSchemasQuery.Items[0].columns0) {
        markup += column.name
    }

    rus.mark(`~/tasks/restful/desks-get-markup.js EXECUTED`)

    return markup
}
//  Return markup as string, and it will be assigned to
//      (data.RU.response.body) by (compose-response.js).


module.exports = desksGetMarkup
rus.mark(`~/tasks/restful/desks-get-markup.js LOADED`)
