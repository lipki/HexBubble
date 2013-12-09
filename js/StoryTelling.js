
var requestAFrame = (function(){
    return window.requestAnimationFrame    ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();

var cancelAFrame = (function () {
    return window.cancelAnimationFrame    ||
        window.webkitCancelAnimationFrame ||
        window.mozCancelAnimationFrame    ||
        window.oCancelAnimationFrame      ||
        function (id) {
            window.clearTimeout(id);
        };
})();

var StoryTelling = function() {};

StoryTelling.prototype.addScenario = function( scenario ) {
	
    this.listing = [];
    this.oldlisting = [];
    this.currentTime = 0;
    
    for( var s in scenario )
	    $(document).trigger( scenario[s].trigger, scenario[s] );
    
    if (window.performance.now)
         this.startime = window.performance.now();
    else this.startime = Date.now();
    
    this.frame(this.startime);
    
};

StoryTelling.prototype.addline = function( time, callback ) {
	
	if( time.indexOf('next') == 0 ) {
		tabTime = time.split('+');
		this.listing.push([ this.addDelay(tabTime[1]), callback]);
	} else {
		this.listing.push([ this.setCurrentTime(time), callback]);
	}
	
};

StoryTelling.prototype.addDelay = function( time ) {
	return this.currentTime += this.inMilli(time);
};

StoryTelling.prototype.setCurrentTime = function( time ) {
	return this.currentTime = this.inMilli(time);
};

StoryTelling.prototype.inMilli = function( time ) {
    
    if( typeof time === 'number' )
    	return time;
    else if( typeof time === 'string' ) {
    	
    	if( time.indexOf('ms') != -1 )
    		return Number(time.split('ms')[0]);
    	else if( time.indexOf('s') != -1 ) {
    		return Number(time.split('s')[0])*1000;
    	} else
    		return Number(time.split('ms')[0]);
    	
    } else return 0;
    
};

StoryTelling.prototype.frame = function( time ) {
	
	var milli = time - this.startime;
	
	if( typeof this.listing[0] !== 'undefined' ) {
		if( milli > this.listing[0][0] ) {
			this.listing[0][1]();
			this.oldlisting.push(this.listing.shift());
		}
	}
	
	var mi = this;
    requestAFrame(function(time){mi.frame(time);});
    
};
