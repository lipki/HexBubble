var Hexa = function( css, x, y, side )  {
	
	this.css = css;
	this.x = x;
    this.y = y;
    this.side = side;
    var classPosX = this.classPosX = 'x_'+x;
    var classPosY = this.classPosY = 'y_'+y;
    var classPos = this.classPos = '.'+this.classPosX+'.'+this.classPosY;
    
    
    // color
    
    this.s0 = 0;
    this.s1 = 5;
    this.s2 = 10;
    this.s3 = 100;
    this.s4 = 50;
    
    // position
    
    var tZ = this.tZ = x*side + Math.ceil(y/2)*side;
    var tX = this.tX = x*side - Math.ceil((y-1.5)/2)*side;
    var tY = this.tY = y*side;
	
	// reste
	this.border();
	this.front();
	this.big();
};

Hexa.prototype.border = function() {
	
	var target = $('#border .yaw');
	var css = this.css;
    var side = this.side;
    var classPosX = this.classPosX;
    var classPosY = this.classPosY;
    var classPos = this.classPos;
	
	// render
	
    var render = '';
    render += '<div class="face border '+classPosX+' '+classPosY+' fro"></div>';
    render += '<div class="face border '+classPosX+' '+classPosY+' rig"></div>';
    render += '<div class="face border '+classPosX+' '+classPosY+' top"></div>';
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
    
    css.insertTagRule('.border', 'all face border',
		'height: 0px','width : 0px','margin: 0px',
		'border-color: transparent transparent #fff #fff',
    	'border-style: solid',
		'border-width: 0',
		'transition: width 1s, height 1s, margin 1s, transform 1s, border 1s'
    );
    css.insertTagRule( '.border.rig', 'all face border rig',
		'border-color: transparent #fff #fff transparent'
    );
    css.insertTagRule( '.border.top', 'all face border top',
		'border-color: #fff #fff transparent transparent'
    );
    
};

Hexa.prototype.front = function() {
	
	var target = $('#front .yaw');
	var css = this.css;
    var classPosX = this.classPosX;
    var classPosY = this.classPosY;
    var classPos = this.classPos;
    
	// render
	
    var render = '';
    render += '<div class="face front  '+classPosX+' '+classPosY+' fro"></div>';
    render += '<div class="face front  '+classPosX+' '+classPosY+' rig"></div>';
    render += '<div class="face front  '+classPosX+' '+classPosY+' top"></div>';
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
		'transition: width 1s, height 1s, margin 1s, transform 1s'
    );
    
};

Hexa.prototype.big = function() {
	
	var target = $('#big .yaw');
	var css = this.css;
    var side = this.side;
    var classPosX = this.classPosX;
    var classPosY = this.classPosY;
    var classPos = this.classPos;
    
	// render
	
    var render = '';
    render += '<div class="face big '+classPosX+' '+classPosY+' fro"></div>';
    render += '<div class="face big '+classPosX+' '+classPosY+' rig"></div>';
    render += '<div class="face big '+classPosX+' '+classPosY+' top"></div>';
    target.append(render);
    
    // size
    
    css.insertTagRule('.big', 'all face big',
    	'height: 0px','width : 0px','margin: 0px',
		'transition: width 1s, height 1s, margin 1s, transform 1s'
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
    
};

Hexa.prototype.on = function( id, color ) {
	
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
    
    var aside = side+1;
    css.insertTagRule( classPos+'.id_'+id+'.front', classPos+'.id_'+id+'.front',
    	'height:'+aside.toFixed(1)+'px','width:'+aside.toFixed(1)+'px','margin:-'+(aside/2).toFixed(1)+'px'
    );
    
    var border = side*1.2-side;
    css.insertTagRule( classPos+'.id_'+id+'.border', classPos+'.id_'+id+'.border',
		'height:'+(aside-border).toFixed(1)+'px',
		'width:'+(aside-border).toFixed(1)+'px',
		'margin:-'+(aside/2+border/2).toFixed(1)+'px',
		'border-color: transparent transparent #fff #fff',
		'border-width: '+border+'px',
		'border-radius: '+border+'px 0'
    );
    css.insertTagRule( classPos+'.id_'+id+'.border.rig', classPos+'.id_'+id+'.border rig',
		'border-color: transparent #fff #fff transparent',
		'border-radius: 0 '+border+'px'
    );
    css.insertTagRule( classPos+'.id_'+id+'.border.top', classPos+'.id_'+id+'.border top',
		'border-color: #fff #fff transparent transparent'
    );
	
	// event
	$(document).trigger('hexa_on', {id:this.id, x:this.x, y:this.y} );
    
};

Hexa.prototype.bigOn = function( pos ) {
	
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
    
    var aside = this.side+1;
	switch (pos) {
    	case 'left' :
		    css.insertRule(classPos+'.id_'+id+'.big_left.big.rig',
		    	'height:'+aside.toFixed(1)+'px','width:'+aside.toFixed(1)+'px','margin:-'+(aside/2).toFixed(1)+'px'
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
		    	'height:'+aside.toFixed(1)+'px','width:'+aside.toFixed(1)+'px','margin:-'+(aside/2).toFixed(1)+'px'
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
		    	'height:'+aside.toFixed(1)+'px','width:'+aside.toFixed(1)+'px','margin:-'+(aside/2).toFixed(1)+'px'
		    );
	        css.insertRule( classPos+'.big_bottom.big.top',
    			css.transformRule({ tY: tY-side/2*3, tZ: tZ, tX: tX, rX: 90 })
    		);
	        css.insertTagRule( '.id_'+id+'.big_bottom.big.top', 'bigbottom'+id, 
    			css.linearGradientRule( -130, [{R:color.R-s3-s0, G:color.G-s3-s0, B:color.B-s3-s0}, -50], [{R:color.R+s4-s0, G:color.G+s4-s0, B:color.B+s4-s0}, 150])
    		);
	    break;
	}
	
};