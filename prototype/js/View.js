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
        
        this.add = function ( name, zx, zy, width, height ) {
            
            this[name] = {};
            this[name].zx = zx;
            this[name].zy = zy;
            this[name].width = width;
            this[name].height = height;
            this[name].canvas = document.createElement("canvas");
            this[name].canvas.style.position = 'absolute';
            this[name].canvas.width = this.width;
            this[name].canvas.height = this.height;
            this[name].canvas.setAttribute('data-name', name);
        
            this.content.appendChild(this[name].canvas);
            this[name].ctx = this[name].canvas.getContext('2d');
            
        }
        
        this.clear = function (name) {
            this[name].ctx.clearRect(this[name].zx, this[name].zy, this[name].width, this[name].height);
        }
        
    }
    
    environment['View'] = new View();
    
})(this);
