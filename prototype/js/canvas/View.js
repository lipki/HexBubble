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
        this.canvas = document.createElement("canvas");
        this.canvas.setAttribute('id', name);
        this.canvas.width = size[0];
        this.canvas.height = size[1];
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = position[0]+'px';
        this.canvas.style.top = position[1]+'px';
    
        View.content.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
    }
    
    View.makeContent = function () {
        
        if( undefined !== View.content ) return;
        
        View.content = document.createElement("div");
        View.content.setAttribute('id', 'content');
        document.body.appendChild(View.content);
        
        View.sprite = new Main.View ('sprite', [100, 100] );
        
        var styleNode = document.createElement("style");
        styleNode.textContent += "html,body{background:#000000;margin:0;height:100%;position:relative;overflow:hidden}\n";
        styleNode.textContent += "#content{display:block;position:absolute;bottom:0;width:100%;height:100%}\n";
        document.head.appendChild(styleNode);
            
    }
        
    View.prototype.clear = function () {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
    
    
    /*
    View.prototype.makeView = function (Hex) {
        this.add('back'       , [this.width, this.height] );
        this.add('border'     , [Hex.aWidth+Hex.width, Hex.aHeight+Hex.zeroy], [Hex.zerox-Hex.dwidth, 0], [Hex.dwidth+Hex.dwidth, Hex.rayon+Hex.zeroy] );
        this.add('borderGift' , [Hex.aWidth+Hex.width, Hex.aHeight+Hex.zeroy], [Hex.zerox-Hex.dwidth, 0], [Hex.dwidth+Hex.dwidth, Hex.rayon+Hex.zeroy] );
        this.add('borderBalle', [Hex.aWidth+Hex.width, Hex.aHeight+Hex.zeroy], [Hex.zerox-Hex.dwidth, 0], [Hex.dwidth+Hex.dwidth, Hex.rayon+Hex.zeroy] );
        this.add('cube'       , [Hex.aWidth, Hex.aHeight], [Hex.zerox, Hex.zeroy], [Hex.dwidth, Hex.rayon] );
        this.add('canon'      , [Hex.aWidth, Hex.aHeight], [Hex.zerox, Hex.zeroy] );
        this.add('balle'      , [Hex.aWidth, Hex.aHeight], [Hex.zerox, Hex.zeroy] );
        this.add('gift'       , [Hex.aWidth, Hex.aHeight], [Hex.zerox, Hex.zeroy], [Hex.dwidth, Hex.rayon] );
        this.add('alert'      , [this.width, this.height] );
    }*/
    
    Main.View = View;
    return Main;
}(Main || {}));
