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

///////////////////////////////////////////////////////////////////////////////    
/*  
    WIDGET : RU-INCREMENTAL 

    Coralling Attribute:    data-ru-incrementable-group="INSTANTIATE"
    
    Key Elements:
    
        "A: a button that adds a copy of a template, D, to the DOM":
        
                            data-ru-incrementable-role="append-one"
        
        "B: an element into which ... element C will be appended as a child":
        
                            data-ru-incrementable-role="parent"
        
        "C: a cloned node from the (content)-prop of a (template)":
        
                            data-ru-incrementable-role="appended-child"
                            
        "D: the template from which C is cloned:"

                            template[data-ru-incrementable-group="INSTANTIATE"]

        "E: a button that removes the closest matching ancestor C":
        
                            data-ru-incrementable-role="remove-closest"

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

*/
///////////////////////////////////////////////////////////////////////////////    
    Array.from ( document.querySelectorAll(
         '[data-ru-incrementable-role="append-one"]'
    ) )
    .forEach ( element => {
        
        const group = element.dataset.ruIncrementableGroup
        
        element
        .addEventListener( 'click', function(event){
            
            // (this) refers to this method's parent object, the (element)
            
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
                this.ruIncrementableParent.addEventListener('click', function(_event){
                    
                    // PERFORM OP#2
                    const _target = _event.target
                    if (_target.matches(
                            this.ruIncrementableGroupSelector
                           +'[data-ru-incrementable-role="remove-closest"]'
                        ))
                    { 
                        //console.log(
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
            
            for ( const attr of this.ruIncrementableAttributes ) {
                this.ruIncrementableClonedContent
                    .querySelector( `[${ attr.attribute }="${ attr.baseValue }"]` )
                    .setAttribute ( 
                        attr.attribute, 
                        `${ attr.baseValue }.${ this.ruIncrementableCounter }`
                    )
            }
    
            this.ruIncrementableParent.append ( this.ruIncrementableClonedContent ) 
        })
    
        
    })

})


/*
window.removeClosest 
    = function (  selector ) {  this.closest( selector ).remove() }


window.RU = {

    removeClosestTr : thisArg => removeClosest ( thisArg, 'tr' )

}*/