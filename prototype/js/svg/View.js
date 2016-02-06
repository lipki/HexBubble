var Main = (function (Main, undefined) {
    'use strict';
    
    function View ( name, size, position, offset ) {
        
        // static content
        View.makeContent();
        
        var size = size || [0,0];
        var position = position || [0,0];
        var offset = offset || [0,0];
        
        this.name = name;
        this.owidth = offset[0];
        this.oheight = offset[1];
        this.width = size[0];
        this.height = size[1];
        
        this.svg = document.createElementNS (View.xmlns, "g");
        this.svg.setAttribute('id', name);
        View.sprite.appendChild(this.svg);
        
        this.use = document.createElementNS (View.xmlns, "use");
        this.use.setAttributeNS ("xlink", "href", "#"+name);
        this.use.setAttributeNS (null, "transform", "translate("+offset[0]+","+offset[1]+")");
        View.content.appendChild(this.use);
        
    }
    
    View.makeContent = function () {
        
        if( undefined !== View.content ) return;
        
        View.xmlns = "http://www.w3.org/2000/svg";
        var boxWidth = window.innerWidth;
        var boxHeight = window.innerHeight;
        
        View.content = document.createElementNS (View.xmlns, "svg");
        View.content.setAttributeNS (null, "viewBox", "0 0 " + boxWidth + " " + boxHeight);
        View.content.setAttributeNS (null, "width", boxWidth);
        View.content.setAttributeNS (null, "height", boxHeight);
        View.content.style.display = "block";
        document.body.appendChild (View.content); 

        View.sprite = document.createElementNS (View.xmlns, "defs");
        View.content.appendChild (View.sprite);
        
        var styleNode = document.createElement("style");
        styleNode.textContent += "html,body{background:#000000;margin:0;height:100%;position:relative;overflow:hidden}\n";
        styleNode.textContent += "#content{display:block;position:absolute;bottom:0;width:100%;height:100%}\n";
        document.head.appendChild(styleNode);
        
    }
        
    /*View.prototype.makeView = function (Hex) {
        this.add('back'       , [this.width, this.height] );
        this.add('border'     , [Hex.aWidth+Hex.width, Hex.aHeight+Hex.zeroy], [Hex.zerox-Hex.dwidth, 0], [Hex.dwidth+Hex.dwidth, Hex.rayon+Hex.zeroy] );
        this.add('cube'       , [Hex.aWidth, Hex.aHeight], [Hex.zerox, Hex.zeroy], [Hex.dwidth, Hex.rayon] );
        this.add('gift'       , [Hex.aWidth, Hex.aHeight], [Hex.zerox, Hex.zeroy], [Hex.dwidth, Hex.rayon] );
        this.add('alert'      , [this.width, this.height] );
    }*/
        
    /*View.prototype.clear = function (name) {
        //this[name].ctx.clearRect(0, 0, this[name].canvas.width, this[name].canvas.height);
    }*/
    
    Main.View = View;
    return Main;
}(Main || {}));
