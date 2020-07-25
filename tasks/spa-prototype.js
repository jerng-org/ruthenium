'use strict'

//  Provide a debuggable function name, 
//  in order to avoid debuggin (function).toString()

const rus = require ( '/var/task/modules/r-u-s.js' )

const spaPrototype = async ( data ) => {

    // YOUR CODE HERE
    
    // set data in ( data.RU.io.thisIsMyName )



    data.RU.signals.sendResponse.statusCode = 200
    data.RU.signals.sendResponse.body =

// string begins
`
<h1>Single-page App Prototype</h1>

<script>
</script>
`
// string ends




    rus.mark ( `~/tasks/spa-prototype.js EXECUTED` )
}
// manipulate (data.RU), for example
// no need to return (data)

module.exports = spaPrototype
rus.mark ( `~/tasks/spa-prototype.js LOADED` )


/*

WHAT

    So historically ... they went from
    
    -   SSR-only, to
    -   SSR-with-AJAX updates, to
    -   SPA-with-AJAX updates :star:, to
    -   SPA-with-SSR-with-AJAX updates :skull:
    
    The result seems to be that SPAs :star:  aren't generally designed to be 
    extensions of [pre-SPA-SSR] ... and then [SPA-SSR :skull:] is all about 
    this SPA :star: that wasn't designed with pre-SPA-SSR in mind. I'm currently 
    thinking about how the traditional pre-SPA-SSR could be incrementally 
    transitioned to SSR-with-SPA-with-AJAX-updates :rotating_light: which may be
    different from :skull: depending on what the study uncovers.

Questions

    -   Is the CSRF token planted in the client's cookie on login?

Examples
    
    1.      User READs a table (all the shoes)
    
    1.1.    User wants to CREATE a shoe
    
            (a) Client requests a form, server responds with a form, including 
                UUID4
            (b) Client recalls a form (from sessionStorage), generating UUID4
            
    PUT : Client requests via PUT, including:
            -   CSRF token
            -   new shoe data
            -   new UUID4
            -   "prior context" 
                -   if the SPA does a "create in place" then the URI sent to the
                    server should be for (1.), with some guarantee that the NEW 
                    shoe would be among the results (though in this example, it
                    is not necessary that OTHER results would be the same in both
                    HTML and JSON responses, as there's no query parameter
                    requiring a specific sort order for results.)
            
            -   // MORE STEPS PENDING 
            
            !!! WARNING !!! as pointed out by JayJun (2020-07-25), pure HTML
            forms cannot use PUT. Perhaps then since we are patching PATCH for
            idempotence, we should just patch POST and be done with it.
            
    1.2.    User wants to UPDATE a shoe
    
            Client requests a form
            (a) Server sends a form, including 
                -   shoe's latest state, including READ TIME, from a STRONGLY
                    CONSISTENT read
            (b) Client recalls a form (from sessionStorage), server sends JSON
                including
                -   shoe's latest state, including READ TIME, from a STRONGLY
                    CONSISTENT read
                
    PATCH : Client requests via PATCH, including:
            -   CSRF token
            -   ONLY DELTAS to shoe data
            -   the previously responded READ TIME (this adds IDEMPOTENCE)
            -   "prior context" 
                -   if the SPA does an "update in place" then the URI sent to the
                    server should be for (1.), with some guarantee that the 
                    UPDATED shoe would be among the results (though in this example, it
                    is not necessary that OTHER results would be the same in both
                    HTML and JSON responses, as there's no query parameter
                    requiring a specific sort order for results.)

            -   // MORE STEPS PENDING 
            
            Server fails the response, if shoe's UPDATED time is more recent
            than the previously responded READ TIME.
     
            -   // MORE STEPS PENDING 
            
    PUT : We DO NOT use PUT because ... it consumes more bandwidth between
            client and server (even though it requires more hits to the database)
            
    1.3.    User wants to DELETE a shoe
    
            Client requests a form
            (a) Client his a button on (1.)
            (b) Client recalls a form (from sessionStorage)
                
    DELETE : Client requests via DELETE, including:
            -   CSRF token
            -   "prior context" 
                -   if the SPA does an "update in place" then the URI sent to the
                    server should be for (1.), with some guarantee that the 
                    DELETED shoe would not be among the results (though in this example, it
                    is not necessary that OTHER results would be the same in both
                    HTML and JSON responses, as there's no query parameter
                    requiring a specific sort order for results.)
    
            -   // MORE STEPS PENDING 
            
    1.4.
    POST : we do not use POST because it lacks idempotency
    
*/
