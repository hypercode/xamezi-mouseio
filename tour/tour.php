<?php
  include("../php_library/session.php");
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><?php if($_SESSION['language']=='GR') echo 'Ξενάγηση'; else echo 'Tour';?></title>

<link href="../css/site.css" type="text/css" rel="stylesheet"/>
<link href="css/tour.css" type="text/css" rel="stylesheet"/>

<script type="text/javascript" src="../javascript/jquery-1.8.3.js" /></script>
<script type="text/javascript" src="../javascript/site.js"></script>

</head>

<body>
	<?php
      include('../php_library/dbConnect.php');
	  include('../php_library/files.php');
	  include("../php_library/header.php");
    ?>
    <div id="main_body">
         
         <?php
		     
			 $roomsTitlesGr=array("Χώρος 1","Χώρος 2","Χώρος 3","Χώρος 4");
			 $roomsTitlesEN=array("Room 1","Room 2","Room 3","Room 4");
			 
			 for($i=1;$i<5;$i++)
			 {
			echo '<div class="room">
					 <div class="room_img">
					   <img src="../content/rooms/room'.$i.'/image.jpeg"/>
					 </div>
					 <div class="room_summary">';
					  
					 if($language=='GR')
						  echo '<h4>'.$roomsTitlesGr[$i-1].'</h4>';
					 else if($language=='EN')
					      echo '<h4>'.$roomsTitlesEN[$i-1].'</h4>';
					 
					 $content=readContent("/../content/rooms/room".$i."/room".$i.$language.".txt");
					 $length=strlen($content);
					 if($length>1500)
					 {
						  $content=substr($content,0,1500);
						  $content.=' .....';
					 }
					 echo'<p>'.$content.'</p>';
						
					 echo '<a href="../rooms/rooms.php?roomID='.$i.'">';
						 if($language=='GR')
							  echo 'Επισκεφτείτε τον χώρο';
						 else if($language=='EN')
							  echo 'Visit the site';
						 echo '</a>
					 </div>
				 </div>';
			 }
		  ?>
          
		
    </div>
    <?php
      include("../php_library/footer.php");
    ?>
    	
</body>
</html>