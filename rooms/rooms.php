<?php
  include("../php_library/session.php");
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><?php if($_SESSION['language']=='GR') echo 'Χώροι'; else echo 'Rooms';?></title>

<link href="../css/site.css" type="text/css" rel="stylesheet"/>
<link rel="stylesheet" type="text/css" href="../plugins/mosaic/css/mosaic.css" />
<link rel="stylesheet" type="text/css" href="css/rooms.css" />
  
<script type="text/javascript" src="../javascript/jquery-1.8.3.js" /></script>
<script type="text/javascript" src="../plugins/mosaic/js/mosaic.1.0.1.js" /></script>
<script type="text/javascript" src="../javascript/site.js"></script>
<script type="text/javascript" src="javascript/rooms.js"></script>
</head>

<body>

	 <?php 
	 
	    include('../php_library/dbConnect.php');
        include('../php_library/files.php');
	    include("../php_library/header.php");
	 ?>
     
     <div id="main_body">
         
     <?php  
		 if(isset($_GET['id']) || isset($_SESSION['roomID'])) 
		 {
			if(isset($_GET['id']))
		       $roomID=$_GET['id'];
		    if(isset($_SESSION['roomID']))
			   $roomID=$_SESSION['roomID'];
			
			echo ' <div class="room_description">';
					  
					 if($language=='GR')
						  echo '<h4>Χώρος '.$roomID.'</h4>';
					 else if($language=='EN')
					      echo '<h4>Site '.$roomID.'</h4>';
					 
					 echo'<p>'.readContent("/../content/rooms/room".$roomID."/room".$roomID.$language.".txt").'</p>
						
				  </div>';
			
		    echo '<div id="mosaic">';     
      
         $result=sqlQuery("select CategoryID,Title". $language.",Description". $language." from category where RoomID='".$roomID."'");
       
     
        $i=0;
        while($row=mysql_fetch_array($result))
		{
		 echo '<div class="mosaic-block bar2">
		         <a href="../gallery/gallery.php#category'.$i.'/image0" target="_blank" class="mosaic-overlay">
				    <div class="details">
					  <h4>'.$row[1].'</h4>
					  <p>'.$row[2].'</p>
					</div>
				</a>
			    <div class="mosaic-backdrop"><img src="../plugins/mosaic/img/top-athens-national-museum.jpg"/></div>
		      </div>';
		  $i++;
		}
	  echo '</div>';	
	 }
   ?>
 
 </div>
 <?php
      include("../php_library/footer.php");
 ?>	
</body>
</html>