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
        
        <link   href="https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap" 
                rel="stylesheet">

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
            
            h1, h2, h3, h4, h5, h6 {
                margin-top: 2.0rem;
            }
            
            thead sub,
            thead th:first-child
            {
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

            tbody > tr:nth-child(odd) > td ,
            tbody > tr:nth-child(odd) > th {
                    background-image: linear-gradient(#f8f8f8, #fff, #fff, #fff, #f8f8f8);               
            }
            
            legend {
                margin-top: 1 rem;
            }
            
            dialog::backdrop {
                background: linear-gradient(45deg, rgba(0,143,104,.5), rgba(250,224,66,.5));
                /* .showModal() will display the  */
            } 
            
            label {
                margin-top: 1rem;
            }
            
            input {
                border-left: 3px dotted #d1d1d1;
            }
            
        /* Application Original Content  */
            
            .ru-card { 
                border-radius: 0.5em;
                padding: 0.5em 1em;
                border: 1px solid #ccc;
            }
            
            .ru-hover-opaque {
                opacity:0;
            }
            
            .ru-hover-opaque:hover {
                opacity:1;
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
            <h3>[fn: ruthenium-v1-dev_THEUNICORN]</h3>
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
        ${ rus.conf.verbosity > 2 ? ( "<pre>cookies (data.RU.request.headers.cookies):\n" + await rus.print.stringify4 ( data.RU.request.headers.cookies ) + '</pre>' ) : ''}
        ${ rus.conf.verbosity > 2 ? ( "<pre>io (data.RU.io):\n" + await rus.print.stringify4 ( data.RU.io ) + '</pre>' ) : ''}
        ${ rus.conf.verbosity > 2 ? ( "<pre>form data (data.RU.request.formStringParameters):\n" + await rus.print.stringify4 ( data.RU.request.formStringParameters ) + '</pre>' ) : ''}
        ${ rus.conf.verbosity > 2 ? ( "<pre>form data (data.RU.request.formStringParametersBeforeReindex):\n" + await rus.print.stringify4 ( data.RU.request.formStringParametersBeforeReindex ) + '</pre>' ) : ''}
        ${ rus.conf.verbosity > 2 ? ( "<pre>form data (data.RU.request.rawFormString):\n" + await rus.print.stringify4 ( data.RU.request.rawFormString ) + '</pre>' ) : ''}
    </body>
</html>`


    // manipulate (data.RU), for example

    // no need to return (data)

}

module.exports = layoutMarkup
