<?php
	session_start();
	require 'dbconn.php';

	class Encounter {
		public function getcovidEncounter(){
			error_reporting(E_ERROR);

			$config = new Config();
	
			$response = array();

			$conn = $config->conn;

			if($conn->connect_error){
				return  $conn->connect_error;

			} else {
				 $query = 'SELECT  date, bookID, studentID, logType From transactionlog' ;
					// $query = 'SELECT name FROM userrecord';
				$data = array();
				if($stmt = $conn->prepare($query)){
					
					$result = array();
					$data = array();
					if($stmt->execute()){
						
						 $stmt->bind_result($date, $book, $student, $type );
								// $stmt->bind_result($name);
						$stmt->store_result();
						
						if($stmt->num_rows > 0){
							while($stmt->fetch()){

									//if($studentstatus == $studentstatusdynamic) {
                                       
										 $result['date'] = $date;
										 $result['bookID'] = $book;
									 $result['studentID'] = $student;
									
									 $result['type'] = $type;
									//what???????????? how????????/
									
										 $data[] = $result;		
								

								
								
							}
						
							$response['isSuccess'] = true;
							$response['value'] = $data;
							$response['msg'] = 'data fetch successfully';
						}
					} else {
						$response['isSuccess'] = false;
						$response['value'] = 0;
						$response['msg'] = $stmt->error;
					}
				} else {
					$response['isSuccess'] = false;
					$response['value'] = 0;
					$response['msg'] = $conn->error;
				}
				$conn->close();
			}

			return json_encode($response);
		}
	}

	$app = new Encounter();
// if(isset($_SESSION['name'])) {
		echo $app->getcovidEncounter();

// 	} else {
// 		echo 'ERROR: No direct access';
// 	}
	

?>