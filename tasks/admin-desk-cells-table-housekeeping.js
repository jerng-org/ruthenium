'use strict'

//  Provide a debuggable function name, 
//  in order to avoid debuggin (function).toString()

const rus = require('/var/task/modules/r-u-s.js')

let printable = []

const deskCellsTableHousekeeping = async(data) => {
    rus.mark(`~/tasks/desk-cells-table-housekeeping.js EXECUTION start`)

    const deskSchemasByName = {}
    data.RU.io.deskSchemasScan = await rus.aws.ddbdc.scan({
        TableName: 'RUTHENIUM-V1-DESK-SCHEMAS',
    }).promise()
    data.RU.io.deskSchemasScan.Items.forEach(_schema => {
        deskSchemasByName[_schema.name] = _schema
        // cheaply passes by reference
    })

    data.RU.io.deskCellsDeletes = []
    const orphanedCells = []
    data.RU.io.deskCellsScan = await rus.aws.ddbdc.scan({
        TableName: 'TEST-APP-DESK-CELLS',
    }).promise()
    for (const _deskCell of data.RU.io.deskCellsScan.Items) {

        const [_deskSchemaName, _column] = _deskCell.DHC.split(`#`)

        let orphanFound =
            _deskSchemaName in deskSchemasByName ?
            (!
                (
                    deskSchemasByName[_deskSchemaName].columns.map(col => col.name).includes(_column)
                )
            ) :
            true

        if (orphanFound) {


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

        }
    }


    data.RU.signals.sendResponse = { body: `
<h1>Housekeeping</h1>

<h2>Desk Schemas found: ${ data.RU.io.deskSchemasScan.Count } </h2>

<h2>Orphaned Cells deleted: </h2>
(consider breaking this into two stages: orphaned cells listed, before confirmation for deletion)

<pre><code>
    ${  JSON.stringify(orphanedCells,null,4)   }
</code></pre>
` }

    rus.mark(`~/tasks/desk-cells-table-housekeeping.js EXECUTION end`)
}
// manipulate (data.RU), for example
// no need to return (data)

module.exports = deskCellsTableHousekeeping
rus.mark(`~/tasks/desk-cells-table-housekeeping.js LOADED`)
