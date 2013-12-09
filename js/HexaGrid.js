var HexaGrid = function()  {
	
	this.css = new CSS(1);
	this.grid = [];
    
    this.$idbody = $('<div id="body"/>');
    this.$roll   = $('<div id="roll"/>');
    this.$pitch  = $('<div id="pitch"/>');
    this.$yaw    = $('<div id="yaw"/>');
    
    this.$pitch.append(this.$yaw);
    this.$roll.append(this.$pitch);
    this.$idbody.append(this.$roll);
    $('body').prepend(this.$idbody);
    
	// orientation
	this.navWidth = this.width = this.$idbody.width();
	this.navHeight = this.height = this.$idbody.height();
	
	if( this.navWidth > this.navHeight ) {
		this.height = this.navWidth;
		this.width = this.navHeight;
	}
    
};

HexaGrid.prototype.initCSS = function()  {
	
	this.css.insertRule('*','translate3d(0,0,0)');
	this.css.insertRule('#roll,#pitch,#yaw,.block','display:block','position:absolute','transform-style:preserve-3d');
	this.css.insertRule('#pitch','transform:rotateX(-35deg)');
	this.css.insertRule('#yaw','transform:rotateY(45deg);margin: 0px');
    this.css.insertRule('.block','display: block;position: absolute');
	this.css.insertRule('.face','backface-visibility:hidden','display:block','position:absolute','-moz-box-sizing:padding-box');
    
	var offsetWidth = this.width/2; //middle
	offsetWidth -= this.demiWidthCube*(this.column-.5); // décentrage
	
	var offsetHeight = this.height/2; //middle
	offsetHeight -= this.heightCube*((this.line-1)*.75); // décentrage
	
	if( this.navWidth > this.navHeight ) {
    	this.css.insertRule('#roll','transform:translateY('+this.width.toFixed(1)+'px) rotateZ(-90deg)');
    	this.css.insertRule('#roll','top:'+(-offsetWidth).toFixed(1)+'px');
    	this.css.insertRule('#roll','left:'+offsetHeight.toFixed(1)+'px');
	} else {
    	this.css.insertRule('#roll','left:'+offsetWidth.toFixed(1)+'px');
		this.css.insertRule('#roll','top:'+offsetHeight.toFixed(1)+'px');
	}
	
};

HexaGrid.prototype.calculating = function() {
	
    this.widthCube = this.width/(this.column+1);
    this.demiWidthCube = this.widthCube/2;
    this.heightCube = this.demiWidthCube/Math.cos(Math.PI*30/180);
    this.side = this.heightCube*1.227; // valeur mystérieuse
    
    this.maxLine = Math.floor(this.height/((this.heightCube/2)*3));
    
    this.lineHeight = (this.heightCube/2)*(this.line*3+1);
    this.lineStart = (this.height-this.lineHeight)/2;
    this.linesup = Math.ceil(this.lineStart/this.heightCube);
    
};

HexaGrid.prototype.reset = function( map )  {
	
	this.css.reset();
    
    this.column = map.data.column;
    this.line = map.data.line;
    
    this.calculating();
    
    if( this.maxLine < map.data.line ) return false;
    
	this.initCSS();
    
    for( var x = -1 ; x <= map.data.column ; x ++) {
    	
    	this.grid[x] = [];
    	
	    for( var y = -this.linesup ; y <= map.data.line-1+this.linesup ; y ++) {
	    	
	    	this.grid[x][y] = new Hexa( this.$yaw, this.css, x, y, this.side, map.data.color[map.data.background] );
            
	    }
    }
	
	return true;
	
};

HexaGrid.prototype.on = function( hexa, color ) {
	
	this.grid[hexa.x][hexa.y].on( hexa.id, color );
    
};

HexaGrid.prototype.check = function( hexa ) {
	
    //if triple
    
    var nx = Math.ceil(hexa.y/2) == (hexa.y/2) ? hexa.x-1 : hexa.x;
    
    var $top1 = $('.x_'+(nx+0)+'.y_'+(hexa.y-1));
    var $top2 = $('.x_'+(nx+1)+'.y_'+(hexa.y-1));
    var $left = $('.x_'+(hexa.x-1)+'.y_'+hexa.y);
    var $righ = $('.x_'+(hexa.x+1)+'.y_'+hexa.y);
    var $bot1 = $('.x_'+(nx+0)+'.y_'+(hexa.y+1));
    var $bot2 = $('.x_'+(nx+1)+'.y_'+(hexa.y+1));
    
    var big = false;
    if( $top1.hasClass('id_'+hexa.id) && $top2.hasClass('id_'+hexa.id)  ) big = {b3:{x:hexa.x, y:hexa.y}, b2:{x:nx+1, y:hexa.y-1}, b1:{x:nx, y:hexa.y-1}};
    if( $bot2.hasClass('id_'+hexa.id) && $righ.hasClass('id_'+hexa.id)  ) big = {b1:{x:hexa.x, y:hexa.y}, b3:{x:nx+1, y:hexa.y+1}, b2:{x:hexa.x+1, y:hexa.y}};
    if( $left.hasClass('id_'+hexa.id) && $bot1.hasClass('id_'+hexa.id)  ) big = {b2:{x:hexa.x, y:hexa.y}, b3:{x:nx, y:hexa.y+1}, b1:{x:hexa.x-1, y:hexa.y}};
    
    //console.log(big);
    
    //if( bot1 && bot2  ) console.log('b1');
    //if( top2 && righ  ) console.log('b2');
    //if( left && top1  ) console.log('b3');
    
    if( big ) {
    	
    	this.grid[big.b1.x][big.b1.y].bigOn('left');
        this.grid[big.b2.x][big.b2.y].bigOn('right');
        this.grid[big.b3.x][big.b3.y].bigOn('bottom');
            
    }
	
};