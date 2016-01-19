/*

alert('hop', {hop:'hop'});

if ( prompt("What's your sign?", 'scorpio', {hop:'hop'}) == "scorpio" )
	alert("Wow! I'm a Scorpio too!");

if ( confirm("Are you sure you wish to leave?", {hop:'hop'}) ) { 
	alert("Thanks for Visiting!");
}

*/

window.alertOrigin = window.alert;
window.alert = function( mess ) {
	if( typeof arguments[1] === 'object' ) {
		
		var args = arguments[1];
		if( !Message.make() ) alertOrigin.apply(window,arguments);
		message.say( mess, args );
		
  	} else alertOrigin.apply(window,arguments);
};

window.confirmOrigin = window.confirm;
window.confirm = function( mess ) {
	if( typeof arguments[1] === 'object' ) {
		
		var args = arguments[1];
		if( !Message.make() ) alertOrigin.apply(window,arguments);
		message.say( mess, args );
  		
  	} else confirmOrigin.apply(window,arguments);
};

window.promptOrigin = window.prompt;
window.prompt = function( mess ) {
	if( typeof arguments[1] === 'object' || typeof arguments[2] === 'object' ) {
		
		var args = typeof arguments[1] === 'object' ? arguments[1] : arguments[2];
		if( !Message.make() ) alertOrigin.apply(window,arguments);
		message.say( mess, args );
  		
  	} else promptOrigin.apply(window,arguments);
};




var Message = function() {

	var css = this.css = new CSS(0);
	var width = this.width = $('#body').width();
    
    this.s2 =  10;
    this.s3 = 100;
    this.s4 =  50;
    
    $('#body').append('<div id="message"/>');
    
	css.insertRule('#message',
		'display: block',
		'height: 100%',
		'width: 100%',
		'position: absolute',
		'transform-style: preserve-3d',
		'transform: translateZ(400px)'
	);
	
	css.insertRule('.message-box', 'position: absolute' );
    
	css.insertRule('.message-center',
		'display: block',
		'margin: 0 -'+((width/1.1)/2).toFixed(1)+'px',
		'text-align: center',
		'width: '+(width/1.1).toFixed(1)+'px',
		'height: 0'
	);
	
	css.insertRule('.message',
		'display: inline-block',
		'border: '+(width/64).toFixed(1)+'px solid #FFFFFF',
		'border-radius: '+(width/64).toFixed(1)+'px',
		'color: #FFFFFF',
		'font-family: monospace',
		'font-size: '+(width/20).toFixed(1)+'px',
		'font-weight: bold',
		'padding: '+(width/160).toFixed(1)+'px '+(width/35).toFixed(1)+'px',
		'text-transform: uppercase'
	);
	
    // listen event
    var mi = this;
    $(document).on('alert',   function(e, data) { mi.alert (e, data); });
    $(document).on('confirm', function(e, data) { mi.confirm (e, data); });
    $(document).on('prompt',  function(e, data) { mi.prompt (e, data); });
	
};

Message.prototype.setTop = function( mData ) {
	
	
	var offsetHeight = hexagrid.height/2; //middle
	offsetHeight -= hexagrid.side*((mData.line-1)*.75); // décentrage
	offsetHeight -= hexagrid.side;
	
	$('#message').css( 'top', offsetHeight );
	
};

Message.prototype.say = function( say, args )  {
    
    var s2 = this.s2;
    var s3 = this.s3;
    var s4 = this.s4;
	var target = this.target;
	var width = this.width;
	var clas = args.say;
    
    var colorL = 'rgb('+(args.color.R+s4-s2)+','+(args.color.G+s4-s2)+','+(args.color.B+s4-s2)+')';
    var colorD = 'rgb('+(args.color.R-s3-s2)+','+(args.color.G-s3-s2)+','+(args.color.B-s3-s2)+')';
    var colorN = 'rgb('+(128-s3-s2)+','+(128-s3-s2)+','+(128-s3-s2)+')';
	
	this.css.insertRule('.message-box.'+clas,
		'left: '+(width*args.pos.left/100).toFixed(1)+'px',
		'top: '+(width*args.pos.top/100).toFixed(1)+'px'
	);
	this.css.insertRule('.message-box.'+clas+' .message',
		'background: none repeat scroll 0 0 '+colorL,
		'box-shadow: 0 0 '+(width/12).toFixed(1)+'px '+colorD+' inset, 0 0 '+(width/64).toFixed(1)+'px '+colorN
	);
	
	var rep = '';
	rep += '<div class="message-box '+clas+'">';
	rep += '<div class="message-center">';
	rep += '<div class="message">'+say+'</div>';
	rep += '</div>';
	rep += '</div>';
	$('#message').append(rep);
	
	// action
	if( typeof args.reply !== 'undefined' ) {
		$('.message-box.'+clas+' .message')
			.css('cursor','pointer')
			.click(function() {
				$(document).trigger(args.reply.name, args.reply );
			});
	}
	
};

Message.prototype.alert = function( e, data ) {
	
	st.addline( data.time, function() {
		if( typeof data.sayArgs !== 'undefined' )
			 alert( _(data.say, data.sayArgs), data );
		else alert( _(data.say), data );
	});
    
};

Message.prototype.confirm = function( e, data ) {
    
	var mi = this;
	st.addline( data.time, function(){
		if( typeof data.sayArgs !== 'undefined' )
			 result = confirm( _(data.say, data.sayArgs), data );
		else result = confirm( _(data.say), data );
		
		if( result ) $(document).trigger(data.reply.name, data.reply );
	});
    
};

StoryTelling.prototype.prompt = function( e, data ) {
	
	st.addline( data.time, function() {
		if( typeof data.sayArgs !== 'undefined' )
			 alert( _(data.say, data.sayArgs), data );
		else alert( _(data.say), data );
	});
    
};


// pseudo singleton
Message.make = function() {
	
	if( typeof message === 'undefined' )
		message = new Message();
	
	return message;
	
};