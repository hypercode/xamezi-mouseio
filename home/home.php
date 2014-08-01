<?php
  include("../php_library/session.php");
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

<title><?php if($_SESSION['language']=='GR') echo 'Αρχική'; else echo 'Home';?></title>

<link href="../css/site.css" type="text/css" rel="stylesheet"/>
<link href="css/home.css" type="text/css" rel="stylesheet"/>

<script type="text/javascript" src="../javascript/jquery-1.8.3.js" /></script>
<script type="text/javascript" src="../javascript/site.js"></script>
<script type="text/javascript" src="javascript/home.js"></script>
</head>

<body>
    
     <?php
      include('../php_library/dbConnect.php');
	  include('../php_library/files.php');
	  include("../php_library/header.php");
	  
	  echo '<div id="main_body">';	  
	  echo "<p>".readContent("/../content/home/home".$language.".txt")."</p>";
	  echo '</div>';
	  
	  echo '<div id="image_slider"></div>
	        <div id="images">
				 <img src="../content/home/image_slider/img_1.JPG">
				 <img src="../content/home/image_slider/img_2.jpg">
				 <img src="../content/home/image_slider/img_3.jpg">
	        </div>';
      include("../php_library/footer.php");
    ?>
    	
</body>
</html>