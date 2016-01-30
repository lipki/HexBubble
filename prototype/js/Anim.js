var Main = (function (Main, undefined) {
    'use strict';
    
    function Anim () {
        
        this.animList = [];
        this.animStep = 0;
        
    }
        
    /** Boucle avec requestAnimationFrame qui gère toute les animations */
    Anim.prototype.animAll = function () {
        
        for( var a = 0, l = this.animList.length ; a < l ; a++ ) {
            if( undefined !== this.animList[a] && undefined !== this.animList[a].callbackStep )
                this.animList[a].callbackStep( this.animStep-this.animList[a].start );
                
        }
        
        this.animStep ++;
        var mi = this;
        requestAnimationFrame(function () { mi.animAll() });
    }
        
    /**
     * Fonction permettant d'ajouter un sprite, dans la boucle d'animation
     * @param {string} name - id de l'animation.
     * @param {string} sprite - nom de la fonction sprite.
     * @param {string} args - argument a fournir a la fonction.
     * @param {string} callbackStep - callback appeler a chaque étape.
     * @param {string} callbackend - callback appeler a la fin de l'animation.
     */
    Anim.prototype.animAdd = function ( name, callbackStep, callbackend ) {
        this.animList.push({
            name:name,
            callbackStep:callbackStep,
            callbackend:callbackend,
            start:this.animStep
        });
        
        if( this.animStep == 0 )
            this.animAll();
    }
        
    /**
     * Fonction permettant de suprimmer un sprite, de la boucle d'animation.
     * @param {string} name - id de l'animation.
     */
    Anim.prototype.animDel = function ( name ) {
        var animlist = [];
        for( var a = 0, l = this.animList.length ; a < l ; a++ )
            if( this.animList[a].name === name )
                 var callbackend = this.animList[a].callbackend;
            else animlist.push(this.animList[a]);
        this.animList = animlist;
        if( callbackend != undefined ) callbackend();
    }
    
    Main.Anim = Anim;
    return Main;
}(Main || {}));
