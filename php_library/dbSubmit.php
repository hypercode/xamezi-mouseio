<?php

  include("session.php");
  include('dbConnect.php');

  //$eventID=$_SESSION['eventID'];
  
  $data = json_decode(stripslashes($_POST['data']),true);
 
  $table=$data[0][1];

  $sql="";
 

  if($table=='image' && $_SESSION['role']=='admin')
  {
	  $Name=$data[1][1];
	  $DescriptionGR=$data[2][1];
	  $DescriptionEN=$data[3][1]; 
	  
	  sqlQuery("update image set DescriptionGR='$DescriptionGR' ,DescriptionEN='$DescriptionEN' where Name='$Name'");
	  
  }
  if($table=='imagearea' && $_SESSION['role']=='admin')
  {
	$AreaID=$data[1][1];
	$ImageID=$data[2][1];
	$DescriptionGR=$data[3][1];
	$DescriptionEN=$data[4][1]; 
	$X1=$data[5][1];
	$Y1=$data[6][1]; 
	$X2=$data[7][1]; 
	$Y2=$data[8][1];  
	$TitleGR=$data[9][1];  
	$TitleEN=$data[10][1];  

	if($AreaID==0)
	  sqlQuery("insert into imagearea (ImageID,DescriptionGR,DescriptionEN,X1,Y1,X2,Y2,TitleGR,TitleEN) values ('$ImageID','$DescriptionGR','$DescriptionEN',$X1,$Y1,$X2,$Y2,'$TitleGR','$TitleEN') ");

	else
	  sqlQuery("update imagearea set DescriptionGR='$DescriptionGR' ,DescriptionEN='$DescriptionEN',TitleGR='$TitleGR',TitleEN='$TitleEN' where AreaID=$AreaID"); 
	  
	  
	  $result=sqlQuery("select * from imagearea where ImageID='$ImageID'");
	  
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
	  	       		
  }
  if($table=='category' && $_SESSION['role']=='admin')
  {
	$function=$data[1][1];
	$CategoryID=$data[2][1];
	
		if($function=="update")
		{
			$TitleGR=$data[3][1];  
			$TitleEN=$data[4][1];
			$DescriptionGR=$data[5][1];
			$DescriptionEN=$data[6][1]; 
			$RoomID=$data[7][1]; 
			
		   
		   sqlQuery("update category set TitleGR='$TitleGR',TitleEN='$TitleEN',DescriptionGR='$DescriptionGR' ,DescriptionEN='$DescriptionEN',RoomID='$RoomID' where CategoryID='$CategoryID'");
		   
		   echo 'data saved';
	   }
	   if($function=="create")
	   {
		   sqlQuery("insert into category (CategoryID) values ('$CategoryID')");
		   
		   mkdir("./gallery/".$CategoryID, 0700);
		   echo '<a href="galleryEdit.php?categoryID='.$CategoryID.'" target="_blank">'.$CategoryID.'</a><span style="color:red;font-size:10px">νέο<span><br/>';
	   }
	  
  }
  
?>