;(function(undefined){
    'use strict';
    
    var A, U, C, S, G, H, V;
    function Grid (main) {
        
        this.init = function ( clas ) {
            A = clas[0]; U = clas[1]; C = clas[2]; S = clas[3]; G = clas[4]; H = clas[5]; V = clas[6];
        }
        
        this.appInit = function () {
            
            this.nx = A.ref.gameGridSize.x;
            this.ny = A.ref.gameGridSize.y+3;
            
            this.gridL = this.cooToGrid(new Point(this.nx, this.ny+1));
            this.grid = new Array(this.gridL);
            this.set = [];
            this.groups = [];
            this.gifts = [];
            
            for( var g = 0;  g < this.gridL;  g++ )
                this.grid[g] = new Tile(this.gridToCoo(g));
            
            for( var g = 0;  g < this.gridL;  g++ )
                this.grid[g].check();
            
        } 
        
        
        this.initRound = function( level ) {
            
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
            
            Tile.draw(A);
        }
        
        this.addInGroup = function(tile) {
            
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
        
        this.makeSet = function() {
            this.set = [].concat(A.ref.option);
            for( var g = 0, l = this.grid.length ; g < l ; g++ )
                if( this.grid[g].on
                 && -1 === this.lvl.special.indexOf(this.grid[g].type) 
                 && -1 === this.set.indexOf(this.grid[g].type) )
                    this.set.push(this.grid[g].type);
            return this.set;
        }
        
        this.cooToGrid = function(point) {
            return point.x+this.nx*point.y;
        }
        
        this.gridToCoo = function(grid) {
            return new Point(grid%this.nx, (grid/this.nx)|0);
        }
        
        this.get = function(point) {
            if( point.x < 0 || point.y < 0 || point.x >= H.nx || point.y >= H.ny )
                return false;
            var g = this.cooToGrid(point);
            if( ( Math.isPair(point.y) || point.x != 0 ) && point.y < this.ny && this.grid[g] != undefined )
                return this.grid[g];
            return false;
        }
        
    }
    
    function Tile (point) {
        
        this.point = point;
        this.px = H.hexToPixel(point);
        this.on = false;
        this.type = '';
        this.group = false;
        this.near = [];
        
        this.drawBack = function () {
            if( G.get(point) ) S.tileBack(this);
        }
        
        this.draw = function () {
            if( this.on ) S.tileOn( this );
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
            if(G.get(point))
                this.near.push(G.get(point));
        }
        
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
    
    var ready = new Event("hexbubble.class.grid.loaded");
    ready.instance = new Grid();
    document.dispatchEvent(ready);
    
})();
