var HexaGrid = function()  {
	
	this.cssfixe = new CSS(0);
	this.css = new CSS(1);
	this.grid = [];
	
    this.$idbody     = $('<div id="body"/>');
    this.$rollborder = $('<div id="border" class="roll"/>');
    this.$rollfront  = $('<div id="front"  class="roll"/>');
    
    this.$idbody.append(this.$rollborder);
    this.$idbody.append(this.$rollfront);
    $('body').prepend(this.$idbody);
    
	this.cssfixe.insertRule('*','transform:translate3d(0,0,0)');
	this.cssfixe.insertTagRule('#body', 'background', 
		'background-color:#0f0f0f',
		'background-image:'+
		'linear-gradient( 30deg,#171717 0%,#131313 12%,transparent 12%,transparent 87%,#1b1b1b 87%,#171717),'+
		'linear-gradient(150deg,#171717 0%,#1b1b1b 12%,transparent 12%,transparent 87%,#131313 87%,#171717),'+
		'linear-gradient( 30deg,#171717 0%,#131313 12%,transparent 12%,transparent 87%,#1b1b1b 87%,#171717),'+
		'linear-gradient(150deg,#171717 0%,#1b1b1b 12%,transparent 12%,transparent 87%,#131313 87%,#171717),'+
		'linear-gradient( 60deg,#080808 0%,#0f0f0f 25%,transparent 25%,transparent 75%,#0f0f0f 75%,#151515),'+
		'linear-gradient( 60deg,#080808 0%,#0f0f0f 25%,transparent 25%,transparent 75%,#0f0f0f 75%,#151515),'+
		'linear-gradient(-60deg,#131313 0%,#171717 25%,transparent 25%,transparent 75%,#171717 75%,#1b1b1b),'+
		'linear-gradient(-60deg,#131313 0%,#171717 25%,#171717 75%,#1b1b1b)',
		'background-size: 80px 140px',
		'background-position: 0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px, 0 0, 40px 70px',
		'transition: background-size 1s, background-position 1s'
    );
	
    // listen event
    var mi = this;
    $(document).on('hexa_on'    , function(e, data       ) { mi.check (e, data); });
    $(document).on('map_hexa_on', function(e, data, data2) { mi.on (e, data); });
	
};

HexaGrid.prototype.reset = function( mData )  {
	
	this.css.reset();
	
	var width  = $('body').width();
	var height = $('body').height();
	var wCase  = this.wCase = width/(mData.column+1);
    var hCase  = this.hCase = wCase/Math.cos(Math.PI*30/180);
	var bwpos  = wCase;
	var bhpos  = hCase*1.5;
	var b1xpos = ( y%2 ? wCase/2 : 0 )+wCase/4;
	var b1ypos = (4*height-3*hCase*mData.line-hCase)/8;
	var b2xpos = wCase/2+( y%2 ? wCase/2 : 0 )+wCase/4;
	var b2ypos = hCase*.75+(4*height-3*hCase*mData.line-hCase)/8;
	
	var $ucas = $('<div class="case"></div>');
	this.css.insertTagRule('.case', 'case', 
		'position: absolute',
		'width: '+wCase+'px','height: '+hCase+'px',
		'margin: -'+hCase/2+'px -'+wCase/2+'px'
	);
	
	this.$idbody.css({
		backgroundSize: bwpos+'px '+bhpos+'px',
		backgroundPosition: b1xpos+'px '+b1ypos+'px, '+b1xpos+'px '+b1ypos+'px, '+b2xpos+'px '+b2ypos+'px, '+b2xpos+'px '+b2ypos+'px, '+
							b1xpos+'px '+b1ypos+'px, '+b2xpos+'px '+b2ypos+'px, '+b1xpos+'px '+b1ypos+'px, '+b2xpos+'px '+b2ypos+'px'
    });
	
    for( var x = 0 ; x <= Math.ceil(mData.column)-1 ; x ++) {
    	this.grid[x] = [];
		for( var y = 0 ; y <= mData.line-1 ; y ++)
		if( Math.ceil(mData.column) == mData.column || !(y%2) || x != Math.floor(mData.column) ) {
			$cas = $ucas.clone();
			$cas.addClass('x_'+x)
				.addClass('y_'+y)
				.css({
					top: (4*height+6*hCase*y-3*hCase*mData.line+3*hCase)/8,
					left: x*wCase+( y%2 ? wCase/2 : 0 )+wCase*.75,
					//outline: '1px solid '+( (x+y)%2 ? 'red' : 'green' )
				});
		    this.$rollborder.append($cas);
		    this.$rollfront.append($cas.clone());
		    this.grid[x][y] = new Hexa( this, x, y );
		}
	}
	
};

HexaGrid.prototype.on = function( e, hexa ) {
	
	if( !this.grid[hexa.x][hexa.y].id ) {
		this.grid[hexa.x][hexa.y].on( hexa.id, hexa.color );
	}
};

HexaGrid.prototype.check = function( e, hexa ) {
	
	/*
    
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
    
    if( big ) {
    	
    	this.grid[big.b1.x][big.b1.y].bigOn('left');
        this.grid[big.b2.x][big.b2.y].bigOn('right');
        this.grid[big.b3.x][big.b3.y].bigOn('bottom');
            
    }*/
	
};