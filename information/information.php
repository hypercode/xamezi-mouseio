<?php
  include("../php_library/session.php");
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><?php if($_SESSION['language']=='GR') echo 'Πληροφορίες'; else echo 'Informations';?></title>

<link href="../css/site.css" type="text/css" rel="stylesheet"/>
<link href="css/information.css" type="text/css" rel="stylesheet"/>

<script type="text/javascript" src="../javascript/jquery-1.8.3.js" /></script>
<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCYJ5AIxaiUouXKL6WSMMVPlJy3ivPkBm8&sensor=false"></script>
<script type="text/javascript" src="../javascript/site.js"></script>
<script type="text/javascript" src="javascript/information.js"></script>

</head>

<body>
	<?php
      include('../php_library/dbConnect.php');
	  include("../php_library/header.php");
    ?>
    <div id="main_body">
         <div id="tab_menu">
           <a href="#" id="info_tab"><?php if($language=='GR') echo 'Διοικητικές Πληροφορίες'; else echo '	Administrative Information';?></a>
           <a href="#" id="visit_tab"><?php if($language=='GR') echo 'Πληροφορίες Επίσκεψης'; else echo 'Visit Information';?></a>
           <a href="#" id="contact_tab"><?php if($language=='GR') echo 'Φόρμα Επικοινωνίας'; else echo 'Contact Form';?></a>
           <a href="#" id="map_tab"><?php if($language=='GR') echo 'Τοποθεσία - Χάρτης'; else echo 'Location - Map';?></a>
         </div>
         <div id="tab_content">
                 <div id="info" >
                    <?php if($language=='GR') echo '<h4>Διοικητικές Πληροφορίες</h4>'; else echo '	<h4>Administrative Information</h4>';?>
                       <table> 
                         <tr> 
                            <td><label><?php if($language=='GR') echo 'Τηλέφωνο: '; else echo 'Telephone: ';?></label></td><td>+30 210 35678</td> 
                         </tr> 
                         <tr> 
                            <td></td><td>+30 6978401234</td> 
                         </tr> 
                         <tr> 
                            <td><label><?php if($language=='GR') echo 'Email: '; else echo 'Email: ';?></label></td><td>info@syllogos.gr</td> 
                         </tr> 
                         <tr> 
                            <td><label><?php if($language=='GR') echo 'Διεύθυνση: '; else echo 'Address: ';?></label></td><td>Πατησίων 44, Τ.Κ. 33333, Κρήτη</td> 
                         </tr>
                       </table> 
                 </div>
                 <div id="visit">
                 <?php if($language=='GR') echo '<h4>Πληροφορίες Επίσκεψης</h4>'; else echo '	<h4>Visit Information</h4>';?>
                 <p>Δευτέρα: 13:00-20:00<br/> 
                  Τρίτη-Κυριακή: 09:00-16:00
                </p>
                 </div>
                 <div id="contact">
                   
   <form action="contact.php" method="post">
                      <?php if($language=='GR') echo '<h4>Φόρμα Επικοινωνίας</h4>'; else echo '	<h4>Contact Form</h4>';?> 
                      <table> 
                          <tr> 
                             <td><label>Όνομα</label></td><td><input class="textbox" name="userName" type="text" size="30" maxlength="30"></td> 
                          </tr> 
                          <tr> 
                             <td><label>E-mail</label></td><td><input class="textbox" name="userMail" type="email" size="30" maxlength="50"></td> 
                          </tr> 
                          <tr> 
                             <td><label>Θέμα</label></td><td><input class="textbox" name="mailSubject" type="text" size="30" maxlength="50"></td> 
                          </tr> 
                          <tr> 
                             <td><label>Μήνυμα</label></td><td><textarea class="textbox" name="mailBody" cols="50" rows="10"></textarea></td> 
                          </tr> 
                          <tr> 
                             <td></td><td><input  class="textbox" name="send" type="submit" value="Αποστολή" /><input  class="textbox" name="reset" type="reset" value="Ακύρωση" /></td> 
                          </tr> 
                      </table> 
   </form> 
                 </div>
                 <div id="map">
					 <?php if($language=='GR') echo '<h4>Τοποθεσία - Χάρτης</h4>'; else echo '	<h4>Location - Map</h4>';?> 
                     <div id="map_canvas"></div>
                 </div>
         </div>
    </div>
    <?php
      include("../php_library/footer.php");
    ?>
    	
</body>
</html>