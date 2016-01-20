;(function(environment){
    'use strict';
    
    environment['includeDebug'] = false;
    environment['includeList'] = [];
    environment['includeLoadOn'] = false;
    environment['include'] = function (src, callback) {
        
        if(src instanceof Array == false)
            src = [src];
        
        includeList.push({src:src, callback:callback});
        if(includeDebug) console.log('add', includeList);
        
        if( includeList.length > 0 && !includeLoadOn ) {
            if(includeDebug) console.log('start');
            includeLoad();
        }
        
    }
    environment['includeLoad'] = function (src, callback) {
        includeLoadOn = true;
        
        var lastIncludeList = includeList[includeList.length-1];
        var lastSrc = lastIncludeList.src[lastIncludeList.src.length-1];
        if(includeDebug) console.log('load', lastSrc);
        
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = lastSrc + '?' + (new Date().getTime());
        document.getElementsByTagName('head')[0].appendChild(script);
        
        script.onreadystatechange = function(e) {
            var src = e.target.getAttribute('src').split('?')[0];
            if(includeDebug) console.log('loaded', src);
            lastIncludeList.src.splice(lastIncludeList.src.indexOf(src), 1);
            
            while( includeList.length> 0 ) {
                var prolast = includeList[includeList.length-1];
                if( prolast.src.length == 0 ) {
                    if(includeDebug) console.log('vide and last', 'callback', prolast.callback);
                    if( typeof prolast.callback === "function" )
                        prolast.callback();
                    includeList.pop();
                    if(includeDebug) console.log('rest', includeList);
                } else break;
            }
        
            if( includeList.length > 0 )
                includeLoad();
            else {
                if(includeDebug) console.log('stop');
                includeLoadOn = false;
            }
        };
        script.onload = script.onreadystatechange;
    }
    
    var scripts = document.getElementsByTagName('script');
    for( var s in scripts )
        if( scripts[s].src )
            if( scripts[s].src.search(/Loader.js/i) != -1 )
                include(scripts[s].getAttribute("data-main"));
    
})(this);
