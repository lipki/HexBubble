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
    
    this.$idbody.append(this.$roll_border);
    
    this.$pitch.clone().appendTo(this.$roll_front);
    this.$idbody.append(this.$roll_front);
    
    this.$pitch.appendTo(this.$roll_big);
    this.$idbody.append(this.$roll_big);
    
    $('body').prepend(this.$idbody);
    
	$('#body').css({
		transform: 'translate3d(0,0,0)',
		backgroundColor:'#080808',
		//backgroundRepeat:'no-repeat',
		backgroundImage: 
		'linear-gradient( 30deg, #171717 0%, #131313 12%, transparent 12%, transparent 87%, #1b1b1b 87%, #171717),'+
		'linear-gradient(150deg, #171717 0%, #1b1b1b 12%, transparent 12%, transparent 87%, #131313 87%, #171717),'+
		'linear-gradient( 30deg, #171717 0%, #131313 12%, transparent 12%, transparent 87%, #1b1b1b 87%, #171717),'+
		'linear-gradient(150deg, #171717 0%, #1b1b1b 12%, transparent 12%, transparent 87%, #131313 87%, #171717),'+
		'linear-gradient( 60deg, #080808 0%, #0f0f0f 25%, transparent 25%, transparent 75%, #0f0f0f 75%, #151515),'+
		'linear-gradient( 60deg, #080808 0%, #0f0f0f 25%, transparent 25%, transparent 75%, #0f0f0f 75%, #151515),'+
		'linear-gradient(-60deg, #131313 0%, #171717 25%, transparent 25%, transparent 75%, #171717 75%, #1b1b1b),'+
		'linear-gradient(-60deg, #131313 0%, #171717 25%, #171717 75%  , #1b1b1b)',
		backgroundSize: '80px 140px',
		//transition: 'background-position 5s',
		backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px, 0 0, 0 0, 40px 70px, 40px 70px'
    });
    
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
	
	var css = this.css;
    var widthCube = this.widthCube = 80;
    var side = this.side = widthCube/2/Math.cos(Math.PI*30/180);
    var scale = this.scale = widthCube/(this.width/(this.column+1));
	var newWidthCube = widthCube/scale;
	var newSide = side/scale;
	
	var offsetWidth = this.width/2; //middle
	offsetWidth -= (newWidthCube/2)*(this.column-.5); // décentrage
	
	var offsetHeight = this.height/2; //middle
	offsetHeight -= newSide*((this.line-1)*.75); // décentrage
	
	var backWidth1 = backWidth2  = - ( Math.odd(this.column) ? newWidthCube/2 : 0 ) - ( Math.floor(this.column) != this.column ? newWidthCube/this.column : 0 );
    backWidth1 += ( this.width/2-newWidthCube/4 );
    backWidth2 += ( this.width/2+newWidthCube/4 );
    
    var backHeight1 = ( this.height/2-newSide*1.75 ) + ( Math.odd(this.line) ? newSide*.75 : 0 );
    var backHeight2 = ( this.height/2-newSide*0.25 ) + ( Math.odd(this.line) ? newSide*.75 : 0 );
    
    var backHeight3 = newWidthCube;
    var backWidth4  = newSide*3;
	
	css.insertRule('*','transform:translate3d(0,0,0)');
	css.insertRule('.roll, .pitch, .yaw, .block','display: block','position: absolute','transform-style:preserve-3d');
	css.insertRule('.pitch','transform:rotateX(-35deg)');
	css.insertRule('.yaw','transform:rotateY(45deg);margin: 0px');
	css.insertRule('#front','transform: translateZ(200px) scale('+(1.226/scale)+');');// valeur mystérieuse
	css.insertRule('#big','transform: translateZ(300px) scale('+(1.226/scale)+');');
    css.insertRule('.block','display: block;position: absolute');
	css.insertRule('.face','backface-visibility:hidden','display:block','position:absolute');
	
	if( this.navWidth > this.navHeight )
    	css.insertRule('.roll',
    		'transform:translateY('+this.width.toFixed(1)+'px) rotateZ(-90deg)',
    		'top:'+(-offsetWidth).toFixed(1)+'px',
    		'left:'+offsetHeight.toFixed(1)+'px'
    	);
	else
		css.insertRule('.roll','left:'+offsetWidth.toFixed(1)+'px','top:'+offsetHeight.toFixed(1)+'px');

	$('#body').css({
		backgroundSize: backHeight3+'px '+backWidth4+'px',
		backgroundPosition: 
			backWidth1+'px '+backHeight1+'px, '+backWidth1+'px '+backHeight1+'px, '+
			backWidth2+'px '+backHeight2+'px, '+backWidth2+'px '+backHeight2+'px, '+
			backWidth1+'px '+backHeight1+'px, '+backWidth2+'px '+backHeight2+'px, '+
			backWidth1+'px '+backHeight1+'px, '+backWidth2+'px '+backHeight2+'px'
    });
	
};

HexaGrid.prototype.reset = function( mData )  {
	
    this.column = mData.column;
    this.line = mData.line;
    
	this.css.reset();
	this.initCSS();
    
    for( var x = 0 ; x <= Math.ceil(mData.column)-1 ; x ++) {
    	this.grid[x] = [];
	    for( var y = 0 ; y <= mData.line-1 ; y ++)
	    	this.grid[x][y] = new Hexa( this.css, x, y, this.side, this.widthCube/this.scale, this.side/this.scale );
    }
	
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