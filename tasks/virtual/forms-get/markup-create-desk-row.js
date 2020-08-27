'use strict'

const rus = require ( '/var/task/modules/r-u-s.js' )

const innerHTML = async DATA => `
<fieldset>

    ${  
        DATA.RU.io.deskSchemasGet.Item.columns.reduce( 
            ( accumulator, currentValue, index, array ) => {
                return accumulator + ( await rus.html.input ( {
                    id:             currentValue.name,
                    label:          currentValue.name,
                    name:           `desk-cells###[${ currentValue.name }]`,
                    placeholder:    `-- enter a ${ currentValue.type } --`
                    
                } ) )
            },
            `` /* initial value */
        )
    } 

    <button type="submit"
            title="submit form: create object"
            >
            <i class='material-icons'>send</i> SUBMIT FORM</button>
                        
                        
</fieldset>
`

const createDeskRow = async ( data ) => {
    
    return `
    
        <h2><code>${ data.RU.io.deskSchemasGet.Item.name }</code> : object creation </h2>
    
        ${  await rus.html.form ( {
                action: await rus.appUrl( [ /* TBD
                    [ 'route','virtual' ], 
                    [ 'type','desk-cells' ] */
                ] ),
                innerHTML: await innerHTML(data),
                class: 'ru-card'
            } ) 
        }
    `
}
module.exports = createDeskRow