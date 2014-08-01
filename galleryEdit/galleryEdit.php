<?php
include("../php_library/session.php");
   
   if(isset($_GET['categoryID']))
   {
       $categoryID=$_GET['categoryID'];
	   $_SESSION['categoryID']= $categoryID;
	}   
	else
       $categoryID=null;
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Διαχείριση Εκθέσεων</title>

<link href="../css/site.css" type="text/css" rel="stylesheet"/>
<link href="../gallery/css/gallery.css" type="text/css" rel="stylesheet"/>

<script type="text/javascript" src="../javascript/jquery-1.8.3.js"></script>
<script type="text/javascript" src="../tools/tapmodo-Jcrop-1902fbc/js/jquery.Jcrop.js"></script>
<script type="text/javascript" src="../javascript/json2.js"></script>
<script type="text/javascript" src="../javascript/site.js"></script>
<script type="text/javascript" src="javascript/galleryEdit.js"></script>

</head>

<body>
  
  
<?php

   include('../php_library/dbConnect.php');
   include("../php_library/header.php");
   echo '<div id="main_body">';
   
if($_SESSION['role']=='admin' && $_SESSION['mode']=='edit')
{
   
   if(isset($_GET['imageID']))
   {
	   $imgSrc="../photos/".$_GET['imageID'];
	   $imgID=$_GET['imageID'];
	   $result=sqlQuery("select * from image where Name='$imgID'");
	   $row=mysql_fetch_array($result);
	   echo '<div id="crop">
				 <img src="'.$imgSrc.'" id="target"/>
				 <div id="imgAreaDescription">
					<img class="flag" id="GR_FLAG" src="../assets/icons/greece_flag.gif"/><img class="flag" id="EN_FLAG" src="../assets/icons/united_kingdom_flag.gif"/><br/>
					<input type="text" id="GR_T" class="greek"/>
					<input type="text" id="EN_T" class="english"/>
					<textarea id="GR" class="greek">Περιγραφή</textarea>
					<textarea id="EN" class="english">Description</textarea>
					<button class="confirmDescription" id="'.$imgID.'">ΟΚ</button>
					<input id="imgAreaID" value="0" style="visibility:hidden"/>
				 </div>
				 <div id="imgDescription">
				    <img class="flag" id="GR_FLAG_D" src="../assets/icons/greece_flag.gif"/><img class="flag" id="EN_FLAG_D" src="../assets/icons/united_kingdom_flag.gif"/><br/>
					 <textarea class="GR" style="boder:1px solid black">'.$row['DescriptionGR'].'</textarea>
					 <textarea class="EN" style="display:none">'.$row['DescriptionEN'].'</textarea>
					 <button class="confirmImage" id="'.$imgID.'">Αποθήκευση</button>
			     </div>
				 <div id="coords" class="hidden">
				   <input type="text" id="X1"/>
				   <input type="text" id="Y1"/>
				   <input type="text" id="X2"/>
				   <input type="text" id="Y2"/>
				 </div>
			 </div>
			 <div id="areas">';
			 
			 $result=sqlQuery("select * from imagearea where ImageID='$imgID'");
			 
			 while($row=mysql_fetch_array($result))
			 {
				 echo '<div id="'.$row['AreaID'].'">
				         <label class="GR_T">'.$row['TitleGR'].'</label>
					     <label class="EN_T hidden">'.$row['TitleEN'].'</label>
					     <textarea class="GR hidden">'.$row['DescriptionGR'].'</textarea>
					     <textarea class="EN hidden" >'.$row['DescriptionEN'].'</textarea>
						 <input class="X1 hidden" value="'.$row['X1'].'"/>
					     <input class="Y1 hidden" value="'.$row['Y1'].'"/>
					     <input class="X2 hidden" value="'.$row['X2'].'"/>
					     <input class="Y2 hidden" value="'.$row['Y2'].'"/>
						 <img class="editDescription" src="../assets/icons/pencil.png"/>
						 <img class="deleteDescription" src="../assets/icons/erase.png"/>
				      </div>';
			 }
			 
			 echo'</div>';
			 
	   
   }
   else if(isset($_GET['categoryID']))
   {
	   $f=$_GET['categoryID'];
	   $result=sqlQuery("select * from category where CategoryID='$f'");
	   $row=mysql_fetch_array($result);
					 echo '<a href="'.$_SERVER['PHP_SELF'].'">Επιστροφή στη λίστα κατηγοριών</a>';
					 echo '<div id="info"> '.' 	
								<div id="categoryDescription">
								<img class="flag" id="GR_FLAG" src="../assets/icons/greece_flag.gif"/><img class="flag" id="EN_FLAG" src="../assets/icons/united_kingdom_flag.gif"/><br/>
								<input type="text" id="GR_T" class="greek" value="'.$row['TitleGR'].'" size="45"/>
								<input type="text" id="EN_T" class="english" value="'.$row['TitleEN'].'" size="45"/>';
				//---------------------------------------------------------------------				
				  echo '<select id="roomID">';
				  for($i=1;$i<5;$i++)
				  {
					   echo '<option ';
					   if($i==$row['RoomID'])
						  echo 'selected="selected"';
					   echo' value="'.$i.'">Χώρος'.$i.'</option>';
				   }
				   echo '</select><br/>';
				//--------------------------------------------------------------------- 
						   echo '<textarea id="GR" class="greek" rows="8" cols="50">'.$row['DescriptionGR'].'</textarea>
								<textarea id="EN" class="english" rows="8" cols="50">'.$row['DescriptionEN'].'</textarea>
								<button class="confirmCategory" id="'.$f.'" style="display:block">Αποθήκευση</button>
								<div id="message"></div>
								</div>
						   </div>';
					$subdir=opendir("../photos/$f/");
					$imgArray;
					echo '<ul class="gallery">';
				    echo '<li style="background-color:#D7D7D7; cursor:pointer"><img src="../assets/icons/list_add.png" id="add" /></li>';
					if($subdir!=false)
					{
					
					   
					   while($image=readdir($subdir))  
						 if(substr("$image", 0, 1) != ".")
						   if(is_file("../photos/$f/$image")==true)
						   {
								$ext=pathinfo($image,PATHINFO_EXTENSION);
								if($ext=="jpg" || $ext=="JPG" ||$ext=="jpeg" ||$ext=="JPEG" || $ext=="gif" || $ext=="png")
									$imgArray[]=$image;
							   
						   }
							 
					   closedir($subdir);
			  
					if(!isset($imgArray))
						echo "<p>Δεν υπάρχουν προς το παρόν φωτογραφίες. Θα προστεθούν το συντομότερο.</p>";		 
					else
					 {
					   $imagesCount=count($imgArray);
					  
					  for($j=0;$j<$imagesCount;$j++)      
					
						echo "<li id=\"$f/$imgArray[$j]\"><a rel=\"prettyPhoto[pp_gal]\" href=\"../photos/$f/$imgArray[$j]\"><img class=\"gallery\" src=\"../photos/$f/thumbnail/$imgArray[$j]\"/></a><img class=\"delete\" src=\"../assets/icons/delete.png\"/><img class=\"edit\" src=\"../assets/icons/pencil.png\"/></li>";		    
					
					   unset($imgArray);
					   
					  // echo "<li id=\"eventIDHidden\" style=\"visibility:hidden\">$f</li>";
					   echo '</ul>';
					 }
					}
	   
   }
   else
   {		
			$result=sqlQuery("select * from category");
			 
			echo '<div id="categoriesList">';
		    while($row=mysql_fetch_array($result))
				echo '<a href="galleryEdit.php?categoryID='.$row['CategoryID'].'">'.$row['TitleGR'].'</a><br/>';	
					 
			echo '</div>
				 <input type="text" id="newCategoryID" placeholder="Όνομα Κατηγορίας"/>
				 <input type="button" class="createCategory" value="Δημιουργία Κατηγορίας"/>';
					  
    }
}
  echo '</div>';
 // include("../php_library/footer.php");
?>
 
</body>
</html>