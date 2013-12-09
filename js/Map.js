
var Map = function(name) {
    
    this.shoot = 0;
    
    //load
    $.getJSON('map/'+name+'.json', function(data) {
	    $(document).trigger('map_loaded', data );
    });
	
    // listen event
    var mi = this;
    $(document).on('map_loaded',  function(e, data) { mi.loaded (e, data); });
    $(document).on('map_display', function(e, data) { mi.display(e, data); });
};

Map.prototype.loaded = function( e, data ) {
    
    //init
    this.data = data;
	
	//size
	if( !hexagrid.reset( this ) )
		; // todo message d'echec;
	
	// scenario
	storytelling.add(this, data.scenario);
    
};

Map.prototype.display = function( e, data ) {
    
    var hexa = this.data.map[this.shoot++];
	hexagrid.on(hexa, this.data.color[hexa.id]);
    
};
