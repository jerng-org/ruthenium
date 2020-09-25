'use strict'

//  Provide a debuggable function name, 
//  in order to avoid debuggin (function).toString()

const rus = require('/var/task/modules/r-u-s.js')

let printable = {}

const deskCellsTableHousekeeping = async(data) => {
    rus.mark(`~/tasks/desk-cells-table-housekeeping.js EXECUTION start`)

    data.RU.io.deskSchemasScan = await rus.aws.ddbdc.scan({
        TableName: 'RUTHENIUM-V1-DESK-SCHEMAS',
    }).promise()
    data.RU.io.deskCellsScan = await rus.aws.ddbdc.scan({
        TableName: 'TEST-APP-DESK-CELLS',
    }).promise()

    for ( const _deskCell of data.RU.io.deskCellsScan) {
        
    }
/*    
    for (const _deskSchema of data.RU.io.deskSchemasScan.Items) {
        data.RU.io.deskCellsQuery = await rus.aws.ddbdc.query({
            TableName: 'TEST-APP-DESK-CELLS',
            IndexName: 'D-GSI',
            KeyConditionExpression: 'D = :deskName',
            ExpressionAttributeValues: { ':deskName': _deskSchema.name },
        }).promise()
        
        const _deskRows = rus.limbo.ddbDeskCellsByRowID ( _deskSchema, data.RU.io.deskCellsQuery.Items ) 
        
        //printable[ _deskSchema.name ] = _deskRows

        for (const _row in _deskRows ) {
//
            
        }

    }
*/

    data.RU.signals.sendResponse = { body: `
<h1>Housekeeping</h1>

<h2>Desk Schemas found: ${ data.RU.io.deskSchemasScan.Count } </h2>

<!--
<table>

    <thead>
    </thead>
    <tbody>
    </tbody>

</table>
-->

<pre><code>
    ${ 
    JSON.stringify(data.RU.io.deskCellsScan,null,4) 
    
        
    }
</code></pre>
` }

    rus.mark(`~/tasks/desk-cells-table-housekeeping.js EXECUTION end`)
}
// manipulate (data.RU), for example
// no need to return (data)

module.exports = deskCellsTableHousekeeping
rus.mark(`~/tasks/desk-cells-table-housekeeping.js LOADED`)
