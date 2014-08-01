<?php
  
  include("session.php");
  include('dbConnect.php');
   
  if(isset($_POST['file']) && $_SESSION['role']=='admin')
  {
	 $file="../photos/".$_POST['file'];
	 $thumb=split('/',$_POST['file']);
	 $thumbnail="../photos/".$thumb[0]."/thumbnail/".$thumb[1];

	 if(file_exists($file))
	    unlink($file);
		
	  if(file_exists($thumbnail))
	    unlink($thumbnail);
		
	sqlQuery("delete from image where Name='".$_POST['file']."'");
  }
  
  if(isset($_POST['imgArea']) && $_SESSION['role']=='admin')
  {
	  echo $_POST['imgArea'];
	  sqlQuery("delete from imagearea where AreaID='".$_POST['imgArea']."'");
  }

?>