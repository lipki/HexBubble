var HexaGrid = function()  {
	
	this.css = new CSS(1);
	this.grid = [];
    
    this.$idbody       = $('<div id="body"/>');
    this.$roll_border  = $('<div class="roll" id="border"/>');
    this.$roll_front   = $('<div class="roll" id="front"/>');
    this.$roll_big     = $('<div class="roll" id="big"/>');
    this.$pitch        = $('<div class="pitch"/>');
    this.$yaw          = $('<div class="yaw"/>');
    
    this.$pitch.append(this.$yaw);
    
    this.$pitch.clone().appendTo(this.$roll_border);
    this.$idbody.append(this.$roll_border);
    
    this.$pitch.clone().appendTo(this.$roll_front);
    this.$idbody.append(this.$roll_front);
    
    this.$pitch.appendTo(this.$roll_big);
    this.$idbody.append(this.$roll_big);
    
    $('body').prepend(this.$idbody);
    
	// orientation
	this.navWidth = this.width = this.$idbody.width();
	this.navHeight = this.height = this.$idbody.height();
	
	if( this.navWidth > this.navHeight ) {
		this.height = this.navWidth;
		this.width = this.navHeight;
	}
    	
    // listen event
    var mi = this;
    $(document).on('hexa_on'    , function(e, data       ) { mi.check (e, data); });
    $(document).on('map_hexa_on', function(e, data, data2) { mi.on (e, data); });

};

HexaGrid.prototype.initCSS = function()  {
	
	this.css.insertRule('*','transform:translate3d(0,0,0)');
	this.css.insertRule('.roll, .pitch, .yaw, .block','display: block','position: absolute','transform-style:preserve-3d');
	this.css.insertRule('.pitch','transform:rotateX(-35deg)');
	this.css.insertRule('.yaw','transform:rotateY(45deg);margin: 0px');
	this.css.insertRule('#border','transform: translateZ(100px);');
	this.css.insertRule('#front','transform: translateZ(200px);');
	this.css.insertRule('#big','transform: translateZ(300px);');
    this.css.insertRule('.block','display: block;position: absolute');
	this.css.insertRule('.face','backface-visibility:hidden','display:block','position:absolute');
	
    
	var offsetWidth = this.width/2; //middle
	offsetWidth -= this.demiWidthCube*(this.column-.5); // décentrage
	
	var offsetHeight = this.height/2; //middle
	offsetHeight -= this.heightCube*((this.line-1)*.75); // décentrage
	
	if( this.navWidth > this.navHeight )
    	this.css.insertRule('.roll',
    		'transform:translateY('+this.width.toFixed(1)+'px) rotateZ(-90deg)',
    		'top:'+(-offsetWidth).toFixed(1)+'px',
    		'left:'+offsetHeight.toFixed(1)+'px'
    	);
	else
		this.css.insertRule('.roll','left:'+offsetWidth.toFixed(1)+'px','top:'+offsetHeight.toFixed(1)+'px');
	
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

HexaGrid.prototype.reset = function( mData )  {
	
    this.column = mData.column;
    this.line = mData.line;
    
	this.css.reset();
    this.calculating();
    
    var backWidth1  = this.widthCube*0.75;
    var backWidth2  = this.widthCube*1.25;
    var backHeight1 = this.height/2+this.heightCube/2;
    var backHeight2 = this.height/2+this.heightCube*2;
	
	this.css.insertRule('#body',
		'background-color:#556',
		'background-image: '+
		'linear-gradient( 30deg, #171717 0%, #131313 12%, transparent 12.5%, transparent 87%, #1b1b1b 87.5%, #171717),'+
		'linear-gradient(150deg, #171717 0%, #1b1b1b 12%, transparent 12.5%, transparent 87%, #131313 87.5%, #171717),'+
		'linear-gradient( 30deg, #171717 0%, #131313 12%, transparent 12.5%, transparent 87%, #1b1b1b 87.5%, #171717),'+
		'linear-gradient(150deg, #171717 0%, #1b1b1b 12%, transparent 12.5%, transparent 87%, #131313 87.5%, #171717),'+
		'linear-gradient( 60deg, #080808 0%, #0f0f0f 25%, transparent 25.5%, transparent 75%, #0f0f0f 75%  , #151515),'+
		'linear-gradient( 60deg, #080808 0%, #0f0f0f 25%, transparent 25.5%, transparent 75%, #0f0f0f 75%  , #151515),'+
		'linear-gradient(-60deg, #131313 0%, #171717 25%, transparent 25.5%, transparent 75%, #171717 75%  , #1b1b1b),'+
		'linear-gradient(-60deg, #131313 0%, #171717 25%, transparent 25.5%, transparent 75%, #171717 75%  , #1b1b1b)',
		'background-size:'+this.widthCube+'px '+(this.heightCube*3)+'px',
		'background-position: '+
			backWidth1+'px '+backHeight1+'px, '+backWidth1+'px '+backHeight1+'px, '+
			backWidth2+'px '+backHeight2+'px, '+backWidth2+'px '+backHeight2+'px, '+
			backWidth1+'px '+backHeight1+'px, '+backWidth2+'px '+backHeight2+'px, '+
			backWidth1+'px '+backHeight1+'px, '+backWidth2+'px '+backHeight2+'px'
    );
    
    if( this.maxLine < mData.line ) return false;
    
	this.initCSS();
    
    for( var x = 0 ; x <= Math.ceil(mData.column)-1 ; x ++) {
    	
    	this.grid[x] = [];
    	
	    for( var y = 0 ; y <= mData.line-1 ; y ++) {
	    	
	    	this.grid[x][y] = new Hexa( this.css, x, y, this.side );
            
	    }
    }
	
	return true;
	
};

HexaGrid.prototype.on = function( e, hexa ) {
	
	this.grid[hexa.x][hexa.y].on( hexa.id, hexa.color );
    
};

HexaGrid.prototype.check = function( e, hexa ) {
	
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