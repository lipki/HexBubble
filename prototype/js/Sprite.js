;(function(environment){
    'use strict';
    
    /** Classe regroupant tout les assets graphique */
    function Sprite () {
        
        // animate sprite
        
        this.animList = [];
        this.animStep = 0;
        
        /** Boucle avec requestAnimationFrame qui gère toute les animations */
        this.animAll = function () {
            
            for( var a = 0, l = this.animList.length ; a < l ; a++ ) {
                if( this.animList[a] == null ) continue;
                
                var name = this.animList[a].name;
                var sprite = this.animList[a].sprite;
                var start = this.animList[a].start;
                var args = this.animList[a].args.concat([this.animStep-start, name]);
                var callbackStep = this.animList[a].callbackStep;
                this[sprite].apply(this, args );
                if( callbackStep !=undefined ) callbackStep();
                    
            }
            
            this.animStep ++;
            var mi = this;
            requestAnimationFrame(function () { mi.animAll() });
        }
        
        /**
         * Fonction permettant d'ajouter un sprite, dans la boucle d'animation
         * @param {string} name - id de l'animation.
         * @param {string} sprite - nom de la fonction sprite.
         * @param {string} args - argument a fournir a la fonction.
         * @param {string} callbackStep - callback appeler a chaque étape.
         * @param {string} callbackend - callback appeler a la fin de l'animation.
         */
        this.animAdd = function ( name, sprite, args, callbackStep, callbackend ) {
            this.animList.push({
                name:name,
                sprite:sprite,
                args:args,
                callbackStep:callbackStep,
                callbackend:callbackend,
                start:this.animStep
            });
        }
        
        /**
         * Fonction permettant de suprimmer un sprite, de la boucle d'animation.
         * @param {string} name - id de l'animation.
         */
        this.animDel = function ( name ) {
            var animlist = [];
            for( var a = 0, l = this.animList.length ; a < l ; a++ )
                if( this.animList[a].name == name )
                     var callbackend = this.animList[a].callbackend;
                else animlist.push(this.animList[a]);
            this.animList = animlist;
            if( callbackend != undefined ) callbackend();
        }
        
        this.animAll();
        
        // game sprite
        
        this.tileBack = function ( tile ) {
            
            this.hex(View['back'].ctx, tile.px, '#181818', Hex.rayon);
            //this.font(View['back'].ctx, tile.px, 'white', Hex.rayon/2, String(tile.group)[0] );
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
                //this.font(View['cube'].ctx, tile.px, 'white', Hex.rayon/2, String(tile.group)[0] );
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
            var color = 'red';
            
            this.hex(View['borderGift'].ctx, px, 'white', Hex.rayon, Hex.rayon/4);
            this.hex(View['borderGift'].ctx, px, 'white', Hex.rayon);
            this.hex(View['gift'].ctx, px, color, Hex.rayon);
            this.shadowOut(View['gift'].ctx, px, Hex.rayon);
            
            var p1 = new Point( tile.point.x-1, tile.point.y );
            if(Math.isPair(tile.point.y)) {
                var p2 = new Point( tile.point.x, tile.point.y-1 );
                var p3 = new Point( tile.point.x+1, tile.point.y-1 );
            } else {
                var p2 = new Point( tile.point.x-1, tile.point.y-1 );
                var p3 = new Point( tile.point.x, tile.point.y-1 );
            }
            
            var grouPot = [];
            for( var gr = 0, l = tile.near.length ; gr < l ; gr++ ) {
                if( !tile.near[gr].on || tile.near[gr].type != 'gift' ) continue;
                
                     if( p1.egal(tile.near[gr].point) )
                    var p = new Point(px.x-Hex.dwidth, px.y+Hex.drayon);
                else if( p2.egal(tile.near[gr].point)
                      || p3.egal(tile.near[gr].point) )
                    var p = new Point(px.x, px.y-Hex.rayon);
            
                if( p != undefined ) {
                    this.hex(View['borderGift'].ctx, p, 'white', Hex.rayon/2, Hex.rayon/4);
                    this.hex(View['borderGift'].ctx, p, 'white', Hex.rayon/2);
                    this.hex(View['gift'].ctx, p, color, Hex.rayon/2);
                    this.shadowOut(View['gift'].ctx, p, Hex.rayon/2);
                }
                
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
            
            if( !canon.inshoot ) return ;
            
            this.hex(ctx, canon.point, canon.ball, Hex.rayon/5*4);
            this.shadowIn(ctx, canon.point, Hex.rayon/5*4);
            
        }
        
        this.ballRes = function ( canon ) {
            
            var p = new Point(canon.point.x + Hex.rayon*2, canon.point.y+Hex.drayon);
            this.hex(View['back'].ctx, p, 'white' , Hex.rayon/3*2, Hex.rayon/4);
            this.hex(View['back'].ctx, p, canon.ballRes, Hex.rayon/3*2);
            this.shadowOut(View['back'].ctx, p, Hex.rayon/3*2);
        
        }
        
        this.trace = function ( parcour ) {
            
            for ( var k = 0, l = parcour.length ; k < l ; k++ ) {
            
                var ctx = View['canon'].ctx;
                var size = Hex.rayon/8;
                var p = parcour[k].point;
                
                ctx.beginPath();
                ctx.arc( p.x, p.y, size, 0, 2*Math.PI  );
                
                ctx.lineWidth = size/3;
                ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
                ctx.stroke();
                
                ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
                ctx.fill();
                
                ctx.closePath();
            }
            
        }
        
        this.gaol = function ( tile ) {
            
            this.hex(View['canon'].ctx, tile.px, 'rgba(255,255,255,0.5)', Hex.rayon/5*4);
            this.shadowOut(View['canon'].ctx, tile.px, Hex.rayon/5*4);
            
        }
        
        this.move = function ( canon, stepp ) {
            
            //balle
            if( canon.pico[stepp] == undefined )
                return this.animDel( 'move' );
            
            if( canon.pico[stepp-1] != undefined ) {
                var step = canon.pico[stepp-1];
                View.borderBalle.ctx.clearRect(step.point.x-Hex.rayon, step.point.y-Hex.rayon, step.point.x+Hex.rayon, step.point.y+Hex.rayon);
                View.balle.ctx.clearRect(step.point.x-Hex.rayon, step.point.y-Hex.rayon, step.point.x+Hex.rayon, step.point.y+Hex.rayon);
            }
            
            var step = canon.pico[stepp];
            
            this.hex(View['borderBalle'].ctx, step.point, 'white' , Hex.rayon, Hex.rayon/4);
            this.hex(View['balle'].ctx, step.point, canon.ballShoot, Hex.rayon);
            this.shadowOut(View['balle'].ctx, step.point, Hex.rayon);
         
        }
        
        this.poufTime = 5;
        this.pouf = function ( pouflist, step ) {
            
            View.clear('borderBalle');
            
            if( step > this.poufTime )
                return this.animDel( 'pouf' );
            
            for( var t = 0, l = pouflist.length; t < l;  t++ ) {
                
                var size = Math.round(Hex.rayon-Hex.rayon/this.poufTime*step);
                this.hex(View['borderBalle'].ctx, pouflist[t].px, 'white', size, Hex.rayon/4);
                this.hex(View['borderBalle'].ctx, pouflist[t].px, 'white', size);
                
            }
            
        }
        
        this.win = function( gifts, step ) {
            //View.clear('borderGift');
            View.clear('gift');
            
            for( var t = 0, l = gifts.length; t < l;  t++ ) {
                var p = new Point(gifts[t].px.x, gifts[t].px.y);
                p.y += Math.cos(step/10+1.5)*Hex.rayon;
                this.tileGift( gifts[t], p );
            }
        }
        
        this.body = function( ctx ) {
            
            var rayon = Hex.drayon;
            var width = Hex.dwidth;
            
            ctx.rect(0,0,width,rayon*3.5);
            ctx.fillStyle = '#222';
            ctx.fill();
            ctx.closePath();
            
            var p = new Point(width/2,-rayon*1.5);
            p.x -= width/2; p.y += rayon;
            this.shadowIn(ctx, p, rayon);
            p.x += width;
            this.shadowIn(ctx, p, rayon);
            p.x -= width/2; p.y += rayon*1.5;
            this.shadowIn(ctx, p, rayon);
            p.x -= width/2; p.y += rayon*1.5;
            this.shadowIn(ctx, p, rayon);
            p.x += width;
            this.shadowIn(ctx, p, rayon);
            
            var data = ctx.getImageData(0,0,width,rayon*3.5);
            
            var p = new Point(Hex.zerox+Hex.dwidth-width-(Math.ceil(Hex.zerox/width)*width),-Hex.drayon+(rayon/2)*5);
            var nw = window.innerWidth/width;
            var nh = window.innerHeight/(rayon*3);
            
            for( var x = 0;  x < nw;  x++ )
            for( var y = 0;  y < nh;  y++ )
                ctx.putImageData(data, x*width+p.x, y*(rayon*3)-p.y);
            
        }
        
        this.alert = function ( str, time, step, thisAnim ) {
            
            View.clear('alert');
                
            if( step > time )
                return this.animDel(thisAnim);
            
            var p = Hex.hexToPixel(new Point(4,5));
            var ligne = str.split('/n');
            
            var rectY = p.y-Hex.rayon*3;
            var rectHeight = ligne.length+Hex.rayon*6;
            
            View['alert'].ctx.rect( 0, rectY, View.width, rectHeight );
            View['alert'].ctx.fillStyle = 'rgba(0,0,0,0.5)';
            View['alert'].ctx.fill();
            View['alert'].ctx.closePath();
            
            if( step == undefined ) {
                
                for( var t = 0, l = ligne.length; t < l ; t++ ) {
                    p.x -= (ligne[t].length-1)/2*Hex.width;
                    for( var c = 0, C = ligne[t].length; c < C ; c++ )
                        this.font(View['alert'].ctx, new Point(p.x+Hex.width*c, p.y), 'white', Hex.rayon, ligne[t][c] );
                }
                
            } else {
                
                var letterTime = 4;
            
                var letter = Math.floor(step/letterTime);
                var letter = letter >= str.length ? str.length : letter;
                
                var empty = new Array(str.length-letter+1).join(' ');
                var ligne = (str.substr(0, letter) + empty).split('/n');
                
                for( var t = 0, l = ligne.length; t < l ; t++ ) {
                    p.x -= (ligne[t].length-1)/2*Hex.width;
                    p.y += t*Hex.rayon*1.5;
                    for( var c = 0, C = ligne[t].length; c < C ; c++ )
                        this.font(View['alert'].ctx, new Point(p.x+Hex.width*c, p.y), 'white', Hex.rayon, ligne[t][c] );
                }
                
            }
            
        }
        
        // model part
        
        this.hex = function ( ctx, center, color, size, sizeBorder ) {
            
            ctx.beginPath();
            
            var p1= this.hexCorner(center, size, 0);
            ctx.lineTo(p1.x, p1.y);
            var p = this.hexCorner(center, size, 1);
            ctx.lineTo( p.x, p.y );
            var p = this.hexCorner(center, size, 2);
            ctx.lineTo( p.x, p.y );
            var p = this.hexCorner(center, size, 3);
            ctx.lineTo( p.x, p.y );
            var p = this.hexCorner(center, size, 4);
            ctx.lineTo( p.x, p.y );
            var p = this.hexCorner(center, size, 5);
            ctx.lineTo( p.x, p.y );
            ctx.lineTo(p1.x, p1.y);
            
            if( sizeBorder ) {
                ctx.lineCap="round";
                ctx.lineJoin="round";
                ctx.lineWidth = sizeBorder;
                ctx.strokeStyle = color;
                ctx.stroke();
            } else {
                ctx.fillStyle = color;
                ctx.fill();
            }
            ctx.closePath();
            
        }
        
        this.font = function ( ctx, center, color, size, str ) {
            
            var sl = size*2;
            var p = new Point(center.x-(sl/2 -Math.round(sl/13)), center.y+(size +Math.round(sl/31)));
            ctx.font = sl+"px hexfont";
            ctx.fillStyle = color;
            ctx.fillText(str, p.x, p.y);
            
        }
        
        this.hexCorner = function( center, size, i, angle_start ) {
            
            var cacheName = size+'_'+i+'_'+angle_start;
            var ret = Deja.read('hexCorner', cacheName);
            if( ret !== false )
                return new Point(ret.x + center.x, ret.y + center.y);
            
            var angle_start = angle_start != undefined ? angle_start : 30;
            var angle_deg = 60 * i + angle_start;
            var angle_rad = Math.PI / 180 * angle_deg;
            var ret = new Point(size * Math.cos(angle_rad), size * Math.sin(angle_rad));
            Deja.cache('hexCorner', cacheName, ret);
            
            return new Point(ret.x + center.x, ret.y + center.y);
            
        }

        this.shadowIn = function( ctx, center, size ) {
            
            ctx.beginPath();
            
            this.shadowPart( ctx, 'front', 'in', center, size);
            this.shadowPart( ctx, 'left' , 'in', center, size);
            this.shadowPart( ctx, 'right', 'in', center, size);
            
        }

        this.shadowOut = function( ctx, center, size ) {
            
            ctx.beginPath();
            
            this.shadowPart( ctx, 'front', 'out', center, size);
            this.shadowPart( ctx, 'left' , 'out', center, size);
            this.shadowPart( ctx, 'right', 'out', center, size);
            
        }

        this.shadowPart = function( ctx, mod, out, center, rayon ) {
            
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
            
            /*ctx.lineWidth = 1;
            ctx.strokeStyle = 'black';
            ctx.stroke();*/
            
            ctx.closePath();
            
        }
        
    }
    
    environment['Sprite'] = new Sprite ();
    
})(this);
