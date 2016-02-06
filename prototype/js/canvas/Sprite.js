var Main = (function (Main, undefined) {
    'use strict';
    
    var Hex;
    
    // class Sprite
    
    function Sprite ( hex, viewTop, viewBottom ) {
        
        Hex = hex;
        this.viewTop = viewTop || null;
        this.viewBottom = viewBottom || this.viewTop;
        
    }
    
    Sprite.pregen = function ( resolve ) {
        
        Sprite.assets = new Image();
        Sprite.assets.src = "img/assets/full.svg";
        Main.View.sprite.canvas.appendChild(Sprite.assets);

        Sprite.assets.onload = function() {
            resolve('Main.Sprite.pregen');
        }
        
    }
    
    
    
    
    
    // class Back extends Sprite
    
    function Back ( hex, viewTop ) {
        
        var viewTop = new Main.View( viewTop.name, viewTop.size, viewTop.position, viewTop.offset );
        
        Sprite.call( this, hex, viewTop );
        
    }
    
    Back.prototype = Object.create(Sprite.prototype);
    Back.prototype.constructor = Back;
    
    Back.prototype.puzzle = function(Hex) {
        
        var ref = Main.App.ref;
        var backref = Main.App.ref.assets.back;
        var px = backref[0]-Hex.zerox*ref.rapport;
        var py = backref[1]-Hex.zeroy*ref.rapport;
        var width = this.viewTop.width*ref.rapport;
        var height = this.viewTop.height*ref.rapport;
        this.viewTop.ctx.drawImage(Sprite.assets, px, py, width, height, 0, 0, this.viewTop.width, this.viewTop.height);
        
    }
    
    
    
    
    
    // class Alert extends Sprite
    
    function Alert ( hex, viewTop ) {
        
        var viewTop = new Main.View( viewTop.name, viewTop.size, viewTop.position, viewTop.offset );
        
        Sprite.call( this, hex, viewTop );
        
    }
    
    Alert.prototype = Object.create(Sprite.prototype);
    Alert.prototype.constructor = Alert;
    
    Alert.loadFont = function( resolve ) {
        
        var styleNode = document.createElement("style");
        styleNode.type = "text/css";
        styleNode.textContent = "@font-face { font-family: 'hexfont'; src: url('fonts/hex.ttf?"+Math.random()+"') format('truetype'); }";
        document.head.appendChild(styleNode);
        
        var ctx = Main.View.sprite.ctx;
        ctx.rect( 0, 0, 10, 10 );
        ctx.fill();
        ctx.font = "100px hexfont";
        ctx.fillStyle = '#fff';
        
        var si = setInterval(function() {
            ctx.fillText('o', -50, 90);
            if( 255 === ctx.getImageData(0, 0, 1, 1).data[0] ) {
                clearInterval(si);
                resolve('Main.Sprite.Alert.loadFont');
            }
        }, 10);
    }
    
    Alert.prototype.spriteFont = function( hex, center, string ) {
        
        var string = string[0];
        var fontref = Main.App.ref.assets.font;
        
        for ( var str in fontref )
            if( -1 != str.indexOf(string) ) {
                var index = str.indexOf(string);
                var px = fontref[str][0]+index*100 -50;
                var py = fontref[str][1] -50;
                this.viewTop.ctx.drawImage(Sprite.assets, px, py, 100, 100,
                    center[0]-hex.rayon, center[1]-hex.rayon, hex.rayon*2, hex.rayon*2);
                break;
            }
        
    }
    
    /*
    
    Alert.prototype.show = function ( str, step ) {
        
        var view = this.viewTop;
        var ligne = str.split('\n');
        var proLigne = ligne.slice(0);
        
        var heightChar = ((H.rayon*1.5)*ligne.length)+H.drayon;
        var p = new Point( V.width/2, V.height/2-H.drayon );
        var rectY = p.y-H.rayon*2;
        var rectHeight = (heightChar+H.rayon)+H.rayon;
        
        view.ctx.clearRect(0, 0, V.width, V.height);
        
        view.ctx.rect( 0, rectY, V.width, rectHeight );
        view.ctx.fillStyle = 'rgba(0,0,0,0.5)';
        view.ctx.fill();
        view.ctx.closePath();
        
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
            var ox = -((ligne[t].length/2)|0)*H.width;
                ox += Math.isPair(t) ? 0 : H.dwidth;
            for( var c = 0, C = ligne[t].length; c < C ; c++ )
                this.drawSprite( view, Alert.sprite['Font'+proLigne[t][c]], new Point(p.x+H.width*c +ox, p.y+(H.rayon*1.5)*t));
        }
        
    }*/
    
    
    
    
    // class Cube extends Sprite
    
    function Cube ( hex, viewTop, viewBottom ) {
        
        var viewBottom = new Main.View( viewBottom.name, viewBottom.size, viewBottom.position, viewBottom.offset );
        var viewTop = new Main.View( viewTop.name, viewTop.size, viewTop.position, viewTop.offset );
        
        Sprite.call( this, hex, viewTop, viewBottom );
        
    }
    
    Cube.prototype = Object.create(Sprite.prototype);
    Cube.prototype.constructor = Cube;
    
    Cube.prototype.spriteCube = function( hex, center, type ) {
        
        var px, py, index;
        var cuberef = Main.App.ref.assets.cube;
        var ballColor = Main.App.ref.ballColor;
        var option = Main.App.ref.ballOption.slice(0);
        option.push('fixed');
        
        if( 'star' === type ) {
            px = cuberef.borderStar[0] -100;
            py = cuberef.borderStar[1] -100;
        } else  {
            px = cuberef.border[0] -100;
            py = cuberef.border[1] -100;
        }
        
        this.viewBottom.ctx.drawImage(Sprite.assets, px, py, 200, 200,
            center[0]-hex.rayon*2, center[1]-hex.rayon*2, hex.rayon*4, hex.rayon*4);
                
        if( 'gift' === type ) {
            index = (Math.random()*10)%2|0;
            px = cuberef.gift[0]+index*100 -50;
            py = cuberef.gift[1] -50;
        } else if( -1 != option.indexOf(type) ) {
            index = option.indexOf(type);
            px = cuberef.option[0]+index*100 -50;
            py = cuberef.option[1] -50;
        } else if( -1 != ballColor.indexOf(type) ) {
            index = ballColor.indexOf(type);
            px = cuberef.color[0]+index*100 -50;
            py = cuberef.color[1] -50;
        }
        
        this.viewTop.ctx.drawImage(Sprite.assets, px, py, 100, 100,
            center[0]-hex.rayon, center[1]-hex.rayon, hex.rayon*2, hex.rayon*2);
        
    }
    
    
    
    
    
    // class Canon extends Sprite
    
    /*function Canon ( viewTop ) {
        
        Sprite.call( this, viewTop );
        
    }
    
    Canon.pregen = function ( resolve, spriteView ) {
        
        var back = new Back();
        back.spriteView = spriteView;
        /*V = view || null;
        H = hex || null;
        A = app || null;
        
        //make sprite
        
        back.makeSprite({
            'Bande':{generator:'spriteBande', args:{rayon:H.rayon, height:V.height, color:[0,0,9]}},
            'Cube':{generator:'spriteCube', args:{rayon:H.rayon, color:[0,0,9]}},
            'PtiCube':{generator:'spriteCube', args:{rayon:H.drayon, color:[0,0,9]}}
        }, function(sprites){
            
            Back.sprite = sprites;
            
            resolve('Main.Sprite.Cube.Back.pregen');
            
        });*//*
        
        resolve('Main.Sprite.Cube.Canon.pregen');
        
    }
    
    Canon.prototype = Object.create(Cube.prototype);
    Canon.prototype.constructor = Canon;
    
    Canon.prototype.drawCanon = function() {
        
        console.log('drawCanon');
        
        var view = viewTop;
        View.clear('canon');
            
        /*
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
        *//*
    }
    */
    
    
    
    Main.Sprite = Sprite;
    Main.Sprite.Cube = Cube;
    Main.Sprite.Back = Back;
    //Main.Sprite.Cube.Canon = Canon;
    Main.Sprite.Alert = Alert;
    return Main;
}(Main || {}));


/*

        
        // game sprite
        
        this.tileOn = function ( tile, size, ctx, ctxborder ) {

            else if( -1 !== A.ref.ballOption.indexOf(tile.type) ) {
                this.hex(V[ctxborder].ctx, px, 'black' , size, 'white', H.rayon/4);
                this.hex(V[ctx].ctx, px, 'black' , size);
                this.font(V[ctx].ctx, px, 'white', size/2, tile.type[0] );
                this.shadowOut(V[ctx].ctx, px, size);

        }
            
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
        
*/
