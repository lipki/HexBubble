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
            this.gridL = this.cooToGrid(new Point(lvl.size.x, lvl.size.y+1));
            this.grid = new Array(this.gridL);
            
            for( var g = 0;  g < this.gridL;  g++ )
                this.grid[g] = new Tile(this, this.gridToCoo(g));
            
            for( var g = 0;  g < this.gridL;  g++ )
                this.grid[g].check();
        }
        
        this.initRound = function( level ) {
            
            this.lvl = level;
            this.groups = [];
            this.gifts = [];
            this.set = null;
            
            for( var g = 0;  g < this.gridL;  g++ )
                this.grid[g].switchOff();
            
            for( var g = 0;  g < this.gridL;  g++ ) {
                
                var cas = this.lvl.map[g];
                var type = this.lvl.range[cas];
                
                if( cas == undefined || type == '' ) continue;
                
                this.grid[g].switchOn(type);
                this.addInGroup(this.grid[g]);
                if( type.indexOf('gift') != -1 )
                    this.gifts.push(this.grid[g]);
                
            }
            
            this.makeSet();
        }
        
        this.addInGroup = function(tile) {
            
            var type = tile.type;
            var grouPot = [];
            
            for( var gr = 0, l = tile.near.length ; gr < l ; gr++ )
                if( tile.near[gr].on && tile.near[gr].type == type )
                    grouPot.push(tile.near[gr].group);
            
            grouPot.sort(function(a, b){return a-b});
            
            if( grouPot.length == 0 ) {
                this.groups.push([]);
                tile.group = this.groups.length-1;
            } else
                tile.group = grouPot[0];
            
            this.groups[tile.group].push(tile);
            
            for( var gr = 1, l = grouPot.length ; gr < l ; gr++ )
                if( grouPot[gr] > tile.group )
                    this.groups[tile.group] = this.groups[tile.group].concat(this.groups[grouPot[gr]]);
            
            for( var gr = 0, l = this.groups[tile.group].length ; gr < l ; gr++ )
                if( this.groups[tile.group][gr] )
                    this.groups[tile.group][gr].group = tile.group;
                        
        }
        
        this.makeSet = function() {
            this.set = [];
            for( var g = 0, l = this.grid.length ; g < l ; g++ )
                if( this.grid[g].on
                 && this.lvl.special.indexOf(this.grid[g].type) == -1 
                 && this.set.indexOf(this.grid[g].type) == -1 )
                    this.set.push(this.grid[g].type);
            return this.set;
        }
        
        this.cooToGrid = function(point) {
            return point.x+this.lvl.size.x*point.y;
        }
        
        this.gridToCoo = function(grid) {
            return new Point(grid%this.lvl.size.x, Math.floor(grid/this.lvl.size.x));
        }
        
        this.get = function(point) {
            if( point.x < 0 || point.y < 0 || point.x >= Hex.nx || point.y >= Hex.ny )
                return false;
            var g = this.cooToGrid(point);
            if( ( Math.isPair(point.y) || point.x != 0 ) && point.y < this.lvl.size.y && this.grid[g] != undefined )
                return this.grid[g];
            return false;
        }
        
        this.construct(level);
        
    }
    
    environment['Tile'] = function (grid, point) {
        
        this.drawBack = function () {
            if( this.G.get(point) ) Sprite.tileBack(this);
        }
        
        this.draw = function () {
            if( this.on ) Sprite.tileOn( this );
        }
        
        this.switchOn = function (type) {
            this.on = true;
            this.type = type;
            this.group = false;
        }
        
        this.switchOff = function () {
            this.on = false;
            this.type = '';
            this.group = false;
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
            if(this.G.get(point))
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
    
        this.init = function ( nx, ny, vw, vh ) {
            
            this.nx = nx;
            this.ny = ny;
            
            this.rayon = (vh/(ny*3+1))*2;
            this.dwidth = Math.floor(this.rayon * Math.cos(Math.PI / 180 * 30));
            this.drayon = Math.round(Math.tan(Math.PI / 180 * 30) * this.dwidth);
            
            if(nx/ny > vw/vh) {
                this.dwidth = Math.floor((vw-mwidth*2)/(nx*2));
                this.drayon = Math.round(Math.tan(Math.PI / 180 * 30) * this.dwidth);
            }
            
            this.rayon = this.drayon*2;
            this.width = this.dwidth*2;
            
            this.aWidth = this.width*this.nx;
            this.aHeight = (this.rayon*1.5)*this.ny+this.drayon;
            this.zerox = Math.floor((View.width-Hex.aWidth)/2);
            this.zeroy = this.drayon;
            
        }
    
        this.hexToPixel = function (point) {
            var offset = Math.isPair(point.y) ? 0 : this.dwidth;
            var px = new Point( this.width*point.x+this.dwidth-offset+this.zerox, this.rayon+point.y*this.rayon*1.5+this.zeroy );
            return new Point(px.x, px.y);
        }

        this.pixelToHex = function (point) {
            
            var point = new Point(point.x-Hex.zerox, point.y-Hex.zeroy);
            
            var bande = Math.floor(point.y/(this.drayon));
            
            var ret = new Point(0, Math.floor((point.y)/(this.rayon*1.5)));
            ret.x = Math.floor((point.x+this.dwidth)/this.width);
            if( Math.isPair(ret.y) )
                 ret.x = Math.floor(point.x/this.width);
            
            if( bande%3 == 0 ) {
                var pc = new Point(Math.floor(point.x/(this.dwidth)),
                                   Math.floor(point.y/(this.drayon)));
                var re = new Point(point.x-(pc.x*this.dwidth),
                                   point.y-(pc.y*this.drayon));
                var po = new Point(re.x*100/this.dwidth,
                                   re.y*100/this.drayon);
                
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
