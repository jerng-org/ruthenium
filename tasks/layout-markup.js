'use strict'

const rus = require('/var/task/modules/r-u-s.js')

const layoutMarkup = async(data) => {

    // get data from ( data.RU.io.layout )

    return `<!DOCTYPE html>
<html>
    <head>
        
        <link   rel="stylesheet" 
                type="text/css" 
                href="${

await rus.appUrl ( [
    [ 'route', 'file' ],
    [ 'file', 'milligram.min.css' ]
] )


                }">
        
        <link   href="https://fonts.googleapis.com/icon?family=Material+Icons"
                rel="stylesheet">
        
        <style>
            /* Application overrides */
        
            .material-icons {
                vertical-align: middle;
            }
            
            li { 
                border-radius: 0.3em;
                padding: 0.3em;
                border: 1px solid #ccc;
            }
        </style>
        
        <script     nomodule 
                    src="${
                    
await rus.appUrl ( [
    [ 'route', 'file' ],
    [ 'file', 'ruthenium-web-client.mjs' ]
] )

                    }"></script>
        <script     type="module" 
                    src="${
                    
await rus.appUrl ( [
    [ 'route', 'file' ],
    [ 'file', 'ruthenium-web-client.mjs' ]
] )

                    }"></script>
    
    </head>
    <body>
        ${  data.RU.signals.session 
            ?   '' 
            :   '<a href="https://' + 
                process.env.COGNITO_ISSUER_HOST + 
                '/login?client_id=' + 
                process.env.COGNITO_RELYING_PARTY_ID +
                '&response_type=code&scope=openid&redirect_uri=' +
                encodeURIComponent ( process.env.COGNITO_REDIRECT_URI ) +
                '">Log In</a>' 
        }
        
        <div class="container">
            <h3>Welcome to Prototyping</h3>
            <hr>
            <p>
            </p>
            ${ data.RU.response.body }
        </div>
        
        ${ rus.conf.verbosity > 2 ? '<hr><h4>(rus.conf.verbosity > 2) :</h4>' : ''}
        ${ rus.conf.verbosity > 2 ? ( "<pre>cookies:\n" + await rus.print.stringify4 ( data.RU.request.headers.cookies ) + '</pre>' ) : ''}
        ${ rus.conf.verbosity > 3 ? ( "<pre>io:\n" + await rus.print.stringify4 ( data.RU.io ) + '</pre>' ) : ''}
    </body>
</html>`


    // manipulate (data.RU), for example

    // no need to return (data)

}

module.exports = layoutMarkup
