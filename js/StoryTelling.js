
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

var StoryTelling = function() {
    
    this.listing = [];
    this.oldlisting = [];
    this.nextTime = 0;
    
};

StoryTelling.prototype.add = function( map, scenario ) {
    
    
    for( var s in scenario ) {
    	
    	var task = scenario[s];
    	var realTime = task.time;
    	
    	if( task.time.indexOf('next') == 0 ) {
    		tabTime = task.time.split('+');
    		realTime = this.nextTime + this.delay(tabTime[1]);
    	} else {
    		realTime = this.delay(task.time);
    	}
    	
    	this.nextTime = this[task.action]( task, realTime );
    	
    }
    
    if (window.performance.now)
         this.startime = window.performance.now();
    else this.startime = Date.now();
    
    this.frame(this.startime);
    
};

StoryTelling.prototype.delay = function( time ) {
    
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
	
	/*
		var bulle = message.say( 'install', {left:15,top:6}, map.data.color[3] );
		
		bulle.add('.id_3')
			.css('cursor','pointer')
			.click(install);
	*/
	var mi = this;
    requestAFrame(function(time){mi.frame(time)});
    
};









StoryTelling.prototype.map = function( task, realTime ) {
    
    if( typeof task.start === 'undefined' ) task.start = 0;
    if( typeof task.end === 'undefined' ) task.end = map.data.map.length-1;
    
    var s = 0;
    	
    if( task.start < task.end ) {
    
	    for( var m = task.start; m <= task.end; m++ ) { s ++;
	    	
	    	if( s != 0 ) realTime += this.delay(task.delay);
	    	this.listing.push([ realTime, function(){
	    		$(document).trigger('map_display', task);
	    	}]);
	    	
	    }
	    
    } else if( task.start > task.end ) {
    
	    for( var m = task.start; m >= task.end; m-- ) { s ++;
	    	
	    	if( s != 0 ) realTime += this.delay(task.delay);
	    	this.listing.push([ realTime, function(){
	    		$(document).trigger('map_display', task);
	    	}]);
	    	
	    }
	    
    }
    
    return realTime;
    
};

StoryTelling.prototype.alert = function( task, realTime ) {
	
	this.listing.push([ realTime, function() {
		if( typeof task.sayArgs !== 'undefined' )
			 alert( _(task.say, task.sayArgs), task );
		else alert( _(task.say), task );
	}]);
    
    return realTime;
    
};

StoryTelling.prototype.confirm = function( task, realTime ) {
	
	var mi = this;
	this.listing.push([ realTime, function() {
		task.callback.objet = mi;
		task.callback.methode = mi.confirmResult;
		if( typeof task.sayArgs !== 'undefined' )
			 result = confirm( _(task.say, task.sayArgs), task );
		else result = confirm( _(task.say), task );
		
		mi.confirmResult( result, task );
	}]);
    
    return realTime;
    
};

StoryTelling.prototype.confirmResult = function( result, task ) {
	
	if( result ) alert("Thanks for Visiting!");
    
};

StoryTelling.prototype.prompt = function( task, realTime ) {
	
	this.listing.push([ realTime, function() {
		if( typeof task.sayArgs !== 'undefined' )
			 alert( _(task.say, task.sayArgs), task );
		else alert( _(task.say), task );
	}]);
    
    return realTime;
    
};

StoryTelling.prototype.install = function( task, realTime ) {
	
	this.listing.push([ realTime, function() {
		webApp.installBtn(task);
	}]);
    
    return realTime;
    
};