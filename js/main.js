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
    		case  50 : var hexa = mapIntro.display(); hexaGrid.check( hexa ); break;
    		case  60 : var hexa = mapIntro.display(); hexaGrid.check( hexa ); break;
    		case  70 : var hexa = mapIntro.display(); hexaGrid.check( hexa ); break;
    		case 100 : var hexa = mapIntro.display(); hexaGrid.check( hexa ); break;
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
