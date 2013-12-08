
var Map = function(name) {
    
    mi = this;
    this.shoot = 0;
    
    //load
    $.getJSON('map/'+name+'.json', function(data) {
    	mi.loaded(data);
    });
	
};

Map.prototype.loaded = function(data) {
    
    //init
    this.data = data;
	
	//size
	if( !hexagrid.reset( this ) )
		; // todo message d'echec;
	
	// scenario
	storytelling.add(this, data.scenario);
    
};

Map.prototype.display = function() {
    
    var hexa = this.data.map[this.shoot++];
	hexagrid.on(hexa, this.data.color[hexa.id]);
    return hexa;
    
};
