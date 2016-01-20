;(function(environment){
    'use strict';
    
    environment['Grid'] = function Grid (level) {
        
        this.lvl;
        this.grid;
        this.gridL;
        this.set;
        this.groups = [];
        this.gifts = [];
        
        this.construct = function(lvl) {
            this.lvl = lvl;
            this.gridL = this.cooToGrid(new Point(lvl.size.x+1, lvl.size.y+1+1));
            this.grid = new Array(this.gridL);
            
            for( var g = 0;  g <= this.gridL;  g++ ) {
                var point = this.gridToCoo(g);
                this.grid[g] = new Tile(this, point);
            }
        }
        
        this.initRound = function( level ) {
            
            this.lvl = level;
            
            for( var g = 0;  g <= this.gridL;  g++ ) {
                
                this.grid[g].switchOff();
                var m = this.gridToMap(g);
                
                if( m !== false ) {
                    var cas = this.lvl.map[m];
                    var type = this.lvl.range[cas];
                    if( cas != undefined && type != '' ) {
                        this.grid[g].switchOn(type);
                        this.addInGroup(this.grid[g]);
                        if( type.indexOf('gift') != -1 )
                            this.gifts.push(this.grid[g]);
                    }
                }
            }
            
            for( var g = 0;  g <= this.gridL;  g++ )
                this.grid[g].check();
            
            this.makeSet();
        }
        
        this.addInGroup = function(tile) {
                        
            // groupage pour explosion
            var type = tile.type;
            var grouPot = [];
            
            grouPot.push(this.isInGroup(new Point(tile.point.x-1, tile.point.y), type));
            grouPot.push(this.isInGroup(new Point(tile.point.x+1, tile.point.y), type));
            grouPot.push(this.isInGroup(new Point(tile.point.x, tile.point.y-1), type));
            grouPot.push(this.isInGroup(new Point(tile.point.x, tile.point.y+1), type));
            
            if(Math.isPair(tile.point.y) ) {
                grouPot.push(this.isInGroup(new Point(tile.point.x+1, tile.point.y-1), type));
                grouPot.push(this.isInGroup(new Point(tile.point.x+1, tile.point.y+1), type));
            } else {
                grouPot.push(this.isInGroup(new Point(tile.point.x-1, tile.point.y-1), type));
                grouPot.push(this.isInGroup(new Point(tile.point.x-1, tile.point.y+1), type));
            }
            
            grouPot.sort(function(a, b){return a === false ? 1 : (b === false ? -1 : a-b)});
            
            var group = false;
            for( var gr = 0, l = grouPot.length ; gr < l ; gr++ ) {
                if( grouPot[gr] === false )
                    break;
                else {
                    if( group === false )
                        group = grouPot[gr];
                    else if( group !== false && grouPot[gr] > group ) {
                        for( var grs = 0, l = this.groups[grouPot[gr]].length ; grs < l ; grs++ )
                            this.groups[grouPot[gr]][grs].group = group;
                        this.groups[group] = this.groups[group].concat(this.groups[grouPot[gr]]);
                    } else if( group !== false && grouPot[gr] <= group )
                        group = grouPot[gr];
                }
            }
            
            if( group === false ) {
                this.groups.push([]);
                group = this.groups.length-1;
            }
            
            this.groups[group].push(tile);
            tile.group = group;
                        
        }
        
        this.isInGroup = function(point, type) {
            var tile = this.get(point);
            if(tile && tile.on && tile.type == type )
                return tile.group;
            return false;
        }
        
        this.makeSet = function() {
            this.set = [];
            for( var g = 0, l = this.grid.length ; g < l ; g++ )
                if( this.grid[g].on )
                    if( this.lvl.special.indexOf(this.grid[g].type) == -1 )
                        if( this.set.indexOf(this.grid[g].type) == -1 )
                            this.set.push(this.grid[g].type);
            return this.set;
        }
        
        this.cooToGrid = function(point) {
            return (point.x+1)+(this.lvl.size.x+2)*(point.y+1);
        }
        
        this.gridToCoo = function(grid) {
            return new Point(grid%(this.lvl.size.x+2)-1, Math.floor(grid/(this.lvl.size.x+2))-1);
        }
        
        this.gridToMap = function(grid) {
            var point = this.gridToCoo(grid);
            if( point.x < 0 || point.x >= this.lvl.size.x
             || point.y < 0 || point.y > this.lvl.size.y - 3
             || (!Math.isPair(point.y) && point.x == 0) )
                return false;
            return point.x+this.lvl.size.x*point.y;
        }
        
        this.is = function(point) {
            if( point.x < 0 || point.x >= this.lvl.size.x
             || point.y < 0 || point.y > this.lvl.size.y - 3
             || (!Math.isPair(point.y) && point.x == 0) )
                return false;
            var g = this.cooToGrid(point);
            return this.grid[g] != undefined;
        }
        
        this.get = function(point) {
            var g = this.cooToGrid(point);
            return this.grid[g];
        }
        
        this.construct(level);
        
    }
    
    environment['Tile'] = function (grid, point) {
        
        this.drawBack = function () {
            
            if( this.point.x < 0 || this.point.x >= this.G.lvl.size.x
             || this.point.y < 0
             || (!Math.isPair(this.point.y) && this.point.x == 0) )
                ;//Sprite.cube('back', this.px, '#111', Hex.rayon);
            else if( this.point.y > this.G.lvl.size.y - 1 )
                ;//Sprite.tile('back', this.px, '#222', Hex.rayon);
            else
                Sprite.tileBack(this);
            
        }
        
        this.draw = function () {
            
            if( this.on ) Sprite.tileOn( this );
            
        }
        
        this.switchOn = function (type) {
            this.on = true;
            this.type = type;
        }
        
        this.switchOff = function () {
            this.on = false;
            this.type = '';
            this.group = false;
            this.step = 0;
        }
        
        this.check = function () {
            this.checkAdd(new Point(this.point.x-1, this.point.y));
            this.checkAdd(new Point(this.point.x+1, this.point.y));
            this.checkAdd(new Point(this.point.x, this.point.y-1));
            this.checkAdd(new Point(this.point.x, this.point.y+1));
            
            if(Math.isPair(this.point.y)) {
                this.checkAdd(new Point(this.point.x+1, this.point.y-1));
                this.checkAdd(new Point(this.point.x+1, this.point.y+1));
            } else {
                this.checkAdd(new Point(this.point.x-1, this.point.y-1));
                this.checkAdd(new Point(this.point.x-1, this.point.y+1));
            }
        }
        
        this.checkAdd = function (point) {
            if(this.G.is(point))
                this.near.push(this.G.get(point));
        }
        
        this.G = grid;
        this.point = point;
        this.px = Hex.hexToPixel(point);
        this.on = false;
        this.type = '';
        this.group = false;
        this.near = [];
        
    }
    
    Tile.drawBack = function (G) {
        View.clear('back');
        for( var g = 0, l = G.grid.length ; g < l ; g++ )
            G.grid[g].drawBack();
        
    }
    
    Tile.draw = function (G) {
        View.clear('border');
        View.clear('cube');
        View.clear('borderGift');
        View.clear('gift');
        for( var g = 0, l = G.grid.length ; g < l ; g++ )
            if(G.grid[g].on)
                G.grid[g].draw();
        
    }
    
    function Hexagone () {
    
        this.init = function ( nx, ny, vw, vh, mwidth, mheight ) {
            
            this.mwidth = mwidth;
            this.mheight = mheight;
            this.nx = nx;
            this.ny = ny;
            
            if(nx/ny > vw/vh) {
                this.dwidth = Math.floor((vw-mwidth*2)/(nx*2));
                this.drayon = Math.tan(Math.PI / 180 * 30) * this.dwidth;
            } else {
                this.rayon = ((vh-mheight*2)/(ny*3+1))*2;
                this.dwidth = Math.floor(this.rayon * Math.cos(Math.PI / 180 * 30));
                this.drayon = Math.tan(Math.PI / 180 * 30) * this.dwidth;
            }
            
            this.rayon = this.drayon*2;
            this.width = this.dwidth*2;
            
        }
    
        this.hexToPixel = function (point) {
            var offset = Math.isPair(point.y) ? 0 : Hex.dwidth;
            var px = new Point( Hex.width*point.x+Hex.dwidth-offset, Hex.rayon+point.y*Hex.rayon*1.5);
            return new Point(px.x+View.mwidth, px.y+View.mheight);
        }

        this.pixelToHex = function (point) {
            
            var point = new Point(point.x-View.mwidth, point.y-View.mheight);
            
            var bande = Math.floor(point.y/(Hex.drayon));
            
            var ret = new Point(0, Math.floor((point.y)/(Hex.rayon*1.5)));
            if( Math.isPair(ret.y) )
                 ret.x = Math.floor(point.x/Hex.width);
            else ret.x = Math.floor((point.x+Hex.dwidth)/Hex.width);
            
            if( bande%3 == 0 ) {
                var pc = new Point(Math.floor(point.x/(Hex.dwidth)),
                                   Math.floor(point.y/(Hex.drayon)));
                var re = new Point(point.x-(pc.x*Hex.dwidth),
                                   point.y-(pc.y*Hex.drayon));
                var po = new Point(re.x*100/Hex.dwidth,
                                   re.y*100/Hex.drayon);
                
                if(Math.isPair(pc.x+pc.y) && po.x+po.y < 25 ) {
                    ret.y--;
                    if( Math.isPair(ret.y) ) ret.x--;
                } else if( !Math.isPair(pc.x+pc.y) && 25-po.x+po.y < 25 ) {
                    ret.y--;
                    if( !Math.isPair(ret.y) ) ret.x++;
                }
                
            }
            
            return ret;
        }
        
    }
    
    var Hex = environment['Hex'] = new Hexagone();
    

    
})(this);
