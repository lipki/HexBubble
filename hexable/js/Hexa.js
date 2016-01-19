var Hexa = function( hexagrid, x, y )  {
	
	this.hexagrid = hexagrid;
	this.x = x;
    this.y = y;
    
    // color
    
    this.s0 = 0;
    this.s1 = 5;
    this.s2 = 10;
    this.s3 = 100;
    this.s4 = 50;
    
    //anim
    
    this.speed = '2s';
    
	// reste
	
	//this.border();
	//this.front( '#border', 1.3 );
	//this.front( '#front', 1.227, {R:176,G:204,B:153} );
	//this.big();
};

Hexa.prototype.border = function() {
	
	var hg = this.hexagrid;
    var border = hg.hCase/32;
    var border2 = border/Math.tan(Math.PI*60/180 );
	
	// render
	
    var $bfront = $('<div class="fro"/>');
    var $bright = $('<div class="rig"/>');
    var $btop   = $('<div class="top"/>');
    $('#border .x_'+this.x+'.y_'+this.y)
    	.append($bfront)
    	.append($bright)
    	.append($btop  );
    
    // position
    
    hg.css.insertTagRule( '#border .fro, #border .rig, #border .top', '#border part',
		'position: absolute',
		'top: '+hg.hCase/2+'px',
    	'left: '+(hg.wCase/2)+'px',
    	'height: 0','width : 0',
		'background: #fff',
		'transition: width '+this.speed+', height '+this.speed+', top '+this.speed+'s, left '+this.speed
    );
    hg.css.insertTagRule( '#border .open', '#border part open',
		'top: '+(hg.hCase/4-border2)+'px',
    	'left: -'+border+'px',
    	'height: '+(hg.hCase/2+border2*2)+'px',
		'width : '+(hg.wCase+border*2)+'px'
    );
    $bfront.css({ transform: 'rotate( 60deg)' });
    $bright.css({ transform: 'rotate(-60deg)' });
    
    setTimeout(function () {
    	$bfront.addClass('open');
    	$bright.addClass('open');
    	$btop.addClass('open');
	},1);
};

