Math.odd = function( num ){
    return Math.ceil(num/2) != (num/2);
};

Zepto(function($){
    
    hexagrid = new HexaGrid();
	Message.make( hexagrid.$roll, hexagrid.$idbody.width() );
    webApp = new WebApp( location.href + 'manifest.webapp' );
    storytelling = new StoryTelling();
    
    console.log('start');
    
    webApp.checkInstalled(function( result ) {
    	map = new Map('intro');
    },function( result ) {
    	map = new Map('install');
    });

});
