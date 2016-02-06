;(function(undefined){
    'use strict';
    
    Math.isPair = function (i) {
        return 0 === i%2;
    }
    
    Math.Point = function Point (coo) {
        this.coo = coo;
    }
    
    Math.Point.prototype = {
        get x(){ return coo[0] },
        set x(a){ coo[0] = a },
        get y(){ return coo[1] },
        set y(a){ coo[1] = a }
    }
    
    Math.Point.egal = function( coo ) {
        return this.coo[0] === coo[0] && this.coo[1] === coo[1];
    }
    
})();
