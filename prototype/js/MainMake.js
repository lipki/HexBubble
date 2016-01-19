;(function(environment){
    'use strict';
    
    include([
        'js/Grid.js',
        'js/utils.js',
        'js/Sprite.js',
        'js/View.js',
        'maps/round0.js'
            ],
        function() {
            environment['Main'] = new Main();
            environment['Main'].init();
        });

    function Main () {
        
        this.round = Round0;
        this.selectedTile;
        this.type = 3;
        
        this.init = function () {
            
            //size init
            Hex.init ( this.round.size.x, this.round.size.y, window.innerWidth, window.innerHeight, 10, 10 );
            View.init( this.round.size.x, this.round.size.y, Hex.rayon, Hex.width, 10, 10 );
            
            //model
            this.G = new Grid(this.round);
            
            //view
            View.add('sprite', true);
            View.add('back');
            View.add('border');
            View.add('borderGift');
            View.add('borderBalle');
            View.add('cube');
            View.add('gift');
            View.add('canon');
            View.add('balle');
            View.add('alert');
            
            // draw
            Tile.drawBack(this.G);
            Tile.draw(this.G);
            
            //event
            var mi = this;
            window.addEventListener('click', function (e) {mi.pan(e)});
            window.addEventListener('mousemove', function (e) {mi.move(e)});
            window.addEventListener("keydown", function (e) {mi.key(e)});
            window.addEventListener("DOMMouseScroll", function (e) {mi.wheel(e)});
            
        }
        
        this.move = function (e) {
            
            var tile = Hex.pixelToHex(new Point(e.layerX, e.layerY));
            if( this.G.is(tile) ) {
                
                this.selectedTile = this.G.get(tile);
                var type = this.round.range[this.type];
                
                View.clear('borderBalle');
                View.clear('balle');
                if( this.round.range[this.type] != 'off' ) {
            
                    if( type.indexOf('gift') != -1 )
                        type = 'Fuchsia';
                    if( type == 'fixed' )
                        type = 'DarkKhaki';
                    
                    Sprite.hex(View['borderBalle'].ctx, this.selectedTile.px, 'white' , Hex.rayon/5*3, Hex.rayon/4);
                    Sprite.hex(View['balle'].ctx, this.selectedTile.px, type, Hex.rayon/5*3);
                    Sprite.shadowOut(View['balle'].ctx, this.selectedTile.px, Hex.rayon/5*3);
                    
                    
                } else Sprite.hex(View['balle'].ctx, this.selectedTile.px, 'white', Hex.rayon/5*3, Hex.rayon/4);
                
            }
            
        }
        
        this.wheel = function (e) {
            if ( e.detail > 0 )
                 this.type = (this.type+this.round.range.length+1)%this.round.range.length;
            else this.type = (this.type+this.round.range.length-1)%this.round.range.length;
            this.move(e);
        }

        this.pan = function (e) {
            if( this.round.range[this.type] != 'off' ) {
                 this.selectedTile.switchOn(this.round.range[this.type]);
                this.selectedTile.draw();
            } else {
                this.selectedTile.switchOff();
                Tile.draw(this.G);
            }
        }
        
        this.key = function (e) {
            
            if(e.keyCode === 32) {
                e.preventDefault();
                
                this.G.makeSet();
                
                var all = [];
                for( var y = 0;  y < Hex.ny;  y++ )
                for( var x = 0;  x < Hex.nx;  x++ )
                    if(this.G.get(new Point(x, y)).on)
                         all.push(this.G.set.indexOf(this.G.get(new Point(x, y)).type)+1);
                    else all.push(0);
                
                console.log("\n",
                ";(function(environment){\n",
                "'use strict';\n",
                "   environment['Round"+window.location.search.substring(1)+"'] = {\n",
                "       size :{x:"+Hex.nx+", y:"+Hex.ny+"},\n",
                "       special:['', 'gift', 'fixed'],\n",
                "       range:['', '"+this.G.set.join("', '")+"'],\n",
                "       map  :["+all.join(",")+"]\n",
                "   }\n",
                "})(this);",
                "\n",
                "\n");
                
            }
            
        }
        
    }
    
})(this);
