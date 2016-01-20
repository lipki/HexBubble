;(function(environment){
    'use strict';
    
    function View () {
        
        this.list = {};
        this.content = document.createElement("div");
        document.body.appendChild(this.content);
        this.content.style.display = 'block';
        this.content.style.position = 'absolute';
        this.content.style.bottom = 0;
        this.content.style.left = '50%';
        //this.content.style.opacity = 0.5;
            
        this.body = document.getElementsByTagName("body")[0];
        this.body.style.margin = 0;
        
        this.init = function ( nx, ny, rayon, width, mwidth, mheight ) {
            
            this.mwidth = mwidth;
            this.mheight = mheight;
            this.width = nx*width+(this.mwidth*2);
            this.height = ny*(rayon*1.5)+rayon/2+(this.mheight*2);
            
            this.content.style.width = this.width+'px';
            this.content.style.height = this.height+'px';
            this.content.style.marginLeft = -(this.width/2)+'px';
            
        }
        
        this.add = function ( name, morphe ) {
            
            this[name] = {};
            this[name].canvas = document.createElement("canvas");
            
            if( morphe ) {
                this[name].canvas.style.display = 'none';
                this[name].canvas.width = 100;
                this[name].canvas.height = 100;
                this[name].canvas.style.position = 'fixed';
                this[name].canvas.style.top = 0;
                this[name].canvas.style.left = 0;
            } else {
                this[name].canvas.style.position = 'absolute';
                this[name].canvas.width = this.width;
                this[name].canvas.height = this.height;
            }
            
            this.content.appendChild(this[name].canvas);
            this[name].ctx = this[name].canvas.getContext('2d');
            
        }
        
        this.clear = function (name) {
            var view = this[name];
            view.ctx.clearRect(0, 0, this.width, this.height);
        }
        
    }
    
    environment['View'] = new View();
    
})(this);
