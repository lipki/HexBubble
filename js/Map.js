
var Map = Class.extend({
	
	init: function(hexagrid, name)  {
        
        this.hexagrid = hexagrid;
        mi = this;
        this.shoot = 0;
        
        //load
        $.getJSON('map/'+name+'.json', function(data) {
        	mi.loaded(data);
        });
		
	},
	
	loaded: function(data)  {
        
        //init
        this.data = data;
    	
    	//size
    	if( !this.hexagrid.reset( data.column, data.line, data.color[data.background] ) )
    		; // todo message d'echec;
        
	},
	
	display: function()  {
        
        var hexa = this.data.map[this.shoot++];
    	this.hexagrid.on(hexa, this.data.color[hexa.id]);
        
	}
  
});
