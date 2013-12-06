var Hexa = Class.extend({
	
	init: function( css, x, y, side, color )  {
		
		this.css = css;
        this.x = x;
        this.y = y;
        this.side = side;
        this.classPosX = 'x_'+x;
        this.classPosY = 'y_'+y;
        
        this.clas = '.'+this.classPosX+'.'+this.classPosY;
        
        this.tZ = x*side + Math.ceil(y/2)*side;
        this.tX = x*side - Math.ceil((y-1.5)/2)*side;
        this.tY = y*side;
    	
	    css.insertTagRule('.face', 'allface',
	    	'height: 0px',
	    	'width: 0px',
	    	'margin: 0px',
	    	'transition-property: all',
	    	'transition-duration: 1s'
	    );
	    
	    css.insertTagRule('.face.back', 'allfaceback',
	    	'height:'+(this.side+2)+'px',
	    	'width: '+(this.side+2)+'px',
	    	'margin: -'+(this.side/2)+'px',
	    	'transition-property: all',
	    	'transition-duration: 1s'
	    );
        
	    css.insertTagRule( '.back', 'backzindex', 'z-index:10' );
	    css.insertTagRule( '.border', 'borderzindex', 'z-index:20' );
	    css.insertTagRule( '.front', 'frontzindex', 'z-index:30' );
	    
        s0 = 0;
        s1 = 5;
        s2 = 10;
        s3 = 100;
        
	    /*css.insertTagRule( '.back.fro', 'bfrocolor', 
	    	'background:linear-gradient(  45deg, rgb('+(color.R-s3-s2)+','+(color.V-s3-s2)+','+(color.B-s3-s2)+') 0%,rgb('+(color.R-s2)+','+(color.V-s2)+','+(color.B-s2)+') 200%)');
        css.insertTagRule( '.back.rig', 'brigcolor', 
	    	'background:linear-gradient( -45deg, rgb('+(color.R-s3-s1)+','+(color.V-s3-s1)+','+(color.B-s3-s1)+') 0%,rgb('+(color.R-s1)+','+(color.V-s1)+','+(color.B-s1)+') 200%)');
        css.insertTagRule( '.back.top', 'btopcolor', 
	    	'background:linear-gradient(-130deg, rgb('+(color.R-s3-s0)+','+(color.V-s3-s0)+','+(color.B-s3-s0)+') 0%,rgb('+(color.R-s0)+','+(color.V-s0)+','+(color.B-s0)+') 200%)');
        */
        css.insertTagRule( '.back.fro', 'bfrocolor',
        	'background:linear-gradient(  45deg, #080808 0%,#0f0f0f 50%,#151515 100%)');
	    css.insertTagRule( '.back.rig', 'brigcolor', 
	    	'background:linear-gradient( -45deg, #131313 0%,#171717 50%,#1b1b1b 100%)');
	    css.insertTagRule( '.back.top', 'btopcolor', 
	    	'background:linear-gradient(-130deg, #131313 0%,#171717 50%,#1b1b1b 100%)');
	    
	    
        
        var bside = side*1.3;
        var border = bside-side;
        
	    css.insertTagRule( '.border', 'borderstyle',
	    					'background:#fff',
	    					'height: 0px',
	    					'width: 0px',
	    					'margin: 0px',
	    					'border-radius: '+border+'px '+(border/3)+'px',
	    					'transition-delay: .4s');
	    css.insertTagRule( '.border.rig', 'borderstyleright',
	    					'border-radius: '+(border/3)+'px '+border+'px');
	   
	    css.insertRule( this.clas+'.fro', css.transformRule({ tX: this.tX+side/2, tY: this.tY, tZ: this.tZ, rY:-90 }));
        css.insertRule( this.clas+'.rig', css.transformRule({ tZ: this.tZ-side/2, tX: this.tX, tY: this.tY }));
        css.insertRule( this.clas+'.top', css.transformRule({ tY: this.tY+side/2, tZ: this.tZ, tX: this.tX, rX: 90 }));
        
	    css.insertRule( this.clas+'.front.fro', css.transformRule({ tX: this.tX, tY: this.tY, tZ: this.tZ, rY:-90 }));
        css.insertRule( this.clas+'.front.rig', css.transformRule({ tZ: this.tZ, tX: this.tX, tY: this.tY }));
        css.insertRule( this.clas+'.front.top', css.transformRule({ tY: this.tY, tZ: this.tZ, tX: this.tX, rX: 90 }));
        
	},
	
	on: function( id, color ) {
		
		this.id = id;
		this.color = color;
		
        s0 = 0;
        s1 = 5;
        s2 = 10;
        s3 = 100;
        s4 = 50;
        
        $(this.clas).addClass('id_'+id);
		
	    this.css.insertRule( this.clas+'.id_'+id+'.front.fro', this.css.transformRule({ tX: this.tX-this.side/2, tY: this.tY, tZ: this.tZ, rY:-90 }));
        this.css.insertRule( this.clas+'.id_'+id+'.front.rig', this.css.transformRule({ tZ: this.tZ+this.side/2, tX: this.tX, tY: this.tY }));
        this.css.insertRule( this.clas+'.id_'+id+'.front.top', this.css.transformRule({ tY: this.tY-this.side/2, tZ: this.tZ, tX: this.tX, rX: 90 }));
        
	    this.css.insertRule(this.clas+'.id_'+id+'.front',
	    	'height:'+(this.side+2)+'px',
	    	'width: '+(this.side+2)+'px',
	    	'margin: -'+(this.side/2)+'px'
	    );
        
	    this.css.insertTagRule( '.id_'+id+'.front.fro', 'fro'+id, 
	    	'background:linear-gradient(  45deg, rgb('+(color.R-s3-s2)+','+(color.V-s3-s2)+','+(color.B-s3-s2)+') 0%,rgb('+(color.R-s2)+','+(color.V-s2)+','+(color.B-s2)+') 200%)');
        
	    this.css.insertTagRule( '.id_'+id+'.front.rig', 'rig'+id, 
	    	'background:linear-gradient( -45deg, rgb('+(color.R-s3-s1)+','+(color.V-s3-s1)+','+(color.B-s3-s1)+') 0%,rgb('+(color.R-s1)+','+(color.V-s1)+','+(color.B-s1)+') 200%)');
        
	    this.css.insertTagRule( '.id_'+id+'.front.top', 'top'+id, 
	    	'background:linear-gradient(-130deg, rgb('+(color.R-s3-s0)+','+(color.V-s3-s0)+','+(color.B-s3-s0)+') 0%,rgb('+(color.R-s0)+','+(color.V-s0)+','+(color.B-s0)+') 200%)');
        
        var bside = this.side*1.3;
	    this.css.insertRule( this.clas+'.id_'+id+'.border', 
			'height:'+(bside+2)+'px',
			'width: '+(bside+2)+'px',
			'margin: -'+(bside/2)+'px'
	    );
	},
	
	big: function( pos ) {
		
        $(this.clas).addClass('big_'+pos);
		
		switch (pos) {
        	case 'left' :
        		this.css.insertRule( this.clas+'.big_left.front.rig',
	    			this.css.transformRule({ tZ: this.tZ+this.side/2*3, tX: this.tX, tY: this.tY })
	    		);
        		this.css.insertTagRule( '.id_'+this.id+'.big_left.front.rig', 'bigleft'+this.id, 
	    			'background:linear-gradient( -45deg, rgb('+(this.color.R-s3-s1)+','+(this.color.V-s3-s1)+','+(this.color.B-s3-s1)+') -50%,rgb('+(this.color.R-s1)+','+(this.color.V-s1)+','+(this.color.B-s1)+') 150%)'
	    		);
			break;
	        case 'right' :
		        this.css.insertRule( this.clas+'.big_right.front.fro',
	    			this.css.transformRule({ tX: this.tX-this.side/2*3, tY: this.tY, tZ: this.tZ, rY:-90 })
	    		);
		        this.css.insertTagRule( '.id_'+this.id+'.big_right.front.fro', 'bigright'+this.id, 
	    			'background:linear-gradient(  45deg, rgb('+(this.color.R-s3-s2)+','+(this.color.V-s3-s2)+','+(this.color.B-s3-s2)+') -50%,rgb('+(this.color.R-s2)+','+(this.color.V-s2)+','+(this.color.B-s2)+') 150%)'
	    		);
	        break;
	    	case 'bottom' :
		        this.css.insertRule( this.clas+'.big_bottom.front.top',
	    			this.css.transformRule({ tY: this.tY-this.side/2*3, tZ: this.tZ, tX: this.tX, rX: 90 })
	    		);
		        this.css.insertTagRule( '.id_'+this.id+'.big_bottom.front.top', 'bigbottom'+this.id, 
	    			'background:linear-gradient(-130deg, rgb('+(this.color.R-s3-s0)+','+(this.color.V-s3-s0)+','+(this.color.B-s3-s0)+') -50%,rgb('+(this.color.R-s0)+','+(this.color.V-s0)+','+(this.color.B-s0)+') 150%)'
	    		);
		    break;
		}
		
		
    },
	
	render: function()  {
        
        var render = '';
        render += '<figure class="face back '+this.classPosX+' '+this.classPosY+' fro"></figure>';
        render += '<figure class="face back '+this.classPosX+' '+this.classPosY+' rig"></figure>';
        render += '<figure class="face back '+this.classPosX+' '+this.classPosY+' top"></figure>';
        render += '<figure class="face border '+this.classPosX+' '+this.classPosY+' fro"></figure>';
        render += '<figure class="face border '+this.classPosX+' '+this.classPosY+' rig"></figure>';
        render += '<figure class="face border '+this.classPosX+' '+this.classPosY+' top"></figure>';
        render += '<figure class="face front '+this.classPosX+' '+this.classPosY+' fro"></figure>';
        render += '<figure class="face front '+this.classPosX+' '+this.classPosY+' rig"></figure>';
        render += '<figure class="face front '+this.classPosX+' '+this.classPosY+' top"></figure>';
        
        return render;
        
	}
  
});