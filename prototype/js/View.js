var Main = (function (Main, undefined) {
    'use strict';
    
    function View ( width, height ) {
        
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
        
    View.prototype.add = function ( name, size, position, offset ) {
        
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
        
    View.prototype.clear = function (name) {
        this[name].ctx.clearRect(0, 0, this[name].canvas.width, this[name].canvas.height);
    }
    
    Main.View = View;
    return Main;
}(Main || {}));
