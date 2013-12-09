var CSS = function( css ) {
	//$("head").append( $(document.createElement("link")).attr({rel:"stylesheet", type:"text/css", href:uri}) );
	this.doc = document.styleSheets[1];
	this.reset();
};

CSS.prototype.reset = function()  {
	while( this.length-- ) this.doc.deleteRule(this.length);
	this.length = 0;
	this.tags = [];
};

CSS.prototype.insertRule = function( selector ) {
	
    if( arguments.length > 1 ) {
    	var trep = [];
        for( var i=1; i<arguments.length; i++ ) trep.push(arguments[i]);
    	var rep = selector+' {'+trep.join(';')+'}';
    }
	this.doc.insertRule( rep , this.length++ );
};

CSS.prototype.insertTagRule = function( selector, tag ) {
	
	if( this.tags.indexOf(tag) == -1 ) {
		this.tags.push(tag);
		var args = Array.prototype.slice.call(arguments);
		args.splice(1, 1);
		args[0] = '/*'+tag+'*/'+args[0];
		this.insertRule.apply( this, args );
	}
	
};

CSS.prototype.transformRule = function( transform ) {
	
    var trep = [];
	if( typeof transform.tZ == 'undefined' ) transform.tZ = 0;
	if( typeof transform.tX == 'undefined' ) transform.tX = 0;
	if( typeof transform.tY == 'undefined' ) transform.tY = 0;
	
	trep.push('translate3d('+transform.tX.toFixed(1)+'px,'+transform.tY.toFixed(1)+'px,'+transform.tZ.toFixed(1)+'px)');
	
	if( typeof transform.rZ != 'undefined' ) trep.push('rotateZ('+transform.rZ.toFixed(1)+'deg)');
	if( typeof transform.rX != 'undefined' ) trep.push('rotateX('+transform.rX.toFixed(1)+'deg)');
	if( typeof transform.rY != 'undefined' ) trep.push('rotateY('+transform.rY.toFixed(1)+'deg)');
	
	return 'transform:'+trep.join(' ');
	
};

CSS.prototype.linearGradientRule = function( angle ) {
	
	var trep = [angle+'deg'];
    for( var i=1; i<arguments.length; i++ ) {
    	var color = arguments[i][0];
    	if( typeof color === 'string' )
    		trep.push(color+' '+arguments[i][1]+'%');
    	else {
			if( typeof color.R == 'undefined' ) color.R = 255;
			if( typeof color.G == 'undefined' ) color.G = 255;
			if( typeof color.B == 'undefined' ) color.B = 255;
			if( typeof color.A == 'undefined' ) color.A = 255;
    		trep.push('rgba('+color.R+','+color.G+','+color.B+','+color.A+') '+arguments[i][1]+'%');
    	}
    }
    
	return  'background:linear-gradient('+trep.join(',')+')';
    
};