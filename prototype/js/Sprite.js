var Main = (function (Main, undefined) {
    'use strict';
    
    var V, H, A;
    
    // class Sprite
    
    function Sprite ( viewTop, viewBottom ) {
        
        this.viewTop = viewTop || null;
        this.viewBottom = viewBottom || this.viewTop;
        
    }
    
    Sprite.cache = {};
    Sprite.batch = [];
    
    Sprite.prototype.makeSprite = function( sprites, callback ) {
        
        Sprite.batch.push({sprites:sprites, callback:callback});
        
        for( var s in sprites ) {
            sprites[s].batch = Sprite.batch[Sprite.batch.length-1];
            this[sprites[s].generator](sprites[s].args, sprites[s].batch.sprites[s]);
        }
        
    }
    
    Sprite.prototype.loadedSprite = function( e, sprite ) {
        
        sprite.loaded = true;
        var batch = sprite.batch;
        var loaded = true;
        for( var s = 0, S = batch.sprites.length ; s < S ;s++ )
            loaded = batch.sprites[s].loaded || false;
        
        if( loaded ) {
            var sprites = batch.sprites;
            var callback = batch.callback;
            batch == null;
            callback(sprites);
        }
        
    }
    
    Sprite.prototype.genimgAndCache = function( cacheName, canvas, ref ) {
            
        var mi = this;
        var img = new Image();
        img.setAttribute('data-cache', cacheName);
        img.src = canvas.toDataURL();
        img.onload = function(e){mi.loadedSprite(e,ref)};
        //canvas.appendChild(img);
        Sprite.cache[cacheName] = ref.img = img;
        
    }
    
    Sprite.prototype.drawSprite = function( view, sprite, center ) {
        
        var x = center.x - sprite.img.width/2;
        var y = center.y - sprite.img.height/2;
        view.ctx.drawImage(sprite.img, x, y);
        
    }
    
    
    
    
    // class Cube extends Sprite
    
    function Cube ( viewTop, viewBottom ) {
        
        Sprite.call( this, viewTop, viewBottom );
        
    }
    
    Cube.pregen = function ( resolve, spriteView, viewTop, viewBottom, hex, app ) {
        
        var cube = new Cube( viewTop, viewBottom );
        cube.spriteView = spriteView;
        H = hex || null;
        A = app || null;
        
        //make cube
        
        var sprites = {};
        
        for( var a in A.ballColor ) {
            sprites['Cube'+a+'Border'] = {generator:'spriteCubeBorder', args:{color:A.ballColor[a], rayon:H.rayon}};
            sprites['Cube'+a]          = {generator:'spriteCube', args:{color:A.ballColor[a], rayon:H.rayon}};
        }
        
        //fixed
        sprites['FixedBorder'] = {generator:'spriteCubeBorder', args:{rayon:H.rayon}};
        sprites['Fixed']       = {generator:'spriteCubeFixed', args:{rayon:H.rayon}};
        //gift
        sprites['GiftBorder'] = {generator:'spriteCubeBorder', args:{color:[0,100,100], rayon:H.rayon}};
        sprites['Gift']       = {generator:'spriteCube', args:{color:[0,100,100], rayon:H.rayon}};
        sprites['PtiGiftBorder'] = {generator:'spriteCubeBorder', args:{color:[0,100,100], rayon:H.drayon}};
        sprites['PtiGift']       = {generator:'spriteCube', args:{color:[0,100,100], rayon:H.drayon}};
        //option
        sprites['OptionBorder'] = {generator:'spriteCubeBorder', args:{color:[0,0,0], rayon:H.rayon}};
        sprites['Option']       = {generator:'spriteCube', args:{color:[0,0,0], rayon:H.rayon}};
        //option star
        sprites['StarBorder'] = {generator:'spriteStarBorder', args:{rayon:H.rayon}};
        sprites['Star']       = {generator:'spriteStar', args:{rayon:H.rayon}};
        
        cube.makeSprite(sprites, function(sprites){
            
            Cube.sprite = sprites;
            
            resolve('Main.Sprite.Cube.pregen');
            
        });
        
    }
    
    Cube.prototype = Object.create(Sprite.prototype);
    Cube.prototype.constructor = BodyBack;
    
    Cube.prototype.spriteCube = function( config, ref ) {
        
        var cacheName = '_spriteCube_'+config.color+'_'+config.rayon+'_';
        if( undefined === Sprite.cache[cacheName] ) {
            
            var color = config.color || [0,0,100];
            var color = 'hsl('+color[0]+','+color[1]+'%,'+color[2]+'%)';
            var rayon = config.rayon || 100;
            
            this.spriteView.canvas.width = rayon*2;
            this.spriteView.canvas.height = rayon*2;
            this.spriteView.ctx.clearRect(0, 0, rayon*2, rayon*2);
            
            var p = new Point(rayon,rayon);
            //this.hex(this.spriteView.ctx, p, color, rayon);
            this.shadow(this.spriteView.ctx, p, color, rayon);
            
            this.genimgAndCache( cacheName, this.spriteView.canvas, ref );
            
        } else if( undefined !== ref )
            this.loaedSprite( {type:'load'}, ref )
        
        return Sprite.cache[cacheName];
        
    }
    
    Cube.prototype.spriteCubeBorder = function( config, ref ) {
        
        var cacheName = '_spriteCubeBorder_'+config.color+'_'+config.rayon;
        if( undefined === Sprite.cache[cacheName] ) {
            
            var color = config.color || [0,0,100];
            var color = 'hsl('+color[0]+','+color[1]+'%,'+color[2]+'%)';
            var rayon = config.rayon || 100;
            var border = rayon/4;
            
            this.spriteView.canvas.width = rayon*2+border*2;
            this.spriteView.canvas.height = rayon*2+border*2;
            this.spriteView.ctx.clearRect(0, 0, rayon*2+border*2, rayon*2+border*2);
            
            var p = new Point(rayon+border,rayon+border);
            this.hex(this.spriteView.ctx, p, color, rayon, 'white', border);
            
            this.genimgAndCache( cacheName, this.spriteView.canvas, ref );
            
        } else if( undefined !== ref )
            this.loaedSprite( {type:'load'}, ref )
        
        return Sprite.cache[cacheName];
        
    }
        
    Cube.prototype.spriteCubeFixed = function ( config, ref ) {
        
        var cacheName = '_spriteCubeFixed_'+config.rayon;
        if( undefined === Sprite.cache[cacheName] ) {
            
            var color = 'hsl(56, 43%, 74%)';
            var rayon = config.rayon || 100;
            
            this.spriteView.canvas.width = rayon*2;
            this.spriteView.canvas.height = rayon*2;
            this.spriteView.ctx.clearRect(0, 0, rayon*2, rayon*2);
            
            var p = new Point(rayon,rayon);
            //this.hex(this.spriteView.ctx, p, color, rayon);
            this.shadow(this.spriteView.ctx, p, color, rayon);
            
            //this.hex(this.spriteView.ctx, p, color, rayon/2);
            this.shadow(this.spriteView.ctx, p, color, rayon/2, true);
            
            this.genimgAndCache( cacheName, this.spriteView.canvas, ref );
            
        } else if( undefined !== ref )
            this.loaedSprite( {type:'load'}, ref )
        
        return Sprite.cache[cacheName];
        
    }
    
    Cube.prototype.spriteStar = function( config, ref ) {
        
        var cacheName = '_spriteStar_'+config.rayon+'_';
        if( undefined === Sprite.cache[cacheName] ) {
            
            var color = 'hsl(60,100%,100%)';
            var rayon = config.rayon || 100;
            
            this.spriteView.canvas.width = rayon*2;
            this.spriteView.canvas.height = rayon*2;
            this.spriteView.ctx.clearRect(0, 0, rayon*2, rayon*2);
            
            var center = new Point(rayon,rayon);
            
            this.spriteView.ctx.beginPath();
            var p1= this.hexCorner(center, rayon, 0);
            this.spriteView.ctx.moveTo(p1.x, p1.y);
                var p = this.hexCorner(center, rayon/2, 1, 0);
                this.spriteView.ctx.lineTo( p.x, p.y );
            var p = this.hexCorner(center, rayon, 1);
            this.spriteView.ctx.lineTo( p.x, p.y );
                var p = this.hexCorner(center, rayon/2, 2, 0);
                this.spriteView.ctx.lineTo( p.x, p.y );
            var p = this.hexCorner(center, rayon, 2);
            this.spriteView.ctx.lineTo( p.x, p.y );
                var p = this.hexCorner(center, rayon/2, 3, 0);
                this.spriteView.ctx.lineTo( p.x, p.y );
            var p = this.hexCorner(center, rayon, 3);
            this.spriteView.ctx.lineTo( p.x, p.y );
                var p = this.hexCorner(center, rayon/2, 4, 0);
                this.spriteView.ctx.lineTo( p.x, p.y );
            var p = this.hexCorner(center, rayon, 4);
            this.spriteView.ctx.lineTo( p.x, p.y );
                var p = this.hexCorner(center, rayon/2, 5, 0);
                this.spriteView.ctx.lineTo( p.x, p.y );
            var p = this.hexCorner(center, rayon, 5);
            this.spriteView.ctx.lineTo( p.x, p.y );
                var p = this.hexCorner(center, rayon/2, 0, 0);
                this.spriteView.ctx.lineTo(p.x, p.y);
            this.spriteView.ctx.lineTo(p1.x, p1.y);
            this.spriteView.ctx.fillStyle = color;
            this.spriteView.ctx.fill();
            this.spriteView.ctx.closePath();
            
            this.spriteView.ctx.globalCompositeOperation = 'source-atop';
            this.shadow(this.spriteView.ctx, center, color, rayon);
            this.spriteView.ctx.globalCompositeOperation = 'source-over';
            
            this.genimgAndCache( cacheName, this.spriteView.canvas, ref );
            
        } else if( undefined !== ref )
            this.loaedSprite( {type:'load'}, ref )
        
        return Sprite.cache[cacheName];
        
    }
    
    Cube.prototype.spriteStarBorder = function( config, ref ) {
        
        var cacheName = '_spriteStarBorder_'+config.rayon+'_';
        if( undefined === Sprite.cache[cacheName] ) {
            
            var color = 'hsl(60,100%,100%)';
            var rayon = config.rayon || 100;
            var border = rayon/4;
            
            this.spriteView.canvas.width = rayon*2+border*2;
            this.spriteView.canvas.height = rayon*2+border*2;
            this.spriteView.ctx.clearRect(0, 0, rayon*2+border*2, rayon*2+border*2);
            
            var center = new Point(rayon+border,rayon+border);
            
            this.spriteView.ctx.beginPath();
            var p1= this.hexCorner(center, rayon, 0);
            this.spriteView.ctx.moveTo(p1.x, p1.y);
                var p = this.hexCorner(center, rayon/2, 1, 0);
                this.spriteView.ctx.lineTo( p.x, p.y );
            var p = this.hexCorner(center, rayon, 1);
            this.spriteView.ctx.lineTo( p.x, p.y );
                var p = this.hexCorner(center, rayon/2, 2, 0);
                this.spriteView.ctx.lineTo( p.x, p.y );
            var p = this.hexCorner(center, rayon, 2);
            this.spriteView.ctx.lineTo( p.x, p.y );
                var p = this.hexCorner(center, rayon/2, 3, 0);
                this.spriteView.ctx.lineTo( p.x, p.y );
            var p = this.hexCorner(center, rayon, 3);
            this.spriteView.ctx.lineTo( p.x, p.y );
                var p = this.hexCorner(center, rayon/2, 4, 0);
                this.spriteView.ctx.lineTo( p.x, p.y );
            var p = this.hexCorner(center, rayon, 4);
            this.spriteView.ctx.lineTo( p.x, p.y );
                var p = this.hexCorner(center, rayon/2, 5, 0);
                this.spriteView.ctx.lineTo( p.x, p.y );
            var p = this.hexCorner(center, rayon, 5);
            this.spriteView.ctx.lineTo( p.x, p.y );
                var p = this.hexCorner(center, rayon/2, 0, 0);
                this.spriteView.ctx.lineTo(p.x, p.y);
            this.spriteView.ctx.lineTo(p1.x, p1.y);
        
            this.spriteView.ctx.lineCap="round";
            this.spriteView.ctx.lineJoin="round";
            this.spriteView.ctx.lineWidth = border;
            this.spriteView.ctx.strokeStyle = 'white';
            this.spriteView.ctx.stroke();
            
            this.spriteView.ctx.fillStyle = color;
            this.spriteView.ctx.fill();
            this.spriteView.ctx.closePath();
            
            this.genimgAndCache( cacheName, this.spriteView.canvas, ref );
            
        } else if( undefined !== ref )
            this.loaedSprite( {type:'load'}, ref )
        
        return Sprite.cache[cacheName];
        
    }
    
    
    //composant
        
    Cube.prototype.hex = function ( ctx, center, color, size, colorborder, sizeBorder ) {
        
        ctx.beginPath();

        var p1= this.hexCorner(center, size, 0);
        ctx.moveTo(p1.x, p1.y);
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
            ctx.strokeStyle = colorborder;
            ctx.stroke();
        }

        ctx.fillStyle = color;
        ctx.fill();

        ctx.closePath();
        
    }
    
    Cube.prototype.hexCornerCache = [];
    Cube.prototype.hexCorner = function( center, size, i, angle_start ) {
        
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

    Cube.prototype.shadow = function( ctx, center, color, size, inOut ) {
        
        this.shadowPart( ctx, 'front', center, color, size, inOut);
        this.shadowPart( ctx, 'left' , center, color, size, inOut);
        this.shadowPart( ctx, 'right', center, color, size, inOut);
        
    }

    Cube.prototype.shadowPart = function( ctx, mod, center, color, rayon, inOut ) {
        
        //var rayon = rayon+0.5;
        var width = (rayon * Math.cos(Math.PI / 180 * 30))|0;
        
        var z = 0, o = 1, shadow = 0.4, light = 0;
        if( inOut === true ) var z = 1, o = 0, shadow = 0.3, light = 0.1;
        
        var lp = [3, 4, 5];
        if( inOut === true ) lp = [4, 5, 0];
        var ps = this.hexCorner(center, rayon, lp[1]);
        
        if( 'left' === mod ) {
            lp = [1, 2, 3];
            if( inOut === true ) lp = [2, 3, 4];
            ps = this.hexCorner(center, rayon, lp[1]);
        }
        if( 'right' === mod ) {
            lp = [5, 0, 1];
            if( inOut === true ) lp = [0, 1, 2];
            ps = this.hexCorner(center, rayon, lp[1]);
        }
        
        var color = color.split('hsl(')[1].split(')')[0].split(',');
        color = [color[0],color[1],Number(color[2].split('%')[0])];
        light = [color[0],color[1],Number(color[2])];
        shadow = [color[0],color[1],Number(color[2])];
        
        light[2] = color[2]-color[2]/3|0;
        if( light[2] >= 100) light[2] = 100;
        color[2] = light[2]/1.3|0;
        shadow[2] = color[2]/2|0;
        
        light = 'hsl('+light[0]+','+light[1]+','+light[2]+'%)';
        color = 'hsl('+color[0]+','+color[1]+','+color[2]+'%)';
        shadow = 'hsl('+shadow[0]+','+shadow[1]+','+shadow[2]+'%)';
        
        var grd = ctx.createLinearGradient(center.x, center.y, ps.x, ps.y);
            grd.addColorStop(z, light);
            grd.addColorStop(0.3, color);
            grd.addColorStop(o, shadow);
        
        ctx.beginPath();
        var p1 = this.hexCorner(center, rayon, lp[0]);
        ctx.moveTo( p1.x, p1.y  );
        var p = this.hexCorner(center, rayon, lp[1]);
        ctx.lineTo( p.x, p.y );
        var p = this.hexCorner(center, rayon, lp[2]);
        ctx.lineTo( p.x, p.y );
        ctx.lineTo( center.x, center.y );
        
            ctx.lineWidth = 1;
            ctx.strokeStyle = grd;
            ctx.stroke();
        
        ctx.fillStyle= grd;
        ctx.fill();
        
        ctx.closePath();
        
    }
    
    // drawsprite
    
    Cube.prototype.drawCube = function( tile ) {
        
        var bp = new Point(tile.px.x,tile.px.y);
        bp.x += this.viewBottom.owidth;
        bp.y += this.viewBottom.oheight;
        var tp = new Point(tile.px.x,tile.px.y);
        tp.x += this.viewTop.owidth;
        tp.y += this.viewTop.oheight;
        
        if( tile.type == 'gift' ) {
            this.drawSprite( this.viewBottom, Cube.sprite.GiftBorder, bp );
            this.drawSprite( this.viewTop, Cube.sprite.Gift, tp );
        } else if( tile.type == 'fixed' ) {
            this.drawSprite( this.viewBottom, Cube.sprite.GiftBorder, bp );
            this.drawSprite( this.viewTop, Cube.sprite.Gift, tp );
        } else if( tile.type == 'star' ) {
            this.drawSprite( this.viewBottom, Cube.sprite.StarBorder, bp );
            this.drawSprite( this.viewTop, Cube.sprite.Star, tp );
        }  else if( -1 !== A.ballOption.indexOf(tile.type) ) {
            this.drawSprite( this.viewBottom, Cube.sprite.OptionBorder, bp );
            this.drawSprite( this.viewTop, Cube.sprite.Option, tp );
        } else  {
            this.drawSprite( this.viewBottom, Cube.sprite['Cube'+tile.type+'Border'], bp );
            this.drawSprite( this.viewTop, Cube.sprite['Cube'+tile.type], tp );
        }
        
        
    }
    
    
    
    
    
    // class BodyBack extends Sprite
    
    function BodyBack ( viewTop ) {
        
        Sprite.call( this, viewTop );
        
    }
    
    BodyBack.pregen = function ( resolve, spriteView, viewTop, hex, app, view ) {
        
        var back = new BodyBack( viewTop );
        back.spriteView = spriteView;
        V = view || null;
        H = hex || null;
        A = app || null;
        
        //make sprite
        
        back.makeSprite({
            'Bande':{generator:'spriteBande', args:{rayon:H.rayon, height:V.height, color:[0,0,9]}},
            'Cube':{generator:'spriteCube', args:{rayon:H.rayon, color:[0,0,9]}},
            'PtiCube':{generator:'spriteCube', args:{rayon:H.drayon, color:[0,0,9]}}
        }, function(sprites){
            
            BodyBack.sprite = sprites;
            
            resolve('Main.Sprite.Cube.BodyBack.pregen');
            
        });
        
    }
    
    BodyBack.prototype = Object.create(Cube.prototype);
    BodyBack.prototype.constructor = BodyBack;
    
    BodyBack.prototype.spriteBande = function( config, ref ){
        
        var cacheName = '_spriteBande_'+config.height+'_'+config.color+'_'+config.rayon+'_';
        if( undefined === Sprite.cache[cacheName] ) {
            
            var ctx = this.spriteView.ctx;
            var color = config.color || [0,0,100];
            var color = 'hsl('+color[0]+','+color[1]+'%,'+color[2]+'%)';
            var rayon = config.rayon || 100;
            var height = (config.height || 100)+rayon;
            
            this.spriteView.canvas.width = rayon*2;
            this.spriteView.canvas.height = height;
            this.spriteView.ctx.clearRect(0, 0, rayon*2, height);
            
            var center = new Point(rayon,rayon);
            
            this.shadowPart( ctx, 'front', center, color, rayon);
            
            var h1 = Math.sqrt((rayon/2)*(rayon/2)+(height/2)*(height/2));
            var a = Math.atan((rayon/2)/(height/2));
            var h2 = Math.cos(a)*rayon;
            var dx = Math.cos(a)*h2;
            var dy = Math.sin(a)*h2;
        
            var shadow = [0,0,9];
            for(var s = 0, l = 3 ; s < l ; s++ )
                shadow[s] = shadow[s]/2|0;
            shadow = 'hsl('+shadow[0]+','+shadow[1]+'%,'+shadow[2]+'%)';
        
            var grd = ctx.createLinearGradient(rayon/2+dx, height/2-dy, rayon/2-dx, height/2+dy);
                grd.addColorStop(0, 'hsl(0,0%,9%)');
                grd.addColorStop(1, shadow);
            
            ctx.beginPath();
            var p1 = this.hexCorner(center, rayon, 3);
            ctx.moveTo( p1.x, p1.y  );
            ctx.lineTo( center.x, center.y );
            ctx.lineTo( center.x, height );
            ctx.lineTo( p1.x, height );
            ctx.fillStyle=grd;
            ctx.fill();
            ctx.closePath();
        
            var grd = ctx.createLinearGradient(rayon/2-dx+rayon, height/2-dy, rayon/2+dx+rayon, height/2+dy);
                grd.addColorStop(0, 'hsl(0,0%,9%)');
                grd.addColorStop(1, shadow);
            
            ctx.beginPath();
            ctx.moveTo( center.x, center.y );
            var p1 = this.hexCorner(center, rayon, 5);
            ctx.lineTo( p1.x, p1.y  );
            ctx.lineTo( p1.x, height );
            ctx.lineTo( center.x, height );
            ctx.fillStyle=grd;
            ctx.fill();
            ctx.closePath();
            
            this.genimgAndCache( cacheName, this.spriteView.canvas, ref );
            
        } else if( undefined !== ref )
            this.loaedSprite( {type:'load'}, ref )
        
        return Sprite.cache[cacheName];
    }

    BodyBack.prototype.shadowPart = function( ctx, mod, center, color, rayon, inOut ) {
        
        //var rayon = rayon+0.5;
        var width = (rayon * Math.cos(Math.PI / 180 * 30))|0;
        
        var z = 0, o = 1, shadow = 0.4, light = 0;
        if( inOut === true ) var z = 1, o = 0, shadow = 0.3, light = 0.1;
        
        var lp = [3, 4, 5];
        if( inOut === true ) lp = [4, 5, 0];
        var ps = this.hexCorner(center, rayon, lp[1]);
        
        if( 'left' === mod ) {
            lp = [1, 2, 3];
            if( inOut === true ) lp = [2, 3, 4];
            ps = this.hexCorner(center, rayon, lp[1]);
        }
        if( 'right' === mod ) {
            lp = [5, 0, 1];
            if( inOut === true ) lp = [0, 1, 2];
            ps = this.hexCorner(center, rayon, lp[1]);
        }
        
        var shadow = color.split('hsl(')[1].split(')')[0].split(',');
        shadow[2] = Number(shadow[2].split('%')[0])-5;
        shadow = 'hsl('+shadow[0]+','+shadow[1]+','+shadow[2]+'%)';
        
        var grd = ctx.createLinearGradient(center.x, center.y, ps.x, ps.y);
            grd.addColorStop(z, color);
            grd.addColorStop(o, shadow);
        
        ctx.beginPath();
        var p1 = this.hexCorner(center, rayon, lp[0]);
        ctx.moveTo( p1.x, p1.y  );
        var p = this.hexCorner(center, rayon, lp[1]);
        ctx.lineTo( p.x, p.y );
        var p = this.hexCorner(center, rayon, lp[2]);
        ctx.lineTo( p.x, p.y );
        ctx.lineTo( center.x, center.y );
        
            ctx.lineWidth = 1;
            ctx.strokeStyle = grd;
            ctx.stroke();
        
        ctx.fillStyle= grd;
        ctx.fill();
        
        ctx.closePath();
        
    }
    
    BodyBack.prototype.puzzle = function() {
        
        var ow = H.zerox+H.dwidth;
        var oh = H.zeroy+H.rayon;
        var view = this.viewTop;
        
        //bande
        for( var x = -1;  x < A.gameGridSize.x+1;  x++ )
            this.drawSprite( view, BodyBack.sprite.Bande, new Point(x*H.width +ow, oh+(H.rayon*1.5)*(A.gameGridSize.y)+H.drayon+V.height/2));
        
        //hool
        var nw = V.width;
        var nh = V.height/(H.rayon*3)+1;
        for( var x = -1;  x < A.gameGridSize.x+1;  ++x )
        for( var y = -1;  y < A.gameGridSize.y+1;  ++y ) {
            var dw = !Math.isPair(y) ? H.dwidth : 0 ;
            this.drawSprite( view, BodyBack.sprite.Cube, new Point(x*H.width+dw+ow-H.dwidth, y*H.rayon*1.5+oh-H.drayon));
        }
        
        //pti
        for( var x = -1;  x < A.gameGridSize.x+1;  x++ )
        for( var y = -1;  y < A.gameGridSize.y+1;  y++ )
            if( ( y < 0 && x > 0 )
             || ( x == -1 && Math.isPair(y) || x == 0 && !Math.isPair(y)
             || x == A.gameGridSize.x ) ) {
                var dw = !Math.isPair(y) ? H.dwidth : 0 ;
                this.drawSprite( view, BodyBack.sprite.PtiCube, new Point(x*H.width-dw+ow, y*H.rayon*1.5+oh));
            }
        
        view.ctx.rect( H.zerox-H.dwidth, 0, H.aWidth+H.width, V.height );
        view.ctx.lineCap="round";
        view.ctx.lineJoin="round";
        view.ctx.lineWidth = H.rayon/4;
        view.ctx.strokeStyle = 'white';
        view.ctx.stroke();
        view.ctx.closePath();
        
        //bande
        for( var x = -(H.zerox/H.width|0)-1;  x < -1;  x++ )
            this.drawSprite( view, BodyBack.sprite.Bande, new Point(x*H.width +ow+H.dwidth, V.height/2-H.drayon));
        for( var x = A.gameGridSize.x;  x < A.gameGridSize.x+(H.zerox/H.width|0);  x++ )
            this.drawSprite( view, BodyBack.sprite.Bande, new Point(x*H.width +ow+H.dwidth, V.height/2-H.drayon));
        
        
    }
    
    
    
    
    
    // class Canon extends Sprite
    
    function Canon ( viewTop ) {
        
        Sprite.call( this, viewTop );
        
    }
    
    Canon.pregen = function ( resolve, spriteView ) {
        
        var back = new BodyBack();
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
            
            BodyBack.sprite = sprites;
            
            resolve('Main.Sprite.Cube.BodyBack.pregen');
            
        });*/
        
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
        */
    }
    
    
    
    
    // class Alert extends Sprite
    
    
    function Alert ( viewTop ) {
        
        Sprite.call( this, viewTop );
        
    }
    
    Alert.pregen = function ( resolve, spriteView, viewTop, hex ) { 
        
        var alert = new Alert( viewTop );
        alert.spriteView = spriteView;
        H = hex || null;
        
        //make sprite
        
        var sprites = [];
        var alphabet = 'abcdefghijklmnopqrstuvwxyz 0123456789';
        alphabet = alphabet.split('');
        
        for( var a = 0, l = alphabet.length ; a < l ; ++a )
            sprites['Font'+alphabet[a]] = {generator:'spriteFont', args:{color:[0,0,100], rayon:H.rayon, string:alphabet[a]}};
        
        alert.makeSprite(sprites, function(){
            
            Alert.sprite = sprites;
            
            resolve('Main.Sprite.Alert.pregen');
            
        });
        
    }
    
    Alert.loadFont = function( resolve, spriteView ) {
        
        var styleNode = document.createElement("style");
        styleNode.type = "text/css";
        styleNode.textContent = "@font-face { font-family: 'hexfont'; src: url('fonts/hex.ttf?"+Math.random()+"') format('truetype'); }";
        document.head.appendChild(styleNode);
        
        spriteView.ctx.rect( 0, 0, 10, 10 );
        spriteView.ctx.fill();
        spriteView.ctx.font = "100px hexfont";
        spriteView.ctx.fillStyle = '#fff';
        
        var si = setInterval(function() {
            spriteView.ctx.fillText('o', -50, 90);
            if( 255 === spriteView.ctx.getImageData(0, 0, 1, 1).data[0] ) {
                clearInterval(si);
                resolve('Main.Sprite.Alert.loadFont');
            }
        }, 10);
    }
    
    Alert.prototype = Object.create(Sprite.prototype);
    Alert.prototype.constructor = Alert;
    
    
    Alert.prototype.spriteFont = function( config, ref ){
        
        var cacheName = '_spriteFont_'+config.color+'_'+config.rayon+'_'+config.string+'_';
        if( undefined === Sprite.cache[cacheName] ) {
            
            var ctx = this.spriteView.ctx;
            var color = config.color || [0,0,100];
            var color = 'hsl('+color[0]+','+color[1]+'%,'+color[2]+'%)';
            var rayon = config.rayon || 100;
            var string = config.string || 'o';
            
            this.spriteView.canvas.width = rayon*3;
            this.spriteView.canvas.height = rayon*3;
            this.spriteView.ctx.clearRect(0, 0, rayon*3, rayon*3);
            
            var center = new Point(rayon*1.5,rayon*1.5);
        
            var sl = rayon*2;
            var p = new Point(center.x-(sl/2 -Math.round(sl/13)), center.y+(rayon +Math.round(sl/31)));
            ctx.font = sl+"px hexfont";
            ctx.fillStyle = color;
            ctx.fillText(string, p.x, p.y);
            
            this.genimgAndCache( cacheName, this.spriteView.canvas, ref );
            
        } else if( undefined !== ref )
            this.loaedSprite( {type:'load'}, ref )
        
        return Sprite.cache[cacheName];
    }
    
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
        
    }
    
    
    
    Main.Sprite = Sprite;
    Main.Sprite.Cube = Cube;
    Main.Sprite.Cube.BodyBack = BodyBack;
    Main.Sprite.Cube.Canon = Canon;
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
