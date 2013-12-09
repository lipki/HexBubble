var WebApp = function( manifest ) {
	
	this.manifest = manifest;
	this.apps = navigator.mozApps;
	this.state = 'unknown';
	
};

WebApp.prototype.checkInstalled = function( callbackTrue, callbackFalse )  {
    console.log('check');
	
	var mi = this;
	var request = this.apps.checkInstalled(this.manifest);
	
	request.onerror = function( e ) {
    	console.log('check : error');
		
		message.say( {say:'checkinstallfailed', error:this.error.name}, {left:35,top:50}, {R:255, G:0, B:0} );
		mi.error = this.error;
		mi.state = 'error';
	};
	
	request.onsuccess = function( e ) { 
		if (this.result) {
			mi.state = 'installed';
    		console.log(mi.state);
			callbackTrue ( this.result );
		} else {
			mi.state = 'uninstalled';
    		console.log(mi.state);
			callbackFalse( this.result );
		}
	};
	
};

WebApp.prototype.installBtn = function( args ) {
	
	switch(this.state) {
		case 'installed' : 
			
			args.callback = {say:'uninstall' , objet:this, methode:this.uninstallConfirm};
			result = confirm( _('uninstall'), args );
			
			this.uninstallConfirm( result, args );
			
			/*
			var bulle = message.say( 'uninstall', task.pos, map.data.color[task.color] );
    		bulle/*.add('.id_3')
				.css('cursor','pointer')
				.click(this.uninstall);*/
		break;
		case 'uninstalled' : 
			
			args.callback = {say:'install' , objet:this, methode:this.installConfirm};
			result = confirm( _('install'), args );
			
			this.installConfirm( result, args );
			
		break;
		
	}
	
};

WebApp.prototype.uninstallConfirm = function( result, args )  {
	
	if( result ) this.unInstall();
	
};

WebApp.prototype.installConfirm = function( result, args )  {
	
	if( result ) this.install();
	
};

WebApp.prototype.install = function()  {
	
	var request = this.apps.install(this.manifest);

    request.onsuccess = function (data) {
		this.state = 'installed';
    };

    request.onerror = function ( err ) {
        this.error = this.error;
		this.state = 'error';
		
		args = {say:'checkinstallfailed' ,pos:{left:35,top:50}, color:{R:255, G:0, B:0}};
		
		if( typeof task.sayArgs !== 'undefined' )
			 alert( _('checkinstallfailed', {error:this.error.name}), args );
		else alert( _(task.say), args );
		
    };
	
};

WebApp.prototype.unInstall = function()  {
	
	console.log('unInstall');
	//var result = this.app.uninstall();
	
};