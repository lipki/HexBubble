var WebApp = function( manifest ) {
	
	this.manifest = manifest;
	this.apps = navigator.mozApps;
	this.state = 'unknown';
	
    // listen event
    var mi = this;
    $(document).on('webapp_installbtn'   , function(e, data) { mi.installbtn (e, data); });
    $(document).on('WebApp_ask_uninstall', function(e, data) { mi.unInstall (e, data); });
    $(document).on('WebApp_ask_install'  , function(e, data) { mi.install (e, data); });
};

WebApp.prototype.checkInstalled = function()  {
	
	var mi = this;
	var request = this.apps.checkInstalled(this.manifest);
	
	request.onerror = function( e ) {
    	console.log( 'WebApp checkInstalled error : '+this.error.name );
		$(document).trigger('WebApp_check_error', this);
		mi.error = this.error;
		mi.state = 'error';
	};
	
	request.onsuccess = function( e ) { 
		if (this.result) {
			mi.state = 'installed';
			$(document).trigger('WebApp_installed', this);
		} else {
			mi.state = 'uninstalled';
			$(document).trigger('WebApp_uninstalled', this);
		}
	};
	
};

WebApp.prototype.installbtn = function( e, data ) {
	
	var mi = this;
	st.addline( data.time, function() {
		
		switch(mi.state) {
			case 'installed' : 
				
				data.reply.name = 'WebApp_ask_uninstall';
				result = confirm( _('uninstall'), data );
		
				if( result ) $(document).trigger('WebApp_ask_uninstall', data);
				
				/*
				var bulle = message.say( 'uninstall', task.pos, map.data.color[task.color] );
	    		bulle/*.add('.id_3')
					.css('cursor','pointer')
					.click(this.uninstall);*/
			break;
			case 'uninstalled' : 
				
				data.reply.name = 'WebApp_ask_install';
				result = confirm( _('install'), data );
				
				if( result ) $(document).trigger('WebApp_ask_install', data);
				
			break;
			
		}
	});
    
};

WebApp.prototype.install = function( e, task )  {
	
	var mi = this;
	var request = this.apps.install(this.manifest);

    request.onsuccess = function (data) {
		mi.state = 'installed';
		$(document).trigger(task.installed.name, task.installed );
    };

    request.onerror = function ( err ) {
        mi.error = mi.error;
		mi.state = 'error';
		
		args = {say:'installfailed' ,pos:{left:35,top:50}, color:{R:255, G:0, B:0}};
		alert( _('installfailed', {error:this.error.name}), args );
    };
	
};

WebApp.prototype.unInstall = function( e, task )  {
	
	console.log('unInstall');
	$(document).trigger(task.uninstalled.name, task.uninstalled );
	
};