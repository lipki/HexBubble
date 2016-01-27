;(function(undefined){
    'use strict';
    
    function Hexagone () {
        
        var A, U, C, S, G, H, V;
        this.init = function ( clas ) {
            A = clas[0]; U = clas[1]; C = clas[2]; S = clas[3]; G = clas[4]; H = clas[5]; V = clas[6];
        }
        
        this.appInit = function () {
            
            this.nx = A.ref.gameGridSize.x;
            this.ny = A.ref.gameGridSize.y+3;
            
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
        
        
        
        this.hexCornerCache = [];
        this.hexCorner = function( center, size, i, angle_start ) {
            
            var cacheName = size+'_'+i+'_'+angle_start;
            var ret = this.hexCornerCache[cacheName];
            if( undefined !== ret )
                return new Point(ret.x + center.x, ret.y + center.y);
            
            var angle_start = angle_start != undefined ? angle_start : 30;
            var angle_deg = 60 * i + angle_start;
            var angle_rad = Math.PI / 180 * angle_deg;
            var ret = new Point(size * Math.cos(angle_rad), size * Math.sin(angle_rad));
            this.hexCornerCache[cacheName] = ret;
            
            return new Point(ret.x + center.x, ret.y + center.y);
            
        }
        
        this.hexToPixel = function (point) {
            var offset = Math.isPair(point.y) ? 0 : this.dwidth;
            var px = new Point( this.width*point.x+this.dwidth-offset, this.rayon+point.y*this.rayon*1.5 );
            return new Point(px.x, px.y);
        }

        this.pixelToHex = function (point) {
            
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
        
    }
    
    var ready = new Event("hexbubble.class.hexagone.loaded");
    ready.instance = new Hexagone();
    document.dispatchEvent(ready);
    
})();
