
var Map = Class.extend({
	
	init: function(hexagrid, name)  {
        
        this.hexagrid = hexagrid;
        mi = this;
        
        //load
        $.getJSON('map/'+name+'.json', function(data) {
        	mi.loaded(data);
        });
		
	},
	
	loaded: function(data)  {
        
        //init
        this.data = data;
    	
    	//size
    	if( !this.hexagrid.reset( data.column, data.line, data.color[data.background] ) )
    		; // todo message d'echec;
    	
    	// affichage
    
    	for( c in data.map ) {
        
            x = data.map[c].x;
            y = data.map[c].y;
            id = data.map[c].id;
            color = data.color;
            
            $block = $('.x_'+x+'.y_'+y);
            $block.addClass('id_'+id);
            $block.find('.fro').css({transform: 'translateX(-'+(this.hexagrid.side/2)+'px) rotateY(-90deg)'});
            $block.find('.rig').css({transform: 'translateZ( '+(this.hexagrid.side/2)+'px)'});
            $block.find('.top').css({transform: 'translateY(-'+(this.hexagrid.side/2)+'px) rotateX( 90deg)'});
            
            s0 = 0;
            s1 = 10;
            s2 = 20;
            s3 = 100;
            
            $block.find('.fro').css('background', 'linear-gradient(  45deg, rgb('+(color[id].R-s3-s2)+','+(color[id].V-s3-s2)+','+(color[id].B-s3-s2)+') -50%,rgb('+(color[id].R-s2)+','+(color[id].V-s2)+','+(color[id].B-s2)+') 150%)');
            $block.find('.rig').css('background', 'linear-gradient( -45deg, rgb('+(color[id].R-s3-s1)+','+(color[id].V-s3-s1)+','+(color[id].B-s3-s1)+') -50%,rgb('+(color[id].R-s1)+','+(color[id].V-s1)+','+(color[id].B-s1)+') 150%)');
            $block.find('.top').css('background', 'linear-gradient(-130deg, rgb('+(color[id].R-s3-s0)+','+(color[id].V-s3-s0)+','+(color[id].B-s3-s0)+') -50%,rgb('+(color[id].R-s0)+','+(color[id].V-s0)+','+(color[id].B-s0)+') 150%)');
           
            
            nx = Math.ceil(y/2) == (y/2) ? x-1 : x;
                
            $top1 = $('.x_'+(nx+0)+'.y_'+(y-1));
            $top2 = $('.x_'+(nx+1)+'.y_'+(y-1));
                
            $left = $('.x_'+(x-1)+'.y_'+y);
            $righ = $('.x_'+(x+1)+'.y_'+y);
            
            $bot1 = $('.x_'+(nx+0)+'.y_'+(y+1));
            $bot2 = $('.x_'+(nx+1)+'.y_'+(y+1));
            
            big = false;
            if( $top1.hasClass('id_'+id) && $top2.hasClass('id_'+id)  ) big = {b1:$top1, b2:$top2, b3:$block};
            if( $bot2.hasClass('id_'+id) && $righ.hasClass('id_'+id)  ) big = {b1:$block, b2:$righ, b3:$bot2};
            if( $left.hasClass('id_'+id) && $bot1.hasClass('id_'+id)  ) big = {b1:$left, b2:$block, b3:$bot1};
            
            //console.log(big);
            
            //if( bot1 && bot2  ) console.log('b1');
            //if( top2 && righ  ) console.log('b2');
            //if( left && top1  ) console.log('b3');
            
            if( big ) {
                
	            big.b2.find('.fro').css('background', 'linear-gradient(  45deg, rgb('+(color[id].R-s3-s2)+','+(color[id].V-s3-s2)+','+(color[id].B-s3-s2)+') -100%,rgb('+(color[id].R-s2)+','+(color[id].V-s2)+','+(color[id].B-s2)+') 100%)');
	            big.b1.find('.rig').css('background', 'linear-gradient( -45deg, rgb('+(color[id].R-s3-s1)+','+(color[id].V-s3-s1)+','+(color[id].B-s3-s1)+') -100%,rgb('+(color[id].R-s1)+','+(color[id].V-s1)+','+(color[id].B-s1)+') 100%)');
	            big.b3.find('.top').css('background', 'linear-gradient(-130deg, rgb('+(color[id].R-s3-s0)+','+(color[id].V-s3-s0)+','+(color[id].B-s3-s0)+') -100%,rgb('+(color[id].R-s0)+','+(color[id].V-s0)+','+(color[id].B-s0)+') 100%)');
	            
                big.b1.find('.rig').css({transform: 'translateZ( '+(this.hexagrid.side/2*3)+'px)'});
                big.b2.find('.fro').css({transform: 'translateX(-'+(this.hexagrid.side/2*3)+'px) rotateY(-90deg)'});
                big.b3.find('.top').css({transform: 'translateY(-'+(this.hexagrid.side/2*3)+'px) rotateX( 90deg)'});
                big.b3.find('.top').get(0).splose = true;
                big.b2.find('.fro').get(0).splose = true;
                big.b1.find('.rig').get(0).splose = true;
                
            }
	    }
	}
  
});
