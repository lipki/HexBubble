;(function Main (undefined){
    'use strict';
    
    // wait for next class
    var clasList = ['app','utils','canon','sprite','grid','hexagone','view'];
    for( var t = 0, l = clasList.length ; t < l ; ++t ) {
        clasList[t] = 'hexbubble.class.'+clasList[t]+'.loaded';
        document.addEventListener(clasList[t], initNextClass);
    }
    
    // wait for body
    clasList.push('load');
    window.onload = initNextClass;
    
    function initNextClass (e) {
        
        var index = clasList.indexOf( e.type );
        if( -1 !== clasList[index] )
            clasList[index] = e.instance;
        
        var end = true;
        for( var t in clasList )
            if( typeof clasList[t] == 'string' )
                end = false;
        
        if( end ) {
            for( var t = 0, l = clasList.length ; t < l ; t++ )
                if( undefined != clasList[t] ) clasList[t].init(clasList);
            clasList[0].appStart();
        }
    }
    
})();
