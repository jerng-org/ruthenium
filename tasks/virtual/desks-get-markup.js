'use strict'

const rus = require('/var/task/modules/r-u-s.js')



const desksGetMarkup = async(data) => {

    let th1s = '<th scope="row" ><sup>property name</sup> <sub>type</sub></th>'
    let th2s = `<th scope="col" colspan="999">
                        <code>${ data.RU.io.deskSchemasGet.Item.name }</code>Object Count <sup>click to show ID</sup>
                    </th>`
    let colNames = []
    for (const col of data.RU.io.deskSchemasGet.Item.columns) {
        colNames.push(col.name)
        th1s += `<th scope="col">${ col.name } <sub>${ rus.conf.labels.deskCellTypes[col.type] }</sub></th>`
    }

    th1s += `<th scope="col"><sub>Operations on each Object</sub></th>`
    

    const deskCellsByRowID = rus.limbo.ddbDeskCellsByRowID(
        data.RU.io.deskSchemasGet.Item,
        data.RU.io.deskCellsQuery.Items)

    rus.conf.verbosity > 6 && `desks-get-markup.js: the code above should probably be made more framework-wise generic`

    let tbodyTrs = ''
    let rowCount = 0
    for (const rowID in deskCellsByRowID) {
        
        rowCount++
        
        const deleteDeskRowFormID = `delete-desk-row-${ rowID }`
        
        tbodyTrs += `
        <tr>
        ${ await colNames.reduce(
            async (accumulator, colName, index, array)=>{
                return await accumulator + `<td>

                            ${ deskCellsByRowID[rowID][colName] }
                            
                            <i class="material-icons ru-hover-opaque">edit</i>
                            <i class="material-icons">construction</i>
                            
                            ${ 
                                await rus.html.fieldset({
                                    form: deleteDeskRowFormID,
                                    name: `testDeleteFormFieldsetName-${ rowID }-${ colName }`,
                                    innerHtml: await rus.html.input({
                                        name: `desk-cells[DELETE]###${ rowCount }###[DHC]`,
                                        type: `hidden`,
                                        value: `${ data.RU.io.deskSchemasGet.Item.name }#${ colName }`
                                    })
                                })
                            }
                                        </td>`
            }, // reducer
            
            ` <th scope = "row" id = "${rowID}" > 
            <i  class="material-icons toggle-set-1"
                        style="display:none;"
                        title="hide the id"
                        onclick="toggler ( this.closest('th'), '.toggle-set-1', null )"
                        >
                        visibility_off</i>

            <span class = "toggle-set-1" style = "display:none;" > &nbsp; ${ rowID } </span>

        <i class = "material-icons toggle-set-1"
        onclick = "toggler ( this.parentElement, '.toggle-set-1', null )" >
            fingerprint </i>

            <span class = "toggle-set-1" > ${rowCount }. </span> 

            </th>
        ` /*initial accumulator value*/
        )
            
            + // after all the other cells in this row, add one more ...
            
            ` <th>

            <a  class="button" 
                    title="UPDATE desk row"
                    href="${
                    await rus.appUrl ([
                        [ 'route', 'virtual' ],
                        [ 'type', 'forms' ],
                        [ 'thing', 'update-desk-row' ],
                        [ 'desk-schema-name', data.RU.io.deskSchemasGet.Item.name ], 
                        [ 'desk-row-id', rowID ], 
                        [ 'reader', 'human']
                    ])
                }"><i class="material-icons">edit</i> UPDATE</a>

            <fieldset onclick = "toggler ( this, '.toggle-set-1', '#unlock-desk-row-delete-${ rowID }' )"
        class = "toggle-set-2"
        style = "margin:0;" >

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
                            </span>
                            <span class="toggle-set-1" style="display:none;">
                                code: 234806</span>
                        </button>
                    </label>

            <input type = "text"
        id = "unlock-desk-row-delete-${ rowID }"
        placeholder = "type the code, to show the link, which deletes this object"
        class = "toggle-set-1"
        style = "display:none;margin-top:0.5rem;"
        onclick = "(e=>e.stopImmediatePropagation())(event)"
        oninput = "console.log('onInput');if (this.value==234806) { 
            this.value = ''
            toggler(this.parentNode, '.toggle-set-1', '#unlock-desk-row-delete-${ rowID }')
    
            const confirmed = window.confirm('WARNING : You are about to display a link which deletes the object \\
                ${ rowID }\\
                forever - select CANCEL to reconsider.')

            if (confirmed) {
                toggler(this.closest('th'), '.toggle-set-2', '#desk-row-delete-${ rowID }')
            }
            else {
                //alert ('dev: cleanup required ')
            }

        }
    " > </fieldset >

    <div class = "ru-card toggle-set-2"
    style = "display:none;" >

        ${  await rus.html.form ( {
                
                action: await rus.appUrl([
                    ['route', 'virtual'],
                    ['type', 'desks'],
                    ['thing', data.RU.io.deskSchemasGet.Item.name],
                    ['form-method', 'PATCH']
                ]),
                id: deleteDeskRowFormID,
                innerHtml: `deleteRowFormInnerHtml` /*await rus.html.fieldset({
                    legendInnerHtml: `some legend text`,
                    innerHtml: await rus.html.input({
                            name: `desk-cells[DELETE]###${ rowCount }###[R]`,
                            type: `hidden`,
                            value: rowID
                        }) +
                        await rus.html.input({
                            name: `desk-cells[DELETE]###${ rowCount }###[DHC]`,
                            type: `hidden`,
                            value: deskCellsByRowID[rowID].DHC
                        })
                })
                
                SUBMIT BUTTON GOES HERE, fieldsets GO IN OTHER tds IN THIS tr
                
                */,
                class: 'ru-card'
            } ) 

/*        `<a  class="button"  title="delete object forever" id="desk-row-delete-${ rowID }" href="${
                    
                        await rus.appUrl ([
                        //
                        //  [ 'route', 'virtual' ],
                        //  [ 'type', 'forms' ],
                        //  [ 'thing', 'delete-desk-schema' ],
                        //  [ 'desk-schema-name', rowID ], 
                        //  [ 'reader', 'human']
                        //
                        ])

                    }"> <i class="material-icons">delete_forever</i> 
                        this action cannot be undone
                    </a>`
*/            
        }
        
        <button class = "button-clear"
    title = "hide the link, which deletes this object"
    onclick = "toggler ( this.closest('th'), '.toggle-set-2', '#desk-row-delete-${ rowID }' )" >
        <i class="material-icons">lock_open</i>
    hide link </button>

        </div>

        </th>`
}
 </ tr > `
}

let markup = `
<h3> <i>GET</i>
a Desk </h3> <h1 > name: <code>${ data.RU.io.deskSchemasGet.Item.name }</code> </h1> 
    <pre > ${ rus.conf.verbosity > 3 ? await rus.print.stringify4(deskCellsByRowID) : '' }</pre>
    <pre>${ rus.conf.verbosity > 3 ? await rus.print.stringify4(colNames) : '' }</pre> 
    <table >

    <thead>
        <tr>
            <th colspan="999">
            
                <a class="button float-left" href="${  
                        
                    await rus.appUrl ([
                        [ 'route', 'virtual' ],
                        [ 'type', 'forms' ],
                        [ 'thing', 'create-desk-row' ],
                        [ 'desk-schema-name', data.RU.io.deskSchemasGet.Item.name ],
                        [ 'reader', 'human']
                    ])
                    
                }"> CREATE
                    <i class="material-icons">fiber_new</i>
                    Object 
                </a>
                        
            </th>
        </tr>
        <tr>${ th1s }</tr>        
        <tr>${ th2s }</tr>        
    </thead>

    <tbody > ${ tbodyTrs } </tbody >

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
