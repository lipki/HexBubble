Math.odd = function( num ){
    return Math.ceil(num/2) != (num/2);
};

Zepto(function($){
    
    hexagrid = new HexaGrid();
    Message.make();
    webApp = new WebApp( location.href + 'manifest.webapp' );
    st = new StoryTelling();
    
    console.log('Hexable : start');
    
    console.log('Hexable : checkInstalled');
    webApp.checkInstalled();
    
    // event listen
    
    $(document).on('WebApp_installed'  , function(e, data) {
    	map = new Map('intro');
    	console.log('Hexable : '+webApp.state);
    });
    $(document).on('WebApp_uninstalled', function(e, data) {
    	map = new Map('install');
    	console.log('Hexable : '+webApp.state);
    });
    $(document).on('WebApp_check_error', function(e, data) {
    	data.pos = {left:35,top:50};
    	data.color = {R:255, G:0, B:0};
		alert( _('checkinstallfailed', {error:data.error.name}), task );
    });
    
    $(document).on('map_loaded', function(e, data) {
    	console.log('Hexable : Map loaded');
    });
    
    
    
    $(document).on('switch', function(e, data) {
    	console.log('Hexable : Map "'+data.map+'" ready to load');
    	map = new Map(data.map);
    });
	
});
