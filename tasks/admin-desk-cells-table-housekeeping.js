'use strict'

//  Provide a debuggable function name, 
//  in order to avoid debuggin (function).toString()

const rus = require('/var/task/modules/r-u-s.js')

const adminDeskCellsTableHousekeeping = async(data) => {
    rus.mark(`EXECUTING ...`)

    const deskSchemasByName = {}
    data.RU.io.deskSchemasScan = await rus.aws.ddbdc.scan({
        TableName: 'RUTHENIUM-V1-DESK-SCHEMAS',
    }).promise()
    data.RU.io.deskSchemasScan.Items.forEach(_schema => {
        deskSchemasByName[_schema.name] = _schema.columns.reduce(
            (accumulator, currentColumn, index, array) => {
                accumulator[currentColumn.name] = currentColumn.type
                return accumulator
            }, {} /* initialValue */
        )
    })

    //data.RU.io.deskCellsDeletes = []
    const orphanedCells = []
    const mistypedCells = []
    let postRowIndex = 0
    let hiddenInputs = ``

    data.RU.io.deskCellsScan = await rus.aws.ddbdc.scan({
        TableName: 'TEST-APP-DESK-CELLS',
    }).promise()

    for (const _deskCell of data.RU.io.deskCellsScan.Items) {

        const [_deskSchemaName, _column] = _deskCell.DHC.split(`#`)

        {
            let orphanFound =
                _deskSchemaName in deskSchemasByName ?
                (!
                    (
                        _column in deskSchemasByName[_deskSchemaName]
                    )
                ) :
                true

            let mistypedFound = (!orphanFound) &&
                !(deskSchemasByName[_deskSchemaName][_column] in _deskCell)

            if (orphanFound) {
                /*    
                let result
                data.RU.io.deskCellsDeletes.push(result = await rus.aws.ddbdc.delete({
                    TableName: 'TEST-APP-DESK-CELLS',
                    Key: {
                        DHC: _deskCell.DHC,
                        R: _deskCell.R
                    },
                    ReturnValues: 'ALL_OLD'
                }).promise())

                if ('Attributes' in result) {
                    orphanedCells.push(result.Attributes)
                }
                */
                orphanedCells.push(_deskCell)
                hiddenInputs += 
                    await rus.html.input({
                        name: `desk-cells[DELETE]###${postRowIndex}###[DHC]`,
                        type: `hidden`,
                        value: _deskCell.DHC
                    }) +
                    await rus.html.input({
                        name: `desk-cells[DELETE]###${postRowIndex}###[R]`,
                        type: `hidden`,
                        value: _deskCell.R 
                    })
            
                postRowIndex++
            }
            else

            if (mistypedFound) {
                mistypedCells.push({

                    ..._deskCell,
                    expected_but_missing_data_type: deskSchemasByName[ _deskSchemaName ][ _column ]

                })
                hiddenInputs += 
                    await rus.html.input({
                        name: `desk-cells[PUT]###${postRowIndex}###[DHC]`,
                        type: `hidden`,
                        value: _deskCell.DHC
                    }) +
                    await rus.html.input({
                        name: `desk-cells[PUT]###${postRowIndex}###[R]`,
                        type: `hidden`,
                        value: _deskCell.R
                    }) +
                    await rus.html.input({
                        name: `desk-cells[PUT]###${postRowIndex}###[D]`,
                        type: `hidden`,
                        value: _deskCell.D
                    }) +
                    await rus.html.input({
                        name: `desk-cells[PUT]###${postRowIndex}###[${ deskSchemasByName[ _deskSchemaName ][ _column ] }]`,
                        type: `hidden`,
                        value: _deskCell[ rus
                                            .conf
                                            .storage
                                            .deskCellTypeKeys
                                            .filter( 
                                                key => Object
                                                        .keys(_deskCell)
                                                        .includes(key) 
                                            )[0] 
                                        ]
                    })
                    
                postRowIndex++
            }
        }
    }


    data.RU.signals.sendResponse = { body: `
<h1>Administration: Housekeeping Report</h1>

<div class="ru-card">
    <h2>Desk Schemas found: ${ data.RU.io.deskSchemasScan.Count } </h2>
    
    <h2>Orphaned Cells found: ${ orphanedCells.length } </h2>
    - its desk was not found in the (desk-schemas) table, OR
    <br> - its column was not found in its desk-schema after the latter was 
            retrieved from the (desk-schemas) table
    
    <h2>Mistyped Cells found: ${ mistypedCells.length } </h2>
</div>

<h3>These were the orphaned cells:</h3>
<pre class="ru-card"><code>
${  JSON.stringify(orphanedCells,null,4)   }
</code></pre>

<h3>These were the mistyped cells:</h3>
<pre class="ru-card"><code>
${  JSON.stringify(mistypedCells,null,4)   }
</code></pre>

<h1>Administration: Address Housekeeping Report</h1>
Proceed to delete orphans, and to attempt to retype mistyped cells. Mistyped
cells may be deleted if their data cannot be coerced successfully.

${
    await rus.html.form({
        action: await rus.appUrl([
            ['route', `virtual`],
            ['type', 'desks'],
            ['form-method', 'PATCH'],
            ['reader', 'human']
        ]),
        class:'ru-card',
        innerHtml: hiddenInputs
            +
            await rus.html.fieldset({
                class:'ru-card',
                legendInnerHtml: `WARNING : Save any of the data above, \
in case you need to undo changes. You may simply save this webpage.`,
                innerHtml: await rus.html.input({
                    type: `submit`,
                })
            })
    })
}


` }

    rus.mark(`... EXECUTED`)
}
// manipulate (data.RU), for example
// no need to return (data)

module.exports = adminDeskCellsTableHousekeeping

rus.mark('LOADED')