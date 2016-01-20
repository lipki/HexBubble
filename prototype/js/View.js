;(function(environment){
    'use strict';
    
    function View () {
        
        this.list = {};
        this.content = document.createElement("div");
        document.body.appendChild(this.content);
        this.content.style.display = 'block';
        this.content.style.position = 'absolute';
        this.content.style.bottom = 0;
        this.content.style.width = '100%';
        this.content.style.height = '100%';
            
        this.body = document.getElementsByTagName("body")[0];
        this.body.style.margin = 0;
        
        this.init = function ( width, height ) {
            this.width = width;
            this.height = height;
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
                this[name].canvas.width = window.innerWidth;
                this[name].canvas.height = window.innerHeight;
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
