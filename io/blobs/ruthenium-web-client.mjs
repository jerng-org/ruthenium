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
    
    document.querySelectorAll(
        '[data-ru-incrementable-group="column-definition"][data-ru-incrementable-role="append-one"]'
    )
    .addEventListener( 'click', function(){
        alert()
    })
    
})


/*
window.removeClosest 
    = function (  selector ) {  this.closest( selector ).remove() }


window.RU = {

    removeClosestTr : thisArg => removeClosest ( thisArg, 'tr' )

}*/