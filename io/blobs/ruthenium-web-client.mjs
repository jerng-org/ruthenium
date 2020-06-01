'use strict'

//  LITERATURE REVIEW:
//
//  -   https://jakearchibald.com/2017/es-modules-in-browsers/
//      -   async, defer, modules, MIME-types, etc.
//
//  -   https://javascript.info/bubbling-and-capturing
//      1.  'capture' starts at (window), and travels UP the tree to the (element)
//      2.  'trigger' occurs on the (element)
//      3.  'bubble' starts at (element), and travels DOWN the tree to the (window)
//
//  -   https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event
//      -   (document.DOMContentLoaded) event triggers when (document)'s markup has parsed
//      -   (window.load) event triggers when (window)'s file dependencies have all loaded'
//
//  -   https://gomakethings.com/event-listener-performance-with-vanilla-js/
//      -   debouncing


document.addEventListener('DOMContentLoaded', (event) => {
})

window.addEventListener('load', (event) => {

    console.warn (`IMPROVE DOCS: Widget RU-INCREMENTAL`)

///////////////////////////////////////////////////////////////////////////////    
/*  
    WIDGET : RU-INCREMENTAL 

    Coralling Attribute:    data-ru-incrementable-group="INSTANTIATE"
                            - IMPORTANT: add this to each of A, B, C, D, E
    Key Elements:
    
        "A: a button that adds a clone of a template, D, to the DOM":
        
            Must have:      data-ru-incrementable-role="append-one"
                            
                            data-ru-incrementable-attributes='[
                                {
                                    "attribute":    "ATTRIBUTENAME",
                                    "baseValue":    "ATTRIBUTEVALUE"    // Must match in D
                                },
                                etc.
                            ]
                            
                            ^
                            A list of objects. You can have as many as you want.
                            ^
                            [attribute="baseValue"] must match an element in D.
                            Cs are clones of D.content.
                            ^
                            When Cs are inserted into the DOM, C's attributes
                            can be targeted, and their values appended with a 
                            integer index which increases as more Cs are added.
                            ^
                            (baseValue) should contain the string '###' which
                            will be replaced by the counter value.
                            ^
                            E.g.    "attribute":"name", "baseValue":"joe" 
                                    
                                    where
                                    
                                    <element-d> name="joe-###-shmo" />
                                    
                                    will become 
                            
                                    <element-c1 name="joe-###1###-shmo" />
                                    <element-c2 name="joe-###2###-shmo" /> etc.
                            ^        
                            The index never decrements when Cs are removed from
                            the DOM. This guarantees uniqueness of "attribute",
                            so-long as your "baseValue" is unique per-document.
                            ^
                            A prototypical use-case for this pattern is to 
                            create unique numbered names for form fields.
                            
        "B: an element into which ... element C will be appended as a child":
        
            Must have:      data-ru-incrementable-role="parent"
        
        "C: a cloned node from the (content)-prop of a (template)":
        
            Must have:      data-ru-incrementable-role="appended-child"
                            
        "D: the (template) from which C is cloned; D is C's parent:"

            Must be:        template
                            
        "E: a button that removes the closest matching ancestor C":
        
            Must have:      data-ru-incrementable-role="remove-closest"

    User Story:
    
        When you click A once, a new instance of C appears inside B.
        If you click A many times, there will be many Cs.
        The template D for C should include an E, such that each C has an E.
        If you click an E, its ancestor C is removed from the DOM.

    Use Case:
    
        A form for your favourite foods may take multiple entries. When you load
        the form, it may have zero inputs displayed. But it would have a "add
        input" button (A), and clicking A would insert input fields (C)s into
        the DOM. Beside each input field there might be a "remove this" button
        (E). Clicking E would remove its ancestor C from the DOM.
        
    Reference Implementation:
    
        ~/tasks/restful/forms/desk-schemas-post.js

*/
///////////////////////////////////////////////////////////////////////////////  

    Array.from ( document.querySelectorAll(
         '[data-ru-incrementable-role="append-one"]'
    ) )
    .forEach ( element => {
        
        const group = element.dataset.ruIncrementableGroup
        
        element
        .addEventListener( 'click', function(event){
            
            // (this) refers to each [.. role="append-one"] (element)
            
            // PREPARE OP#1
            if ( ! (        this.ruIncrementableClonedContent 
                        &&  this.ruIncrementableParent               ) )
            {
                this.ruIncrementableCounter = 0

                this.ruIncrementableGroupSelector 
                    = `[data-ru-incrementable-group="${ group }"]`

                this.ruIncrementableAttributes 
                    = JSON.parse( this.dataset.ruIncrementableAttributes )

                this.ruIncrementableTemplate = document.querySelector ( 
                    `template${ this.ruIncrementableGroupSelector }`
                )
                
                this.ruIncrementableParent = document.querySelector(
                    this.ruIncrementableGroupSelector
                   +'[data-ru-incrementable-role="parent"]'
                )
                this.ruIncrementableParent.addEventListener('click', _event => {

                    // (this) refers to the same element as (this) above!!
                    
                    // PERFORM OP#2
                    const _target = _event.target
                    if (_target.matches(
                            this.ruIncrementableGroupSelector
                           +'[data-ru-incrementable-role="remove-closest"]'
                        ))
                    { 
                        _target.closest(
                            this.ruIncrementableGroupSelector
                           +'[data-ru-incrementable-role="appended-child"]'
                        )
                        .remove()
                        
                    }
                })
                
            }
            
            // PERFORM OP#1
            this.ruIncrementableClonedContent =  this.ruIncrementableTemplate
                                        .content
                                        .cloneNode ( true )
            
            this.ruIncrementableCounter++
            
            for ( const _attr of this.ruIncrementableAttributes ) {
                this.ruIncrementableClonedContent
                    .querySelector( `[${ _attr.attribute }="${ _attr.baseValue }"]` )
                    .setAttribute ( 
                        _attr.attribute, 
                        _attr.baseValue.replace ( '###', '###' + this.ruIncrementableCounter + '###' )
                    )
            }
    
            this.ruIncrementableParent.append ( this.ruIncrementableClonedContent ) 
        })
    
        
    }) //     WIDGET : RU-INCREMENTAL 


})
