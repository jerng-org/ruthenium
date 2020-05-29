// https://jakearchibald.com/2017/es-modules-in-browsers/


removeClosest = ( thisArg, selector ) => {
    thisArg.closest( selector ).remove() 
}

removeClosestTr = ( thisArg ) => { removeClosest ( thisArg, 'tr' ) }