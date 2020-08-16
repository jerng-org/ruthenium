const trInTable
    = require (`/var/task/tasks/virtual/desk-schemas-get/markup-tr-in-table.js`) 

const tableInMarkup = async ( deskSchemasScan ) => {
    
    const markup = `
    <table>
        <thead>
            <tr>
                <th colspan="2">
                
                    <p>System is currently aware of ${ deskSchemasScan.Count } Desk Schemas</p>
                    <h6>
                        <div style="color:#f00; font-weight:700;">
                            <p>Current priority:</p>
                            <ul>
                                <li>
                                    <p>does routing look okay?</p>
                                    <p>
                                        <pre>
                                            We're currently working with something that looks like:
                                            - ? route=virtual
                                            - & type=(desk-schemas, or desks)
                                            - & thing=(UNDEFINED-for-desk-schemas, or DESK-NAME-for-desks)
                                            - & reader=(human, or machine)
                                            
                                            "route=virtual"
                                            
                                                -   this seems to indicate an abstract entity; 
                                                    but that means it is redundant with the 
                                                    definition of RESOURCES in REST, which are 
                                                    always abstract, and never reified;
                                                    
                                                -   consider: "table=virtual" for a more 
                                                    literal interpretation; or "storage=desk"
                                                    which does not specify the implementation
                                                    of desks, but which does refer to the 
                                                    abstract concept of desk storage;
                                            
                                                -   perhaps then, 
                                                
                                                    "storage=desk"  -> (any desk name)
                                                    "storage=table" -> "desk-schemas"
                                                    
                                                    or,
                                                    
                                                    "table=virtual" -> (any desk name)
                                                    "table=actual"  -> "desk-schemas"
                                                    
                                                    but does this discuss too much about
                                                    the implementation with the client?
                                        </pre>
                                    </p>
                                </li>
                                <li>does CRUD for desk-schemas work?</li>
                                <li>does CRUD for desks work?</li>
                                <li>what's missing?</li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                            </ul>
                        </div>
                    </h6>
                    <a class="button float-right" href="#">Create Desk</a>
    
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