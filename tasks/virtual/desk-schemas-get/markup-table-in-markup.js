const trInTable
    = require (`/var/task/tasks/virtual/desk-schemas-get/markup-tr-in-table.js`) 


const rus = require ( '/var/task/modules/r-u-s.js' )


const tableInMarkup = async ( deskSchemasScan ) => {
    
    const markup = `
    <table>
        <thead>
            
            <tr>
                <th colspan="3">
                    <div class="ru-card">
                    
                        <p>System is currently aware of ${ deskSchemasScan.Count } Desk Schemas</p> 
                        <p>(change from table to card layout later</p> 
                        <div style="color:#f00;">
                            <p>Current priority:</p>
                            <ul>
                                <li>does routing look okay? - Good enough.</li>
                                <li>does CRUD for desk-schemas work? - WIP</li>
                                <li>does CRUD for desks work? - next WIP</li>
                                <li>what's missing?</li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                            </ul>
                        </div>
                        <a class="button float-right" href="${  
                            
                            await rus.appUrl ([
                                [ 'route', 'virtual' ],
                                [ 'type', 'forms' ],
                                [ 'thing', 'create-desk-schema' ],
                                [ 'reader', 'human']
                            ])
                            
                        }">Create Desk (ok) </a>
                    
                    </div>
                </th>
            </tr>
            
            <tr>
                <th>Desk's Name</th>
                <th>Desk's Column Names</th>
                <th>Desk's Operations </th>
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
                <td colspan="3">
                    Unallocated space.
                </td>
            </tr>
        </tfoot>
    </table>`

    return markup
}
module.exports  = tableInMarkup