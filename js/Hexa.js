var Hexa = Class.extend({
	
	init: function( target, css, x, y, side, color )  {
		
		this.target = target;
		this.css = css;
		this.x = x;
        this.y = y;
        this.side = side;
        var classPosX = this.classPosX = 'x_'+x;
        var classPosY = this.classPosY = 'y_'+y;
        var classPos = this.classPos = '.'+this.classPosX+'.'+this.classPosY;
        
		// render
		
        var render = '';
        render += '<figure class="face back '+classPosX+' '+classPosY+' fro"></figure>';
        render += '<figure class="face back '+classPosX+' '+classPosY+' rig"></figure>';
        render += '<figure class="face back '+classPosX+' '+classPosY+' top"></figure>';
        target.append(render);
        
        // size
        
        css.insertTagRule('.back', 'all face back',
	    	'height:'+(side+2)+'px','width:'+(side+2)+'px','margin:-'+(side/2)+'px',
	    	'z-index:10'
	    );
	    
	    // color
	    
        var s0 = this.s0 = 0;
        var s1 = this.s1 = 5;
        var s2 = this.s2 = 10;
        var s3 = this.s3 = 100;
        var s4 = this.s4 = 50;
        
	    /*css.insertTagRule( '.back.fro', 'bfrocolor', 
	    	css.linearGradientRule(   45, [{R:color.R-s3-s2, G:color.G-s3-s2, B:color.B-s3-s2}, 0], [{R:color.R-s2, G:color.G-s2, B:color.B-s2}, 200]));
        css.insertTagRule( '.back.rig', 'brigcolor', 
	    	css.linearGradientRule(  -45, [{R:color.R-s3-s1, G:color.G-s3-s1, B:color.B-s3-s1}, 0], [{R:color.R-s1, G:color.G-s1, B:color.B-s1}, 200]));
        css.insertTagRule( '.back.top', 'btopcolor', 
	    	css.linearGradientRule( -130, [{R:color.R-s3-s0, G:color.G-s3-s0, B:color.B-s3-s0}, 0], [{R:color.R-s0, G:color.G-s0, B:color.B-s0}, 200]));
        */
        
        css.insertTagRule( '.back.fro', 'back fro color',
        	css.linearGradientRule(   45, ['#080808', 0], ['#0f0f0f', 50], ['#151515', 100]));
	    css.insertTagRule( '.back.rig', 'back rig color', 
	    	css.linearGradientRule(  -45, ['#131313', 0], ['#171717', 50], ['#1b1b1b', 100]));
	    css.insertTagRule( '.back.top', 'back top color', 
	    	css.linearGradientRule( -130, ['#131313', 0], ['#171717', 50], ['#1b1b1b', 100]));
	    
        // position
        
        var tZ = this.tZ = x*side + Math.ceil(y/2)*side;
        var tX = this.tX = x*side - Math.ceil((y-1.5)/2)*side;
        var tY = this.tY = y*side;
        
        css.insertTagRule( classPos+'.fro', classPos+'.fro',
        	css.transformRule({ tX: tX+side/2, tY: tY, tZ: tZ, rY:-90 }));
        css.insertTagRule( classPos+'.rig', classPos+'.rig',
        	css.transformRule({ tZ: tZ-side/2, tX: tX, tY: tY }));
        css.insertTagRule( classPos+'.top', classPos+'.top',
        	css.transformRule({ tY: tY+side/2, tZ: tZ, tX: tX, rX: 90 }));
		
		// reste
		
        this.border();
        this.front();
        this.big();
	},
	
	border: function() {
		
		var target = this.target;
		var css = this.css;
        var side = this.side;
        var classPosX = this.classPosX;
        var classPosY = this.classPosY;
        var classPos = this.classPos;
		
		// render
		
        var render = '';
        render += '<figure class="face border '+classPosX+' '+classPosY+' fro"></figure>';
        render += '<figure class="face border '+classPosX+' '+classPosY+' rig"></figure>';
        render += '<figure class="face border '+classPosX+' '+classPosY+' top"></figure>';
        target.append(render);
        
        // position
        
        var tZ = this.tZ;
        var tX = this.tX;
        var tY = this.tY;
        
        css.insertTagRule( classPos+'.border.fro', classPos+'.border.fro init',
        	css.transformRule({ tX: tX, tY: tY, tZ: tZ, rY:-90 }));
        css.insertTagRule( classPos+'.border.rig', classPos+'.border.rig init',
        	css.transformRule({ tZ: tZ, tX: tX, tY: tY }));
        css.insertTagRule( classPos+'.border.top', classPos+'.border.top init',
        	css.transformRule({ tY: tY, tZ: tZ, tX: tX, rX: 90 }));
        
        // size
	    
        var bside = side*1.3;
        var border = (bside-side)/.9;
        
	    css.insertTagRule('.border', 'all face border',
			'background:#fff',
			'height: 0px','width : 0px','margin: 0px',
			'border-radius: '+border+'px '+(border/3)+'px',
	    	'transition-property: all',
	    	'transition-duration: 1s',
			'transition-delay: .4s',
			'z-index:20'
	    );
	    css.insertTagRule('.border.rig', 'all face border right',
	    	'border-radius: '+(border/3)+'px '+border+'px'
	    );
	    
	},
	
	front: function() {
		
		var target = this.target;
		var css = this.css;
        var classPosX = this.classPosX;
        var classPosY = this.classPosY;
        var classPos = this.classPos;
        
		// render
		
        var render = '';
        render += '<figure class="face front  '+classPosX+' '+classPosY+' fro"></figure>';
        render += '<figure class="face front  '+classPosX+' '+classPosY+' rig"></figure>';
        render += '<figure class="face front  '+classPosX+' '+classPosY+' top"></figure>';
        target.append(render);
        
        // position
        
        var tZ = this.tZ;
        var tX = this.tX;
        var tY = this.tY;
        
        css.insertTagRule( classPos+'.front.fro', classPos+'.front.fro init',
        	css.transformRule({ tX: tX, tY: tY, tZ: tZ, rY:-90 }));
        css.insertTagRule( classPos+'.front.rig', classPos+'.front.rig init',
        	css.transformRule({ tZ: tZ, tX: tX, tY: tY }));
        css.insertTagRule( classPos+'.front.top', classPos+'.front.top init',
        	css.transformRule({ tY: tY, tZ: tZ, tX: tX, rX: 90 }));
        
        // size
        
        css.insertTagRule('.front', 'all face front',
	    	'height: 0px','width : 0px','margin: 0px',
	    	'transition-property: all',
	    	'transition-duration: 1s',
	    	'z-index:30'
	    );
	    
	},
	
	big: function() {
		
		var target = this.target;
		var css = this.css;
        var side = this.side;
        var classPosX = this.classPosX;
        var classPosY = this.classPosY;
        var classPos = this.classPos;
        
		// render
		
        var render = '';
        render += '<figure class="face big '+classPosX+' '+classPosY+' fro"></figure>';
        render += '<figure class="face big '+classPosX+' '+classPosY+' rig"></figure>';
        render += '<figure class="face big '+classPosX+' '+classPosY+' top"></figure>';
        target.append(render);
        
        // size
	    
        css.insertTagRule('.big', 'all face big',
	    	'height: 0px','width : 0px','margin: 0px',
	    	'transition-property: all',
	    	'transition-duration: 1s',
	    	'z-index:40'
	    );
        
        // position
        
        var tZ = this.tZ;
        var tX = this.tX;
        var tY = this.tY;
        
        css.insertTagRule( classPos+'.big.fro', classPos+'.big.fro init',
        	css.transformRule({ tX: tX-side, tY: tY, tZ: tZ, rY:-90 }));
        css.insertTagRule( classPos+'.big.rig', classPos+'.big.rig init',
        	css.transformRule({ tZ: tZ+side, tX: tX, tY: tY }));
        css.insertTagRule( classPos+'.big.top', classPos+'.big.top init',
        	css.transformRule({ tY: tY-side, tZ: tZ, tX: tX, rX: 90 }));
        
	},
	
	on: function( id, color ) {
		
		var css = this.css;
		this.id = id;
		this.color = color;
        var side = this.side;
        var classPos = this.classPos;
		
	    // color
	    
        $(classPos).addClass('id_'+id);
	    
        var s0 = this.s0;
        var s1 = this.s1;
        var s2 = this.s2;
        var s3 = this.s3;
        var s4 = this.s4;
	    
	    css.insertTagRule( '.id_'+id+'.front.fro', 'fro '+id, 
	    	css.linearGradientRule(   45, [{R:color.R-s3-s2, G:color.G-s3-s2, B:color.B-s3-s2}, 0], [{R:color.R+s4-s2, G:color.G+s4-s2, B:color.B+s4-s2}, 200]));
        css.insertTagRule( '.id_'+id+'.front.rig', 'rig '+id, 
	    	css.linearGradientRule(  -45, [{R:color.R-s3-s1, G:color.G-s3-s1, B:color.B-s3-s1}, 0], [{R:color.R+s4-s1, G:color.G+s4-s1, B:color.B+s4-s1}, 200]));
        css.insertTagRule( '.id_'+id+'.front.top', 'top '+id, 
	    	css.linearGradientRule( -130, [{R:color.R-s3-s0, G:color.G-s3-s0, B:color.B-s3-s0}, 0], [{R:color.R+s4-s0, G:color.G+s4-s0, B:color.B+s4-s0}, 200]));
        
        // anim position
        
        var tZ = this.tZ;
        var tX = this.tX;
        var tY = this.tY;
        
        css.insertTagRule( classPos+'.front.fro', classPos+'.front.fro',
        	css.transformRule({ tX: tX-side/2, tY: tY, tZ: tZ, rY:-90 }));
        css.insertTagRule( classPos+'.front.rig', classPos+'.front.rig',
        	css.transformRule({ tZ: tZ+side/2, tX: tX, tY: tY }));
        css.insertTagRule( classPos+'.front.top', classPos+'.front.top',
        	css.transformRule({ tY: tY-side/2, tZ: tZ, tX: tX, rX: 90 }));
        
        css.insertTagRule( classPos+'.border.fro', classPos+'.border.fro',
        	css.transformRule({ tX: tX-side/2, tY: tY, tZ: tZ, rY:-90 }));
        css.insertTagRule( classPos+'.border.rig', classPos+'.border.rig',
        	css.transformRule({ tZ: tZ+side/2, tX: tX, tY: tY }));
        css.insertTagRule( classPos+'.border.top', classPos+'.border.top',
        	css.transformRule({ tY: tY-side/2, tZ: tZ, tX: tX, rX: 90 }));
        
        // anim size
	    
	    css.insertTagRule( classPos+'.id_'+id+'.front', classPos+'.id_'+id+'.front',
	    	'height:'+(side+2)+'px','width:'+(side+2)+'px','margin:-'+(side/2)+'px'
	    );
        
        var bside = side*1.3;
	    css.insertTagRule( classPos+'.id_'+id+'.border', classPos+'.id_'+id+'.border',
			'height:'+(bside+2)+'px','width:'+(bside+2)+'px','margin:-'+(bside/2)+'px'
	    );
	    
	},
	
	bigOn: function( pos ) {
		
		var css = this.css;
		var id = this.id;
		var color = this.color;
        var side = this.side;
        var classPos = this.classPos;
        var tZ = this.tZ;
        var tX = this.tX;
        var tY = this.tY;
        var s0 = this.s0;
        var s1 = this.s1;
        var s2 = this.s2;
        var s3 = this.s3;
        var s4 = this.s4;
		
        $(classPos+'.id_'+id).addClass('big_'+pos);
        
		
		switch (pos) {
        	case 'left' :
			    css.insertRule(classPos+'.id_'+id+'.big_left.big.rig',
			    	'height:'+(side+2)+'px','width:'+(side+2)+'px','margin:-'+(side/2)+'px'
			    );
        		css.insertRule( classPos+'.big_left.big.rig',
	    			css.transformRule({ tZ: tZ+side/2*3, tX: tX, tY: tY })
	    		);
        		css.insertTagRule( '.id_'+id+'.big_left.big.rig', 'bigleft'+id, 
	    			css.linearGradientRule(  -45, [{R:color.R-s3-s1, G:color.G-s3-s1, B:color.B-s3-s1}, -50], [{R:color.R+s4-s1, G:color.G+s4-s1, B:color.B+s4-s1}, 150])
        		);
			break;
	        case 'right' :
			    css.insertRule(classPos+'.id_'+id+'.big_right.big.fro',
			    	'height:'+(side+2)+'px','width:'+(side+2)+'px','margin:-'+(side/2)+'px'
			    );
		        css.insertRule( classPos+'.big_right.big.fro',
	    			css.transformRule({ tX: tX-side/2*3, tY: tY, tZ: tZ, rY:-90 })
	    		);
		        css.insertTagRule( '.id_'+id+'.big_right.big.fro', 'bigright'+id, 
	    			css.linearGradientRule(   45, [{R:color.R-s3-s2, G:color.G-s3-s2, B:color.B-s3-s2}, -50], [{R:color.R+s4-s2, G:color.G+s4-s2, B:color.B+s4-s2}, 150])
	    		);
	        break;
	    	case 'bottom' :
			    css.insertRule(classPos+'.id_'+id+'.big_bottom.big.top',
			    	'height:'+(side+2)+'px','width:'+(side+2)+'px','margin:-'+(side/2)+'px'
			    );
		        css.insertRule( classPos+'.big_bottom.big.top',
	    			css.transformRule({ tY: tY-side/2*3, tZ: tZ, tX: tX, rX: 90 })
	    		);
		        css.insertTagRule( '.id_'+id+'.big_bottom.big.top', 'bigbottom'+id, 
	    			css.linearGradientRule( -130, [{R:color.R-s3-s0, G:color.G-s3-s0, B:color.B-s3-s0}, -50], [{R:color.R+s4-s0, G:color.G+s4-s0, B:color.B+s4-s0}, 150])
	    		);
		    break;
		}
		
    }
  
});