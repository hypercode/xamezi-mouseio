<?php 

function writeHtml($filename,$id,$data)//+++++++++++++++++++++++++++++++
{
		 $file=getcwd();
		 $file.="/../article/articles/".$id."/".$filename.".html";
		 //echo "<br/>SAVED";
	     $handle = fopen($file, 'w');
		 fwrite($handle,$data);
		 fclose($handle);		
}
function readContent($fileName)
{        
         $file=getcwd();
	     $file.=$fileName;
		 
		 if(file_exists($file))
		 {
             $handle = fopen($file, 'r');
		     $data = fread($handle,filesize($file)+1);
             fclose($handle);
			 
             return $data;
		 }
		 
		 return null;
}
function makeDir($path)
{
      $ret=mkdir($path);
	  return $ret === true || is_dir($path);
}
function deleteDir($dir)//+++++++++++++++++++++++++++++++
{
  if (is_dir($dir)) {
    $objects = scandir($dir);
    foreach ($objects as $object) {
      if ($object != "." && $object != "..") {
        if (filetype($dir."/".$object) == "dir") 
           deleteDir($dir."/".$object); 
        else unlink   ($dir."/".$object);
      }
    }
    reset($objects);
    rmdir($dir);
  }
}
function getEventImages($eventID)
	  {
		  $f=$eventID;
		  $subdir=opendir("../event/events/$f");
		  //$subdir=opendir("events/$f");
		  $imgArray=NULL;
		  
		  if($subdir!=false)
		  {
		   while($image=readdir($subdir))  
			 if(substr("$image", 0, 1) != ".")
			   if(is_file("../event/events/$f/$image")==true)
			   {
					$ext=pathinfo($image,PATHINFO_EXTENSION);
					if($ext=="jpg" || $ext=="JPG" ||$ext=="jpeg" ||$ext=="JPEG" || $ext=="gif" || $ext=="png")
						$imgArray[]=$image;  
			   }
							 
					   closedir($subdir);
		  }
		  
		  return $imgArray;
}

?>