;(function(environment){
    'use strict';
    
    environment['Canon'] = function Canon (main, point, angleMin, angleMax, angleStep) {
        
        this.M = main;
        this.point = point;
        this.precision = Hex.rayon/5;
        
        this._angle = 0;
        this.angleMin = angleMin;
        this.angleMax = angleMax;
        this.angleStep = angleStep;
        
        this.option = {debug:false, trace:true, ghost:false, switch:false, demi:false, micro:false, percante:false, bombe:false };
        
        this.goal;
            
        this.types = null;
        this.ballRes = null;
        this.ball = null;
        this.ballShoot = null;
        
        this.inshoot = true;
        
        this.init = function ( types ) {
            
            this.types = types;
            this.ballRes = this.types[Math.floor(Math.random()*this.types.length)];
            this.ball = null;
            this.ballShoot = null;
            this.ballSwitch();
        
            //this.draw();
            
            var mi = this;
            window.addEventListener('click', function (e) {mi.pan(e)});
            window.addEventListener('mousemove', function (e) {mi.move(e)});
            window.addEventListener("keydown", function (e) {mi.key(e)});
            
            var mi = this;
            Sprite.animAdd( 'canon', 'canon', [this], function() {
                if( mi.inshoot == false && mi.option.trace ) mi.calc();
                if( mi.option.trace || mi.option.debug ) mi.trace();
            });
            
        }
        
        this.key = function (e) {
            
            if(e.keyCode === 32) {
                e.preventDefault();
                this.pan();
            } else if(e.keyCode === 37) {
                e.preventDefault();
                this.angle -= this.angleStep;
            } else if(e.keyCode === 39) {
                e.preventDefault();
                this.angle += this.angleStep;
            }
            
        }
        
        this.move = function (e) {
            
            var x = e.layerX-this.point.x;
            var y = this.point.y-e.layerY;
            
            /*var hex = Hex.pixelToHex(new Point(e.layerX, e.layerY));
            console.log(hex);
            if( hex && this.M.G.is(hex) ) {
                var hex = this.M.G.get(hex);
                console.log(hex);
                Sprite.hex(View['balle'].ctx, hex.px, 'rgba(255,255,255,0.5)', Hex.rayon/5*4);
                Sprite.shadowOut(View['balle'].ctx, hex.px, Hex.rayon/5*4);
            }*/

            this.angle = Math.atan2(x, y)/Math.PI*180;
        }

        this.pan = function (e) {
            if( !this.inshoot ) {
                this.calc();
                this.inshoot = true;
                this.ballSwitch();
                var mi = this;
                Sprite.animAdd( 'move', 'move', [this], null , function(){
                    mi.M.pan();
                });
            }
        }
        
        this.ballSwitch = function () {
            this.ballShoot = this.ball;
            this.ball = this.ballRes;
            if( this.types.length > 0 ) {
                this.ballRes = this.types[Math.floor(Math.random()*this.types.length)];
                Sprite.ballRes(this);
            }
        }
        
        this.calc = function () {
            
            var cacheName = this.point.x+'_'+this.point.y+'_'+this.angle;
            var ret = Deja.read('calc', cacheName);
            if( ret === false ) {
            
                var Vp = new Point(this.point.x, this.point.y);
                var Va = this.angle-90;
                var rebond = 0;
                var rebondY = Math.abs(Math.tan(Math.PI / 180 * Va) * (Hex.aWidth-Hex.rayon*2));
                
                this.pico = [];
                this.list = [];
                
                for( var i = 0; i < 1200; i++ ) {
                    
                    Vp.x += this.precision * Math.cos(Math.PI / 180 * Va);
                    Vp.y += this.precision * Math.sin(Math.PI / 180 * Va);
                    
                    if( Vp.x > View.width-Hex.zerox-Hex.rayon || Vp.x < Hex.zerox+Hex.rayon ) {
                        
                        if( Vp.x > View.width-Hex.zerox-Hex.rayon ) Vp.x = View.width-Hex.zerox-Hex.rayon;
                        if( Vp.x < Hex.zerox+Hex.rayon ) Vp.x = Hex.zerox+Hex.rayon;
                        
                        Vp.y = this.point.y-rebondY*rebond-rebondY/2;
                        
                        Va = -Va+180;
                        rebond ++;
                        
                    } else if( Vp.y < Hex.rayon ) {
                        break;
                    }
                    
                    var hex = Hex.pixelToHex(Vp);
                    var last = this.list[this.list.length-1];
                    
                    if( ( !last || !last.point.egal(hex) ) && this.M.G.is(hex) ) 
                        this.list.push(this.M.G.get(hex));
                    
                    this.pico.push({point:new Point (Vp.x, Vp.y), hex:hex, rebond:rebond});
                }
            
                Deja.cache('calc', cacheName, [this.pico, this.list]);
                
            } else {
                this.pico = ret[0];
                this.list = ret[1];
            }
            
            if(this.option.ghost) {
                for ( var k = this.list.length-1; k > 0 ; k-- )
                    if( !this.list[k].on ) break;
            } else {
                for ( var k = 0, l = this.list.length ; k < l ; k++ )
                    if( this.list[k].on ) break;
                k--;
            }
            
            this.goal = this.list[k];
            
            this.parcour = [];
            for ( var k = 1, l = this.pico.length ; k < l ; k++ ) {
                if( this.goal != undefined && this.pico[k].hex.egal(this.goal.point) ) break;
                if (k%7 == 0) this.parcour.push(this.pico[k]);
            }
            
        }
        
        this.trace = function () {
        
            if(this.option.debug) {
                View['canon'].ctx.rect(Hex.zerox+Hex.dwidth,Hex.rayon+Hex.drayon,Hex.aWidth-2*Hex.dwidth,window.innerHeight);
                View['canon'].ctx.lineWidth = 1;
                View['canon'].ctx.strokeStyle = 'red';
                View['canon'].ctx.stroke();
                View['canon'].ctx.closePath();
                
                if( this.list ) 
                    for ( var k = 0, l = this.list.length ; k < l ; k++ ) {
                        var size = Hex.drayon;
                        if(this.list[k].on) size = Hex.rayon/3;
                        Sprite.gaol( this.list[k] );
                    }
            }
            
            if( this.parcour ) Sprite.trace( this.parcour );
            if( this.goal    ) Sprite.gaol( this.goal );
            
        }
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
    
})(this);
