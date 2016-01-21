;(function(environment){
    'use strict';
    
    Math.isPair = function (i) {
        return i%2 == 0;
    }
    
    /** 
     * Class representing a point.
     * @param {number} x - The x value.
     * @param {number} y - The y value.
     */
    environment['Point'] = function Point (x, y) {
        this.x = x;
        this.y = y;
        
        /**
         * Test for equality with another point
         * @return {boolean} point - true for equality.
         */
        this.egal = function( point ) {
            return this.x == point.x && this.y == point.y;
        }
    }
    
    environment['Deja'] = function Deja () {}
    Deja.lcache = {};
    
    Deja.cache = function(func, args, res) {
        if( Deja.lcache[func] == undefined )
            Deja.lcache[func] = {};
        Deja.lcache[func]['_'+args+'_'] = res;
        return Deja.lcache[func]['_'+args+'_'];
    }
    
    Deja.read = function(func, args) {
        if( Deja.lcache[func] == undefined )
            Deja.lcache[func] = {};
        if( Deja.lcache[func]['_'+args+'_'] != undefined )
            return Deja.lcache[func]['_'+args+'_'];
        return false;
    }
    
})(this);
