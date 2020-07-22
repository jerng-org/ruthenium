'use strict'

const rus = require('/var/task/modules/r-u-s.js')



const desksGetMarkup = async(data) => {

    let markup = `
<h1>Desk id: <code>${ data.RU.io.deskSchemasQuery.Items[0].id }</code></h1>
<h1>Desk name: <code>${ data.RU.io.deskSchemasQuery.Items[0].name }</code></h1>
<table>
    <thead>
        <tr>
        ${
data.RU.io.deskSchemasQuery.Items[0].columns
    .reduce(( acc, cur, index, array)=>{
        
        return acc + `<th scope="col">${ cur.name }</th>`
        
    }, '' /*initial accumulator value*/ )
            
        }        
        </tr>
    </thead>
    <tbody>
    </tbody>
    <tfoot>
    </tfoot>
</table>`


    rus.mark(`~/tasks/restful/desks-get-markup.js EXECUTED`)

    return markup
}
//  Return markup as string, and it will be assigned to
//      (data.RU.response.body) by (compose-response.js).


module.exports = desksGetMarkup
rus.mark(`~/tasks/restful/desks-get-markup.js LOADED`)
