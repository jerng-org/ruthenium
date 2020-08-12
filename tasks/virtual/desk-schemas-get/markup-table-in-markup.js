const trInTable
    = require (`/var/task/tasks/virtual/desk-schemas-get/markup-tr-in-table.js`) 

const tableInMarkup = async ( deskSchemasScan ) => {
    
    const markup = `
    <table>
        <thead>
            <tr>
                <th colspan="2">
                    <h6>
                        System is currently aware of ${ deskSchemasScan.Count } Desk Schemas
                        <a class="button float-right" href="#">Create Desk</a>
                    </h6>
    
                </th>
            </tr>
            <tr>
                <th><h3>Desk Name</h3></th>
                <th><h3>Column Names</h3></th>
            </tr>
        </thead>
        <tbody style="vertical-align:top;">
            ${  
                await deskSchemasScan.Items.reduce ( 
                    async ( accumulator, currentItem, index ) => {
                        return  await accumulator + 
                                await trInTable ( currentItem )
                    }, 
                    ''  
               )
            }
        </tbody>
        <tfoot>
            <tr>
                <td colspan="2">
                    <a class="button float-right" href="?route=virtual&type=forms&thing=create-desk-schema&reader=human">Create Desk</a>
                </td>
            </tr>
        </tfoot>
    </table>`

    return markup
}
module.exports  = tableInMarkup