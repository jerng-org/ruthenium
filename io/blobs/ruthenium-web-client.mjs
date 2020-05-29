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
//  WIDGET : RU-INCREMENTAL 
///////////////////////////////////////////////////////////////////////////////    
    Array.from ( document.querySelectorAll(
         '[data-ru-incrementable-group="column-definition"]'
        +'[data-ru-incrementable-role="append-one"]'
    ) )
    .forEach ( element => {
        
        element
        .addEventListener( 'click', function(event){
            
            // (this) refers to this method's parent object, the (element)
            
            // PREPARE OP#1
            if ( ! (        this.columnDefinitionTemplate 
                        &&  this.relevantTable               ) )
            {
                this.columnDefinitionTemplate = document.querySelector ( 
                    'template[data-ru-incrementable-group="column-definition"]'
                )
                
                this.relevantTable = document.querySelector(
                    '[data-ru-incrementable-group="column-definition"]'
                   +'[data-ru-incrementable-role="parent"]'
                )
                this.relevantTable.addEventListener('click',function(_event){
                    
                    // PERFORM OP#2
                    const _target = _event.target
                    if (_target.matches(
                            '[data-ru-incrementable-group="column-definition"]'
                           +'[data-ru-incrementable-role="remove-closest"]'
                        ))
                    { 
                        //console.log(
                        _target.closest(
                            '[data-ru-incrementable-group="column-definition"]'
                           +'[data-ru-incrementable-role="appended-child"]'
                        )
                        .remove()
                        
                    }
                })
            
                
            }
            
            // PERFORM OP#1
            this.relevantTable.append ( 
                this.columnDefinitionTemplate.content.cloneNode ( true ) 
            ) 
        })
    
        
    })

})


/*
window.removeClosest 
    = function (  selector ) {  this.closest( selector ).remove() }


window.RU = {

    removeClosestTr : thisArg => removeClosest ( thisArg, 'tr' )

}*/