// JavaScript Document

 
 function setMap(slideNum)
 {
     var img=document.getElementById(slideNum);
     var imgSrc=img.getAttribute("src");	
     imgSrc=imgSrc.split('/');	
     imgSrc=imgSrc[imgSrc.length-2]+'/'+imgSrc[imgSrc.length-1];
     //alert(imgSrc);
	 var imgSrc2=imgSrc.replace(/([ !"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g,'\\$1');
	 //alert(imgSrc);
	 $imgWidth=$('#'+slideNum).width();
	 $imgHeight=$('#'+slideNum).height();
	 
	// alert($left+" "+$top);
	//var imgSrc2='Megan\\ Fox\\/megan_fox_in_jonah_hex-1920x1200\\.jpg';
	//alert(imgSrc+"-"+imgSrc2);
	//alert($('#'+imgSrc).html());
	 $("#"+imgSrc2).clone(true).attr("id","map"+slideNum).attr("name","map"+slideNum).appendTo('body');
	 /*$("#"+imgSrc2+" > area").each(function(i){
		    
		    $coords=$(this).attr("coords").split(',');
			
			$x1=Math.round($coords[0]*$imgWidth);
			$y1=Math.round($coords[1]*$imgHeight);
			$x2=Math.round($coords[2]*$imgWidth);
			$y2=Math.round($coords[3]*$imgHeight);
	
	       $coords=$x1+","+$y1+","+$x2+","+$y2;
		   //alert($coords);
	       $(this).attr("coords", $coords)	
		 });*/
	$("#map"+slideNum+" > area").each(function(i){
		    
		    $coords=$(this).attr("coords").split(',');
			
			$x1=Math.round($coords[0]*$imgWidth);
			$y1=Math.round($coords[1]*$imgHeight);
			$x2=Math.round($coords[2]*$imgWidth);
			$y2=Math.round($coords[3]*$imgHeight);
	
	       $coords=$x1+","+$y1+","+$x2+","+$y2;
		  // alert($coords);
	       $(this).attr("coords", $coords)	
		 });
	
	 img.setAttribute("usemap","#map"+slideNum); //+++++++++++++++++++++++++++++++++++++++++++
	 //img.className="map";
 }
 function unsetMap(slideNum)
 {
	 $("#map"+slideNum).remove();
 }
  
  
