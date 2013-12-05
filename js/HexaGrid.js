var HexaGrid = Class.extend({
	
	init: function()  {
    	
    	this.css = new CSS(1);
    	this.grid = [];
        
        this.$idbody = $('<div id="body"/>');
        this.$roll = $('<div id="roll"/>');
        this.$pitch = $('<div id="pitch"/>');
        this.$yaw = $('<div id="yaw"/>');
        
        this.$pitch.append(this.$yaw);
        this.$roll.append(this.$pitch);
        this.$idbody.append(this.$roll);
        $('body').prepend(this.$idbody);
        
    	// orientation
    	this.navWidth = this.width = this.$idbody.width();
    	this.navHeight = this.height = this.$idbody.height();
        
	},
	
	initCSS: function()  {
    	
		this.css.insertRule('#roll,#pitch,#yaw,.block','display:block','position:absolute','transform-style:preserve-3d');
    	this.css.insertRule('#pitch','transform:rotateX(-35deg)');
		this.css.insertRule('#yaw','transform:rotateY(45deg);margin: 0px');
        this.css.insertRule('.block','display: block;position: absolute');
		this.css.insertRule('.face','backface-visibility:hidden','display:block','position:absolute','-moz-box-sizing:padding-box');
        
    	this.css.insertRule('#roll','left:'+(this.navWidth/2)+'px','top:'+(this.navHeight/2)+'px');
    	
    	if( this.navWidth > this.navHeight ) {
	    	this.css.insertRule('#roll','transform:translateY('+this.height+'px) rotateZ(-90deg)');
    		this.height = this.navWidth;
    		this.width = this.navHeight;
    	}
    	
	},
	
	calculating: function() {
		
	    this.widthCube = this.width/(this.column+.5);
	    this.demiWidthCube = this.widthCube/2;
	    this.heightCube = this.demiWidthCube/Math.cos(Math.PI*30/180);
	    this.side = this.heightCube*1.227; // valeur mystérieuse
	    
	    this.maxLine = Math.floor(this.height/((this.heightCube/2)*3));
	    
	    this.lineHeight = (this.heightCube/2)*(this.line*3+1);
	    this.lineStart = (this.height-this.lineHeight)/2;
	    this.linesup = Math.ceil(this.lineStart/this.heightCube);
		
	},
	
	reset: function( column, line, color )  {
		
    	this.css.reset();
    	this.initCSS();
        
        this.column = column;
        this.line = line;
        
        this.calculating();
	    
	    if( this.maxLine < line ) return false;
	    
	    	/*this.$idbody.append('<div id="grille" style="position:absolute"></div>');
	    	
		    for( var x = 0 ; x <= column-1 ; x ++)
		    for( var y = 0 ; y <= line-1 ; y ++) {
		        
		        var $circle = $('<div class="circle x_'+x+' y_'+y+'"></div>');
		        $('#grille').append($circle);
		        $circle.css({
		        	border: '1px solid #fff',
		        	opacity:.5,
		        	borderRadius: '100px',
		        	width: this.widthCube,
		        	height: this.heightCube*2,
		        	position: 'absolute',
		        	top: y*(this.heightCube*2)/4*3+lineStart+this.widthCube/2,
		        	left: x*this.widthCube + ( Math.ceil(y/2) != (y/2) ? demiWidthCube : 0) + this.heightCube,
		        	margin: (-this.widthCube/2)+'px '+(-this.heightCube)+'px'
		        });
            	
		    }*/
		
    	if( this.navWidth > this.navHeight ) {
	    	this.css.insertRule('#roll','top:'+(-this.width/2-this.demiWidthCube/2)+'px');
    		if( Math.ceil(line/2) == (line/2) )
	    		this.css.insertRule('#roll','left:'+(this.height/2+this.heightCube*.75)+'px');
    	} else {
	    	this.css.insertRule('#roll','left:'+(this.width/2+this.demiWidthCube/2)+'px');
    		if( Math.ceil(line/2) == (line/2) )
	    		this.css.insertRule('#roll','top:'+(this.height/2+this.heightCube*.75)+'px');
		}
	    
	    for( var x = -1 ; x <= column-1 ; x ++) {
	    	
	    	this.grid[x] = [];
	    	
		    for( var y = -this.linesup ; y <= line-1+this.linesup ; y ++) {
		    	
		    	var px = x - column/2 +.5;
		    	var py = y - Math.floor(line/2);
		    	
		    	this.grid[x][y] = new Hexa( this.css, x, y, px, py, this.side, color );
		    	this.$yaw.append( $( this.grid[x][y].render() ) );
	            
		    }
	    }
    	
    	return true;
    	
	},
	
	on: function( hexa, color ) {
		
		this.grid[hexa.x][hexa.y].on( hexa.id, color );
        
	},
	
	check: function( hexa ) {
		
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
        	
        	this.grid[big.b1.x][big.b1.y].big('left');
	        this.grid[big.b2.x][big.b2.y].big('right');
	        this.grid[big.b3.x][big.b3.y].big('bottom');
	            
        }
		
	}
  
});