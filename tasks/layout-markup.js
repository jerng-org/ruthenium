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
            
        /* Application Milligram-Overrides */
        
            .material-icons {
                vertical-align: middle;
            }
            
            .button code {
                background-color: inherit;
            }
            
            thead th:first-child {
                font-weight:300;
            }
            
            thead tr:last-child th[scope=col]:first-child {
                border-bottom:none;
            }

            th[scope=row] {
                border-bottom: 0.1rem solid #ddd;
            }
            
            th[scope=col]:not(:first-child) {
                border-left: 0.1rem solid #ddd;
            }

            tbody > tr:nth-child(odd) {
                background-color: #f8f8f8;                
            }

        /* Application Original Content  */
            
            .ru-card { 
                border-radius: 0.5em;
                padding: 1em;
                border: 1px solid #ccc;
            }
            
            .ru-hover-visible {
                visibility: hidden;
            }
            
            .ru-hover-visible:hover {
                visibility: visible;
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
                    
        <script>
       
            /* Application Original Content (move to io/blobs/ later) */
         
            const toggler = ( scopingElement, classString, focusSelector ) => {
                
                Array.prototype.forEach.call ( 
                    scopingElement.querySelectorAll( classString ), 
                    e => {
                    
                        const wasVisible = ['','initial'].includes(e.style.display)
                        e.style.display = wasVisible ? 'none' : ''
                        
                        if (    (! wasVisible) && focusSelector ) 
                        { 
                            const focusTarget = scopingElement.querySelector ( focusSelector )
                            if ( Object.is ( focusTarget, e ) )
                            {
                            
                                console.warn('Not yet understanding why the events are triggered on focusTarget: focus->blur->focus ')
                                    
                                focusTarget.focus()
                                if ( focusTarget.select ) focusTarget.select()
                            }
                        }
                    } 
                )
            
            }
            
            
        </script>
 
    
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
            <h1>Welcome to Prototyping</h1>
            
            <a class="button" href="${
            
                await rus.appUrl ([
                    [ 'route', 'initial' ], 
                    [ 'reader', 'human']
                ])
    
            }"><i class="material-icons">home</i></a>

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
