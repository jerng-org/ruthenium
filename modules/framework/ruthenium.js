'use strict'
const reducer   = require ( '/var/task/modules/framework/ruthenium-reducer.js' )

const ruthenium = async ( HOST_INITIALIZED_DATA, MIDDLEWARE_QUEUE ) => {
    
    const frameworkData = {
            
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

    HOST_INITIALIZED_DATA.RU = frameworkData

    const initialData = Promise.resolve ( HOST_INITIALIZED_DATA )
                        // clunky but more explicit thatn async IIFE

    return await MIDDLEWARE_QUEUE.reduce ( reducer , initialData )
}
module.exports = ruthenium

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

VARNAMES,
PROPNAMES   should avoid quotation marks:   so use camelCase

FILENAMES   follow nodeJS convention    :   so use kebab-skewer-satay-case

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

* How to Refer to Data in this Software Framework *

Broadly, there are Types and Things. Whenever referring to a Type in English,
use the plural form. This is in order to deliver the semantics that a Type has
no meaning outside of the Things which are its individual instances. Types
therefore are roughly, Platonic Forms.

    Therefore,              "Schemas" refers to the class of things which share
                            common traits, or schema-ness. A single schema is
                            simply one such Thing.

* Mapping Routes to Tasks in this Software Framework *

There exists a middleware (router.js) which maps (request parameters) to (tasks)
where (tasks) are what we call the (units of work, or business logic, which
are being requested of the system by the user). A (default mapping) exists in
(router.js), and a (custom mapping) is explicitly defined as (undefined). As
long as the (custom mapping) variable is falsy, (router.js) will use the 
(default mapping).

* How to group Files and Folders in this Software Framework *

FOLDERS ONLY:

    /var/task/     
     |
     +- modules/
     |  |
     |  +- framework/   
     |  +- middlewares/ 
     |
     +- tasks/      
     |  |
     |  +- (a complex task's folder)    
     |  |  |
     |  |  +- (subfolders)              
     |  |
     |  +- restful/                     
     |
     +- markup/ 
     |
     +- io/
        |
        +- blobs/  

FOLDERS & FILES:

    /var/task/  
     |
     +- index.js    
     +- modules/    
     |  |
     |  +- framework/   
     |  |  |
     |  |  +- ruthenium.js          
     |  |  +- ruthenium-reducer.js  
     |  |
     |  +- middlewares/ 
     |     |
     |     +- HOST_LABEL-*.js           
     |     +- tunnel-restful-forms.js   
     |     +- router.js                 
     |     +- composeResponse.js        
     |     +- lastGuard.js    
     |
     +- tasks/      
     |  |
     |  +- (a complex task's folder)    
     |  |  |
     |  |  +- index.js                  
     |  |  +- markup.js
     |  |  +- x-in-y.js
     |  |  +- (subfolders)              
     |  |
     |  +- (a simple task).js           
     |  +- restful/                     
     |  
     +- markup/ 
     |  |
     |  +- (a simple task)-markup.js    
     |  +- (any other markup name).js   
     |  
     +- io/         
        |
        +- blobs/  

FOLDERS & FILES, ANNOTATED:

/var/task/      ... is in the Lambda HOST environment, our system folder (~);
 |
 +- index.js    ... is in the Lambda HOST environment, the entrypoint for our 
 |                  system, where HOST_INITIALIZED_DATA and MIDDLEWARES are 
 |                  configured, and passed by calling (ruthenium.js);
 |                  HOST_INITIALIZED_DATA is passed as (data.HOST_LABEL)
 |
 +- modules/    ... is for (code blocks) which each do specific things;
 |  |
 |  +- framework/   ... is where runtime-agnostic abstraction should begin;
 |  |  |
 |  |  +- ruthenium.js          ... is called by the HOST environment;
 |  |  |                            initialises (data.RU);
 |  |  |
 |  |  +- ruthenium-reducer.js  ... is called by (ruthenium.js)
 |  |                               and is responsible for moving data from the
 |  |                               HOST, through the chain of middlewares, and 
 |  |                               finally back to the HOST;
 |  |
 |  +- middlewares/ ... is where middlewares are stored; but not configured;
 |     |
 |     +- HOST_LABEL-*.js           ... such-named middlewares are specific to 
 |     |                                the HOST;
 |     |
 |     +- tunnel-restful-forms.js   ... to support the CULTURE of (restful)
 |     |                                access, HTML forms are provided with
 |     |                                a way to signal that they are CULTURALLY
 |     |                                identified with a HTTP method that is
 |     |                                other than POST or GET;
 |     |
 |     +- router.js                 ... maps (request parameters) to (tasks);
 |     |                                executes the respective (tasks);
 |     |
 |     +- composeResponse.js        ... prepares a generic (data.RU.response) 
 |     |                                which may require another middleware to 
 |     |                                make it digestable to the HOST;
 |     |                                no such middleware is required by the
 |     |                                Lambda HOST;
 |     |
 |     +- lastGuard.js              ... catches errors, and is the framework's
 |                                      last chance to perform any security 
 |                                      checks and measures on 
 |                                      (data.RU.response) before it is handed
 |                                      back to the HOST;
 |
 +- tasks/      ... various generic tasks such as (restful.js) and 
 |  |               (send-blob.js) are defined here. (initial.js) is also 
 |  |               defined here, where it basically functions as the homepage
 |  |               task ... you will probably customise it.
 |  |
 |  +- (a complex task's folder)    ... COMPLEX TASKS:
 |  |  | 
 |  |  |                                if more than one file is needed for a
 |  |  |                                (task), please put those files under an 
 |  |  |                                appropriately named folder;
 |  |  |
 |  |  +- index.js                  ... the entry point for this (task) should
 |  |  |                                be in the folder's (index.js), not to
 |  |  |                                be confused in this documentation with
 |  |  |                                the (~/index.js) overall system entry 
 |  |  |                                point.
 |  |  |
 |  |  +- markup.js                 ... the (markup) or (view rendering logic)
 |  |  |                                should be in the folder's (markup.js)
 |  |  |
 |  |  +- x-in-y.js                 ... see 
 |  |  |                                (~/markup/(any other markup name).js);
 |  |  |
 |  |  +- (subfolders)              ... in general, a (task folder) should have
 |  |                                   no more than seven (7) files;
 |  |                                   when you find yourself creating the
 |  |                                   fourth (4th) file in a (task folder), 
 |  |                                   consider adding a deeper subfolder;
 |  |
 |  +- (a simple task).js           ... SIMPLE TASKS:
 |  |
 |  |                                   (tasks) defined in (~/tasks) should
 |  |                                   not locate their respective (markup)
 |  |                                   files in this folder;
 |  |                                   (composeResponse.js) will automatically
 |  |                                   look in the folder (~/markup) for their 
 |  |                                   corresponding (markup) files;
 |  |                                   
 |  |                                   For Example:    if, given a (task) file
 |  |                                                   (~/tasks/bumble.js),
 |  |                                   then, (composeResponse.js) will look for
 |  |                                   (~/markups/bumble-markup.js).
 |  |
 |  +- restful/                     ... this (complex task folder) is for the 
 |                                      (tasks) which are supposed to be
 |                                      culturally RESTFUL (restfulness is an 
 |                                      option, not a requirement);
 |
 |                      NAMING RESTFUL TASK FILES AND FOLDERS :
 |
 |                      (TYPE_PLURAL)-(HTTP method) is the general pattern;
 |                      E.g. "desk-schemas-get" refers to a (task) which
 |                      should be mapped to a GET HTTP method, and it should
 |                      refer to some (data type) which is a desk schema;
 |   
 +- markup/ 
 |  |
 |  +- (a simple task)-markup.js    ... please read ~/tasks/(a simple task).js;
 |  |  
 |  +- (any other markup name).js   ... these constraints are undefined;
 |                                      it is strongly encouraged that you
 |                                      derive semantic relevance from file names
 |                                      for example (child-in-parent.js), 
 |                                      (descendent-in-ancestor.js), 
 |                                      (leaf-in-branch.js) with DOM selector
 |                                      strings referring to nested elements;
 |
 +- io/         ... any code pertaining to ex-framework entities such as 
    |               databases, other HTTP endpoints, other sinks or sources;
    |               keep reusable code here, and (task)-specific code in 
    |               (tasks);
    |
    +- blobs/   ... static assets / files go here;

* How to Write Inline ECMAScript Handlers in this Software Framework *

DOM elements may have [onclick] or other attributes which implicitly attach
event handler scripts to such elements. For such handlers, whenever possible:

-   Separate code into (prepare) and (perform) stages.

-   Cache the results from (prepare) in the DOM node, via the (this) variable.

    Pseudocode example:     onEvent =   "   // PREPARE
                                            if (  ! this.preparation ) {
                                                this.preparation = 'something'        
                                            }
                                            
                                            // PERFORM
                                            echo this.preparation
                                        "
-   We expect this this advice will change when we get around to implementing a 
    document-wide or global-esque state manager
*/