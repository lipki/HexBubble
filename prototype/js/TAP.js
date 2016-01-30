var Main = (function (Main, undefined) {
    'use strict';
    
    function TAP ( events, callback ) {
        
        var mi = this;
        this.callback = callback;
        this.events = {};
        for ( var e = 0, l = events.length ; e < l ; e++ ) {
            this.events[events[e]] = {event:events[e], catch:false};
            document.addEventListener(events[e], function(e){mi.catchEvent(e)});
        }
        
    }
    
    TAP.prototype.catchEvent = function ( e ) {
        
        this.events[e.type].catch = true;
        
        var catched = true;
        for( var e in this.events )
            catched = this.events[e].catch || false;
        
        if( catched ) {
            document.dispatchEvent(new Event("Main.TAP.catched"));
            this.callback();
        }
    }
    
    Main.TAP = TAP;
    return Main;
}(Main || {}));
