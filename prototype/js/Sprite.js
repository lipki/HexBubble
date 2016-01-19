;(function(environment){
    'use strict';
    
    function Sprite () {
        
        // animate sprite
        
        this.animList = {};
        this.animStep = 0;
        
        this.animAll = function () {
            
            for( var a in this.animList ) if( this.animList[a] != null ) {
                
                var sprite = this.animList[a].sprite;
                var start = this.animList[a].start;
                var args = this.animList[a].args.concat([this.animStep-start, a]);
                var callbackStep = this.animList[a].callbackStep;
                this[sprite].apply(this, args );
                if( callbackStep !=undefined )
                    callbackStep();
                
            }
            
            this.animStep ++;
            var mi = this;
            requestAnimationFrame(function () { mi.animAll() });
        }
        
        this.animAdd = function ( name, sprite, args, callbackStep, callbackend ) {
            this.animList[name] = {
                sprite:sprite,
                args:args,
                callbackStep:callbackStep,
                callbackend:callbackend,
                start:this.animStep
            };
        }
        
        this.animDel = function ( name ) {
            var callbackend = this.animList[name].callbackend;
            this.animList[name] = null;
            if( callbackend != undefined )
                callbackend();
        }
        
        // game sprite
        
        this.tileBack = function ( tile ) {
            
            this.hex(View['back'].ctx, tile.px, '#181818', Hex.rayon);
            this.shadowIn(View['back'].ctx, tile.px, Hex.rayon);
            
        }
        
        this.tileOn = function ( tile ) {
            
            if( tile.type.indexOf('gift') != -1 )
                this.tileGift( tile );
            else if( tile.type == 'fixed' )
                this.tileFixed( tile );
            else  {
                this.hex(View['border'].ctx, tile.px, 'white' , Hex.rayon, Hex.rayon/4);
                this.hex(View['cube'].ctx, tile.px, tile.type, Hex.rayon);
                //this.font(View['cube'].ctx, tile.px, 'white', Hex.rayon, String(tile.group)[0] );
                this.shadowOut(View['cube'].ctx, tile.px, Hex.rayon);
            }
            
        }
        
        this.tileFixed = function ( tile, p ) {
            
            var px = p || tile.px;
            
            this.hex(View['border'].ctx, px, 'white', Hex.rayon, Hex.rayon/4);
            this.hex(View['border'].ctx, px, 'white', Hex.rayon);
            this.hex(View['cube'].ctx, px, 'DarkKhaki', Hex.rayon);
            this.shadowOut(View['cube'].ctx, px, Hex.rayon);
            
            this.hex(View['cube'].ctx, px, 'DarkKhaki', Hex.rayon/2);
            this.shadowIn(View['cube'].ctx, px, Hex.rayon/2);
            
        }
        
        this.tileGift = function ( tile, p ) {
            
            var px = p || tile.px;
            
            switch(tile.type) {
                case 'gift1' :
                case 'gift1.1' :
                    var color = 'red';
                break;
                case 'gift2' :
                case 'gift2.1' :
                    var color = 'OrangeRed';
                break;
            }
            
            switch(tile.type) {
                case 'gift' :
                case 'gift1' :
                case 'gift2' :
                    this.hex(View['borderGift'].ctx, px, 'white', Hex.rayon, Hex.rayon/4);
                    this.hex(View['borderGift'].ctx, px, 'white', Hex.rayon);
                    this.hex(View['gift'].ctx, px, color, Hex.rayon);
                    this.shadowOut(View['gift'].ctx, px, Hex.rayon);
                break;
                case 'gift1.1' :
                case 'gift2.1' :
                    this.hex(View['borderGift'].ctx, px, 'white', Hex.rayon, Hex.rayon/4);
                    this.hex(View['borderGift'].ctx, px, 'white', Hex.rayon);
                    this.hex(View['gift'].ctx, px, color, Hex.rayon);
                    this.shadowOut(View['gift'].ctx, px, Hex.rayon);
                
                    var p = new Point(px.x-Hex.dwidth, px.y+Hex.drayon);
                    this.hex(View['borderGift'].ctx, p, 'white', Hex.rayon/2, Hex.rayon/4);
                    this.hex(View['borderGift'].ctx, p, 'white', Hex.rayon/2);
                    this.hex(View['gift'].ctx, p, color, Hex.rayon/2);
                    this.shadowOut(View['gift'].ctx, p, Hex.rayon/2);
                
                    var p = new Point(px.x-Hex.width, px.y-Hex.rayon);
                    this.hex(View['borderGift'].ctx, p, 'white', Hex.rayon/2, Hex.rayon/4);
                    this.hex(View['borderGift'].ctx, p, 'white', Hex.rayon/2);
                    this.hex(View['gift'].ctx, p, color, Hex.rayon/2);
                    this.shadowOut(View['gift'].ctx, p, Hex.rayon/2);
                
                    var p = new Point(px.x, px.y-Hex.rayon);
                    this.hex(View['borderGift'].ctx, p, 'white', Hex.rayon/2, Hex.rayon/4);
                    this.hex(View['borderGift'].ctx, p, 'white', Hex.rayon/2);
                    this.hex(View['gift'].ctx, p, color, Hex.rayon/2);
                    this.shadowOut(View['gift'].ctx, p, Hex.rayon/2);
                break;
            }
            
        }
        
        this.canon = function ( canon ) {
            
            var ctx = View['canon'].ctx;
            View.clear('canon');
            
            ctx.beginPath();
            var p = this.hexCorner(canon.point, Hex.rayon, 2);
            ctx.lineTo( p.x, p.y );
            if(canon.angle <= -30)
                 var p = this.hexCorner(canon.point, Hex.rayon*1.7, 3, canon.angle+90);
            else var p = this.hexCorner(canon.point, Hex.rayon, 3);
            ctx.lineTo( p.x, p.y );
            if(canon.angle > -30 && canon.angle < 30)
                 var p = this.hexCorner(canon.point, Hex.rayon*1.7, 4, canon.angle+30);
            else var p = this.hexCorner(canon.point, Hex.rayon, 4);
            ctx.lineTo( p.x, p.y );
            if(canon.angle >= 30)
                 var p = this.hexCorner(canon.point, Hex.rayon*1.7, 5, canon.angle-30);
            else var p = this.hexCorner(canon.point, Hex.rayon, 5);
            ctx.lineTo( p.x, p.y );
            var p = this.hexCorner(canon.point, Hex.rayon, 0);
            ctx.lineTo( p.x, p.y );
            
            ctx.lineCap="round";
            ctx.lineJoin="round";
            ctx.lineWidth = Hex.rayon/4;
            ctx.strokeStyle = 'white';
            ctx.stroke();
            
            ctx.fillStyle= 'white';
            ctx.fill();
            
            ctx.closePath();
            
            this.hex(ctx, canon.point, canon.ball, Hex.rayon);
            this.shadowOut(ctx, canon.point, Hex.rayon);
            
            if( canon.inshoot ) {
                this.hex(ctx, canon.point, canon.ball, Hex.rayon/5*4);
                this.shadowIn(ctx, canon.point, Hex.rayon/5*4);
            }
        }
        
        this.ballRes = function ( canon ) {
            
            var p = new Point(canon.point.x + Hex.rayon*2, canon.point.y+Hex.drayon);
            this.hex(View['back'].ctx, p, 'white' , Hex.rayon/3*2, Hex.rayon/4);
            this.hex(View['back'].ctx, p, canon.ballRes, Hex.rayon/3*2);
            this.shadowOut(View['back'].ctx, p, Hex.rayon/3*2);
        
        }
        
        this.move = function ( canon, stepp ) {
            
            View.clear('borderBalle');
            View.clear('balle');
            
            //balle
            if( canon.parcour && canon.parcour[stepp] ) {
                var step = canon.parcour[stepp];
                this.hex(View['borderBalle'].ctx, step.point, 'white' , Hex.rayon, Hex.rayon/4);
                this.hex(View['balle'].ctx, step.point, canon.ballShoot, Hex.rayon);
                this.shadowOut(View['balle'].ctx, step.point, Hex.rayon);
            } else {
                this.animDel( 'move' );
            }
        }
        
        this.poufTime = 5;
        this.pouf = function ( pouflist, step ) {
            
            View.clear('borderBalle');
            
            //pouf
            for( var t = 0, l = pouflist.length; t < l;  t++ ) {
                
                var size = Math.round(Hex.rayon-Hex.rayon/this.poufTime*step);
                this.hex(View['borderBalle'].ctx, pouflist[t].px, 'white', size, Hex.rayon/4);
                this.hex(View['borderBalle'].ctx, pouflist[t].px, 'white', size);
                
            }
            
            if( step > this.poufTime ) {
                View.clear('borderBalle');
                this.animDel( 'pouf' );
            }
            
        }
        
        this.win = function( gifts, step ) {
            //View.clear('borderGift');
            View.clear('gift');
            
            //win
            for( var t = 0, l = gifts.length; t < l;  t++ ) {
                var p = new Point(gifts[t].px.x, gifts[t].px.y);
                p.y += Math.cos(step/10)*Hex.rayon;
                //p.x += Math.sin(step/10)*step/10;
                
                this.tileGift( gifts[t], p );
            }
        }
        
        this.body = function( ctx ) {
            
            var nw = window.innerWidth/(Hex.dwidth/2);
            var nh = window.innerHeight/(Hex.drayon/2);
            
            for( var x = 0;  x < nw;  x++ )
            for( var y = 0;  y < nh;  y++ ) {
                var p = new Point(x*Hex.dwidth-Hex.dwidth+Math.round(((window.innerWidth-(View.width-View.mwidth*2))/2)/(Hex.dwidth/2)),
                                  window.innerHeight-(y*Hex.drayon*1.5)-View.mheight+Hex.drayon/2);
                if( Math.isPair(y) ) p.x -= Hex.dwidth/2;
                this.hex(ctx, p, '#222', Hex.rayon/2);
                this.shadowIn(ctx, p, Hex.rayon/2);
            }
            
        }
        
        this.alert = function ( str, time, step, thisAnim ) {
            
            var p = Hex.hexToPixel(new Point(4,5));
            var ligne = str.split('/n');
            
            var rectY = p.y-Hex.rayon*3;
            var rectHeight = ligne.length+Hex.rayon*6;
                
            View.clear('alert');
            
            View['alert'].ctx.rect( 0, rectY, View.width, rectHeight );
            View['alert'].ctx.fillStyle = 'rgba(0,0,0,0.5)';
            View['alert'].ctx.fill();
            View['alert'].ctx.closePath();
            
            if( step == undefined ) {
                
                for( var t = 0, l = ligne.length; t < l ; t++ ) {
                    p.x -= (ligne[t].length-1)/2*Hex.width;
                    for( var c = 0, C = ligne[t].length; c < C ; c++ ) {
                        this.font(View['alert'].ctx, new Point(p.x+Hex.width*c, p.y), 'white', Hex.rayon, ligne[t][c] );
                    }
                }
                
            } else {
                
                var letterTime = 4;
            
                var letter = Math.floor(step/letterTime);
                var letter = letter >= str.length ? str.length : letter;
                
                var empty = new Array(str.length-letter+1).join(' ');
                var ligne = (str.substr(0, letter) + empty).split('/n');
                
                for( var t = 0, l = ligne.length; t < l ; t++ ) {
                    p.x -= (ligne[t].length-1)/2*Hex.width;
                    for( var c = 0, C = ligne[t].length; c < C ; c++ ) {
                        this.font(View['alert'].ctx, new Point(p.x+Hex.width*c, p.y), 'white', Hex.rayon, ligne[t][c] );
                    }
                }
                
                if( step > time ) {
                    View.clear('alert');
                    this.animDel(thisAnim);
                }
                
            }
            
        }
        
        // model part
        
        this.spriteHex = [];
        this.hex = function ( ctx, center, color, size, sizeBorder ) {
            
            var mi = this;
            var sSize = sizeBorder ? size+sizeBorder+10 : size+10;
            var cacheName = '_'+Array.join(arguments, '_')+'_';
            if( this.spriteHex[cacheName] == undefined ) {
                
                var po = new Point(sSize,sSize);
                size += .5;
                
                View.sprite.canvas.width = po.x*2;
                View.sprite.canvas.height = po.y*2;
                View.sprite.ctx.clearRect(0, 0, po.x*2, po.y*2);
                View.sprite.ctx.beginPath();
                
                var p1= this.hexCorner(po, size, 0);
                View.sprite.ctx.lineTo(p1.x, p1.y);
                var p = this.hexCorner(po, size, 1);
                View.sprite.ctx.lineTo( p.x, p.y );
                var p = this.hexCorner(po, size, 2);
                View.sprite.ctx.lineTo( p.x, p.y );
                var p = this.hexCorner(po, size, 3);
                View.sprite.ctx.lineTo( p.x, p.y );
                var p = this.hexCorner(po, size, 4);
                View.sprite.ctx.lineTo( p.x, p.y );
                var p = this.hexCorner(po, size, 5);
                View.sprite.ctx.lineTo( p.x, p.y );
                View.sprite.ctx.lineTo(p1.x, p1.y);
                
                if( sizeBorder ) {
                    View.sprite.ctx.lineCap="round";
                    View.sprite.ctx.lineJoin="round";
                    View.sprite.ctx.lineWidth = sizeBorder;
                    View.sprite.ctx.strokeStyle = color;
                    View.sprite.ctx.stroke();
                } else {
                    View.sprite.ctx.fillStyle = color;
                    View.sprite.ctx.fill();
                    View.sprite.ctx.closePath();
                }
                
                this.spriteHex[cacheName] = document.createElement("img");
                this.spriteHex[cacheName].setAttribute('data-name', cacheName);
                View.sprite.canvas.appendChild(this.spriteHex[cacheName]);
                this.spriteHex[cacheName].src = View.sprite.canvas.toDataURL();
                
            }
            
            ctx.drawImage(this.spriteHex[cacheName], center.x-sSize, center.y-sSize);
            
        }
        
        this.spriteFont = [];
        this.font = function ( ctx, center, color, size, str ) {
            
            var mi = this;
            var sSize = size*2;
            var cacheName = '_'+Array.join(arguments, '_')+'_';
            if( this.spriteFont[cacheName] == undefined ) {
                
                var po = new Point(sSize,sSize);
                
                View.sprite.canvas.width = po.x*2;
                View.sprite.canvas.height = po.y*2;
                View.sprite.ctx.clearRect(0, 0, po.x*2, po.y*2);
                
                var sl = size*2;
                po.x -= sl/2 -Math.round(sl/13);
                po.y += size +Math.round(sl/31);
                View.sprite.ctx.font = sl+"px hexfont";
                View.sprite.ctx.fillStyle = color;
                View.sprite.ctx.fillText(str, po.x, po.y);
                
                this.spriteFont[cacheName] = document.createElement("img");
                this.spriteFont[cacheName].setAttribute('data-name', cacheName);
                View.sprite.canvas.appendChild(this.spriteFont[cacheName]);
                this.spriteFont[cacheName].src = View.sprite.canvas.toDataURL();
                
            }
            
            ctx.drawImage(this.spriteFont[cacheName], center.x-sSize, center.y-sSize);
            
        }
        
        this.hexCorner = function( center, size, i, angle_start ) {
            
            var cacheName = size+'_'+i+'_'+angle_start;
            var ret = Deja.read('hexCorner', cacheName);
            if( ret === false ) {
                var angle_start = angle_start != undefined ? angle_start : 30;
                var angle_deg = 60 * i + angle_start;
                var angle_rad = Math.PI / 180 * angle_deg;
                var ret = new Point(size * Math.cos(angle_rad), size * Math.sin(angle_rad));
                Deja.cache('hexCorner', cacheName, ret);
            }
            return new Point(ret.x + center.x, ret.y + center.y);
            
        }

        this.spriteShadowIn = [];
        this.shadowIn = function( ctx, center, size ) {
            
            var mi = this;
            var sSize = size+10;
            var cacheName = '_'+Array.join(arguments, '_')+'_';
            if( this.spriteShadowIn[cacheName] == undefined ) {
                
                var po = new Point(sSize,sSize);
                
                View.sprite.canvas.width = po.x*2;
                View.sprite.canvas.height = po.y*2;
                View.sprite.ctx.clearRect(0, 0, po.x*2, po.y*2);
                View.sprite.ctx.beginPath();
                
                this.shadowPart( View.sprite.ctx, 'front', 'in', po, size);
                this.shadowPart( View.sprite.ctx, 'left' , 'in', po, size);
                this.shadowPart( View.sprite.ctx, 'right', 'in', po, size);
                
                this.spriteShadowIn[cacheName] = document.createElement("img");
                this.spriteShadowIn[cacheName].setAttribute('data-name', cacheName);
                View.sprite.canvas.appendChild(this.spriteShadowIn[cacheName]);
                this.spriteShadowIn[cacheName].src = View.sprite.canvas.toDataURL();
                
            }
            
            ctx.drawImage(this.spriteShadowIn[cacheName], center.x-sSize, center.y-sSize);
            
        }

        this.spriteShadowOut = [];
        this.shadowOut = function( ctx, center, size ) {
            
            var mi = this;
            var sSize = size+10;
            var cacheName = '_'+Array.join(arguments, '_')+'_';
            if( this.spriteShadowOut[cacheName] == undefined ) {
                
                var po = new Point(sSize,sSize);
                
                View.sprite.canvas.width = po.x*2;
                View.sprite.canvas.height = po.y*2;
                View.sprite.ctx.clearRect(0, 0, po.x*2, po.y*2);
                View.sprite.ctx.beginPath();
                
                this.shadowPart( View.sprite.ctx, 'front', 'out', po, size);
                this.shadowPart( View.sprite.ctx, 'left' , 'out', po, size);
                this.shadowPart( View.sprite.ctx, 'right', 'out', po, size);
                
                this.spriteShadowOut[cacheName] = document.createElement("img");
                this.spriteShadowOut[cacheName].setAttribute('data-name', cacheName);
                View.sprite.canvas.appendChild(this.spriteShadowOut[cacheName]);
                this.spriteShadowOut[cacheName].src = View.sprite.canvas.toDataURL();
                
            }
            
            ctx.drawImage(this.spriteShadowOut[cacheName], center.x-sSize, center.y-sSize);
            
        }

        this.shadowPart = function( ctx, mod, out, center, rayon ) {
            
            var rayon = rayon+0.5;
            
            var grd = ctx.createLinearGradient(center.x, center.y, center.x, center.y+Hex.rayon);
                grd.addColorStop(0, 'rgba(0, 0, 0, 0.2)');
                grd.addColorStop(1, 'rgba(0, 0, 0, 0)');
            var lp = [0, 1, 2, grd];
            
            if( mod == 'left' && out == 'in' ) {
                grd = ctx.createLinearGradient(center.x, center.y, center.x-Hex.dwidth, center.y-Hex.drayon);
                grd.addColorStop(0, 'rgba(0, 0, 0, 0.5)');
                grd.addColorStop(1, 'rgba(0, 0, 0, 0)');
                lp = [2, 3, 4, grd];
            }
            if( mod == 'right' && out == 'in' ) {
                grd = ctx.createLinearGradient(center.x, center.y, center.x+Hex.dwidth, center.y-Hex.drayon);
                grd.addColorStop(0, 'rgba(0, 0, 0, 0.6)');
                grd.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
                lp = [4, 5, 0, grd];
            }
            if( mod == 'front' && out == 'out' ) {
                var grd = ctx.createLinearGradient(center.x, center.y, center.x, center.y-Hex.rayon);
                grd.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
                grd.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
                lp = [3, 4, 5, grd];
            }
            if( mod == 'left' && out == 'out' ) {
                var grd = ctx.createLinearGradient(center.x, center.y, center.x-Hex.dwidth, center.y+Hex.drayon);
                grd.addColorStop(0, 'rgba(0, 0, 0, 0.2)');
                grd.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
                lp = [1, 2, 3, grd];
            }
            if( mod == 'right' && out == 'out' ) {
                var grd = ctx.createLinearGradient(center.x, center.y, center.x+Hex.dwidth, center.y+Hex.drayon);
                grd.addColorStop(0, 'rgba(0, 0, 0, 0)');
                grd.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
                lp = [5, 0, 1, grd];
            }
            
            ctx.beginPath();
            var p1 = this.hexCorner(center, rayon, lp[0]);
            ctx.moveTo( p1.x, p1.y  );
            var p = this.hexCorner(center, rayon, lp[1]);
            ctx.lineTo( p.x, p.y );
            var p = this.hexCorner(center, rayon, lp[2]);
            ctx.lineTo( p.x, p.y );
            ctx.lineTo( center.x, center.y );
            
            ctx.fillStyle= lp[3];
            ctx.fill();
            
            ctx.closePath();
            
        }
        
        /*this.trace = function (name, center, color, size) {
            
            var ctx = View[name].ctx;
            
            ctx.fillStyle= color;
            ctx.beginPath();
            ctx.arc( center.x, center.y, size, 0, 2*Math.PI  );
            ctx.fill();
            
            ctx.lineCap="round";
            ctx.lineJoin="round";
            ctx.lineWidth = size/3;
            ctx.strokeStyle = color;
            ctx.stroke();
            
            ctx.closePath();
            
        }*/
        
        this.animAll();
        
    }
    
    environment['Sprite'] = new Sprite ();
    
})(this);
