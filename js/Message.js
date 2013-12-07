var Message = Class.extend({
	
	init: function()  {
		
    	this.css = new CSS(0);
	    
        var s2 = this.s2 = 10;
        var s3 = this.s3 = 100;
        var s4 = this.s4 = 50;
    	
    	this.css.insertRule('.message-box',
    		'position: absolute'
    	);
		
	},
	
	target: function( target, width )  {
		
		this.target = target;
		this.width = width;
	    
    	this.css.insertRule('.message-center',
    		'display: block',
    		'margin: 0 -'+(width/2).toFixed(2)+'px',
    		'text-align: center',
    		'width: '+width+'px'
    	);
    	
    	this.css.insertRule('.message',
    		'display: inline-block',
    		'border: '+(width/64).toFixed(2)+'px solid #FFFFFF',
    		'border-radius: '+(width/64).toFixed(2)+'px',
    		'color: #FFFFFF',
    		'font-family: monospace',
    		'font-size: '+(width/20).toFixed(2)+'px',
    		'font-weight: bold',
    		'padding: '+(width/160).toFixed(2)+'px '+(width/35).toFixed(2)+'px',
    		'text-transform: uppercase'
    	);
    	
	},
	
	say: function( say, pos, color )  {
	    
        var s2 = this.s2;
        var s3 = this.s3;
        var s4 = this.s4;
		var target = this.target;
		var width = this.width;
        
        var colorL = 'rgb('+(color.R+s4-s2)+','+(color.G+s4-s2)+','+(color.B+s4-s2)+')';
        var colorD = 'rgb('+(color.R-s3-s2)+','+(color.G-s3-s2)+','+(color.B-s3-s2)+')';
        var colorN = 'rgb('+(128-s3-s2)+','+(128-s3-s2)+','+(128-s3-s2)+')';
		
    	this.css.insertRule('.message-box.'+say,
    		'left: '+(width*pos.left/100).toFixed(2)+'px',
    		'top: '+(width*pos.top/100).toFixed(2)+'px'
    	);
    	this.css.insertRule('.message-box.'+say+' .message',
    		'background: none repeat scroll 0 0 '+colorL,
    		'box-shadow: 0 0 '+(width/12).toFixed(2)+'px '+colorD+' inset, 0 0 '+(width/64).toFixed(2)+'px '+colorN
    	);
    	
		var rep = '';
		rep += '<div class="message-box '+say+'">';
		rep += '<div class="message-center">';
		rep += '<div class="message">';
		rep += _(say);
		rep += '</div>';
		rep += '</div>';
		rep += '</div>';
		this.target.append(rep);
		
		return $('message-box.'+say+' .message');
		
	}
  
});