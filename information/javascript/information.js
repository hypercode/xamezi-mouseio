// JavaScript Document

$(document).ready(function(e) {
    
	  initializeDocumentDimensions();
	 
	  $('#info_tab').click(function(){
			tab_menu_func();
			$('#info_tab').css('border-bottom','1px groove #D94A06');
			$('#info').fadeIn(1000);
		});
		
		$('#visit_tab').click(function(){
			tab_menu_func();
			$('#visit_tab').css('border-bottom','1px groove #D94A06');
			$('#visit').fadeIn(600);
		});
		 $('#contact_tab').click(function(){
		    tab_menu_func();
			$('#contact_tab').css('border-bottom','1px groove #D94A06');
			$('#contact').fadeIn(600);
		});
		
		$('#map_tab').click(function(){
		    tab_menu_func();
			$('#map_tab').css('border-bottom','1px groove #D94A06');
			$('#map').fadeIn(600);
			$('#map_canvas').fadeIn(100);
			initialize();
			//google.maps.event.addDomListener(window, 'load', initialize);
		});
});

function tab_menu_func(){
	  $('#tab_content div').each(function(index) {
                $(this).hide();
            });
			$('#tab_menu a').each(function(index) {
                $(this).css('border-bottom','1px dotted #D94A06');
        });
}
function initialize() {
	
        var mapOptions = {
          center: new google.maps.LatLng(-34.397, 150.644),
          zoom: 8,
		  mapTypeId:google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map_canvas"),
            mapOptions);
}



