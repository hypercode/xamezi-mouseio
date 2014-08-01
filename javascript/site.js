// JavaScript Document

$(document).ready(function(e) {
	
	$(this).scrollTop(0);
	
    $("#nav_menu ul li a").hover(
	       function(){
		           $(this).stop().animate({color:"#f00"},1000);
		             },
		   function(){
			       $(this).stop().animate({color:"#333"},1000);
			         }
	);
	
});

function initializeDocumentDimensions()
{
	$windowHeight=$(window).innerHeight();
	$windowWidth=$(window).width();  
	$headerHeight=$('#header').height();
	$footerHeight=$('#footer').height();
	$mainBodyHeight=$('#main_body').height(); 
	$mainBodyWidth=$('#main_body').width();
	$fixedHeight=$windowHeight-$headerHeight-$footerHeight;
	
	//alert("window height: "+$windowHeight+"\n"+"document height: "+$bodyHeight);
	if($windowWidth<$mainBodyWidth)
	  $('body').width($mainBodyWidth); 
	if($mainBodyHeight < $fixedHeight)
	   $('#main_body').height($fixedHeight);
}
