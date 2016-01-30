var Main = (function (Main, undefined) {
    'use strict';
    
    var A, H;
    
    function Canon ( app, hex, width, height ) {
        
        A = app;
        H = hex;
        
        this.width = width;
        this.height = height;
        
        this.point = new Point(width/2, height - H.drayon);
        this.precision = H.drayon;
        
        this._angle = 0;
        this.angleMin = A.canonAngleMin;
        this.angleMax = A.canonAngleMax;
        this.angleStep = A.canonAngleStep;
            
        this.types = null;
        this.ballRes = null;
        this.ball = null;
        this.ballShoot = null;
        
        this.inshoot = true;
        
        this.pico = [];
        this.goal;
        
    }
        
    Canon.prototype.calcAngle = function (mouseX, mouseY) {
        var x = mouseX-C.point.x;
        var y = C.point.y-mouseY;
        C.angle = Math.atan2(x, y)/Math.PI*180;
    }
    
    Canon.prototype.calcRebondCache = [];
    Canon.prototype.calcRebond = function () {
        
        var Vp = new Point(this.point.x, this.point.y);
        var Va = this.angle-90;
        var rebond = 0;
        var rebondY = Math.abs(Math.tan(Math.PI / 180 * Va) * (M.H.aWidth-M.H.rayon*2));
        
        var pico = [];
        
        for( var i = 0; i < 1200; i++ ) {
            
            Vp.x += this.precision * Math.cos(Math.PI / 180 * Va);
            Vp.y += this.precision * Math.sin(Math.PI / 180 * Va);
            
            S.hex(M.V['canon'].ctx, pic[k].point, 'rgba(255,0,0,0.5)', rayon);
            
            if( Vp.y < M.H.rayon ) break;
            
            if( Vp.x > M.V.width-M.H.zerox-M.H.rayon || Vp.x < M.H.zerox+M.H.rayon ) {
                
                if( Vp.x > M.V.width-M.H.zerox-M.H.rayon ) Vp.x = M.V.width-M.H.zerox-M.H.rayon;
                if( Vp.x < M.H.zerox+M.H.rayon ) Vp.x = M.H.zerox+M.H.rayon;
                
                Vp.y = this.point.y-rebondY*rebond-rebondY/2;
                
                Va = -Va+180;
                rebond ++;
                
            }
            
            pico.push({point:new Point (Math.round(Vp.x), Math.round(Vp.y)), rebond:rebond});
        }
    
        return pico;
    }
    
    Canon.prototype.key = function (e) {
        
        if(32 === e.keyCode) {
            e.preventDefault();
            this.pan();
        } else if(37 === e.keyCode) {
            e.preventDefault();
            this.angle -= this.angleStep;
        } else if(39 === e.keyCode) {
            e.preventDefault();
            this.angle += this.angleStep;
        }
        
    }
    
    Canon.prototype.move = function (e) {
        
        if( undefined != e ) {
            var x = e.layerX-this.point.x;
            var y = this.point.y-e.layerY;

            this.angle = Math.atan2(x, y)/Math.PI*180;
        
            if( true === this.inshoot || !M.option.trace ) return ;
            
            this.calc();
            
            if( M.option.trace ) this.trace();
        }
        
        M.S.canon( this );
            
            /*var hex = M.H.pixelToHex(new Point(e.layerX, e.layerY));
            if( hex && M.G.get(hex) ) {
                var hex = M.G.get(hex);
                M.S.hex(M.V['canon'].ctx, hex.px, 'rgba(255,255,255,0.5)', M.H.rayon/5*4);
                M.S.shadowOut(M.V['canon'].ctx, hex.px, M.H.rayon/5*4);
            }*/
        
    }

    Canon.prototype.pan = function (e) {
        if( this.inshoot ) return ;
        
        this.calc();
        this.inshoot = true;
        this.ballSwitch();
        var mi = this;
        M.S.animAdd( 'move', 'move', [this], null , function(){
            M.V.clear('borderBalle');
            M.V.clear('balle');
            mi.M.pan();
        });
    }
    
    Canon.prototype.ballSwitch = function () {
        this.ballShoot = this.ball;
        this.ball = this.ballRes;
        var typeslength = this.types.length;
        if( typeslength > 0 ) {
            this.ballRes = this.types[(Math.random()*typeslength) | 0];
            M.S.ballRes(this);
        }
        M.S.canon( this );
    }
    
    Canon.prototype.calc = function () {
        
        var pic = this.calcPico();
        
        this.pico.length = 0;
        var list = [];
        for ( var k = 1, l = pic.length ; k < l ; k++ ) {
            
            if( 0 === k%2 ) this.pico.push(pic[k]);
            var hex = M.H.pixelToHex(pic[k].point);
            
            if( this.M.G.get(hex).on ) break;
                
            list.push(M.G.get(hex));
            
            if(  M.option.percante ) {
                
                var rayon = M.H.rayon - (M.H.rayon - M.H.dwidth)*2;
                if( M.option.micro )
                    var rayon = M.H.rayon - M.H.dwidth;
                
                //M.S.hex(M.V['canon'].ctx, pic[k].point, 'rgba(255,0,0,0.5)', rayon);
                    
                if( M.G.get(M.H.pixelToHex(M.S.hexCorner(pic[k].point, rayon, 0))).on ) break;
                if( M.G.get(M.H.pixelToHex(M.S.hexCorner(pic[k].point, rayon, 1))).on ) break;
                if( M.G.get(M.H.pixelToHex(M.S.hexCorner(pic[k].point, rayon, 2))).on ) break;
                if( M.G.get(M.H.pixelToHex(M.S.hexCorner(pic[k].point, rayon, 3))).on ) break;
                if( M.G.get(M.H.pixelToHex(M.S.hexCorner(pic[k].point, rayon, 4))).on ) break;
                if( M.G.get(M.H.pixelToHex(M.S.hexCorner(pic[k].point, rayon, 5))).on ) break;
                
            }
            
        }
        
        console.log(list)
        if(  M.option.percante ) this.list = list;
        this.goal = list[list.length-1];
        
    }
    
    Canon.prototype.calcPico = function() {
        
        var Vp = new Point(this.point.x, this.point.y);
        var Va = this.angle-90;
        var rebond = 0;
        var rebondY = Math.abs(Math.tan(Math.PI / 180 * Va) * (M.H.aWidth-M.H.rayon*2));
        
        var pico = [];
        
        for( var i = 0; i < 1200; i++ ) {
            
            Vp.x += this.precision * Math.cos(Math.PI / 180 * Va);
            Vp.y += this.precision * Math.sin(Math.PI / 180 * Va);
            
            if( Vp.y < M.H.rayon ) break;
            
            if( Vp.x > M.V.width-M.H.zerox-M.H.rayon || Vp.x < M.H.zerox+M.H.rayon ) {
                
                if( Vp.x > M.V.width-M.H.zerox-M.H.rayon ) Vp.x = M.V.width-M.H.zerox-M.H.rayon;
                if( Vp.x < M.H.zerox+M.H.rayon ) Vp.x = M.H.zerox+M.H.rayon;
                
                Vp.y = this.point.y-rebondY*rebond-rebondY/2;
                
                Va = -Va+180;
                rebond ++;
                
            }
            
            pico.push({point:new Point (Math.round(Vp.x), Math.round(Vp.y)), rebond:rebond});
        }
    
        return pico;
        
    }
    
    Canon.prototype.trace = function () {
    
        /*M.V['canon'].ctx.rect(M.H.zerox+M.H.dwidth,M.H.rayon+M.H.drayon,M.H.aWidth-2*M.H.dwidth,window.innerHeight);
        M.V['canon'].ctx.lineWidth = 1;
        M.V['canon'].ctx.strokeStyle = 'red';
        M.V['canon'].ctx.stroke();
        M.V['canon'].ctx.closePath();*/
        
        /*if( this.list ) 
            for ( var k = 0, l = this.list.length ; k < l ; k++ ) {
                var size = M.H.drayon;
                if(this.list[k].on) size = M.H.rayon/3;
                M.S.gaol( this.list[k] );
            }*/
        
        if( this.pico ) M.S.trace( this.pico );
        if( this.goal ) M.S.gaol ( this.goal );
        
    }
    
    Canon.prototype = {
        get angle(){
            return this._angle;
        },
        set angle(a){
            this._angle = Math.round(a/this.angleStep)*this.angleStep;
            if( this._angle < this.angleMin ) this._angle = this.angleMin;
            if( this._angle > this.angleMax ) this._angle = this.angleMax;
        }
    }
    
    Main.Canon = Canon;
    return Main;
}(Main || {}));
