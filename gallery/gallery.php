<?php
  include("../php_library/session.php");
  include('../php_library/dbConnect.php');
?>

<!DOCTYPE html>
<html lang="en">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title><?php if($_SESSION['language']=='GR') echo 'Προβολή'; else echo 'Gallery';?></title>
          
        <link rel="stylesheet" type="text/css" href="../tools/Gallery/css/flashblock.css" />
        <link rel="stylesheet" type="text/css" href="../tools/Gallery/css/videoPlayer.css" />
        <link rel="stylesheet" type="text/css" href="../tools/Gallery/css/audioPlayer_tr.css" />
        <link rel="stylesheet" type="text/css" href="../tools/Gallery/css/playlistBottomInside.css" />
        <link rel="stylesheet" type="text/css" href="../tools/Gallery/css/areaHover.css" />
        <!--<link rel="stylesheet" type="text/css" href="css/gallery.css" />-->
        <!--[if lte IE 8 ]><link rel="stylesheet" type="text/css" href="css/ie.css" /><![endif]-->
        
        <script type="text/javascript" src="../tools/Gallery/js/jquery-1.9.1.min.js"></script>
        
        <script type="text/javascript" src="../tools/Gallery/js/jquery.easing.1.3.js"></script>
        <script type="text/javascript" src="../tools/Gallery/js/jquery.address.js"></script>
        <script type="text/javascript" src="../tools/Gallery/js/jquery.cj-swipe.js"></script>
        <script type="text/javascript" src="../tools/Gallery/js/swfobject.js"></script>
        <script type="text/javascript" src="../tools/Gallery/js/froogaloop.js"></script>
        <script type="text/javascript" src="http://www.youtube.com/player_api"></script>
        <script type="text/javascript" src="../tools/Gallery/js/jquery.apYoutubePlayer.min.js"></script>
        <script type="text/javascript" src="../tools/Gallery/js/jquery.apVimeoPlayer.min.js"></script>
        <script type="text/javascript" src="../tools/Gallery/js/jquery.videoGallery.min.js"></script>
        <script type="text/javascript" src="../tools/Gallery/js/soundmanager2-nodebug-jsmin.js" ></script>
        <script type="text/javascript" src="../tools/Gallery/js/jquery.apPlaylistManager.min.js"></script>
        <script type="text/javascript" src="../tools/Gallery/js/jquery.apTextScroller.min.js"></script>
        <script type="text/javascript" src="../tools/Gallery/js/jquery.html5audio.min.js"></script>
        <script type="text/javascript" src="../tools/Gallery/js/jquery.multiGallery.min.js"></script>
       
       
        <script type="text/javascript" src="../tools/Gallery/js/gallery_settings.js"></script>
        
        <script type="text/javascript" src="../tools/Gallery/js/areaHover.js"></script>
		<script type="text/javascript">
		
			//gallery instances
			var gallery1;  
			
			jQuery(document).ready(function($) {
				jsReady = true;
				gallery1 = $('#componentWrapper').multiGallery(kb_settings, ap_settings);
				kb_settings = null;
				ap_settings = null;
			
			});
		
        </script>
      
        <script type="text/javascript" src="../tools/Gallery/js/gallery_functions.js"></script>
	
  </head>
      <body>  
      
         <!-- wrapper for the whole component -->
         <div id="areaHoverMessage"></div>
         <div id="areaHover"></div>
         
          
         <div id="componentWrapper">
         
          	  <div class="componentHolder">
         
                  <div class="mediaHolder1"></div>
                  <div class="mediaHolder2"></div>
                      
                  <!-- playlist -->
                  <div class="componentPlaylist">
                      
                     <div class="menuHolder">
                         <div class="menuWrapper">
                         </div>
                     </div>
                     
                     <div class="thumbHolder">
                         <div class="thumbWrapper">
<?php
						    
                    $language=$_SESSION['language'];
					$subdir=opendir("../photos/");
					$categoriesArray;
					$categoriesTitles;
					
					if($subdir!=false)
					{
					   
					   $result=sqlQuery('select CategoryID,Title'.$language.' from category'); 
					   while($row=mysql_fetch_array($result))
					   {
					     $categoriesArray[]=$row[0];
						 $categoriesTitles[]=$row[1];
					   }
					  
					   $Count=count($categoriesArray);
					  
					  
					  for($j=0;$j<$Count;$j++)  
					  {    
						
						echo '<div class="playlist" data-address="category'.$j.'" data-title="'.$categoriesTitles[$j].'" data-transitionType="alpha" data-imageFitMode="fit-outside" data-duration="4000" data-transitionTime="1000" data-transitionEase="easeOutSine" data-bgColor="#e5e5e5" data-playlistSize="165">
                                  <ul> ';   
								  
									$subdir=opendir("../photos/$categoriesArray[$j]/");
								$imgArray;
							
								if($subdir!=false)
								{
								
								   
								   while($image=readdir($subdir))  
									 if(substr("$image", 0, 1) != ".")
									   if(is_file("../photos/$categoriesArray[$j]/$image")==true)
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
								  
								  for($k=0;$k<$imagesCount;$k++)  
								  {    	
								        $imgName=$categoriesArray[$j]."/".$imgArray[$k];
										
										$result=sqlQuery("select Description". $language." from image where Name='$imgName'");
			                       									
										$row=mysql_fetch_array($result);
															
										echo '<li id="parenT" data-address="image'.$k.'" class="playlistItem2" data-imagePath="../photos/'.$categoriesArray[$j].'/'.$imgArray[$k].'"  data-description="'.$row[0].'"><a href="#" ><img class="playlistThumb" src="../photos/'.$categoriesArray[$j].'/thumbnail/'.$imgArray[$k].'" width="130" height="80" alt=""/></a></li>';	
										
										
								  }
								   echo '</ul> 
					
                                          </div>'; 
								   for($k=0;$k<$imagesCount;$k++)
								   {
									    $imgName=$categoriesArray[$j]."/".$imgArray[$k];
										//$imgName=$imgArray[$k];
									    echo '<map name="'.$imgName.'" id="'.$imgName.'">';
										
										$result=sqlQuery("select Title". $language.",Description". $language.",X1,Y1,X2,Y2 from imagearea where ImageID='$imgName'");
										 while($row=mysql_fetch_array($result))
										    echo '<area shape="rect" coords="'.$row['X1'].'
,'.$row['Y1'].','.$row['X2'].','.$row['Y2'].'" href="#"  alt="'.$row[0].' ^^ '.$row[1].'" />';

										echo '</map>';
								    }						
								   unset($imgArray);
								
								 }
					            }
					  }
					   unset($categoriesArray);
					
					 
				}
                         
