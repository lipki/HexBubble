;(function(undefined){
    'use strict';
    
    function View () {
        
        var A, U, C, S, G, H, V;
        this.init = function ( clas ) {
            A = clas[0]; U = clas[1]; C = clas[2]; S = clas[3]; G = clas[4]; H = clas[5]; V = clas[6];
        }
        
        this.appInit = function ( width, height ) {
            
            this.width = width;
            this.height = height;
            
            this.content = document.createElement("div");
            document.body.appendChild(this.content);
            this.content.style.display = 'block';
            this.content.style.position = 'absolute';
            this.content.style.bottom = 0;
            this.content.style.width = '100%';
            this.content.style.height = '100%';
                
            this.body = document.getElementsByTagName("body")[0];
            this.body.style.margin = 0;
            
        }
        
        this.add = function ( name, size, position, offset ) {
            
            var size = size || [0,0];
            var position = position || [0,0];
            var offset = offset || [0,0];
            
            this[name] = {};
            this[name].owidth = offset[0];
            this[name].oheight = offset[1];
            this[name].width = size[0];
            this[name].height = size[1];
            this[name].canvas = document.createElement("canvas");
            this[name].canvas.width = size[0];
            this[name].canvas.height = size[1];
            this[name].canvas.setAttribute('data-name', name);
            this[name].canvas.style.position = 'absolute';
            this[name].canvas.style.left = position[0]+'px';
            this[name].canvas.style.top = position[1]+'px';
        
            this.content.appendChild(this[name].canvas);
            this[name].ctx = this[name].canvas.getContext('2d');
            
        }
        
        this.clear = function (name) {
            this[name].ctx.clearRect(0, 0, this[name].canvas.width, this[name].canvas.height);
        }
        
    }
    
    var ready = new Event("hexbubble.class.view.loaded");
    ready.instance = new View();
    document.dispatchEvent(ready);
    
})();
