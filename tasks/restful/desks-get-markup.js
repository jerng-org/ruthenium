'use strict'

const rus = require('/var/task/modules/r-u-s.js')



const desksGetMarkup = async(data) => {

    let th1s = '<th scope="row">Column Names :</th>'
    let th2s = '<th scope="row">Column Types :</th>'
    let colNames = []
    for (const col of data.RU.io.deskSchemasQuery.Items[0].columns) {
        th1s += `<th scope="col">${ col.name }</th>`
        th2s += `<th scope="col">${ col.type }</th>`
    }
    //let rowCount = 1

    let deskColumnTypes = {}
    data.RU.io.deskSchemasQuery.Items[0].columns
        .forEach((column) => { deskColumnTypes[column.name] = column.type })

    let deskCells = {}
    data.RU.io.deskCellsQuery.Items.forEach((cell) => {

        if (!(cell.R in deskCells)) {
            deskCells[cell.R] = {}
        }
        const colName = cell.DHC.slice(cell.DHC.indexOf('#'))
        const colType = deskColumnTypes[colName]
        deskCells[cell.R][colName] = cell[colType]
    })

    let markup = `
<h3><i>GET</i> a Desk </h3>
<h1>id:     <code>${ data.RU.io.deskSchemasQuery.Items[0].id }</code></h1>
<h2>name:   <code>${ data.RU.io.deskSchemasQuery.Items[0].name }</code></h2>
<table>

    <thead>
        <tr>${ th1s }</tr>        
        <tr>${ th2s }</tr>        
    </thead>
    
    <tbody>
    ${ await rus.print.stringify4(deskCells)}
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
