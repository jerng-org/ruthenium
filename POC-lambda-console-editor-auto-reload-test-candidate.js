//  HOW TO USE THIS
//  In the AWS Lambda web console, which uses the Cloud9Lite editor:
//  1.  open browser devtools, <<console>>
//  2.  select the correct script execution context, <<index.html>> 
//          under <<gibberish.cloudfront.net>>
//  3.  configure the <<tesetUrl>> variable in the script below
//  4.  run this entire script in the context of (1,2)
//
//  Now every time you click "Save", the testUrl should pop open in a new tab.
//
//  NEXT: requires "writing a Chrome extension" in order to get access to
//  "devtools" object, or "content-scripts" feature.


//  Modified from MDN documentation;
//
//  Select an element that changes when the console has saved the file.
//  const targetNode = document.querySelector('.infolabel.errorlabel')
//  We can't simply do this because the element is added to the document
//  only after the first (save) event.

const testUrl = ''

const body = document.querySelector('body')

// Create an observer instance linked to the callback function
const observer1 = new MutationObserver( ( _mutationRecords, _mutationObserver ) => {

        _mutationRecords.forEach ( mutation => {
            switch ( mutation.type ) {
            
            case 'childList':
            if (    mutation.addedNodes[0].classList.contains(`errorlabel`) ) 
            {
///////////////////////////////////////////////////////////////////////////////

                console.log (`FIRST flashed message`)
                
                const observer2 = new MutationObserver ( (  __mutationRecords,
                                                            __mutationObserver ) => 
                {
                    __mutationRecords.forEach ( __mutation => {
                        
                        switch ( __mutation.type ) {
                        
                        case 'attributes':
                        console.log ( __mutation.oldValue )
                        if (    __mutation.attributeName == 'style'
                                && __mutation.oldValue.includes('-17px')
                            ) {

                            console.log ( `SUBSEQUENT flash message`)
                            window.open ( testUrl )
                        }
                        break

                        }
                    } ) 
                } ) 
                
                observer2.observe ( mutation.addedNodes[0], 
                                    { attributes: true, attributeOldValue: true} )

///////////////////////////////////////////////////////////////////////////////
            }
            break

            }
            // switch
        } )
        // forEach mutation
    }
    // callback
)
// new MutationObserver

// Start observing the target node for configured mutations
observer1.observe ( body, { childList: true } ) 
