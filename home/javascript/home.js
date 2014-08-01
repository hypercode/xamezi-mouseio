// JavaScript Document

$(document).ready(function(e) {
    
	var images = [];
	var timer=5000;
	var c;
	$('#images img').each(function(j) {
				var img=$(this);
				images.push(img);
    });
	
	c=1;
	
	$('#image_slider').append(images[0]);
	$('#image_slider img').fadeIn(1000);
			
	setInterval(function() {
				 
			  image=images[c];
			  $('#image_slider img').fadeOut(100);
			  $('#image_slider').empty().append(image);
			  $('#image_slider img').fadeIn(1000);
			  c++;
			  if(c==images.length)
				c=0;
	}, timer);
	

});