?>     
                                                
                        </div>
                     </div>  
                                     
                     <!-- menu buttons -->
                     <div class="prevMenuBtn"><img src='../tools/Gallery/media/data/gallery_icons/playlist_prev_h.png' width='12' height='18' alt=''/></div>   
                     <div class="nextMenuBtn"><img src='../tools/Gallery/media/data/gallery_icons/playlist_next_h.png' width='12' height='18' alt=''/></div> 
                     
                     <!-- thumb buttons -->
                     <div class="prevThumbBtn"><img src='../tools/Gallery/media/data/gallery_icons/playlist_prev_h.png' width='12' height='18' alt=''/></div>   
                     <div class="nextThumbBtn"><img src='../tools/Gallery/media/data/gallery_icons/playlist_next_h.png' width='12' height='18' alt=''/></div>  
                     
                     <!-- playlist toggle -->
                     <div class="playlist_toggle"><img src='../tools/Gallery/media/data/gallery_icons/plus.png' width='30' height='30' alt='playlist_toggle'/></div>
                  
                  </div>
                  
              </div> 
              
              <!-- fullscreen btn (automatically removed if browser doesnt support fullscreen) -->
              <div class="gallery_fullscreen"><img src='../tools/Gallery/media/data/gallery_icons/fullscreen_enter.png' width='30' height='30' alt=''/></div>
              
             
              <!-- slideshow controls - previous,pause/play,next -->
              <div class="slideshow_controls">
              	  <div class="controls_next"><img src='../tools/Gallery/media/data/gallery_icons/next.png' width='30' height='30' alt='controls_next'/></div>
                  <div class="controls_toggle"><img src='../tools/Gallery/media/data/gallery_icons/play.png' width='30' height='30' alt='controls_toggle'/></div>
                  <div class="controls_prev"><img src='../tools/Gallery/media/data/gallery_icons/prev.png' width='30' height='30' alt='controls_prev'/></div>
              </div>
              
              <!-- data controls - link/description -->
              <div class="data_controls">
                  <div class="info_toggle"><img src='../tools/Gallery/media/data/gallery_icons/info.png' width='30' height='30' alt='info_toggle'/></div>
                  <div class="link_toggle"><img src='../tools/Gallery/media/data/gallery_icons/link.png' width='30' height='30' alt='link_toggle'/></div>
              </div>
              <!-- description holder -->
              <div class="info_holder"></div>
              
              <!-- preloader for images -->
              <div class="componentPreloader"></div>  
              
            
        </div> 
   		<!-- public API -->
    	<div id='publicFunctions'>
       		<p>PUBLIC API</p><br/>
            <ul>
                 <!-- toggle slideshow, (pass true (play), false (stop) as parameter, or none for simple toggle). -->
                <li><a href='#' onClick="gallery1.toggleSlideshow(); return false;">toggle slideshow</a></li>
                
                <!-- toggle playlist (open /close) -->
                <li><a href='#' onClick="gallery1.togglePlaylist(); return false;">toggle playlist</a></li>
                
                <!-- open next media -->
                <li><a href='#' onClick="gallery1.nextItem(); return false;">next media</a></li>
                
                <!-- open previous media -->
                <li><a href='#' onClick="gallery1.previousItem(); return false;">previous media</a></li>
                
                <!-- Open media, pass number (counting starts from 0), or data-address as string (for deeplink). -->
                <li><a href='#' onClick="gallery1.loadItem(2); return false;">Open media number 2</a></li>
                <li><a href='#' onClick="gallery1.loadItem('image5'); return false;">Open media 'image5'</a></li>
                
                <!-- Open new category, pass number (counting starts from 0), or data-address as string (for deeplink).
                This will open first image in category. -->
                <li><a href='#' onClick="gallery1.loadCategory(2); return false;">Open category number 2</a></li>
                <li><a href='#' onClick="gallery1.loadCategory('wellness_reveal'); return false;">Open category name 'wellness_reveal'</a></li>
                
            </ul>
         </div>
    
     </body>
</html>