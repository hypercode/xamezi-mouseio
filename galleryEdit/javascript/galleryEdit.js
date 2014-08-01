
$(document).ready(function(){
	
	  //$('#target').Jcrop({onRelease: imgAreaComment});
	  
	//initializeDocumentDimensions();
	
	var jcrop_api;

    $('#target').Jcrop({
      onChange:   showCoords,
      onSelect:   showCoords,
      onRelease:  hideImgAreaComment,
	  onDblClick: imgAreaComment
    },function(){
      jcrop_api = this;
    });
	 
	 $("li").hover(
      function(){$("img.delete",this).fadeIn(400);$("img.edit",this).fadeIn(400);},
	  function(){$("img.delete",this).fadeOut(150);$("img.edit",this).fadeOut(150);}
                 );
	
	$(".createCategory").click(function(e){
		    var dataToSend=[
		                 ["Table","category"],
						 ["Function","create"],
						 ["CategoryID",$("#newCategoryID").val()]
	            ]
		 
		  var jsonString=JSON.stringify(dataToSend);
			$.ajax({
		           type:'POST',
				   url:'../php_library/dbSubmit.php',
				   //dataType:'json',
				   data:{data: jsonString},
				   success:function(data){
					   $("#newCategoryID").val("");
					   $('#categoriesList').append(data);
					 // $('#editor1').append(data);
				   }
		     });	
		});
	$(".confirmCategory").click(function(e){
		  
		  var dataToSend=[
		                 ["Table","category"],
						 ["Function","update"],
						 ["CategoryID",e.target.id],
						 ["TitleGR",$('#GR_T').val()],
						 ["TitleEN",$('#EN_T').val()],
						 ["DescriptionGR",$('#GR').val()],
						 ["DescriptionEN",$('#EN').val()],
						 ["RoomID",$('#roomID').val()]
		               ]
		 			  
		  var jsonString=JSON.stringify(dataToSend);
			$.ajax({
		           type:'POST',
				   url:'../php_library/dbSubmit.php',
				   //dataType:'json',
				   data:{data: jsonString},
				   success:function(data){
					   $('#message').empty().append(data);
					 // $('#editor1').append(data);
				   }
		     });	
		});		 
	$("img.delete").click(function(){
		var image=$(this).parent().attr("id");
		$imageli=$(this).parent();
		var deleted=false;
		
		$.ajax({
        type: "POST",
        url: "../php_library/delete.php",
        data: "file="+image,
        success: function(){ $imageli.remove();}
        });		 
	 });
	 
	 $("img.edit").click(function(){
		$imageID=$(this).parent().attr("id");
        window.open("galleryEdit.php?imageID="+$imageID,'_self');
	    });	
	 
	 $("#add").click( function(){
			var windowSizePos="width=900,height=600,top=100,left=400";
			//var eventID=$("#eventIDHidden").html();
            window.open( "../tools/FileUploader/index.html","uploader",windowSizePos);
			uploader.moveTo(300,100);
    });	
	
	
	$('.flag').click(function(e){
		   $flag=e.target.id;
		   
		   if($flag=="GR_FLAG")
		   {
			   $('.english').hide();
			   $('.greek').show();
			   $('#EN_FLAG').css("border","0");
			   $('#GR_FLAG').css("border","2px groove #D94A06");
			   
		   }
		   if($flag=="EN_FLAG")
		   {
			   $('.greek').hide();
			   $('.english').show();
			   $('#GR_FLAG').css("border","0");
			   $('#EN_FLAG').css("border","2px groove #D94A06");
		   }
		   if($flag=="GR_FLAG_D")
		   {
			   $id=e.target.parentNode.id;
			   $('#'+$id).children('.EN').hide();
			   $('#'+$id).children('.GR').show();
			   
			   $('#EN_FLAG_D').css("border","0");
			   $('#GR_FLAG_D').css("border","2px groove #D94A06");
			  
		   }
		   if($flag=="EN_FLAG_D")
		   {
			   $id=e.target.parentNode.id;
			   $('#'+$id).children('.GR').hide();
			   $('#'+$id).children('.EN').show();
			   
			   $('#GR_FLAG_D').css("border","0");
			   $('#EN_FLAG_D').css("border","2px groove #D94A06");
			}
		});
		
	$('.confirmDescription').live('click',function(e){
		 
		 
		  var dataToSend=[
		                 ["Table","imagearea"],
						 ["ImageAreaID",$("#imgAreaID").val()],
						 ["ImageID",e.target.id],
						 ["DescriptionGR",$("#GR").val()],
						 ["DescriptionEN",$("#EN").val()],
						 ["X1",$("#X1").val()],
						 ["Y1",$("#Y1").val()],
						 ["X2",$("#X2").val()],
						 ["Y2",$("#Y2").val()],
						 ["TitleGR",$("#GR_T").val()],
						 ["TitleEN",$("#EN_T").val()]
		               ]
					  
		var jsonString=JSON.stringify(dataToSend);
			$.ajax({
		           type:'POST',
				   url:'../php_library/dbSubmit.php',
				   //dataType:'json',
				   data:{data: jsonString},
				   success:function(data){				  
					  $('#areas').empty().append(data);
					  hideImgAreaComment();
					  jcrop_api.release();
				   }
		     });	
		});
		
	 $('.confirmImage').click(function(e){
		  var dataToSend=[
		                 ["Table","image"],
						 ["ImageID",e.target.id],
						 ["DescriptionGR",$("#imgDescription").children('.GR').val()],
						 ["DescriptionEN",$("#imgDescription").children('.EN').val()]
		               ]
					  
		var jsonString=JSON.stringify(dataToSend);
			$.ajax({
		           type:'POST',
				   url:'../php_library/dbSubmit.php',
				   //dataType:'json',
				   data:{data: jsonString},
				   success:function(data){
					   //alert(data);
					 // $('#editor1').append(data);
				   }
		     });	
		 
	 });
	 $('.editDescription').live('click',function(e){
		    
			$imgWidth=$("#target").width();
	        $imgHeight=$("#target").height();
			
			$id=e.target.parentNode.id;
	        $TitleGR=$('#'+$id).children('.GR_T').html();
			$TitleEN=$('#'+$id).children('.EN_T').html();
			$DescriptionGR=$('#'+$id).children('.GR').val();
			$DescriptionEN=$('#'+$id).children('.EN').val();
			$X1=$('#'+$id).children('.X1').val();
			$X2=$('#'+$id).children('.X2').val();
			$Y1=$('#'+$id).children('.Y1').val();
			$Y2=$('#'+$id).children('.Y2').val();
	        
			
			$('#imgAreaID').val($id);
			$('#GR_T').val( $TitleGR);
			$('#EN_T').val($TitleEN);
			$('#GR').val($DescriptionGR);
			$('#EN').val($DescriptionEN);
			$('#X1').val($X1);
			$('#Y1').val($Y1);
			$('#X2').val($X2);
			$('#Y2').val($Y2);
			

			$x1=Math.round($X1*$imgWidth);
			$y1=Math.round($Y1*$imgHeight);
			$x2=Math.round($X2*$imgWidth);
			$y2=Math.round($Y2*$imgHeight);
			
			var coords=[$x1,$y1,$x2,$y2];
		    jcrop_api.setSelect(coords);
			$('#imgAreaDescription').show();
	        $('#imgAreaDescription').css("top",$y1);
	        $('#imgAreaDescription').css("left",$x1);
		   
		 });
		 
		  $('.deleteDescription').live('click',function(e){
			  
			  
			  $imgAreaID=e.target.parentNode.id;
			  $.ajax({
					type: "POST",
					url: "../php_library/delete.php",
					data: "imgArea="+$imgAreaID,
					success: function(data){ 
					   $("#"+$imgAreaID).remove();
					   //alert(data);
					    }
					});	
			  });
});

  function imgAreaComment(c)
  {
	  $imgWidth=$("#target").width();
	  $imgHeight=$("#target").height();
	  $X1=c.x/$imgWidth;
	  $Y1=c.y/$imgHeight;
	  $X2=c.x2/$imgWidth;
	  $Y2=c.y2/$imgHeight;
	  $('#imgAreaDescription').show();
	  $('#imgAreaDescription').css("top",c.y);
	  $('#imgAreaDescription').css("left",c.x);
	  
	  $('#X1').val($X1);
      $('#Y1').val($Y1);
	  $('#X2').val($X2);
	  $('#Y2').val($Y2);
	  	  
  }
  // Simple event handler, called from onChange and onSelect
  // event handlers, as per the Jcrop invocation above
  function showCoords(c)
  {
    $('#x1').val(c.x);
    $('#y1').val(c.y);
    $('#x2').val(c.x2);
    $('#y2').val(c.y2);
    $('#w').val(c.w);
    $('#h').val(c.h);
  };

  function hideImgAreaComment()
  {
     $('#imgAreaDescription').hide();
	 
	 $('#imgAreaID').val("0");
	 $('#GR_T').val("");
	 $('#EN_T').val("");
	 $('#GR').val("");
	 $('#EN').val("");
	 $('#X1').val("");
	 $('#Y1').val("");
	 $('#X2').val("");
	 $('#Y2').val("");
	 
	 
  };
  