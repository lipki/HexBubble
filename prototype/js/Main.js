;(function(environment){
    'use strict';
    
    include([
        'js/Grid.js',
        'js/utils.js',
        'js/Sprite.js',
        'js/Canon.js',
        'js/View.js',
        'maps/round0.js',
        'maps/round1.js',
        'maps/round2.js',
        'maps/round3.js',
        'maps/round4.js',
        'maps/round5.js',
        'maps/round6.js',
        'maps/round7.js',
        'maps/round8.js',
        'maps/round9.js',
        'maps/round10.js',
        'maps/round11.js',
        'maps/round12.js',
        'maps/round13.js',
        'maps/round14.js',
        'maps/round15.js',
        'maps/round16.js',
        'maps/round17.js',
        'maps/round18.js',
        'maps/round19.js',
        'maps/round20.js',
        'maps/round21.js',
        'maps/round22.js',
        'maps/round23.js',
        'maps/round24.js',
        'maps/round25.js',
        'maps/round26.js',
        'maps/round27.js',
        'maps/round28.js',
        'maps/round29.js',
        'maps/round30.js',
        'maps/round31.js',
        'maps/round32.js',
        'maps/round33.js',
        'maps/round34.js',
        'maps/round35.js',
        'maps/round36.js',
        'maps/round37.js',
        'maps/round38.js',
        'maps/round39.js'
            ],
        function() {
            Main = new Main();
            Main.init();
        });

    function Main () {
        
        this.rounds = [Round1, Round2, Round3, Round4, Round5, Round6, Round7, Round8, Round9, Round10, Round11, Round12, Round13, Round14, Round15, Round16, Round17, Round18, Round19, Round20, Round21, Round22, Round23, Round24, Round25, Round26, Round27, Round28, Round29, Round30, Round31, Round32, Round33, Round34, Round35, Round36, Round37, Round38, Round39];
        this.round = 0;
        this.win = 0;
        
        this.init = function () {
            
            //size init
            View.init( window.innerWidth, window.innerHeight );
            Hex.init ( Round0.size.x, Round0.size.y+3, View.width, View.height );
            
            //model
            this.G = new Grid(Round0);
            
            //view
            //View.add('sprite', 100, 100 );
            View.add('body'  , 0, 0, window.innerWidth, window.innerHeight );
            View.add('back'       , Hex.zerox-Hex.drayon, Hex.zeroy-Hex.drayon, Hex.aWidth+Hex.rayon, Hex.aHeight);
            View.add('border'     , Hex.zerox-Hex.drayon, Hex.zeroy-Hex.drayon, Hex.aWidth+Hex.rayon, Hex.aHeight);
            View.add('borderGift' , Hex.zerox-Hex.drayon, Hex.zeroy           , Hex.aWidth+Hex.rayon, Hex.aHeight);
            View.add('borderBalle', Hex.zerox-Hex.drayon, Hex.zeroy-Hex.drayon, Hex.aWidth+Hex.rayon, Hex.aHeight);
            View.add('cube'       , Hex.zerox-Hex.drayon, Hex.zeroy-Hex.drayon, Hex.aWidth+Hex.rayon, Hex.aHeight);
            View.add('canon', Hex.zerox, Hex.zeroy, Hex.aWidth, Hex.aHeight);
            View.add('balle', Hex.zerox, Hex.zeroy, Hex.aWidth, Hex.aHeight);
            View.add('gift' , Hex.zerox, Hex.zeroy, Hex.aWidth, Hex.aHeight);
            View.add('alert', 0, 0, window.innerWidth, window.innerHeight );
            
            //pregen sprite
            //View.sprite.canvas.style.display = 'none';
            //View.sprite.canvas.style.position = 'fixed';
            //View.sprite.canvas.style.top = 0;
            //View.sprite.canvas.style.left = 0;
            
            //sound
            this.poum = new Audio("sound/5642.wav");
            this.pouf = new Audio("sound/3604.wav");
            this.fall = new Audio("sound/3603.wav");
            
            // draw
            Sprite.body(View.body.ctx);
            Tile.drawBack(this.G);
            
            this.canon = new Canon(this, new Point(View.width/2, View.height - Hex.drayon), -80, 80, 1);
            
            //start
            var mi = this;
            Sprite.animAdd( 'title', 'alert', ['hex/nbubble', 100], null, function(){
                mi.start();
            });
            
        }
        
        this.start = function() {
            
            var mi = this;
            mi.G.initRound(mi.rounds[mi.round]);
            Tile.draw(mi.G);
            mi.canon.init(mi.G.set);
            mi.win = 0;
            
            //Sprite.animAdd( 'trois', 'alert', ['3', 50], null, function(){
                //Sprite.animAdd( 'deux', 'alert', ['2', 50], null, function(){
                    //Sprite.animAdd( 'un', 'alert', ['1', 50], null, function(){
                        mi.canon.inshoot = false;
                    //});
                //});
            //});
            
        }
        
        this.gameOver = function (res) {
            console.log('gameover', res);
            switch(res) {
                case 'win' :
                    this.win = 1;
                    Sprite.animAdd( 'win', 'win', [this.G.gifts], null, function(){
                        View.clear('borderGift');
                        View.clear('gift');
                    });
                    
                    var mi = this;
                    Sprite.animAdd( 'next', 'alert', ['next '+(this.round+1), 100], null, function() {
                        Sprite.animDel( 'win' );
                        mi.round = (mi.round+1)%mi.rounds.length;
                        mi.start();
                    });
                break;
                case 'loss' :
                    this.win = -1;
                    
                    var mi = this;
                    Sprite.animAdd( 'loss', 'alert', ['loss', 100], null, function() {
                        mi.round = 0;
                        mi.start();
                    });
                break;
            }
        }
        
        this.pan = function () {
                
            this.poum.pause();
            this.poum.fastSeek(0);
            this.poum.play();
            
            this.canon.goal.switchOn(this.canon.ballShoot);
            this.canon.goal.draw();
            
            var mi = this;
            setTimeout(function(){
                mi.check(mi.canon.goal);
                Tile.draw(mi.G);
            }, 50);
            
            setTimeout(function(){
                mi.FallStepOne();
                mi.out();
                if( mi.win == 0 ) {
                    mi.canon.types = mi.G.makeSet();
                    mi.canon.inshoot = false;
                }
            }, 200);
            
        }
        
        this.check = function (tile) {
            
            this.G.addInGroup(tile);
            var tour = this.G.groups[tile.group];
            
            if( tour.length < 3 ) return ;
            
            for( var t = 0, l = tour.length ; t < l ; t++ )
                tour[t].switchOff()
            Tile.draw(this.G);
            Sprite.animAdd( 'pouf', 'pouf', [tour]);
            
            this.pouf.pause();
            this.pouf.fastSeek(0);
            this.pouf.play();
            
        }
        
        this.FallStepOne = function() {
            
            var indice = Date.now();
            
            this.all = [];
            for( var y = 0;  y < Hex.ny-1;  y++ )
            for( var x = 0;  x < Hex.nx;  x++ )
                if(this.G.get(new Point(x, y)).on)
                    this.all.push(x+Hex.nx*y);
            
            if( this.all.length == 0 ) return ;
                
            for( var x = 0; x < Hex.nx;  x++ )
                if(this.G.get(new Point(x, 0)).on)
                    this.FallStepTwo(this.G.get(new Point(x, 0)), indice, 0);
            
            if( this.all.length == 0 ) return ;
            
            var win = false;
            this.tour = [];
            
            for( var t = 0, l = this.all.length ; t < l ; t++ ) {
                var lit = this.all[t];
                var point = new Point(lit%Hex.nx, Math.floor(lit/Hex.nx));
                var tile = this.G.get(point);
                if( tile.type.indexOf('gift') != -1 ) {
                    if( win === false ) win = true;
                } else
                    tile.switchOff();
                this.tour.push(tile);
            }
            Tile.draw(this.G);
            Sprite.animAdd( 'pouf', 'pouf', [this.tour]);
                
            this.fall.pause();
            this.fall.fastSeek(0);
            this.fall.play();
            
            if( win !== false ) this.gameOver('win');
            
        }
        
        this.FallStepTwo = function(tile, indice, step) {
            tile.indice = indice;
            for( var n = 0, l = tile.near.length; n < l;  n++ ) {
                if( !tile.near[n].on ) continue;
                
                var index = this.all.indexOf(tile.near[n].point.x+Hex.nx*tile.near[n].point.y);
                if(index != -1)
                    this.all.splice(this.all.indexOf(tile.near[n].point.x+Hex.nx*tile.near[n].point.y), 1);
                if( tile.near[n].indice != indice )
                    this.FallStepTwo(tile.near[n], indice, step++);
            }
        }
        
        this.out = function (tile) {
            
            var out = [];
            for( var x = 0; x < Hex.nx;  x++ )
                if(this.G.get(new Point(x, Hex.ny-3)).on)
                    out.push('out');
            
            if( out.length > 0 ) this.gameOver('loss');
            
        }
    }
    
})();
