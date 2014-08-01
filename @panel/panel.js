// JavaScript Document

$(document).ready(function(){
	
	$('.popup').ready(function() {
		
		  $height=$(window).height();
          $('.popup').css("height",$height);
       });
	   
	 $('#panel').click(function(){
		    $('.popup').animate({right:'0px'},1000,function(){});
		 });
});