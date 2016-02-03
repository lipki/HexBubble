var Main = (function (Main, undefined) {
    'use strict';
    
    var View, Hex, Grid, Canon, Anim, Alert, Cube, BodyBack;
    
    function App () {
        
        this.ref = {
            gameGridSize :{x:8, y:10},
            ballOption:['trace', 'ghost', 'micro', 'percante', 'bombe', 'star'],
            ballColor:{SteelBlue:[207,100,100], DarkOrange:[33,100,100], Lime:[136,100,100], white:[0,0,100], DarkViolet:[282,100,100], Yellow:[60,100,100], Crimson:[348,100,100]},
            activeOption:{trace:false, ghost:false, micro:false, percante:false },
            activeRound:1,
            gameStat:'menu',
            canonAngleMin:-80,
            canonAngleMax:80,
            canonAngleStep:1
        }
        
        //init size
        View = new Main.View( window.innerWidth, window.innerHeight );
        Hex = this.H = new Main.Hexagone( this.ref, View );
        
        //view
        this.makeView();
        
        //init app
        Grid = new Main.Grid( this.ref, Hex, View );
        Canon = new Main.Canon( this.ref, Hex, View.width, View.height, View.canon, View.back );
        Anim = new Main.Anim();
        BodyBack = new Main.Sprite.Cube.BodyBack( View.back, Hex, this.ref, View );
        Alert = new Main.Sprite.Alert ( View.alert, Hex );
        
        //sound
        this.soundPoum = new Audio("sound/5642.wav");
        this.soundPouf = new Audio("sound/3604.wav");
        this.soundFall = new Audio("sound/3603.wav");
        
        //event
        var mi = this;
        window.addEventListener('click', function (e) {mi.pan(e)});
        window.addEventListener('mousemove', function (e) {mi.move(e)});
        window.addEventListener("keydown", function (e) {mi.key(e)});
        
        //pregen
        var mi = this;
        var font = new Promise( function(resolve) {
            Main.Sprite.Alert.loadFont ( resolve, View.sprite )});
        
        font.then(function(val) {
            var bodyBack = new Promise( function(resolve) {
                Main.Sprite.Cube.BodyBack.pregen ( resolve, View.sprite, View.back, Hex, mi.ref, View )});
            var alert = new Promise( function(resolve) {
                Main.Sprite.Alert.pregen ( resolve, View.sprite, View.alert, Hex )});
            var cube = new Promise( function(resolve) {
                Main.Sprite.Cube.pregen ( resolve, View.sprite, View.cube, View.border, Hex, mi.ref )});
            var canon = new Promise( function(resolve) {
                Main.Sprite.Cube.Canon.pregen ( resolve, View.sprite )});
            
            Promise.all([font, bodyBack, alert, cube, canon]).then(function(){mi.pregenEnd()});
            
        });
        
    }
        
    App.prototype.makeView = function () {
        View.add('back'       , [window.innerWidth, window.innerHeight] );
        View.add('border'     , [Hex.aWidth+Hex.width, Hex.aHeight+Hex.zeroy], [Hex.zerox-Hex.dwidth, 0], [Hex.dwidth+Hex.dwidth, Hex.rayon+Hex.zeroy] );
        View.add('borderGift' , [Hex.aWidth+Hex.width, Hex.aHeight+Hex.zeroy], [Hex.zerox-Hex.dwidth, 0], [Hex.dwidth+Hex.dwidth, Hex.rayon+Hex.zeroy] );
        View.add('borderBalle', [Hex.aWidth+Hex.width, Hex.aHeight+Hex.zeroy], [Hex.zerox-Hex.dwidth, 0], [Hex.dwidth+Hex.dwidth, Hex.rayon+Hex.zeroy] );
        View.add('cube'       , [Hex.aWidth, Hex.aHeight], [Hex.zerox, Hex.zeroy], [Hex.dwidth, Hex.rayon] );
        View.add('canon'      , [Hex.aWidth, Hex.aHeight], [Hex.zerox, Hex.zeroy] );
        View.add('balle'      , [Hex.aWidth, Hex.aHeight], [Hex.zerox, Hex.zeroy] );
        View.add('gift'       , [Hex.aWidth, Hex.aHeight], [Hex.zerox, Hex.zeroy], [Hex.dwidth, Hex.rayon] );
        View.add('alert'      , [window.innerWidth, window.innerHeight] );
        View.add('sprite'     , [100, 100] );
    }
    
    App.prototype.move = function (e) {
        
        //Canon.draw();
        
        /*if( undefined != e ) {
            C.calcAngle();
            
            if( true !== C.inshoot && A.activeOption.trace ) {
                C.calcRebond();
                if( M.option.trace )
                    S.trace();
            }
            
        }
        
        S.canon( this );
            
            /*var hex = M.H.pixelToHex(new Point(e.layerX, e.layerY));
            if( hex && M.G.get(hex) ) {
                var hex = M.G.get(hex);
                M.S.hex(M.V['canon'].ctx, hex.px, 'rgba(255,255,255,0.5)', M.H.rayon/5*4);
                M.S.shadowOut(M.V['canon'].ctx, hex.px, M.H.rayon/5*4);
            }*/
        
    }
        
    App.prototype.pregenEnd = function () {
        
        BodyBack.puzzle();
        
        //start
        var mi = this;
        
        Anim.animAdd( 'title', function( step ) {
            Alert.show('hex\nbubble', step );
            if( step > 100 ) {
                View.clear('alert');
                return Anim.animDel( 'title' );
            }
        }, function(){
            mi.loadRound();
        });
        
    }
    
    App.prototype.loadRound = function() {
        
        var mi = this;
        var round = document.createElement("script");
        round.type = "text/javascript";
        round.src = 'maps/round'+this.ref.activeRound+'.js';
        round.onreadystatechange = function(){mi.loadedRound()};
        round.onload = function(){mi.loadedRound()};
        document.body.appendChild(round);
        
    }
        
    App.prototype.loadedRound = function() {
        
        Grid.initRound(window['Round'+this.ref.activeRound]);
        this.ref.gameStat = 'wait';
        

        
        /*Anim.animAdd( 'countdown', function( step ) {
            Alert.countdown('3', 10, step );
            if( step > 3*10 ) {
                View.clear('alert');
                return Anim.animDel( 'countdown' );
            }
        }, function(){
            mi.canon.inshoot = false;
        });*/
        
    }
    
    //var all = [];
    /*
        
    
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
            }
        
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
        
        
        
        
        this.gameOver = function (res) {
            console.log('gameover', res);
            switch(res) {
                case 'win' :
                    this.win = 1;
                    S.animAdd( 'win', 'win', [G.gifts], null, function(){
                        V.clear('borderGift');
                        V.clear('gift');
                    });
                    
                    var mi = this;
                    S.animAdd( 'next', 'alert', ['next '+(this.round+1), 100], null, function() {
                        S.animDel( 'win' );
                        mi.round = (mi.round+1)%mi.rounds.length;
                        mi.start();
                    });
                break;
                case 'loss' :
                    this.win = -1;
                    
                    var mi = this;
                    S.animAdd( 'loss', 'alert', ['loss', 100], null, function() {
                        mi.round = 0;
                        mi.start();
                    });
                break;
            }
        }
        
        this.pan = function () {
                
            this.soundPoum.pause();
            this.soundPoum.fastSeek(0);
            this.soundPoum.play();
            
            this.canon.goal.switchOn(this.canon.ballShoot);
            this.canon.goal.draw();
            
            var mi = this;
            setTimeout(function(){ console.log(mi.canon.ballShoot);
                switch ( mi.canon.ballShoot ) {
                    case 'bombe' :
                        mi.boum(mi.canon.goal);
                    break;
                    case 'trace' :
                        mi.option.trace = true;
                        mi.canon.goal.switchOff();
                    break;
                    case 'micro' :
                        mi.option.micro = true;
                        mi.canon.goal.switchOff();
                    break;
                    case 'percante' :
                        mi.percante(mi.canon.list);
                    break;
                    default :
                        mi.pouf(mi.canon.goal);
                }
                Tile.draw(mi);
            }, 50);
            
            setTimeout(function(){
                mi.FallStepOne();
                mi.out();
                if( 0 === mi.win ) {
                    mi.canon.types = mi.G.makeSet();
                    mi.canon.inshoot = false;
                    mi.canon.move();
                }
            }, 200);
            
        }
        
        this.percante = function (list) {
            console.log(list);
            var tour = [];
            for( var gr = 0, l = list.length ; gr < l ; gr++ )
                if( list[gr].on &&  -1 != list[gr].type.indexOf('gift') ) {
                    list[gr].switchOff();
                    tour.push(list[gr]);
                }
            S.animAdd( 'pouf', 'pouf', [tour]);
            
            this.soundPouf.pause();
            this.soundPouf.fastSeek(0);
            this.soundPouf.play();
            
        }
        
        this.boum = function (tile) {
            
            var tour = [];
            for( var gr = 0, l = tile.near.length ; gr < l ; gr++ )
                if( tile.near[gr].on &&  -1 != tile.type.indexOf('gift') ) {
                    tile.near[gr].switchOff();
                    tour.push(tile.near[gr]);
                }
            S.animAdd( 'pouf', 'pouf', [tour]);
            
            this.soundPouf.pause();
            this.soundPouf.fastSeek(0);
            this.soundPouf.play();
            
        }
        
        this.pouf = function (tile) {
            
            G.addInGroup(tile);
            var tour = G.groups[tile.group];
            
            if( tour.length < 3 ) return ;
            
            for( var t = 0, l = tour.length ; t < l ; t++ )
                tour[t].switchOff()
            Tile.draw(this);
            S.animAdd( 'pouf', 'pouf', [tour]);
            
            this.soundPouf.pause();
            this.soundPouf.fastSeek(0);
            this.soundPouf.play();
            
        }
        
        this.FallStepOne = function() {
            
            var indice = Date.now();
            
            this.all.length = 0;
            for( var y = 0;  y < H.ny-1;  y++ )
            for( var x = 0;  x < H.nx;  x++ )
                if(G.get(new Point(x, y)).on)
                    this.all.push(x+H.nx*y);
            
            if( 0 === this.all.length ) return ;
                
            for( var x = 0; x < H.nx;  x++ )
                if(G.get(new Point(x, 0)).on)
                    this.FallStepTwo(G.get(new Point(x, 0)), indice, 0);
            
            if( 0 === this.all.length ) return ;
            
            var win = false;
            var tour = [];
            
            for( var t = 0, l = this.all.length ; t < l ; t++ ) {
                var lit = this.all[t];
                var point = new Point(lit%H.nx, (lit/H.nx)|0);
                var tile = G.get(point);
                if( tile.type.indexOf('gift') != -1 ) {
                    if( false === win ) win = true;
                } else
                    tile.switchOff();
                tour.push(tile);
            }
            Tile.draw(this);
            S.animAdd( 'pouf', 'pouf', [tour]);
                
            this.soundFall.pause();
            this.soundFall.fastSeek(0);
            this.soundFall.play();
            
            if( false !== win ) this.gameOver('win');
            
        }
        
        this.FallStepTwo = function(tile, indice, step) {
            tile.indice = indice;
            for( var n = 0, l = tile.near.length; n < l;  n++ ) {
                if( !tile.near[n].on ) continue;
                
                var index = this.all.indexOf(tile.near[n].point.x+H.nx*tile.near[n].point.y);
                if(index != -1)
                    this.all.splice(this.all.indexOf(tile.near[n].point.x+H.nx*tile.near[n].point.y), 1);
                if( tile.near[n].indice != indice )
                    this.FallStepTwo(tile.near[n], indice, step++);
            }
        }
        
        this.out = function (tile) {
            
            var out = [];
            for( var x = 0; x < H.nx;  x++ )
                if(G.get(new Point(x, H.ny-3)).on)
                    out.push('out');
            
            if( out.length > 0 ) this.gameOver('loss');
            
        }*/
    
    Main.App = App;
    return Main;
}(Main || {}));
