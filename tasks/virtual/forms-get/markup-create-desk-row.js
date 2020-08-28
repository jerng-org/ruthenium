'use strict'

const rus = require ( '/var/task/modules/r-u-s.js' )

const innerHTML = async DATA => `
<fieldset>

    ${  
        await DATA.RU.io.deskSchemasGet.Item.columns.reduce( 
            async ( accumulator, currentValue, index, array ) => {
                return await accumulator + await rus.html.input ( {
                    id:             currentValue.name,
                    label:          currentValue.name,
                    name:           `desk-cell[columns][${ currentValue.name }]`,
                    placeholder:    `-- enter a ${ rus.conf.labels.deskCellTypes[ currentValue.type ] } --`
                    
                } ) 
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
                action: await rus.appUrl( [
                    [ 'route','virtual' ], 
                    [ 'type','desk-cells' ] 
                ] ),
                innerHTML: await innerHTML(data),
                class: 'ru-card'
            } ) 
        }
    `
}
module.exports = createDeskRow