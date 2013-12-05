
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

Zepto(function($){
    
    var hexaGrid = new HexaGrid();
    var mapIntro = new Map(hexaGrid, 'install');
    
    // install
    //require('./install-button');
    
    // The main game loop
    var time = 0;
    function Frame() { time++;
    	
    	switch (time) {
    		case  40 : mapIntro.display(); break;
    		case  50 : mapIntro.display(); break;
    		case  70 : mapIntro.display(); break;
    		case 100 : mapIntro.display(); break;
    		case 140 : hexaGrid.check(mapIntro.data.map[mapIntro.data.map.length-1]); break;
    		case 200 : 
    			hexaGrid.$idbody.append('<div class="message install">Install</div>');
			break;
    		case 220 : 
    			hexaGrid.$idbody.append('<div class="message skip">skip</div>');
			break;
    	}
    	
        requestAnimFrame(Frame);
    };

    // Let's play this game!
    Frame();

});
