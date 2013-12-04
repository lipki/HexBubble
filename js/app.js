
var requestAnimFrame = (function(){
    return window.requestAnimationFrame    ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();

define(function(require) {
    var $ = require('zepto');
    require('receiptverifier');
    require('Class');
    require('./HexaGrid');
    require('./Map');
    
    Zepto(function($){
	    
	    var hexaGrid = new HexaGrid();
	    var mapIntro = new Map(hexaGrid, 'install');
	    
	    // install
	    require('./install-button');
	    
	    // The main game loop
	    function Frame() {
	        requestAnimFrame(main);
	    };
	
	    // Let's play this game!
	    //Frame();
    
	});
});
