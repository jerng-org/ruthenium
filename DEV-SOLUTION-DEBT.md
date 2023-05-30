# CURRENT :

- io/models/X validation isn't linked to form input names, but it should be

- Security: (data) object should probably not get passed lock-stock-barrel to markup files.

- (http-METHOD) validation models COULD possibly ADDITIONALLY
                automatically check other models (e.g. after the (http-patch.js)
                validation check is positive, it could additionally check 
                subfields for the (desk-schemas) if that was the resource being
                PATCHed).

- Route should be properly documented in (data.RU)

- 1. Abandon RESTful approaches, temporarily.
                
                2. Turn focus to making virtual tables work (desks).

- Perhaps the best way to nested guards is with (x in object),
                and perhaps we thus need a routing table, or a routing tree 
                object.

- Oidc does not fail on bad code (bug)

- Rendering options, to be REQUESTED by the client:
                (a) all server responses are HTML
                    -   (a.1) a HTML response can INVITE the client to switch 
                        to protocol (b)
                (b) all server responses are JSON
                    -   (b.1) a JSON response can INVITE the client to switch
                        to protocol (a)
                        
                We need to investigate how the history API achieves simultaneous:
                    -   display of URI-x in the navigation bar
                    -   no      request of URI-x from the client
                    -   actual  request of URI-y from the client
- ,

- UUID4 to base64 !

- Refactor (DESK-SCHEMAS id to become name)

- There should be a (task stack) so that we can trace tasks?

- make ?type=(singular) : desk-schemas -> type=desk-schema

- (desk) CRUD ... (desk-cells- xx .js)
                
                CONSIDER renaming API endpoints (not storage structures):  
                
                    (desk-schemas)  ->  (desks)
                    (desk-cells)
- ,

- cognito - sign-out link; persistent session store, and related policy, next.

- single-page-app framework; history API

- (statustep-functions/s-xxx.js) implement a custom message passing mechanism.

- memory link; redirect to attempted URI after login

- risk manage: billing attacks, for DynamoDB / Lambda / APIGW layers

- 
            
# BACKLOG :

- linking to route=initial involves one layer of indirection, as the
                server redirects the client; REARCHITECTURE this.

- (lastGuard.js) needs to be updated to disallow certain
                responses that Lambda allows (like JSON).

- Some ideas for form builders: https://www.facebook.com/groups/railsrocks/permalink/10151412423849957/

- Currently, (router.js)'s (despatcher phase) calls a (task), and
                that (task) may be manually programmed to call other (tasks); but 
                there is no generic way for tasks to call tasks - should there
                be one? Or is this something we leave to the programmer?
                
                    Example of mess: we are (require)ing (status-xxx) tasks in
                    other (task)s and (middleware)s.

- redirect loop detection

- https://developer.mozilla.org/en-US/docs/Web/Security/Types_of_attacks

- https://developer.mozilla.org/en-US/docs/Glossary/HSTS

- development of validation.js features is ongoing via ~/tasks/virtual/desk-schemas-post.js

- Whole class of problems:
                -   whether to use ES/JS proxies (language specific!) to 
                    automatically anotate data;
                -   example:  writes to (data.RU.signals) should be signed by 
                    the writer; perhaps via a non-enumerable property

- GET method forms are not yet supported by (form middlewares);

- DECOUPLE: (compose-response.js) should be broken up into multiple 
            middlewares also

- Compliance=Weak mode which decreases performance but increases 
            accepted spelling varieties for things like field names

- Test how require() maintains modules in memory, between function 
            calls;

- Modify the architecture of (the entire framework) such that it 
            behaves more like a library; then again, the trade off always is how 
            much it behaves like a cage, while feeling like a prairie.

- sessions.js: look for a SCOPE in an unexpired access_token;

- Examine the pattern which would allow throwing an exception in any
                middleware, to be checked for safety, then sent to Lambda as the response 
                via ( middleware -> reducer -> ruthenium -> Lambda handler);

- devise a mechanism where the reducer hides (data) from being
                returned to (index.js) by default, UNLESS (lastGuard.js)
                is installed. #security

- Addressing the issue: (modulesA) which are (require)d by (rus)
                cannot call (rus.moduleB): we can resolve this (a) dynamically
                where (modulesA.method(_RUS, ... OTHER_ARGUMENTS) or (b) by
                establishing a (pre-rus) of some sort; I haven't looked into
                this

- 
            
ICEBOX :

- v2:
                
                -   Tunneled form methods should be in REQUEST HEADERS or
                    HIDDEN INPUT ELEMENTS not in URI
                    
                    -   Also E-tags; PUT If-Match, etc. for optimistic 
                        concurrency control (locking); framework wide;
                    
                    -   Also CSRF tokens
                
                -   Probably no WebDAV, unless, we FIRST figure out a morphism
                    which uses JSON (popular) instead of XML (unpopular) wtf
                
                -   MIME multipart content for 1->N request->response-representations;
                
                -   CSRF (middleware?)
                
                -   Etags for updated data; also see "last modified" header;
                    (middleware?)
                
                -   Clean up the data model : 
                
                    -   a conceptually discrete RESOURCE can be intrinsically
                        a COLLECTION OF OTHER RESOURCES
                        
                    -   clear delineation of :
                
                        -   RESOURCEs;                  
                        
                            -   RESOURCE METADATA;
                        
                        -   resource REPRESENTATIONs;   
                        
                            -   resource REPRESENTATION METADATA
                            
                    -   Lee (1997) defines metadata as being machine readable
                    
                    -   URIs should not include HTTP METHODS (perhaps except
                            when we have to tunnel weird methods over
                            form-POSTs) (RFC 7231.2) !!! NO VERBS !!!
                                
                    -   Unsafe Methods, full scope (listed by increasing complexity)
                    
                        -   DELETE  : delete                                any entire RESOURCE
                        
                        -   PUT     : create / update                       any entire RESOURCE
                        
                        -   PATCH   : create / update / delete 
                                                      CHILD-RESOURCES of    a COLLECTION-RESOURCE
                        
                                    :   or                                  any entire RESOURCE
                        
                        -   POST    : create a CHILD-RESOURCE of            a COLLECTION-RESOURCE
                                    
                                    :   or                                  any entire RESOURCE
                                    
                                    :   POST is messy because HTML 
                                        only supports POST as a tunnel for
                                        PUT, PATCH, and DELETE
                                        
                    -   Unsafe Methods, reduced scope, Approach 1.1. (updated):
                    
                        -   Since POST's unique characteristic is that it is the 
                                only unsafe (RFC 2612) method supported by HTML,
                                we *may* feasibly scope the role of POST to
                                the tunneling of other methods, such that it 
                                interpreted to have no other use on its own;
                                
                        -   In this approach: 
                        
                            -   POST    : performs no CRUD operations 
                            
                            -   DELETE  : deletes
                                            : any entire RESOURCE
                            
                            -   PUT     : creates / updates
                                            : any entire RESOURCE
                            
                            -   PATCH   : creates / updates / deletes
                                            : CHILD-RESOURCES of
                                                a COLLECTION-RESOURCE
                                        
                                        : recursively, semantics for child C_ UD
                                            should be precisely like    - PUT
                                                                        - DELETE
                                                                        
                                        : custom semantics for arbitrary
                                            verbs/operations should be allowed,
                                            e.g. INCREMENT_BY_ONE
                                            
                                            ... however that is beyond the scope
                                            of a standard interface definition,
                                            at this time.
- ,