'use strict'

const rus = require ( '/var/task/modules/r-u-s.js' )

const layoutMarkup = async ( data ) => {

// get data from ( data.RU.io.layout )

return `<!DOCTYPE html>
<html>
    <head>
        
        <link   rel="stylesheet" 
                type="text/css" 
                href="/test-middleware?route=file&file=milligram.min.css">
        
        <link   href="https://fonts.googleapis.com/icon?family=Material+Icons"
                rel="stylesheet">
        
        <style>
            /* Application overrides */
        
            .material-icons {
                vertical-align: middle;
            }
        </style>
        
        <script     nomodule 
                    src="/test-middleware?route=file&file=ruthenium-web-client.mjs"></script>
        <script     type="module" 
                    src="/test-middleware?route=file&file=ruthenium-web-client.mjs"></script>
    
    </head>
    <body>
        <pre>${ await rus.print.stringify4 ( data.RU.request.headers.cookies ) }</pre>
        <h3>Welcome to Prototyping</h3>
        <p>
        </p>
        ${ data.RU.response.body }

    </body>
</html>`
    
    
    // manipulate (data.RU), for example

    // no need to return (data)

}

module.exports = layoutMarkup