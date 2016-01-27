;(function(undefined){
    'use strict';
    
    /** Classe regroupant tout les assets graphique */
    function Sprite ( main ) {
        
        var A, U, C, S, G, H, V;
        this.init = function ( clas ) {
            A = clas[0]; U = clas[1]; C = clas[2]; S = clas[3]; G = clas[4]; H = clas[5]; V = clas[6];
        }
        
        this.appInit = function () {
        
            this.animList = [];
            this.animStep = 0;
            this.lastLoop = new Date;
            
            this.animAll();
                
        }
        
        /** Boucle avec requestAnimationFrame qui gère toute les animations */
        this.animAll = function () {
            /*var thisLoop = new Date;
            var fps = 1000 / (thisLoop - this.lastLoop);
            this.lastLoop = thisLoop;
            document.title=(Math.round(fps));*/
            
            for( var a = 0, l = this.animList.length ; a < l ; a++ ) {
                if( undefined === this.animList[a] ) continue;
                
                var args = this.animList[a].args.concat([this.animStep-this.animList[a].start, this.animList[a].name]);
                var callbackStep = this.animList[a].callbackStep;
                this[this.animList[a].sprite].apply(this, args );
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
                if( this.animList[a].name === name )
                     var callbackend = this.animList[a].callbackend;
                else animlist.push(this.animList[a]);
            this.animList = animlist;
            if( callbackend != undefined ) callbackend();
        }
        
        // game sprite
        
        this.tileOn = function ( tile, size, ctx, ctxborder ) {
            
            var size = size || H.rayon;
            var ctx = ctx || 'cube';
            var ctxborder = ctxborder || 'border';
            
            var px = new Point(tile.px.x + H.drayon, tile.px.y +H.drayon);
            
            if( tile.type.indexOf('gift') != -1 )
                this.tileGift( tile );
            /*else if( 'fixed' === tile.type )
                this.tileFixed( tile );
            else if( -1 !== A.ref.ballOption.indexOf(tile.type) ) {
                this.hex(V[ctxborder].ctx, px, 'black' , size, 'white', H.rayon/4);
                this.hex(V[ctx].ctx, px, 'black' , size);
                this.font(V[ctx].ctx, px, 'white', size/2, tile.type[0] );
                this.shadowOut(V[ctx].ctx, px, size);
            } else  {
                this.hex(V[ctxborder].ctx, px, tile.type, size, 'white' , H.rayon/4);
                this.hex(V[ctx].ctx, px, tile.type, size);
                //this.font(V['cube'].ctx, px, 'white', size/2, String(tile.group)[0] );
                this.shadowOut(V[ctx].ctx, px, size);
            }*/
            
        }
        
        this.tileFixed = function ( tile, p ) {
            
            var px = p || tile.px;
            
            this.hex(V['border'].ctx, px, 'DarkKhaki', H.rayon, 'white', H.rayon/4);
            this.hex(V['cube'].ctx, px, 'DarkKhaki', H.rayon);
            this.shadowOut(V['cube'].ctx, px, H.rayon);
            
            this.hex(V['cube'].ctx, px, 'DarkKhaki', H.drayon);
            this.shadowIn(V['cube'].ctx, px, H.drayon);
            
        }
        
        this.tileGift = function ( tile, p ) {
            
            var px = p || tile.px;
            var color = 'red';
            
            this.hex(V['borderGift'].ctx, px, color, H.rayon, 'white', H.rayon/4);
            this.hex(V['gift'].ctx, px, color, H.rayon);
            this.shadowOut(V['gift'].ctx, px, H.rayon);
            
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
                    var p = new Point(px.x-H.dwidth, px.y+H.drayon);
                else if( p2.egal(tile.near[gr].point)
                      || p3.egal(tile.near[gr].point) )
                    var p = new Point(px.x, px.y-H.rayon);
            
                if( p != undefined ) {
                    this.hex(V['borderGift'].ctx, p, color, H.drayon, 'white', H.rayon/4);
                    this.hex(V['gift'].ctx, p, color, H.drayon);
                    this.shadowOut(V['gift'].ctx, p, H.drayon);
                }
                
            }
            
        }
        
        this.canon = function ( canon ) {
            
            var ctx = V['canon'].ctx;
            V.clear('canon');
            
            ctx.beginPath();
            var p = H.hexCorner(canon.point, H.rayon, 2);
            ctx.lineTo( p.x, p.y );
            if(canon.angle <= -30)
                 var p = H.hexCorner(canon.point, H.rayon*1.7, 3, canon.angle+90);
            else var p = H.hexCorner(canon.point, H.rayon, 3);
            ctx.lineTo( p.x, p.y );
            if(canon.angle > -30 && canon.angle < 30)
                 var p = H.hexCorner(canon.point, H.rayon*1.7, 4, canon.angle+30);
            else var p = H.hexCorner(canon.point, H.rayon, 4);
            ctx.lineTo( p.x, p.y );
            if(canon.angle >= 30)
                 var p = H.hexCorner(canon.point, H.rayon*1.7, 5, canon.angle-30);
            else var p = H.hexCorner(canon.point, H.rayon, 5);
            ctx.lineTo( p.x, p.y );
            var p = H.hexCorner(canon.point, H.rayon, 0);
            ctx.lineTo( p.x, p.y );
            
            ctx.lineCap="round";
            ctx.lineJoin="round";
            ctx.lineWidth = H.rayon/4;
            ctx.strokeStyle = 'white';
            ctx.stroke();
                
            ctx.fillStyle = 'white';
            ctx.fill();
            
            ctx.closePath();
            
            this.tileOn( {px:canon.point, type:canon.ball}, H.rayon, 'canon', 'canon' );
            
            if( !canon.inshoot ) return ;
            
            this.hex(ctx, canon.point, canon.ball, H.rayon/5*4);
            this.shadowIn(ctx, canon.point, H.rayon/5*4);
            
        }
        
        this.ballRes = function ( canon ) {
            
            var p = new Point(canon.point.x + H.rayon*2, canon.point.y+H.drayon);
            this.hex(V['back'].ctx, p, canon.ballRes, H.rayon/3*2, 'white', H.rayon/4);
            this.shadowOut(V['back'].ctx, p, H.rayon/3*2);
        
        }
        
        this.trace = function ( parcour ) {
            
            for ( var k = 0, l = parcour.length ; k < l ; k++ ) {
            
                var ctx = V['canon'].ctx;
                var size = H.rayon/8;
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
            
            this.hex(V['canon'].ctx, tile.px, 'rgba(255,255,255,0.5)', H.rayon/5*4);
            this.shadowOut(V['canon'].ctx, tile.px, H.rayon/5*4);
            
        }
        
        this.move = function ( canon, stepp ) {
            
            //balle
            if( undefined === canon.pico[stepp] )
                return this.animDel( 'move' );
            
            if( canon.pico[stepp-1] != undefined ) {
                var step = canon.pico[stepp-1];
                V.borderBalle.ctx.clearRect(step.point.x-H.rayon, step.point.y-H.rayon, step.point.x+H.rayon, step.point.y+H.rayon);
                V.balle.ctx.clearRect(step.point.x-H.rayon, step.point.y-H.rayon, step.point.x+H.rayon, step.point.y+H.rayon);
            }
            
            var step = canon.pico[stepp];
            
            this.tileOn( {px:step.point, type:canon.ballShoot}, H.rayon, 'balle', 'borderBalle' );
         
        }
        
        this.poufTime = 5;
        this.pouf = function ( pouflist, step ) {
            
            V.clear('borderBalle');
            
            if( step > this.poufTime )
                return this.animDel( 'pouf' );
            
            for( var t = 0, l = pouflist.length; t < l;  t++ ) {
                
                var size = Math.round(H.rayon-H.rayon/this.poufTime*step);
                this.hex(V['borderBalle'].ctx, pouflist[t].px, 'white', size, 'white', H.rayon/4);
                
            }
            
        }
        
        this.win = function( gifts, step ) {
            //V.clear('borderGift');
            V.clear('gift');
            
            for( var t = 0, l = gifts.length; t < l;  t++ ) {
                var p = new Point(gifts[t].px.x, gifts[t].px.y);
                p.y += Math.cos(step/10+1.5)*H.rayon;
                this.tileGift( gifts[t], p );
            }
        }
        
        this.body = function() {
            
            var ctx = V.back.ctx;
            
            
            // bande
            var lp = [];
            
            var grd = ctx.createLinearGradient(H.width+H.dwidth-V.height, 0, H.width+H.dwidth+V.height, V.height);
            grd.addColorStop(0, 'rgba(0, 0, 0, 0.2)');
            grd.addColorStop(1, 'rgba(0, 0, 0, 1)');
            lp.push(grd);
                
            grd = ctx.createLinearGradient(H.dwidth-V.height, 0, H.dwidth+V.height, V.height);
            grd.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
            grd.addColorStop(1, 'rgba(0, 0, 0, 0)');
            lp.push(grd);
            
            for( var x = 0;  x < 2;  x++ ) {
                
                ctx.beginPath();
                
                ctx.moveTo( x*H.dwidth, 0  );
                ctx.lineTo( (x+1)*H.dwidth, 0 );
                ctx.lineTo( (x+1)*H.dwidth, V.height );
                ctx.lineTo( x*H.dwidth, V.height );
                ctx.fillStyle = '#181818';
                ctx.fill();
                
                ctx.moveTo( x*H.dwidth, 0  );
                ctx.lineTo( (x+1)*H.dwidth, 0 );
                ctx.lineTo( (x+1)*H.dwidth, V.height );
                ctx.lineTo( x*H.dwidth, V.height );
                ctx.fillStyle = lp[x%2];
                ctx.fill();
                ctx.closePath();
                
            }
            
            var bande = ctx.getImageData(0,0,H.width,V.height);
            
            
            // Cube
            
            var p = new Point(0,-H.drayon);
            this.hex(ctx, p, '#181818', H.rayon);
            this.shadowIn(ctx, p, H.rayon);
            p.x += H.width;
            this.hex(ctx, p, '#181818', H.rayon);
            this.shadowIn(ctx, p, H.rayon);
            p.x -= H.dwidth; p.y += H.rayon*1.5;
            this.hex(ctx, p, '#181818', H.rayon);
            this.shadowIn(ctx, p, H.rayon);
            
            var cube = ctx.getImageData(0,0,H.width,H.rayon*2);
            
            
            // pti Cube
            var p = new Point( H.dwidth, H.rayon);
            this.hex(ctx, p, '#222', H.drayon);
            this.shadowOut(ctx, p, H.drayon);
            
            var ptiCube = ctx.getImageData(0,0,H.width,H.rayon*2);
            
            
            
        
            var ow = H.zerox;
            var oh = H.zeroy;
            
            //bande
            for( var x = -1;  x < A.ref.gameGridSize.x;  x++ )
                ctx.putImageData(bande, x*H.width +ow+H.dwidth, oh+(H.rayon*1.5)*(A.ref.gameGridSize.y)+H.drayon);
            
            
            //hool
            var nw = V.width;
            var nh = V.height/(H.rayon*3)+1;
            for( var x = 0;  x < A.ref.gameGridSize.x;  x++ )
            for( var y = 0;  y < A.ref.gameGridSize.y;  y++ ) {
                var dw = !Math.isPair(y) ? H.dwidth : 0 ;
                ctx.putImageData(cube, x*H.width +ow+dw, y*H.rayon*1.5  +oh);
            }
        
            //pti
            for( var x = -1;  x < A.ref.gameGridSize.x+1;  x++ )
            for( var y = -1;  y < A.ref.gameGridSize.y+3;  y++ )
                if( ( y < 0 && x > 0 )
                 || ( x == -1 && Math.isPair(y) || x == 0 && !Math.isPair(y)
                 || x == A.ref.gameGridSize.x ) ) {
                    var dw = !Math.isPair(y) ? H.dwidth : 0 ;
                    ctx.putImageData(ptiCube, x*H.width +ow -dw, y*H.rayon*1.5  +oh);
                }
                
            //bande
            for( var x = -(H.zerox/H.width|0)-1;  x < -1;  x++ )
                ctx.putImageData(bande, x*H.width +ow+H.dwidth, 0);
            for( var x = A.ref.gameGridSize.x;  x < A.ref.gameGridSize.x+(H.zerox/H.width|0);  x++ )
                ctx.putImageData(bande, x*H.width +ow+H.dwidth, 0);
            
            
        }
        
        this.alert = function ( str, time, step, thisAnim ) {
            
            V.clear('alert');
                
            if( step > time )
                return this.animDel(thisAnim);
            
            var ctx = V['alert'].ctx;
            var p = H.hexToPixel(new Point((A.ref.gameGridSize.x/2)|0,(A.ref.gameGridSize.y/2)|0));
            var ligne = str.split('\n');
            var proLigne = ligne.slice(0);
            
            var rectY = p.y-H.rayon*3;
            var rectHeight = H.rayon*2*ligne.length+H.rayon*3;
            
            V['alert'].ctx.rect( 0, rectY, V.width, rectHeight );
            V['alert'].ctx.fillStyle = 'rgba(0,0,0,0.5)';
            V['alert'].ctx.fill();
            V['alert'].ctx.closePath();
            
            if( step != undefined ) {
                
                var letterTime = 4;
                var letter = (step/letterTime)|0;
                var letter = letter >= str.length ? str.length : letter;
                var length = str.split('\n').join('').length;
                
                for( var t = 0, l = ligne.length; t < l ; t++ ) {
                    var lett = ligne[t-1] ? letter-ligne[t-1].length : letter;
                    lett = lett < 0 ? 0 : lett;
                    var emptylength = ligne[t].length-lett+1;
                    var empty = (emptylength <= 0) ? '' : new Array(ligne[t].length-lett+1).join(' ');
                    proLigne[t] = (ligne[t].substr(0, lett) + empty);
                }
                
            }
            
            for( var t = 0, l = ligne.length; t < l ; t++ ) {
                p.x = (V.alert.width/2)-((ligne[t].length/2)|0)*H.width;
                p.x += Math.isPair(p.y+t) ? 0 : H.dwidth;
                for( var c = 0, C = ligne[t].length; c < C ; c++ )
                    this.font(ctx, new Point(p.x+H.width*c, p.y+(H.rayon*1.5)*t), 'white', H.rayon, proLigne[t][c] );
            }
            
        }
        
        // model part
        
        this.hex = function ( ctx, center, color, size, colorborder, sizeBorder ) {
            
            ctx.beginPath();
            
            var p1= H.hexCorner(center, size, 0);
            ctx.lineTo(p1.x, p1.y);
            var p = H.hexCorner(center, size, 1);
            ctx.lineTo( p.x, p.y );
            var p = H.hexCorner(center, size, 2);
            ctx.lineTo( p.x, p.y );
            var p = H.hexCorner(center, size, 3);
            ctx.lineTo( p.x, p.y );
            var p = H.hexCorner(center, size, 4);
            ctx.lineTo( p.x, p.y );
            var p = H.hexCorner(center, size, 5);
            ctx.lineTo( p.x, p.y );
            ctx.lineTo(p1.x, p1.y);
            
            if( sizeBorder ) {
                ctx.lineCap="round";
                ctx.lineJoin="round";
                ctx.lineWidth = sizeBorder;
                ctx.strokeStyle = colorborder;
                ctx.stroke();
            }
            
            ctx.fillStyle = color;
            ctx.fill();
            
            ctx.closePath();
            
        }
        
        this.font = function ( ctx, center, color, size, str ) {
            
            var sl = size*2;
            var p = new Point(center.x-(sl/2 -Math.round(sl/13)), center.y+(size +Math.round(sl/31)));
            ctx.font = sl+"px hexfont";
            ctx.fillStyle = color;
            ctx.fillText(str, p.x, p.y);
            
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
            
            var grd = ctx.createLinearGradient(center.x, center.y, center.x, center.y+H.rayon);
                grd.addColorStop(0, 'rgba(0, 0, 0, 0.2)');
                grd.addColorStop(1, 'rgba(0, 0, 0, 0)');
            var lp = [0, 1, 2, grd];
            
            if( 'left' === mod && 'in' === out ) {
                grd = ctx.createLinearGradient(center.x, center.y, center.x-H.dwidth, center.y-H.drayon);
                grd.addColorStop(0, 'rgba(0, 0, 0, 0.5)');
                grd.addColorStop(1, 'rgba(0, 0, 0, 0)');
                lp = [2, 3, 4, grd];
            }
            if( 'right' === mod && 'in' === out ) {
                grd = ctx.createLinearGradient(center.x, center.y, center.x+H.dwidth, center.y-H.drayon);
                grd.addColorStop(0, 'rgba(0, 0, 0, 0.6)');
                grd.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
                lp = [4, 5, 0, grd];
            }
            if( 'front' === mod && 'out' === out ) {
                var grd = ctx.createLinearGradient(center.x, center.y, center.x, center.y-H.rayon);
                grd.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
                grd.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
                lp = [3, 4, 5, grd];
            }
            if( 'left' === mod && 'out' === out ) {
                var grd = ctx.createLinearGradient(center.x, center.y, center.x-H.dwidth, center.y+H.drayon);
                grd.addColorStop(0, 'rgba(0, 0, 0, 0.2)');
                grd.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
                lp = [1, 2, 3, grd];
            }
            if( 'right' === mod && 'out' === out ) {
                var grd = ctx.createLinearGradient(center.x, center.y, center.x+H.dwidth, center.y+H.drayon);
                grd.addColorStop(0, 'rgba(0, 0, 0, 0)');
                grd.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
                lp = [5, 0, 1, grd];
            }
            
            ctx.beginPath();
            var p1 = H.hexCorner(center, rayon, lp[0]);
            ctx.moveTo( p1.x, p1.y  );
            var p = H.hexCorner(center, rayon, lp[1]);
            ctx.lineTo( p.x, p.y );
            var p = H.hexCorner(center, rayon, lp[2]);
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
    
    var ready = new Event("hexbubble.class.sprite.loaded");
    ready.instance = new Sprite();
    document.dispatchEvent(ready);
    
})();
