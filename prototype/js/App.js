;(function App (undefined){
    'use strict';
    
    function App () {
        
        var A, U, C, S, G, H, V, mi;
        this.init = function ( clas ) {
            A = clas[0]; U = clas[1]; C = clas[2]; S = clas[3]; G = clas[4]; H = clas[5]; V = clas[6];
            mi = this;
        }
        
        this.appStart = function () {
        
            this.ref = {
                gameGridSize :{x:8, y:10},
                ballOption:['trace', 'ghost', 'micro', 'percante', 'bombe'],
                activeOption:{trace:false, ghost:false, micro:false, percante:false },
                activeRound:1,
                gameStat:0,
                canonAngleMin:-80,
                canonAngleMax:80,
                canonAngleStep:1
            }
            
            //init app
            V.appInit( window.innerWidth, window.innerHeight );
            H.appInit();
            S.appInit();
            G.appInit();
            C.appInit();
            
            //view
            this.makeView();
            
            //sound
            this.soundPoum = new Audio("sound/5642.wav");
            this.soundPouf = new Audio("sound/3604.wav");
            this.soundFall = new Audio("sound/3603.wav");
            
            //event
            var mi = this;
            window.addEventListener('click', function (e) {mi.pan(e)});
            window.addEventListener('mousemove', function (e) {mi.move(e)});
            window.addEventListener("keydown", function (e) {mi.key(e)});
            
            //start
            var mi = this;
            S.body();
            S.animAdd( 'title', 'alert', ['hex\nbubble', 100], null, function(){
                mi.loadRound();
            });
        }
        
        this.makeView = function () {
            V.add('sprite'     , [100, 100] );
            V.add('back'       , [window.innerWidth, window.innerHeight] );
            V.add('border'     , [H.aWidth+H.rayon, H.aHeight], [H.zerox-H.drayon, H.zeroy-H.drayon], [H.drayon, H.drayon] );
            V.add('borderGift' , [H.aWidth+H.rayon, H.aHeight], [H.zerox-H.drayon, H.zeroy],          [H.drayon, 0]        );
            V.add('borderBalle', [H.aWidth+H.rayon, H.aHeight], [H.zerox-H.drayon, H.zeroy-H.drayon], [H.drayon, H.drayon] );
            V.add('cube'       , [H.aWidth+H.rayon, H.aHeight], [H.zerox-H.drayon, H.zeroy-H.drayon], [H.drayon, H.drayon] );
            V.add('canon'      , [H.aWidth, H.aHeight], [H.zerox, H.zeroy] );
            V.add('balle'      , [H.aWidth, H.aHeight], [H.zerox, H.zeroy] );
            V.add('gift'       , [H.aWidth, H.aHeight], [H.zerox, H.zeroy] );
            V.add('alert'      , [window.innerWidth, window.innerHeight] );
        }
        
        this.move = function (e) {
            
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
        
        this.loadRound = function() {
            
            var round = document.createElement("script");
            round.type = "text/javascript";
            round.src = 'maps/round'+this.ref.activeRound+'.js';
            round.onreadystatechange = function(){mi.loadedRound()};
            round.onload = function(){mi.loadedRound()};
            document.body.appendChild(round);

            /*var mi = this;
            include('maps/round'+this.round+'.js',function() {
                
                mi.G.initRound(window['Round'+mi.round]);
                Tile.draw(mi);
                mi.canon.init(mi.G.set);
                mi.win = 0;
                
                //S.animAdd( 'trois', 'alert', ['3', 50], null, function(){
                    //S.animAdd( 'deux', 'alert', ['2', 50], null, function(){
                        //S.animAdd( 'un', 'alert', ['1', 50], null, function(){
                            mi.canon.inshoot = false;
                        //});
                    //});
                //});
            });*/
            
        }
        
        this.loadedRound = function() {
            
            G.initRound(window['Round'+this.ref.activeRound]);
            C.init(G.set);
            this.ref.gameStat = 0;
            
            //S.animAdd( 'trois', 'alert', ['3', 50], null, function(){
                //S.animAdd( 'deux', 'alert', ['2', 50], null, function(){
                    //S.animAdd( 'un', 'alert', ['1', 50], null, function(){
                        C.inshoot = false;
                    //});
                //});
            //});
            
        }
    }
    
    //var all = [];
    /*
        
        
        //pregen sprite
        //V.sprite.canvas.style.display = 'none';
        //V.sprite.canvas.style.position = 'fixed';
        //V.sprite.canvas.style.top = 0;
        //V.sprite.canvas.style.left = 0;
        
        //start
        var mi = this;
        S.animAdd( 'title', 'alert', ['hex/nbubble', 100], null, function(){
            mi.start();
        });
        
        
        
        
        
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
    
    var ready = new Event("hexbubble.class.app.loaded");
    ready.instance = new App();
    document.dispatchEvent(ready);
    
})();
