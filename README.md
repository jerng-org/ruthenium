# ruthenium

-   [Technical Documentation](./DOCUMENTATION.md)
-   [Motivations](./MOTIVATIONS.md)  
    **Excerpt:**
    ```
    The following nouns are asserted to being equivalent for the purpose of this README:

    -   software framework
    -   software development kit
    -   software design pattern
    -   kit (for brevity)
    
    Kit

    This kit addresses the complexities of developing web applications.

    This is meant to be a language-agnostic and runtime-agnostic kit. This kit 
    may be implemented in any / many languages and runtimes.
    ```

## roadmap

```
2020-07-13

ARCHITECTURAL NOTES

Layers for consideration:

    1.
    SERVER INFRASTRUCTURE
    
    1.1.
    -   Microprocessor Architecture & other Hardware: generally not a problem.

    1.2.
    -   Operating Systems: generally a minor problem in 2020, as much of these
        traditional issues seem to have become abstracted into the Cloud
        Provider layer - or maybe it's just that most people use a Linux of 
        some sort these days.

    !!! v v v v !!!
    !!! WARNING !!!
    !!! v v v v !!!
    
    1.3.
    -   Cloud Providers: platform-specific environmental variables, such as
        special API gateway HTTP parsers, FaaS runtime idiosyncracies,
        cloud-specific data stores / caches.
    
    1.4.
    -   Language Runtimes: a language runtime determines the programming
        language rules which codify the instructions which will finally be 
        executed on a microprocessor; language runtimes are effectively
        frameworks for abstracting over microprocessor instruction architecture;
        the language runtime is usually selected by the developer. 
        
        An explosion of complexity in software begins here; Language Frameworks 
        are actually a subclass of the programming language layer, and should 
        not be considered separately - language frameworks are additional rules
        which limit the acceptable forms of code in a language, in the same way 
        that language runtimes limit the acceptable forms of characters which
        may be compiled/interpreted to microprocessor instructions.
        
    1.5.
    -   Storage Runtimes: filesystems, databases, caches, queues,

    !!! v v v v !!!
    !!! WARNING !!!
    !!! v v v v !!!
    
    2.
    CLIENT INFRASTRUCTURE

    2.1.
    -   Standards Gatekeepers: W3.org RFCs, TC39, Browser vendors.

    2.2.
    -   Native Mobile Vendors
    
Addressing issues 1.3. - 1.5.:

    3.
    A Language Runtime Agnostic Design Pattern
        
    -   This would be a framework for abstraction over the Standards
        Gatekeeper layer.
        
    3.1.
    -   A platonic data structure which is flexible enough to be implemented
        in various language runtimes (1.4.), easily; it must also be reasonably 
        efficient to store in various storage runtimes (1.5.)
        
        3.1.1.
        -   A DSL for representing business data; query format; result format.
            (This particular item is a bit scary and seems like a potential
            time-suck.) !!! WARNING !!!
        
    -   Of course, only a subset of all 1.4. and all 1.5. would be expected to
        be compatible with 3.1.
    
    3.2.
    -   Encapsulation of code, which enables isometric implementation of 
        operations upon data ("computation"), regardless of language runtime
        and storage runtime.
    
    4.n.    
    A Language-specific Implementation of 3.

Chart of 3.

        Pick a              Pick a
        Cloud               Language Runtime
        [1.3.1.]   +--------[1.4.1.]--------+
        [1.3.2.]---+        [1.4.2.]        |
        ...        |        ...             |
        [1.3.n.]   |        [1.4.n.]        |
                   |                        |
                   |                        |
                   |        Pick a          |
                   |        Datastore       |
                   |        [1.5.1.]        |
                   +--------[1.5.2.]        |
                            ...             |
                            [1.5.n.]        |
                                            |   Use the 4. which
                                            |   fits your chosen
                                            |   Language Runtime
                                            +---[4#1.4.1.]

        [4#1.4.1.   for example, would have been written with the following
                    considerations:
        
                    -   agnostic with regards to any 1.3.
                    -   agnostic with regards to any 1.5.
                    
                    Therefore, it should have:
                    
                    -   IO interface with 1.3.
                        -   inputs accept only  3.1.
                        -   outputs are in      3.1.
                        
                    -   IO interface with 1.5.
                        -   inputs accept only  3.1.1.
                        -   outputs are in      3.1.1.
                    
                    INTEGRATIONS:
                    
                    4#1.4.1#1.3.1#i would then be a chunk of code written for
                                    1.4.1., which that takes upstream data from 
                                    1.3.1., and transforms it into 3.1., such 
                                    that it can be accepted by the INPUT 
                                    interface of 4#1.4.1. E.g. a HTTP Request
                                    FROM AWS API Gateway would need to be 
                                    parsed to 3.1. before input to 4#1.4.1.
                    
                    4#1.4.1#1.3.1#o would then be a chunk of code written for
                                    1.4.1., which that takes 3.1., and 
                                    transforms it such that it can be accepted 
                                    by the OUTPUT interface of 4#1.4.1. E.g. a
                                    HTTP Response TO AWS API Gateway would need
                                    to be parsed from 3.1. before output from
                                    4#1.4.1.
                                    
                    4#1.4.1#1.5.1#i would then be a chunk of code written for
                                    1.4.1., which that takes upstream data from 
                                    1.5.1., and transforms it into 3.1., such 
                                    that it can be accepted by the INPUT 
                                    interface of 4#1.4.1. E.g. a database 
                                    response FROM AWS DYNAMODB would need to be 
                                    parsed to 3.1. before being input to
                                    4#1.4.1.
                    
                    4#1.4.1#1.5.1#o would then be a chunk of code written for
                                    1.4.1., which that takes 3.1., and 
                                    transforms it such that it can be accepted 
                                    by the OUTPUT interface of 4#1.4.1. E.g. a 
                                    database request TO AWS DYNAMODB would need
                                    to be parsed from 3.1. before being output
                                    from 4#1.4.1.
        ]

Current state of 3.1. / 3.2.

    3.1. is currently TODO
    
    -   data.RU.request : a slightly modified version of AWS API GATEWAY's 
        (event) object.
    
    -   data.RU.signals.sendResponse : a complex version of AWS API GATEWAY's
        (response) object; significant plumbing needs to happen here, so that
        there is eventually only one way to send responses out of (ruthenium)
        and to disallow most of the various options accepted by AWS API GATEWAY.
        TODO
        
    -   Database abstraction has not yet been plumbed, but it should look
        something like this:
        
        data.RU.io.VENDOR_PURPOSE.request =     {}  TODO
        data.RU.io.VENDOR_PURPOSE.response =    {}  TODO
            (currently we just do data.RU.io.KEY)
        
    -   ORMs are bad. We're not aiming to build one - but we do need a common
        data FORMAT / SYNTAX / DSL for representing data with entity relations.
        TODO (3.1.1.)
        
        Once 3.1.1. has been established, and since the ORM pattern is banned,
        we can then mandate that developers must MANUALLY implement:
        
        -   4#1.4.n#1.5.n#i
        -   4#1.4.n#1.5.n#o

        It is then left to the developer to decide if they would be lazy and 
        use an ORM or other library instead of a completely manual 
        implementation.
```