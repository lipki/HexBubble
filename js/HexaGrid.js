var HexaGrid = Class.extend({
	
	init: function()  {
    	
    	this.css = document.styleSheets[0];
        
        this.$idbody = $('<div id="body"/>');
        this.$roll = $('<div id="roll"/>');
        this.$pitch = $('<div id="pitch"/>');
        this.$yaw = $('<div id="yaw"/>');
        
        this.$pitch.append(this.$yaw);
        this.$roll.append(this.$pitch);
        this.$idbody.append(this.$roll);
        $('body').prepend(this.$idbody);
        
        this.css.insertRule('#roll,#pitch,#yaw,.block{display:block;position:absolute;transform-style:preserve-3d}', this.css.length);
    	this.css.insertRule('#pitch{transform:rotateX(-35deg)}', this.css.length);
		this.css.insertRule('#yaw {transform:rotateY(45deg);margin: 0px}', this.css.length);
        this.css.insertRule('.block {display: block;position: absolute}', this.css.length);
		this.css.insertRule('.face {backface-visibility:hidden;display:block;position:absolute;-moz-box-sizing:padding-box}', this.css.length);
        
    	// orientation
    	this.navWidth = this.width = this.$idbody.width();
    	this.navHeight = this.height = this.$idbody.height();
    	
    	this.css.insertRule('#roll{left: '+(this.navWidth/2)+'px; top: '+(this.navHeight/2)+'px}', this.css.length);
    	
    	if( this.navWidth > this.navHeight ) {
	    	this.css.insertRule('#roll{transform: translateY('+this.height+'px) rotateZ(-90deg)}', this.css.length);
    		this.height = this.navWidth;
    		this.width = this.navHeight;
    	}
        
	},
	
	reset: function( column, line, color )  {
        
        this.column = column;
        this.line = line;
        
	    this.widthCube = this.width/(column+.5);
	    var demiWidthCube = this.widthCube/2;
	    this.heightCube = demiWidthCube/Math.cos(Math.PI*30/180);
	    this.side = this.heightCube*1.227; // valeur mystérieuse
	    
	    this.maxLine = Math.floor(this.height/((this.heightCube/2)*3));
	    
	    if( this.maxLine < line ) return false;
	    
	    var lineHeight = (this.heightCube/2)*(line*3+1);
	    var lineStart = (this.height-lineHeight)/2;
	    var linesup = Math.ceil(lineStart/this.heightCube);
	    
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
	    	this.$roll.css('top', -this.width/2-demiWidthCube/2);
    		if( Math.ceil(line/2) == (line/2) )
    			this.$roll.css('left', this.height/2+this.heightCube*.75);
    	} else {
    		this.$roll.css('left', this.width/2+demiWidthCube/2);
    		if( Math.ceil(line/2) == (line/2) )
    			this.$roll.css('top', this.height/2+this.heightCube*.75);
		}
    	
	    this.css.insertRule('.face {height: '+(this.side+2)+'px; width: '+(this.side+2)+'px; margin: -'+(this.side/2)+'px}', this.css.length);
	    
	    for( var x = -1 ; x <= column-1 ; x ++)
	    for( var y = -linesup ; y <= line-1+linesup ; y ++) {
	        
            var $block = $('<div class="block x_'+x+' y_'+y+'"><figure class="face fro"></figure><figure class="face rig"></figure><figure class="face top"></figure></div>');
            this.$yaw.append($block);
	    	
	    	var px = x - column/2 +.5;
	    	var py = y - Math.floor(line/2);
            
            tZ = px*this.side + Math.ceil(py/2)*this.side;
            tX = px*this.side - Math.ceil((py-1.5)/2)*this.side;
            tY = py*this.side;
            
            $block.css('transform', 'translateZ('+tZ+'px) translateX('+tX+'px) translateY('+tY+'px)');
	        
            s0 = 0;
            s1 = 5;
            s2 = 10;
            s3 = 100;
            
	        $block.find('.fro').css({
	        	transform: 'translateX( '+(this.side/2)+'px) rotateY(-90deg)',
	        	background: 'linear-gradient(  45deg, rgb('+(color.R-s3-s2)+','+(color.V-s3-s2)+','+(color.B-s3-s2)+') 0%,rgb('+(color.R-s2)+','+(color.V-s2)+','+(color.B-s2)+') 200%)'
	        });
	        $block.find('.rig').css({
	        	transform: 'translateZ(-'+(this.side/2)+'px)',
	        	background: 'linear-gradient( -45deg, rgb('+(color.R-s3-s1)+','+(color.V-s3-s1)+','+(color.B-s3-s1)+') 0%,rgb('+(color.R-s1)+','+(color.V-s1)+','+(color.B-s1)+') 200%)'
	        });
	        $block.find('.top').css({
	        	transform: 'translateY( '+(this.side/2)+'px) rotateX( 90deg)',
	        	background: 'linear-gradient(-130deg, rgb('+(color.R-s3-s0)+','+(color.V-s3-s0)+','+(color.B-s3-s0)+') 0%,rgb('+(color.R-s0)+','+(color.V-s0)+','+(color.B-s0)+') 200%)'
	        });
	        /*
		        background: 'linear-gradient(  45deg, #080808 0%,#0f0f0f 50%,#151515 100%)'
		        background: 'linear-gradient( -45deg, #131313 0%,#171717 50%,#1b1b1b 100%)'
		        background: 'linear-gradient(-130deg, #131313 0%,#171717 50%,#1b1b1b 100%)'
           */
        
	    }
    	
    	return true;
    	
	}
  
});