'use strict'

const rus = require('/var/task/modules/r-u-s.js')



const desksGetMarkup = async(data) => {

    let th1s = '<th scope="row">Property Name</th>'
    let th2s = '<th scope="row">Property Type</th>'
    let th3s = `<th scope="col"><code>${ data.RU.io.deskSchemasQuery.Items[0].name }</code>Object Count</th>`
    let colNames = []
    for (const col of data.RU.io.deskSchemasQuery.Items[0].columns) {
        colNames.push(col.name)
        th1s += `<th scope="col">${ col.name }</th>`
        th2s += `<th scope="col">${ col.type }</th>`
    }

    let deskColumnTypes = {}
    data.RU.io.deskSchemasQuery.Items[0].columns
        .forEach((column) => { deskColumnTypes[column.name] = column.type })

    let deskCells = {}
    data.RU.io.deskCellsQuery.Items.forEach((cell) => {

        if (!(cell.R in deskCells)) {
            deskCells[cell.R] = {}
        }
        const _colName = cell.DHC.slice(cell.D.length + 1)
        const _colType = deskColumnTypes[_colName]
        deskCells[cell.R][_colName] = cell[_colType]
    })

    let tbodyTrs = ''
    let rowCount = 0
    for (const rowID in deskCells) {
        tbodyTrs += `
        <tr>
        ${ colNames.reduce(
            (accumulator, colName)=>{
                return accumulator + `<td>${deskCells[rowID][colName]}</td>`
            },
            `<th    scope="row" 
                    id="${rowID}"
                    onclick="toggler ( this, '.toggle-set-1', null )"
                    >
                    ${ ++rowCount } 
                    : 
                    <i      class="material-icons toggle-set-1"
                            >
                            fingerprint</i>
                    <span   class="toggle-set-1" 
                            style="display:none;"
                            >
                            ${rowID}</span>
            </th>` /*initial accumulator value*/) 
        }
        </tr>`
    }

    let markup = `
<h3><i>GET</i> a Desk </h3>
<h1>name:   <code>${ data.RU.io.deskSchemasQuery.Items[0].name }</code></h1>
        <pre>${ rus.conf.verbosity > 3 ? await rus.print.stringify4(deskCells) : '' }</pre>
        <pre>${ rus.conf.verbosity > 3 ? await rus.print.stringify4(colNames) : '' }</pre>
<table>

    <thead>
        <tr>
            <th colspan="4">
            
                <a class="button float-left" href="${  
                        
                    await rus.appUrl ([
                        [ 'route', 'virtual' ],
                        [ 'type', 'forms' ],
                        [ 'thing', 'create-desk-schema' ],
                        [ 'reader', 'human']
                    ])
                    
                }">CREATE <i class="material-icons">fiber_new</i> Row</a>
                        
            </th>
        </tr>
        <tr>${ th1s }</tr>        
        <tr>${ th2s }</tr>        
        <tr>${ th3s }</tr>        
    </thead>
    
    <tbody>${ tbodyTrs }</tbody>
    
    <tfoot>
    </tfoot>
    
</table>`


    rus.mark(`~/tasks/virtual/desks-get-markup.js EXECUTED`)

    return markup
}
//  Return markup as string, and it will be assigned to
//      (data.RU.response.body) by (compose-response.js).


module.exports = desksGetMarkup
rus.mark(`~/tasks/virtual/desks-get-markup.js LOADED`)
