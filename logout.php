<?php
session_start();  
session_unset();  
session_destroy();  
header('Location: logIn.html'); 
exit();

	// session_start();
	// // remove all session variables
	// session_unset(); 

	// // destroy the session 
	// session_destroy(); 
?>