Hexa.prototype.front = function( target, scale, id, color ) {
	
	this.id = id;
	var hg = this.hexagrid;
	var aside = hg.hCase+2;
	
	// render
	
	var $target = $(target+' .x_'+this.x+'.y_'+this.y);
    var $cfront = $('<div class="face fro"/>');
    var $cback  = $('<div class="face bac"/>');
    var $cright = $('<div class="face rig"/>');
    var $cleft  = $('<div class="face lef"/>');
    var $ctop   = $('<div class="face top"/>');
    var $cbottom= $('<div class="face bot"/>');
    var $yaw    = $('<div class="yaw"/>');
    var $pitch  = $('<div class="pitch"/>');
    $pitch.append($yaw);
    $yaw.append($cfront).append($cback  )
    	.append($cright).append($cleft  )
    	.append($ctop  ).append($cbottom);
    	
    $target.append($pitch)
    	   .css({ transform:'scale(0)',transition: 'transform '+this.speed });
    
    $target.addClass('id_'+id);
    
    // position
    
    hg.css.insertTagRule(target+' .pitch, '+target+' .yaw', target+' pitch yaw',
    	'display: block',
    	'position: absolute',
    	'transform-style:preserve-3d',
		'transition: transform '+this.speed
    );
	hg.css.insertTagRule(target+' .pitch',target+' pitch',
		'transform:rotateX(215deg)',
		'top:'+(hg.hCase/2)+'px',
		'left:'+(hg.wCase/2)+'px',
    	'background: green'
	);
	hg.css.insertTagRule(target+' .yaw'  ,target+' yaw'  ,
		'transform:rotateY(225deg)');
	
    hg.css.insertTagRule( target+' .face', target+' part',
    	'position: absolute',
    	'height: '+(aside/2)+'px',
    	'width : '+(aside/2)+'px',
		'backface-visibility:hidden'
    );
    hg.css.insertTagRule( target+' .fro', target+' fro part',
		hg.css.transformRule({ tX: 0, tY: -hg.hCase/4, tZ: 0, rY:-90 }));
    hg.css.insertTagRule( target+' .bac', target+' bac part',
		hg.css.transformRule({ tX: -hg.hCase/2, tY: -hg.hCase/4, tZ: 0, rY:90 }));
    hg.css.insertTagRule( target+' .rig', target+' rig part',
		hg.css.transformRule({ tX: -hg.hCase/4, tY: -hg.hCase/4, tZ: -hg.hCase/4 }));
    hg.css.insertTagRule( target+' .lef', target+' lef part',
		hg.css.transformRule({ tX: -hg.hCase/4, tY: -hg.hCase/4, tZ: +hg.hCase/4, rY:180 }));
    hg.css.insertTagRule( target+' .top', target+' top part',
		hg.css.transformRule({ tX: -hg.hCase/4, tY: 0, tZ: 0, rX:90 }));
    hg.css.insertTagRule( target+' .bot', target+' bot part',
		hg.css.transformRule({ tX: -hg.hCase/4, tY: -hg.hCase/2, tZ: 0, rX:-90 }));
	
	//color
    
    if( color ) {
    
	    var s0 = this.s0 = 0;
	    var s1 = this.s1 = 5;
	    var s2 = this.s2 = 10;
	    var s3 = this.s3 = 100;
	    var s4 = this.s4 = 50;
    	
	    var cs  = {R:Math.ceil(color.R/100*60), G:Math.ceil(color.G/100*60), B:Math.ceil(color.B/100*60)};
	    var cs2 = {R:Math.ceil(color.R/100*2), G:Math.ceil(color.G/100*2), B:Math.ceil(color.B/100*2)};
	    var cm  = color;
	    var cl  = {R:color.R+Math.ceil(color.R/100*60), G:color.G+Math.ceil(color.G/100*60), B:color.B+Math.ceil(color.B/100*60)};
	    var cl2 = {R:color.R+Math.ceil(color.R/100*2) , G:color.G+Math.ceil(color.G/100*2) , B:color.B+Math.ceil(color.B/100*2)};
	    
	    hg.css.insertTagRule( target+' .id_'+id+' .fro', target+' '+!color+'id_'+id+' fro part color',
			hg.css.linearGradientRule(  -45, [{R:color.R-s3-s2, G:color.G-s3-s2, B:color.B-s3-s2},  -50], [cm,  50], [{R:color.R+s4-s2, G:color.G+s4-s2, B:color.B+s4-s2}, 150]));
	    hg.css.insertTagRule( target+' .id_'+id+' .bac', target+' '+!color+'id_'+id+' bac part color',
			hg.css.linearGradientRule(   45, [cs,    0], [cm, 100], [cl, 200]));
	    hg.css.insertTagRule( target+' .id_'+id+' .rig', target+' '+!color+'id_'+id+' rig part color',
			hg.css.linearGradientRule(   45, [{R:color.R-s3-s1, G:color.G-s3-s1, B:color.B-s3-s1}, -50], [cm,  50], [{R:color.R+s4-s1, G:color.G+s4-s1, B:color.B+s4-s1}, 150]));
	    hg.css.insertTagRule( target+' .id_'+id+' .lef', target+' '+!color+'id_'+id+' lef part color',
			hg.css.linearGradientRule(  -45, [cs,    0], [cm, 100], [cl, 200]));
	    hg.css.insertTagRule( target+' .id_'+id+' .top', target+' '+!color+'id_'+id+' top part color',
			hg.css.linearGradientRule(   45, [cs,    0], [cm, 100], [cl, 200]));
	    hg.css.insertTagRule( target+' .id_'+id+' .bot', target+' '+!color+'id_'+id+' bot part color',
			hg.css.linearGradientRule(  130, [{R:color.R-s3-s0, G:color.G-s3-s0, B:color.B-s3-s0},  -50], [cm,  50], [{R:color.R+s4-s0, G:color.G+s4-s0, B:color.B+s4-s0}, 150]));
		
    } else {
	    hg.css.insertTagRule( target+' .face', target+' '+!color+' fro part color', 'background:#FFF');
    }
	
    //anim
    
    setTimeout(function () {
    	$yaw.css   ('transform', 'rotateY(45deg)');
    	$pitch.css ('transform', 'rotateX(35deg)');
    	$target.css('transform', 'scale('+scale+')');
	},1);
	
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
	
	this.front( '#border', 1.3, id );
	this.front( '#front', 1.227, id, color );
	
	/*var css = this.css;
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
    
    // anim size
    
    var aside = side+1;
    css.insertTagRule( classPos+'.id_'+id+'.front', classPos+'.id_'+id+'.front',
    	'height:'+aside.toFixed(1)+'px','width:'+aside.toFixed(1)+'px','margin:-'+(aside/2).toFixed(1)+'px'
    );
    
    var border = side/8;
    var border2 = border/Math.tan(Math.PI*60/180 );
    
    css.insertTagRule( classPos+'.border', classPos+'.border',
    	'height: '+this.heightCube+'px',
		'width : '+this.widthCube+'px',
		'border-width: '+border2+'px '+border+'px',
		'margin: -'+(this.heightCube/2+border2)+'px -'+(this.widthCube/2+border)+'px',
		'transition: width 1s, height 1s, margin 1s, transform 1s, border 1s'
    );
    
	// event
	$(document).trigger('hexa_on', {id:this.id, x:this.x, y:this.y} );
    */
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