<?php 
 $language=$_SESSION['language'];	  
?>

<div id="header">
    <div id="language_selector">
    <form method="post" action="<?php echo $_SERVER['PHP_SELF']; ?>">
      <input type="submit" name="submit_greek" value="ΕΛ" />
    </form>
    <form method="post" action="<?php echo $_SERVER['PHP_SELF']; ?>">
      <input type="submit" name="submit_english" value="EN" />
    </form>
    </div>
    <div id="logo_and_menu">
        <div id="logo">
          <img src="../assets/images/logo.png" />
        </div>
        <div id="nav_menu_header">
          <ul>
            <li>
            <a href="/museum/home/home.php">
			<?php if($language=='GR') echo 'Αρχική'; else echo 'Home';?>
            </a>
            </li>
            <li>
            <a href="/museum/history/history.php">
            <?php if($language=='GR') echo 'Ιστορία'; else echo 'History';?>
            </a>
            </li>
            <li>
            <a href="/museum/tour/tour.php">
           <?php if($language=='GR') echo 'Ξενάγηση'; else echo 'Tour';?>
            </a>
            </li>
            <?php 
			    if($_SESSION['role']=='admin' && $_SESSION['mode']=='edit')
				{
				  echo '<li><a href="/museum/galleryEdit/galleryEdit.php">';
						
				  if($language=='GR') 
				     echo 'Διαχείριση Εκθέσεων'; 
				  else echo 'Exhibitions Administration';		
						
				  echo '</a></li>';
			    }
			?>
            <li>
            <a href="/museum/information/information.php">
            <?php if($language=='GR') echo 'Πληροφορίες'; else echo 'Information';?>
            </a>
            </li>
          </ul>
        </div>
    </div>
    
</div>