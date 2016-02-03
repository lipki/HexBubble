var Main = (function (Main, undefined) {
    'use strict';
    
    function View ( width, height ) {
        
        this.width = width;
        this.height = height;
        
        this.content = document.createElement("div");
        this.content.setAttribute('id', 'content');
        document.body.appendChild(this.content);
        
        var styleNode = document.createElement("style");
        styleNode.textContent += "html,body{background:#000000;margin:0;height:100%;position:relative;overflow:hidden}\n";
        styleNode.textContent += "#content{display:block;position:absolute;bottom:0;width:100%;height:100%}\n";
        document.head.appendChild(styleNode);
            
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
        this[name].canvas.setAttribute('id', name);
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
