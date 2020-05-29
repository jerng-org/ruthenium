'use strict'

// https://jakearchibald.com/2017/es-modules-in-browsers/

var removeClosest = ( thisArg, selector ) => {
    thisArg.closest( selector ).remove() 
}

var removeClosestTr = ( thisArg ) => { removeClosest ( thisArg, 'tr' ) }