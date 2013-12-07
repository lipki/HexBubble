Math.odd = function( num ){
    return Math.ceil(num/2) != (num/2);
};

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
    
    var message  = new Message();
    var hexaGrid = new HexaGrid();
    message.target( hexaGrid.$roll, hexaGrid.$idbody.width() );
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
    			var texte = message.say( 'install', {left:15,top:6}, mapIntro.data.color[3] );
    		break;
    		case 220 : 
    			var texte = message.say( 'skip', {left:57,top:13}, mapIntro.data.color[4] );
    		break;
    	}
    	
        requestAnimFrame(Frame);
    };

    // Let's play this game!
    Frame();

});
