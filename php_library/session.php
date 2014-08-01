<?php
  
  session_start();
  
   //------- LANGUAGE --------------------------
    if(!isset($_SESSION['language']))
     $_SESSION['language']="GR"; 
	 
	if(isset($_POST['submit_greek']))
	  $_SESSION['language']="GR"; 
	else if(isset($_POST['submit_english']))
	  $_SESSION['language']="EN";
	
   //------- ROLE -----------------------------
   if(!isset($_SESSION['role']))
    $_SESSION['role']='admin'; //visitor,user,admin
	
   //------- MODE -----------------------------
   if(!isset($_SESSION['mode']))
    $_SESSION['mode']='edit'; //view,edit
	  
   //----- ROOM ---------------------------
   if(!isset($_SESSION['roomID']))
      $_SESSION['roomID']=null;
   if(isset($_GET['roomID']))
      $_SESSION['roomID']=$_GET['roomID'];
  
?>