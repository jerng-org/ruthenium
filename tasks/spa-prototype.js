'use strict'

//  Provide a debuggable function name, 
//  in order to avoid debuggin (function).toString()

const rus = require('/var/task/modules/r-u-s.js')

const spaPrototype = async(data) => {

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




    rus.mark(`~/tasks/spa-prototype.js EXECUTED`)
}
// manipulate (data.RU), for example
// no need to return (data)

module.exports = spaPrototype
rus.mark(`~/tasks/spa-prototype.js LOADED`)


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


Draft 1 2020-07-26-EOD

ISSUE / DOMAIN OF CONCERN

-   To-date, this project appears to demand for the deprecation of the term
    "single page application" (SPA) where it is currently applied to
    [applications served from a URI, yet dependent on on-going updates from
    other URIs in order to achieve full functionality].

ALTERNATIVE PROPOSAL

-   The following terminology is introduced:

    -   server-initiated-application-client (SIAC) referring to client-side code
        which is

        -    first sent as a response from a server to a client,

        -    then deployed on the client, and

        -    then remains dependent on the server for updates in order to become
             and remain fully functional *

    -   server-hosted-application-updates (SHAU) referring to requests and
        responses from the SIAC to the server, which enable ongoing
        functionality of the SHAU [* as a delivery mechanism to the end user,
        for the entire application's function]

    -   (placeholder for other terms)

-   On the client side, any [user interface (UI) element] in any [presentation
    context (view, medium)] of a SIAC must be mapped to a uniform resource
    identifier (URI). Presentation contexts must be treated as discrete
    resources thusly.
        
-   On the server side, the routing table should not merely map the URI to a
    [code block], rather it should additionally map to all [resources] touched
    by that code block.
    
-   Once this is accomplished, you can run a SHAU-protocol ... have it fail
    :red_circle: on a specific URI request, and then nearly seamlessly downgrade
    to a HTML-only-protocol, but still return to the user the relevant
    [presentation context] which  they were previously in, when they interacted
    with the failed URI request ... just this time, it is fully reloaded from
    the server.

URIs should thus include:
        
-   a resource TREE;
    
    -   the resource at the root of this tree must be a "medium";

    -   all other resources in the tree may be either another medium, or a
        "concept" (datum);
        
    -   each resource in the tree may be mapped on the server side to "default
        sub-resources" (allowing shorter URIs); these defaults can be
        overwritten by "explicit sub-resources" (requiring longer URIs); a
        grammar for this must be defined;

        -   when a sub-resource is a medium, we may refer to it as a
            "sub-medium";

        -   a resource which is a "concept" may not have a sub-resource which is
            a medium (except for example, when the medium is stored as
            serialised data/concept); so only media can have sub-media; we may
            refer to these parents as super-media;

        -   each "sub-medium" must be rendered within a designated "sub-medium
            slot" in its super-medium; there should be defined, a "default
            sub-medium slot" where sub-media will be rendered,in the absence of
            an "explicit sub-medium slot" (URI lengths again, will vary
            accordingly); again a grammar must be defined;

    -   each medium in the tree should be mapped on the server side to a
        "default concept" (minimally a null), again mapped to a "default concept
        rendering function" (minimally a toString().print()); again, explicit
        overrides shall allow the alternative usecases;

-   the term "configured" is introduced here as an alternative to the term
    "defaulted" as used above with regards to sub-resources in a tree

-   URIs containing trees may become long and messy; this is partially mitigated
    by the necessary "default concepts", and the optional "default media"; yet,
    sub-trees of resources may be repetitively used in "configured" trees;

    -   in order to further enable the shortening of URIs, we introduce a lookup
        table with "subtree shortnames" as keys and "resource sub-tree names" as
        values, saving space at the expense of computation-time;

The application ROUTER

-   then dereferences all subtree shortnames from a URI, and identifies the
    requested resource tree in its most reified form;

-   then maps the requested resource tree to code blocks (operations) which will
    construct the requested resource accordingly;

-   SHAU request URIs must include reference to the entire resource tree which
    represents the end user's current "presentation context", whereas the
    request might call for a CRUD operation only upon a specific sub-resource of
    that presentation context;

    -   In such a case, it would/could be correct to notate the sub-resource
        request as a URI query parameter, and to notate the resource tree in the
        URI path


EXPERIMENTAL SEMANTICS FOR RESOURCE TREES 2020-07-27-EOD

    PREVIOUS    :   ?route=some-task-name-that-looks-like-a-hyphenated-slug
    
                    ... is subsequently mapped to a code block, which may call
                        other code blocks;
    
    PERHAPS     :   
    
        {
            resourceName1: {
                
                composer:   'address-of-code-block-which-renders-(default/configured)-CONCEPT',
                
                    <<  should have a parameter, __concepts, whose arguments look like this: 
                        {
                            slotName1:  slotName1Concept,
                            slotNameTo: slotNameToConcept,
                            slotNameN:  slotNameNConcept
                        }
                    >>
                    
                slots :     [ a list of slot names ],
                
                    //  when none are provided, a default is used
                
                subs :      [ 
                    
                    a list of 
                        -   named resources     << strings >>
                        -   literal resources   << functions >>
                ]

                    //  when none are provided, a default is used
                
            }
        }
        
        This, roughly, seems to allow rapid drafting of "crude routes" which 
        obfuscate their sub-resources, while enabling incremental refinement of
        routes into "fine routes" where every sub-resource is finally minutely
        defined.
        
        It looks like it might eventually jive with whatever the fuck the 
        Web Components specification was supposed to do, but that is yet to be
        determined.
        
        The routing table then becomes a one-layer-deep map of canonical
        names for resources, and the literal resources themselves.
        
        The router module then iteratively traverses the routing table in order
        to dereference canonical names, and to determine the final tree of 
        literal resources.
        
        Within this framework then, the "proper" way to do AJAX updates is to
        first delineate the sub-resource with its own canonical name, and then
        to configure clients to send requests to the server with BOTH the root
        resource name, and an indication of which specific sub-resource needs
        to be updated.
        
        The server then remains in control of the client, and is additionally
        able to send a response to (a request for a sub-resource) which is 
        powerful enough to reset the root resource, or any resource in between
        the root and any leaf.

TEST: Example of parsing example data structure, using example semantics:

    GIVEN a routing table :
    
    routingTable = {
    
        aGreatParty: {
            composer: 'a-great-party-markup',
            slots: [
                'thePool',
                'theMusic',
                'thePeople',
                'theFood'
            ],
            subs: [
                'thePool',
                'theMusic',
                async _ => '(Jim, Jane, Jeddah, JiongSun, Jemimah)',
                // async _ => '(food: cheese, dumplings, fruit)' // a missing sub-resource
            ]
        },
        
        thePool: {
            composer: 'the-pool-markup',
            slots: [
                'theFloatyToys', // missing from 'the-pool-markup'
                'theCandles',
                // 'theSlide' // a missing resource-slot ...
            ],
            subs: [
                async _ => '(floaty toys: a unicorn, a duckling, and a sea monster)',
                async _ => '(candles: scented, coloured, and self-igniting)',
                async _ => '(a slide: slippery as can be)'
            ]
        },
        
        theMusic: {
            // composer: 'the-music-markup', // missing composer function ...
            slots : [
                'song1',
                'song2'
            ],
            subs : [
                async _ => '(song1: falala)',
                async _ => '(song2: feefifofum)'
            ]
        }
        
    }
    
    ... first on application initialisation, the routingTable must be validated
        against the following validation rules (as processed by validation.js):
        
        {
            // CONTINUE WORK HERE
        }
    
    ... and GIVEN an HTTP request for the resource "aGreatParty", we would 
    expect an implementation of (some-router.js) to proceed as follows:
    
        1. dereference the resource:
        (discover if the resource can be found in the routingTable, and if it 
        can, then prepare its sub-resource Functions for execution)
        
            << is resourceName in routingTable ? >>
        
            FALSE: reject('requested resource not found')
            
            TRUE: go to (2.)
        
        2. dereference sub-resources:
        << for subResource of routingTable.aGreatParty.subs >>
            
            2.1. << if typeof subResource is Function >>

                TRUE : exit; the goal of 1. is achieved

                FALSE : go to (2.2.)

            2.2. << if typeof subResource is String >>

                TRUE :  go to (1. with regards to this string; it is treated as 
                        a resourceName, and sought for as a key in routingTable 
                        ); so this needs to return an (async function).
                        

                FALSE : reject('subresource defined in routing table as neither
                        a Function nor a String; unacceptable; please fix;')


// NO EXECUTION UNTIL DISPATCHER KICKS IN

        x. execute all sub-resource getters

//  2020-08-04 Notes

    Reference:
    https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm

    Documentation on REST indicates that in the REST style, the canonical 
    synonym for "medium" above is "representation". The model provided is,
    
    [resource] 
    ->  [representation: in a specific MIME type; can be a "composite media type"] 
        ->  [response: from server to a request]
            ->  [client: which sent the request for the resource]
    
        !!! NOTE !!!    In the MIME specification, the only two "composite
                        media types" are "multipart" and "message"; however
                        we can develop the concept of "text/prs.tree", 
                        "text/prs.branch", "text/prs.leaf" etc.
                        
            RFC 2045    "
   An initial set of seven top-level media types is defined in RFC 2046.
   Five of these are discrete types whose content is essentially opaque
   as far as MIME processing is concerned.  The remaining two are
   composite types whose contents require additional handling by MIME
   processors.

   This set of top-level media types is intended to be substantially
   complete.  It is expected that additions to the larger set of
   supported types can generally be accomplished by the creation of new
   subtypes of these initial types.  In the future, more top-level types
   may be defined only by a standards-track extension to this standard.
   If another top-level type is to be used for any reason, it must be
   given a name starting with "X-" to indicate its non-standard status
   and to avoid a potential conflict with a future official name."
   
        RFC 2048    "2.1.3.  Personal or Vanity Tree

   Registrations for media types created experimentally or as part of
   products that are not distributed commercially may be registered in
   the personal or vanity tree.  The registrations are distinguished by
   the leading facet "prs.".

   The owner of "personal" registrations and associated specifications
   is the person or entity making the registration, or one to whom
   responsibility has been transferred as described below.

   While public exposure and review of media types to be registered in
   the personal tree is not required, using the ietf-types list for
   review is strongly encouraged to improve the quality of those
   specifications.  Registrations in the personl tree may be submitted
   directly to the IANA."
   
                    Examples of which are provided:
                    
                        https://en.wikipedia.org/wiki/Media_type
                    
        This can be formalised to 2.1.2 : Vendor Tree, prefix "vnd.", later.
    
    
    , hence:
    
    Following up on [a question raised on 2020-07-29 about MIME types], and 
    modified by [the observations on 2020-08-04 about the term REPRESENTATION] 
    : we need two routing tables.
    
        (MIME types refer to TYPES OF REPRESENTATIONS, not TYPES OF RESOURCES.)
    
        Routing Table 1 :   Terminates in REPRESENTATIONS of various MIME types.
        
        Routing Table 2 :   Terminates in REPRESENTATIONS of a MIME type of 
                            << text >>
        
            Reference : https://tools.ietf.org/html/rfc2046#section-4.1

        For all practical purposes, we should prototype this first, and seek to 
        generalise it to other MIME types later if the prototype is successful.
        
        It should also be noted that << text/html >> is able to carry data URIs.

    Therefore:
    
    aRoutingTableMappingResourceNamesToTextualRepresentationDescriptionObjects = {

        //  Below is an example of one  << RESOURCE name >>
        //  and one                     << textual REPRESENTATION descriptor >>
        
        aResourceName 
        : {
            
            aStringREFERENCEToCodeThatReturnsATextRepresentationOfTheResource 
            : 'aRepresentationalOperationName',
            
                //  Trivial example: 'toString'
            
            anArrayOfStringREFERENCEsToSlotsInMediationCodeWhereResourcesWillBePassedIn 
            : [ 'aSlotName' ],
            
            anArrayOfStringREFERENCEsToResources 
            : [ 'anotherResourceName' ]
        }
    }

    Recap:
    
                CLIENT:
        
                << HTML FORM REQUEST : METHOD : only POST, or GET >>
          +---- (1) Client has these limitations;
          | 
          |     << ARBITRARY HTTP REQUEST : METHOD : any official HTTP method >>
          |     (2) We want our server to accept this;
          |      |
          |      |
      (4) |      v
          |     
          |     SERVER (hereon):
          |
          |     (3) We can build around 2. to establish an [intermediate form];
          |                                                                       
          |      ^  |                                                       
          |      |  |                                                       
          +------+  |
             +------+
             |                                                               
             |  (4) Limited clients can have their requests mapped to the    
             |      [intermediate form];                                     
             |                                                               
             +---+
                 |
                 v
                                                                            
                (5) Based on the [intermediate form], the server then picks 
                    a response strategy (such that one application may       
                 |  by design allow responses in different strategies);
                 |  
                 |  (5a) simple HTTP - the only requirements are that
                 |       responses are HTTP specification compliant;
                 |       
                 |  (5b) RESTful - in addition to HTTP protocol, responses
                 |       must also follow the REST architectural style;
                 |       
                 |  (5c) Other examples: SOAP, CORBA, Teapot, etc.
                 |
                 v

                (6) Based on the [intermediate form], the server then picks 
                    a response MIME type; the treatment of certain individual 
                 |  MIME types may be implemented by the same block of code,
                 |  under different strategies selected at (5); other individual
                 |  MIME types may have different implementations, under 
                 v  different strategies;
                     
                (7) Based on (5,6), a ROUTER determines the code-path for the 
                    response.
                    
                     |
                     v
                     
                    (7?-text) If the MIME type was text, then a special feature
                              follows:
                              
                              the requested resource is intepreted not as an
                              atomic ('discrete') resource, but as a tree of
                              resources;

                              Refer to 2020-07-27-EOD; 
                              
                              // CONTINUE WORK THERE
                
                (8) Based on (7), a DISPATCHER executes the code-path, and any
                    sub-routines determined by the routed code-path;
                    
                    //  where can the following be set?
                    
                        //  HTTP response HEADERS (particularly, STATUS CODE)
                        //  HTTP response BODY




















*/
