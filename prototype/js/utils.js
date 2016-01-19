;(function(environment){
    'use strict';
    
    Math.isPair = function (i) {
        return i%2 == 0;
    }
    
    environment['Point'] = function Point (x, y) {
        this.x = x;
        this.y = y;
        
        this.egal = function(one) {
            return this.x == one.x && this.y == one.y;
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
        else return false;
    }
    
})(this);
