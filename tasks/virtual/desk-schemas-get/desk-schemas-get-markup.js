import rus from "/var/task/modules/r-u-s.js";

'use strict'
//const htmlIndex
//    = rus.node.fs.readFileSync ( '/var/task/io/blobs/index.html', { encoding: 'utf8' } )

import tableInMarkup from '/var/task/tasks/virtual/desk-schemas-get/markup-table-in-markup.js'

const deskSchemasMarkup = async (data) => {

    rus.frameworkDescriptionLogger.backlog(`( rewire file naming conventions so that instead of "markup-table-in-markup.js" we have "desk-schemas-get-markup-table-in-markup.js)`)

    const markup = await tableInMarkup(data.RU.io.deskSchemasScan)

        +
        (rus.conf.verbosity < 4 ?
            '' :
            ` <h6>all-desk-schemas/markup.js:</h6>
              <pre><code>${ JSON.stringify( data.RU.io.deskSchemasScan, null, 4 ) }</code></pre>`)

    return markup
}

export default deskSchemasMarkup;
