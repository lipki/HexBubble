
var Map = function(name) {
    
    this.shoot = 0;
    
    //load
    $.getJSON('map/'+name+'.json', function(data) {
	    $(document).trigger('map_loaded', data );
    });
	
    // listen event
    var mi = this;
    $(document).on('map_loaded',      function(e, data) { mi.loaded    (e, data); });
    $(document).on('map_all_display', function(e, data) { mi.alldisplay(e, data); });
    $(document).on('map_display',     function(e, data) { mi.display   (e, data); });
};

Map.prototype.loaded = function( e, data ) {
    
    //init
    this.mData = data;
	
	//size
	$('.message-box, .case').remove();
	hexagrid.reset( this.mData );
	message.setTop( this.mData );
	
	// scenario
	st.addScenario( this.mData.scenario );
    
};

Map.prototype.alldisplay = function( e, data ) {
    
    if( typeof data.start === 'undefined' ) data.start = 0;
    if( typeof data.end   === 'undefined' ) data.end = this.mData.map.length-1;
    
    st.setCurrentTime(data.time);
    
    if( data.start < data.end )
    	for( var m = data.start; m <= data.end; m++ ) 
	    	this.makeTriggerDisplay( m, data );
    else
    	for( var m = data.start; m >= data.end; m-- )
			this.makeTriggerDisplay( m, data );
    
};

Map.prototype.makeTriggerDisplay = function( m, data ) {
    
	st.addline( 'next', function(){
		$(document).trigger('map_display', data);
	});
	st.addDelay(data.delay);
    
};

Map.prototype.display = function( e, data ) {
    
    var hexa = this.mData.map[this.shoot++];
    hexa.color = this.mData.color[hexa.id];
    $(document).trigger('map_hexa_on', hexa);
    
};
