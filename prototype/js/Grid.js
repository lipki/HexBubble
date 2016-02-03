var Main = (function (Main, undefined) {
    'use strict';
    
    var A, H, V, G, Cube;
    
    function Grid ( app, hex, view ) {
        
        Cube = new Main.Sprite.Cube ( view.cube, view.border );
        A = app;
        H = hex;
        V = view;
        G = this;
        
        this.nx = A.gameGridSize.x;
        this.ny = A.gameGridSize.y+3;
        
        this.gridL = this.cooToGrid(new Point(this.nx, this.ny+1));
        this.grid = new Array(this.gridL);
        this.set = [];
        this.groups = [];
        this.gifts = [];
        
        for( var g = 0;  g < this.gridL;  g++ )
            this.grid[g] = new Tile(this.gridToCoo(g));
        
        for( var g = 0;  g < this.gridL;  g++ )
            this.check( this.grid[g] );
        
    } 
    
    Grid.prototype.initRound = function( level ) {
        
        this.lvl = level;
        this.groups.length = 0;
        this.gifts.length = 0;
        
        for( var g = 0;  g < this.gridL;  g++ )
            this.grid[g].switchOff();
        
        for( var g = 0;  g < this.gridL;  g++ ) {
            
            var cas = this.lvl.map[g];
            var type = this.lvl.range[cas];
            
            if( undefined === cas || '' === type ) continue;
            
            this.grid[g].switchOn(type);
            this.addInGroup(this.grid[g]);
            if( type.indexOf('gift') != -1 )
                this.gifts.push(this.grid[g]);
            
        }
        
        this.makeSet();
        
        Tile.draw();
    }
    
    Grid.prototype.addInGroup = function(tile) {
    
        var type = tile.type;
        var grouPot = [];
        
        for( var gr = 0, l = tile.near.length ; gr < l ; gr++ )
            if( tile.near[gr].on && tile.near[gr].type === type )
                grouPot.push(tile.near[gr].group);
        
        grouPot.sort(function(a, b){return a-b});
        var grouPotlength = grouPot.length;
        
        if( 0 === grouPotlength ) {
            this.groups.push([]);
            tile.group = this.groups.length-1;
        } else
            tile.group = grouPot[0];
        
        this.groups[tile.group].push(tile);
        
        for( var gr = 1, l = grouPotlength ; gr < l ; gr++ )
            if( grouPot[gr] > tile.group )
                this.groups[tile.group] = this.groups[tile.group].concat(this.groups[grouPot[gr]]);
        
        for( var gr = 0, l = this.groups[tile.group].length ; gr < l ; gr++ )
            if( this.groups[tile.group][gr] )
                this.groups[tile.group][gr].group = tile.group;
                    
    }
    
    Grid.prototype.makeSet = function() {
        this.set = [].concat(A.option);
        for( var g = 0, l = this.grid.length ; g < l ; g++ )
            if( this.grid[g].on
             && -1 === this.lvl.special.indexOf(this.grid[g].type) 
             && -1 === this.set.indexOf(this.grid[g].type) )
                this.set.push(this.grid[g].type);
        return this.set;
    }
    
    Grid.prototype.cooToGrid = function(point) {
        return point.x+this.nx*point.y;
    }
    
    Grid.prototype.gridToCoo = function(grid) {
        return new Point(grid%this.nx, (grid/this.nx)|0);
    }
    
    Grid.prototype.get = function(point) {
        var g = this.cooToGrid(point);
        if( ( Math.isPair(point.y) || point.x != 0 ) && point.y < this.ny && this.grid[g] != undefined )
            return this.grid[g];
        return false;
    }
    
    Grid.prototype.check = function ( tile ) {
        this.checkAdd(tile, new Point(tile.pg.x-1, tile.pg.y));
        this.checkAdd(tile, new Point(tile.pg.x+1, tile.pg.y));
        this.checkAdd(tile, new Point(tile.pg.x, tile.pg.y-1));
        this.checkAdd(tile, new Point(tile.pg.x, tile.pg.y+1));
        
        if(Math.isPair(tile.pg.y)) {
            this.checkAdd(tile, new Point(tile.pg.x+1, tile.pg.y-1));
            this.checkAdd(tile, new Point(tile.pg.x+1, tile.pg.y+1));
        } else {
            this.checkAdd(tile, new Point(tile.pg.x-1, tile.pg.y-1));
            this.checkAdd(tile, new Point(tile.pg.x-1, tile.pg.y+1));
        }
    }
    
    Grid.prototype.checkAdd = function (tile, point) {
        if(this.get(point))
            tile.near.push(this.get(point));
    }
    
    

    function Tile ( point ) {
        
        this.pg = point;
        this.px = H.hexToPixel(point);
        this.on = false;
        this.type = '';
        this.group = false;
        this.near = [];
        this.cube;
        
    }
    
    Tile.prototype.drawBack = function () {
        if( G.get(point) ) S.tileBack(this);
    }
    
    Tile.prototype.draw = function () {
        if( this.on ) {
            Cube.drawCube( this );
        }
    }
    
    Tile.prototype.switchOn = function (type) {
        this.on = true;
        this.type = type;
        this.group = false;
    }
    
    Tile.prototype.switchOff = function () {
        this.on = false;
        this.type = '';
        this.group = false;
    }
    
    Tile.drawBack = function () {
        V.clear('back');
        for( var g = 0, l = G.grid.length ; g < l ; g++ )
            G.grid[g].drawBack();
        
    }
    
    Tile.draw = function () {
        V.clear('border');
        V.clear('cube');
        V.clear('borderGift');
        V.clear('gift');
        for( var g = 0, l = G.grid.length ; g < l ; g++ )
            if(G.grid[g].on)
                G.grid[g].draw();
        
    }
    
    Main.Grid = Grid;
    return Main;
}(Main || {}));
