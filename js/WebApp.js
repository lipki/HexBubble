var WebApp = function( manifest ) {
	
	this.manifest = manifest;
	this.apps = navigator.mozApps;
	this.state = 'unknown';
	
};

WebApp.prototype.checkInstalled = function( callbackTrue, callbackFalse )  {
	
	var mi = this;
	var request = this.apps.checkInstalled(this.manifest);
	
	request.onerror = function( e ) {
		
		message.say( {say:'checkinstallfailed', error:this.error.name}, {left:35,top:50}, {R:255, G:0, B:0} );
		mi.error = this.error;
		mi.state = 'error';
	};
	
	request.onsuccess = function( e ) { 
		if (this.result) {
			mi.state = 'installed';
			callbackTrue ( this.result );
		} else {
			mi.state = 'uninstalled';
			callbackFalse( this.result );
		}
	};
	
};

WebApp.prototype.installBtn = function( task ) {
	
	switch(this.state) {
		case 'installed' : 
			
			task.callback = {objet:this, methode:this.uninstallConfirm};
			result = confirm( _('uninstall'), task );
			
			this.uninstallConfirm( result, task );
			
			/*
			var bulle = message.say( 'uninstall', task.pos, map.data.color[task.color] );
    		bulle/*.add('.id_3')
				.css('cursor','pointer')
				.click(this.uninstall);*/
		break;
		case 'uninstalled' : 
		break;
		
	}
	
};

WebApp.prototype.uninstallConfirm = function( result, task )  {
	
	if( result ) this.unInstall();
	
};

WebApp.prototype.install = function()  {
	
	var request = apps.install(this.manifest);

    request.onsuccess = function (data) {
		this.state = 'installed';
    };

    request.onerror = function ( err ) {
        this.error = this.error;
		this.state = 'error';
    };
	
};

WebApp.prototype.unInstall = function()  {
	
	//var result = this.app.uninstall();
	
};