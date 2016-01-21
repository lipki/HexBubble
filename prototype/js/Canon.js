;(function(environment){
    'use strict';
    
    environment['Canon'] = function Canon (main, point, angleMin, angleMax, angleStep) {
        
        this.M = main;
        this.point = point;
        this.precision = Hex.rayon/2;
        
        this._angle = 0;
        this.angleMin = angleMin;
        this.angleMax = angleMax;
        this.angleStep = angleStep;
        
        this.option = {debug:true, trace:true, ghost:false, switch:false, demi:false, micro:false, percante:false, bombe:false };
        
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
            if( hex && this.M.G.get(hex) ) {
                var hex = this.M.G.get(hex);
                console.log(hex);
                Sprite.hex(View['balle'].ctx, hex.px, 'rgba(255,255,255,0.5)', Hex.rayon/5*4);
                Sprite.shadowOut(View['balle'].ctx, hex.px, Hex.rayon/5*4);
            }*/

            this.angle = Math.atan2(x, y)/Math.PI*180;
            
            Sprite.canon( this );
            if( this.inshoot == true || !this.option.trace ) return ;
            
            this.calc();
            
            if( this.option.trace || this.option.debug ) this.trace();
            
        }

        this.pan = function (e) {
            if( this.inshoot ) return ;
            
            this.calc();
            this.inshoot = true;
            this.ballSwitch();
            var mi = this;
            Sprite.animAdd( 'move', 'move', [this], null , function(){
                View.clear('borderBalle');
                View.clear('balle');
                mi.M.pan();
            });
        }
        
        this.ballSwitch = function () {
            this.ballShoot = this.ball;
            this.ball = this.ballRes;
            if( this.types.length > 0 ) {
                this.ballRes = this.types[Math.floor(Math.random()*this.types.length)];
                Sprite.ballRes(this);
            }
            Sprite.canon( this );
        }
        
        this.calc = function () {
            
            this.pico = this.calcPico();
            
            this.list = [];
            for ( var k = 1, l = this.pico.length ; k < l ; k++ ) {
                
                var hex = Hex.pixelToHex(this.pico[k].point);
                var last = this.list[this.list.length-1];
                
                console.log('---');
                console.log(this.pico[k].point);
                /*console.log(Sprite.hexCorner(this.pico[k].point, Hex.rayon, 0));
                console.log(Hex.pixelToHex(Sprite.hexCorner(this.pico[k].point, Hex.rayon, 0)));
                console.log(this.M.G.get(Hex.pixelToHex(Sprite.hexCorner(this.pico[k].point, Hex.rayon, 0))));
                console.log(this.M.G.get(Hex.pixelToHex(Sprite.hexCorner(this.pico[k].point, Hex.rayon, 0))).on);*/
                
                View['canon'].ctx.beginPath();
                var p = Sprite.hexCorner(this.pico[k].point, Hex.rayon, 0);
                View['canon'].ctx.lineTo( p.x, p.y );
                var p = Sprite.hexCorner(this.pico[k].point, Hex.rayon, 3);
                View['canon'].ctx.lineTo( p.x, p.y );
                View['canon'].ctx.fillStyle = 'rgba(255,0,0,0.5)';
                View['canon'].ctx.fill();
                View['canon'].ctx.closePath();
                
                /*if( this.M.G.get(Hex.pixelToHex(Sprite.hexCorner(this.pico[k].point, Hex.rayon, 0))).on ) break;
                if( this.M.G.get(Hex.pixelToHex(Sprite.hexCorner(this.pico[k].point, Hex.rayon, 1))).on ) break;
                if( this.M.G.get(Hex.pixelToHex(Sprite.hexCorner(this.pico[k].point, Hex.rayon, 2))).on ) break;
                if( this.M.G.get(Hex.pixelToHex(Sprite.hexCorner(this.pico[k].point, Hex.rayon, 3))).on ) break;
                if( this.M.G.get(Hex.pixelToHex(Sprite.hexCorner(this.pico[k].point, Hex.rayon, 4))).on ) break;
                if( this.M.G.get(Hex.pixelToHex(Sprite.hexCorner(this.pico[k].point, Hex.rayon, 5))).on ) break;*/
                
                //if( ( !last || !last.point.egal(hex) ) && this.M.G.get(hex) && !this.M.G.get(hex).on ) 
                this.list.push(this.M.G.get(hex));
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
            
        }
        
        this.calcPico = function() {
            
            var Vp = new Point(this.point.x, this.point.y);
            var Va = this.angle-90;
            var rebond = 0;
            var rebondY = Math.abs(Math.tan(Math.PI / 180 * Va) * (Hex.aWidth-Hex.rayon*2));
            
            var pico = [];
            
            for( var i = 0; i < 1200; i++ ) {
                
                Vp.x += this.precision * Math.cos(Math.PI / 180 * Va);
                Vp.y += this.precision * Math.sin(Math.PI / 180 * Va);
                
                if( Vp.y < Hex.rayon ) break;
                
                if( Vp.x > View.width-Hex.zerox-Hex.rayon || Vp.x < Hex.zerox+Hex.rayon ) {
                    
                    if( Vp.x > View.width-Hex.zerox-Hex.rayon ) Vp.x = View.width-Hex.zerox-Hex.rayon;
                    if( Vp.x < Hex.zerox+Hex.rayon ) Vp.x = Hex.zerox+Hex.rayon;
                    
                    Vp.y = this.point.y-rebondY*rebond-rebondY/2;
                    
                    Va = -Va+180;
                    rebond ++;
                    
                }
                
                pico.push({point:new Point (Math.round(Vp.x), Math.round(Vp.y)), rebond:rebond});
            }
        
            return pico;
            
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
                
                //for ( var k = 1, l = this.pico.length ; k < l ; k++ )
                //    Sprite.hex(View['canon'].ctx, this.pico[k].point, 'rgba(255,0,0,0.5)', Hex.rayon/5*4);
            }
            
            if( this.pico ) Sprite.trace( this.pico );
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
