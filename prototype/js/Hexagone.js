var Main = (function (Main, undefined) {
    'use strict';
    
    var A, V;
    
    function Hexagone ( app, view ) {
        
        A = app;
        V = view;
        
        this.nx = A.gameGridSize.x;
        this.ny = A.gameGridSize.y+3;
        
        this.rayon = (V.height/(this.ny*3+1))*2;
        this.dwidth = (this.rayon * Math.cos(Math.PI / 180 * 30))|0;
        this.drayon = Math.round(Math.tan(Math.PI / 180 * 30) * this.dwidth);
        
        if(this.nx/this.ny > V.width/V.height) {
            this.dwidth = (V.width/(this.nx*2))|0;
            this.drayon = Math.round(Math.tan(Math.PI / 180 * 30) * this.dwidth);
        }
        
        this.width = this.dwidth*2;
        this.rayon = this.drayon*2;
        
        this.aWidth = this.width*this.nx;
        this.aHeight = (this.rayon*1.5)*this.ny+this.drayon;
        this.zerox = ((V.width-this.aWidth)/2)|0;
        this.zeroy = this.drayon;
            
    }
        
    Hexagone.prototype.hexToPixel = function (point) {
        var offset = Math.isPair(point.y) ? 0 : this.dwidth;
        var px = new Point( this.width*point.x+this.dwidth-offset, this.rayon+point.y*this.rayon*1.5 );
        return new Point(px.x, px.y);
    }

    Hexagone.prototype.pixelToHex = function (point) {
        
        var point = new Point(point.x-this.zerox, point.y-this.zeroy);
        
        var bande = (point.y/(this.drayon))|0;
        
        var ret = new Point(0, ((point.y)/(this.rayon*1.5))|0);
        ret.x = ((point.x+this.dwidth)/this.width)|0;
        if( Math.isPair(ret.y) )
             ret.x = (point.x/this.width)|0;
        
        if( 0 === bande%3 ) {
            var pc = new Point((point.x/(this.dwidth))|0,
                               (point.y/(this.drayon))|0);
            var re = new Point(point.x-(pc.x*this.dwidth),
                               point.y-(pc.y*this.drayon));
            var po = new Point(Math.round(re.x*100/this.dwidth),
                               Math.round(re.y*100/this.drayon));
            
            if(Math.isPair(pc.x+pc.y) && po.x+po.y < 100 ) {
                ret.y--;
                if( Math.isPair(ret.y) ) ret.x--;
            } else if( !Math.isPair(pc.x+pc.y) && 100-po.x+po.y < 100 ) {
                ret.y--;
                if( !Math.isPair(ret.y) ) ret.x++;
            }
            
        }
        
        return ret;
    }
    
    Main.Hexagone = Hexagone;
    return Main;
}(Main || {}));
