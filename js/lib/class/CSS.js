var CSS = Class.extend({
	
	init: function( css ) {
		//$("head").append( $(document.createElement("link")).attr({rel:"stylesheet", type:"text/css", href:uri}) );
		this.doc = document.styleSheets[1];
		this.reset();
	},
	
	reset: function()  {
		while( this.length-- ) this.doc.deleteRule(this.length);
		this.length = 0;
		this.tags = [];
	},
	
	insertRule: function( selector ) {
		
	    if( arguments.length > 1 ) {
	    	trep = [];
	        for( var i=1; i<arguments.length; i++ ) trep.push(arguments[i]);
	    	rep = selector+'{'+trep.join(';')+'}';
	    }
	    
		this.doc.insertRule( rep , this.length++ );
	},
	
	insertTagRule: function( selector, tag ) {
		
		if( this.tags.indexOf(tag) == -1 ) {
			this.tags.push(tag);
			var args = Array.prototype.slice.call(arguments);
			args.splice(1, 1);
			args[0] = '/*'+tag+'*/'+args[0];
			this.insertRule.apply( this, args );
		}
		
	},
	
	transformRule: function( transform ) {
		
	    trep = [];
		if( typeof transform.tZ != 'undefined' ) trep.push('translateZ('+transform.tZ.toFixed(2)+'px)');
		if( typeof transform.tX != 'undefined' ) trep.push('translateX('+transform.tX.toFixed(2)+'px)');
		if( typeof transform.tY != 'undefined' ) trep.push('translateY('+transform.tY.toFixed(2)+'px)');
		if( typeof transform.rZ != 'undefined' ) trep.push('rotateZ('+transform.rZ.toFixed(2)+'deg)');
		if( typeof transform.rX != 'undefined' ) trep.push('rotateX('+transform.rX.toFixed(2)+'deg)');
		if( typeof transform.rY != 'undefined' ) trep.push('rotateY('+transform.rY.toFixed(2)+'deg)');
		
		return 'transform:'+trep.join(' ');
		
	}
  
});