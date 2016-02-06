var Main = (function (Main, undefined) {
    'use strict';
    
    var App, Grid;
    
    function Grid () {
        
        App = Main.App.ref;
        Grid = this;
        
        this.nx = App.gameGridSize[0];
        this.ny = App.gameGridSize[1];
        
        this.gridL = this.cooToGrid([this.nx, this.ny]);
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
        return point[0]+this.nx*point[1];
    }
    
    Grid.prototype.gridToCoo = function(grid) {
        return [grid%this.nx, (grid/this.nx)|0];
    }
    
    Grid.prototype.get = function(point) {
        var g = this.cooToGrid(point);
        if( ( Math.isPair(point[1]) || point[0] != 0 ) && point[1] < this.ny && this.grid[g] != undefined )
            return this.grid[g];
        return false;
    }
    
    Grid.prototype.check = function ( tile ) {
        this.checkAdd(tile, [tile.pg[0]-1, tile.pg[1]]);
        this.checkAdd(tile, [tile.pg[0]+1, tile.pg[1]]);
        this.checkAdd(tile, [tile.pg[0], tile.pg[1]-1]);
        this.checkAdd(tile, [tile.pg[0], tile.pg[1]+1]);
        
        if(Math.isPair(tile.pg[1])) {
            this.checkAdd(tile, [tile.pg[0]+1, tile.pg[1]-1]);
            this.checkAdd(tile, [tile.pg[0]+1, tile.pg[1]+1]);
        } else {
            this.checkAdd(tile, [tile.pg[0]-1, tile.pg[1]-1]);
            this.checkAdd(tile, [tile.pg[0]-1, tile.pg[1]+1]);
        }
    }
    
    Grid.prototype.checkAdd = function (tile, point) {
        if(this.get(point))
            tile.near.push(this.get(point));
    }
    
    

    function Tile ( point ) {
        
        this.pg = point;
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
