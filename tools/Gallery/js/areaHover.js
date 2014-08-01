// JavaScript Document

function posRelativeToElement(elem, ev){
     var $elem = $(elem),
     ePos = $elem.offset(),
     mousePos = {x: ev.pageX, y: ev.pageY};
     mousePos.x -= ePos.left + parseInt($elem.css('paddingLeft')) + parseInt($elem.css('borderLeftWidth'));
     mousePos.y -= ePos.top + parseInt($elem.css('paddingTop')) + parseInt($elem.css('borderTopWidth'));

    return mousePos;
};
$(document).ready(function(e) {
  
   
	$('area').mouseover(
	             function(e){
					           //alert("hover");
		                       $alt=e.target.alt.split("^^");
							   $description='<h4>'+$alt[0]+'</h4><p>'+$alt[1]+'</p>';
							   Position=posRelativeToElement('.mediaHolder1',e);
							   $cx=Position.x;
							   $cy=Position.y;
							   $("#X").val(Position.x);
							   $("#Y").val(Position.y);
							   //alert(e.target.getAttribute("coords"));
							   $coords=e.target.getAttribute("coords").split(',');
							   $slideNum=e.target.parentNode.id.split("map")[1];
							 //  alert($slideNum);
							  
							   $top=parseInt($('#'+$slideNum).css("top"),10);
							   $left=parseInt($('#'+$slideNum).css("left"),10);
							    //alert($left+" "+$top);
							 
							
							   $x1=+$coords[0] + $left;
							   $y1=+$coords[1] + $top;
							   $x2=+$coords[2] + $left ;
							   $y2=+$coords[3] + $top;
							   
							  // alert("x1:"+$x1+" y1:"+$y1);
							  
							   $("#areaHover").css("top",$y1+"px");
							   $("#areaHover").css("left",$x1+"px");
							   $("#areaHover").width($x2-$x1);
							   $("#areaHover").height($y2-$y1);
							   $("#areaHover").fadeIn('slow');
							   
							   $("#areaHoverMessage").empty().append( $description);
							   $("#areaHoverMessage").css("top",$cy+30);
							   $("#areaHoverMessage").css("left",$cx+30);
							   $("#areaHoverMessage").fadeIn('slow');
		                      });/*,
				    function(){
						       $("#areaHoverMessage").empty();
							   $("#areaHoverMessage").fadeOut('slow');
							   $("#areaHover").fadeOut('slow');
						       // alert("mouse out");
					          });*/
   
    $("#areaHover").mouseout(
	                 function(e){
						     $("#areaHoverMessage").empty();
							// $("#areaHoverMessage").fadeOut('slow');
							$("#areaHoverMessage").hide();
							// $("#areaHover").fadeOut('fast');
							$("#areaHover").hide();
						 });
	
});