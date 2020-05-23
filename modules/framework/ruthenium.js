'use strict'
const util      = require ( 'util' )
const reducer   = require ( './rutheniumReducer.js' )

const ruthenium = async ( LAMBDA_ARGUMENTS, MIDDLEWARE_QUEUE ) => {
    
    const initialData = Promise.resolve ( { // clunky but more explicit thatn async IIFE
        
        LAMBDA: {
            
            //  Things we must include because they are principal arguments of 
            //  Lambda invocation handlers.
            event:          LAMBDA_ARGUMENTS[0],
            context:        LAMBDA_ARGUMENTS[1],
            callback:       LAMBDA_ARGUMENTS[2],
            
            //  Things which may not be immediately obvious, which we should
            //  encourage developers to be aware of.
            inspectGlobal:  () => util.inspect ( global, { 
                depth:      Infinity, 
                showHidden: true
            } )
        },
        
        RU: {
            
            middlewares:    MIDDLEWARE_QUEUE.map ( m => m.name ),
            
            request:        {},
            
            signals:        {}, //  inter-middleware communications; 
                                //
                                //  for example,
                                //  to say something about the field 
                                //  (data.RU.response), instead of messing
                                //  it up with (data.RU.response.mySignal),
                                //  you may write (data.RU.signals.mySignal)
            
            io:             {}, //  data-sources and data-sinks may go here
            
            response:       {},
            
            errors:         []  //  stuff errors in here, then continue 
                                //  to let the next middleware process (data),
                                //  instead of short-circuiting the entire 
                                //  queue when a middleware throws an error;
                                //
                                //  we WILL later need a mechanism which gives
                                //  the developer an option to short-circuit,
                                //  but this is not currently the default
        }
    } )

    // reducer ( getHeaders, initialData  ), non-Promise goes in, Promise comes out
    // reducer ( getHeaders, business  ), Promise goes in

    return await MIDDLEWARE_QUEUE.reduce ( reducer , initialData )
}
module.exports = ruthenium

const mark      = require ( '../mark.js' )            
mark (`ruthenium.js LOADED`, true)

/*

* How this Software Framework was Named *

The letter after Lambda is Mu, which is nice and short, but it is also already
taken in the universe of software development framework names. Nu is a little
common as far as glyphs go in the English language. The letter Rho comes along a
little further on. Rhodium has the chemical shortform Rh, and its pronunciation
is not as sharp as I'd like a tool like this to be named. Ruthenium's symbol is 
Ru, and it speaks like the Mandarin Chinese character 入 (rù), "entry", which
looks like Lambda. No other software appears to be called Ruthenium, so I think 
we are all set here.

* How to Write Names in this Software Framework *

FILENAMES   follow nodeJS convention    :   so use camelCase

PROPNAMES   should avoid quotation marks:   so use camelCase

OTHERWISE   emphasise readability across encodings   

                                        :   so use kebab-skewer-satay-case

                                Examples:   HTML class names,
                                            HTTP headers
                                            
* How to Write Middleware in this Software Framework *

Wherever the cost is minimal, avoid dependencies between any two middlewares.

* How to Deploy Functions in this Software Framework *

-   ALWAYS use arrow function expressions (AFEs), UNLESS there is a specific 
    need to refer to a function as `this` from within its own body ... and to
    a less significant degree, if you need the function's `arguments` array.
    Heuristics: prefer terseness; explicitly state intentions.

-   ALWAYS use async functions, UNLESS there is a specific advantage to force 
    synchronous responses. Heuristic: prefer decoupling.
    
    -   Because middleware does I/O, it needs to call `await` in order to avoid 
        promise spaghetti, it can only call `await` if it is itself `async`.
        Currently all middleware is queued, and reduced with an accumulating 
        function. So, all middleware should be homogenised as `async`, to 
        simplify the logic of the accumulating function. 
        
    -   However, views are nested, and with the use of accumulating functions, 
        there evolves a need to use `await` on nearly other line. So in order
        to ease this part of development, we can do more I/O in middleware
        and avoid doing it in views, thereby allowing us to homogenise views
        as synchronous (with perhaps, a few yet to be determined exceptions).
    
-   Use generator functions ONLY when there is a specific need for such
    functionality. (Note added for completeness. Did we miss any other type of 
    function?)

* How to Deploy Promises in this Software Framework *

-   ALWAYS use the following taxonomy:

    (   Promise ( 
            ( resolveFn, rejectFn ) => {}   // an `executor`
            
        ).then(
            onResolved  ( value )   => {},  // a Promise is `settled`1
            onRejected  ( reason )  => {}   // a Promise is `settled`2
            
        ).catch(                            // sugared  .then()
            onRejected  ( reason )  => {}
            
        ).finally(
            regardless  ()          => {}   //  No argument is ever passed.
        )
    ) 
    
-   Do NOT use:     `fulfill`   in place of     `resolve` 

                        (   while `fulfill` is more historically correct, it is 
                            unfortunately contradicted by the ECMAScript 
                            specification choice of .resolve() as the relevant
                            method with its own name; 
                        )
                        
                    `resolved`  in place of     `settled`
                    `result`    in place of     `value`
                    `error`     in place of     `reason`

    Heuristic: prefer standards (the etymology is complex; I have a slide).

-   ALWAYS enter both arguments of Executors, and .then(), EVEN IF one argument
    will not be used. For minimal line noise, consider using `_`, `res`, `rej`, 
    `onRes`, `onRej`, `value => {}`, `reason => {}`. Heuristic: terseness; 
    explicitly deny options.

-   ALWAYS use `await`, and therefore `try { await } catch (e) { handler }`
    UNLESS some of the above is more succinct OR you don't have a wrapping 
    `async` function context. Heuristics: terseness; explicitly state 
    intentions.


*/