'use strict'

// https://jakearchibald.com/2017/es-modules-in-browsers/

const removeClosest = ( thisArg, selector ) => {
    thisArg.closest( selector ).remove() 
}

const removeClosestTr = ( thisArg ) => { removeClosest ( thisArg, 'tr' ) }