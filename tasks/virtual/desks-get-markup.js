'use strict'

const rus = require('/var/task/modules/r-u-s.js')



const desksGetMarkup = async(data) => {

    let th1s = '<th scope="row" colspan="2">Property Name</th>'
    let th2s = '<th scope="row" colspan="2">Property Type</th>' 
    let th3s = `<th scope="col" colspan="999">
                        <code>${ data.RU.io.deskSchemasQuery.Items[0].name }</code>Object Count (click to show ID)
                    </th>`
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
                return accumulator + `  <td>    ${deskCells[rowID][colName]}
                                                
                                                <i class="material-icons ru-hover-opaque">edit<i class="material-icons">construction</i></i>
                                        </td>`
            },
            `
            <th    scope="row" 
                    id="${rowID}"
                    >
                    <span class="toggle-set-1">${ ++rowCount } : </span> 
                    <i      class="material-icons toggle-set-1"
                            onclick="toggler ( this.parentElement, '.toggle-set-1', null )"
                            >
                            fingerprint</i>
                    <span   class="toggle-set-1" 
                            style="display:none;"
                            >
                            ${rowID}</span>
            </th>
            ` /*initial accumulator value*/)
            
            + // after all the other cells in this row, add one more ...
            
            `            
            <th>
            
                <fieldset   onclick="toggler ( this, '.toggle-set-1', '#unlock-desk-row-delete-${ rowID }' )"
                            class="toggle-set-2"
                            style="margin:0;"
                            >
                            
                    <label  for="unlock-desk-row-delete-${ rowID }"
                            style="margin:0;"
                            >
                        <button     title="show the link which deletes this object" 
                                    class="button-outline" 
                                    onclick="return false;"
                                    style="margin:0;"
                                    > 
                            <span>
                                <i class="material-icons">lock</i>
                                <i class="material-icons">delete</i>
                                DELETE
                                <i class="material-icons">construction</i>
                            </span>
                            <span class="toggle-set-1" style="display:none;">
                                code: 234806</span>
                        </button>
                    </label>
                    
                    <input  type="text" 
                            id="unlock-desk-row-delete-${ rowID }" 
                            placeholder="type the code, to show the link, which deletes this object" 
                            class="toggle-set-1"
                            style="display:none;margin-top:0.5rem;"
                            onclick="(e=>e.stopImmediatePropagation())(event)"
                            oninput="if (this.value==234806) { 
                            
                                this.value = ''
                                toggler ( this.parentNode, '.toggle-set-1', '#unlock-desk-row-delete-${ rowID }' )
                                
                                const confirmed = window.confirm('WARNING : You are about to display a link which deletes the object \\'${ rowID }\\' forever - select CANCEL to reconsider.')
                                if ( confirmed ) 
                                {
                                    toggler ( this.closest('th'), '.toggle-set-2', '#desk-row-delete-${ rowID }' )
                                } else {
                                    //alert ('dev: cleanup required ')
                                }
                            }"
                            >
                </fieldset>
                
                <div    class="ru-card toggle-set-2"
                        style="display:none;"
                        >
                
                    <a  class="button" 
                        title="delete object forever"
                        id="desk-row-delete-${ rowID }"
                        href="${
                    
                        await rus.appUrl ([
                        /*
                            [ 'route', 'virtual' ],
                            [ 'type', 'forms' ],
                            [ 'thing', 'delete-desk-schema' ],
                            [ 'desk-schema-name', rowID ], 
                            [ 'reader', 'human']
                        */
                        ])

                    }"> <i class="material-icons">delete_forever</i> 
                        this action cannot be undone
                        <i class="material-icons">construction</i>
                    </a>
                    
                    <button class="button-clear" 
                        title="hide the link, which deletes this object"
                        onclick="toggler ( this.closest('th'), '.toggle-set-2', '#desk-row-delete-${ rowID }' )"
                    >
                    <i class="material-icons">lock_open</i> hide link </button>
                    
                </div>
                
            </th>`
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
            <th colspan="999">
            
                <a class="button float-left" href="${  
                        
                    await rus.appUrl ([
                        [ 'route', 'virtual' ],
                        [ 'type', 'desk' ],
                        [ 'thing', data.RU.io.deskSchemasQuery.Items[0].name ],
                        [ 'reader', 'human']
                    ])
                    
                }"> CREATE
                    <i class="material-icons">fiber_new</i>
                    Object 
                    <i class="material-icons">construction</i>
                </a>
                        
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
