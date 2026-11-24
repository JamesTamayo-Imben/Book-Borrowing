<?php

// session_start();
// require 'dbconn.php';

// date_default_timezone_set('Asia/Manila');

// use PHPMailer\PHPMailer\PHPMailer;
// use PHPMailer\PHPMailer\Exception;

// require 'vendor/autoload.php'; // Include PHPMailer if using Composer

// class Encounter {
//     public function getcovidEncounter() {
//         error_reporting(E_ERROR);

//         $config = new Config();
//         $response = array();
//         $conn = $config->conn;

//         if ($conn->connect_error) {
//             return $conn->connect_error;
//         } else {
//             $query = 'SELECT bookID, borrowedDate, returnDate, studentID FROM borrowedbook';
//             $data = array();
            
//             if ($stmt = $conn->prepare($query)) {
//                 $result = array();
//                 $data = array();

//                 if ($stmt->execute()) {
//                     $stmt->bind_result($book, $borrowD, $returnD, $student);
//                     $stmt->store_result();

//                     if ($stmt->num_rows > 0) {
//                         while ($stmt->fetch()) {
//                             $currentDate = date('Y-m-d');
                            
//                             if ($returnD === $currentDate) {
//                                 $conn->begin_transaction();

//                                 try {
//                                     $overdueQuery = 'INSERT INTO overduebook (bookID, borrowedDate, returnDate, studentID) VALUES (?, ?, ?, ?)';
//                                     if ($overdueStmt = $conn->prepare($overdueQuery)) {
//                                         $overdueStmt->bind_param('ssss', $book, $borrowD, $returnD, $student);
//                                         if (!$overdueStmt->execute()) {
//                                             throw new Exception('Failed to insert into overdue table.');
//                                         }
//                                         $overdueStmt->close();
//                                     }

//                                     $deleteQuery = 'DELETE FROM borrowedbook WHERE bookID = ? AND studentID = ?';
//                                     if ($deleteStmt = $conn->prepare($deleteQuery)) {
//                                         $deleteStmt->bind_param('ss', $book, $student);
//                                         if (!$deleteStmt->execute()) {
//                                             throw new Exception('Failed to delete from borrowedbook table.');
//                                         }
//                                         $deleteStmt->close();
//                                     }

//                                     $emailQuery = 'SELECT email FROM student WHERE studentID = ?';
//                                     if ($emailStmt = $conn->prepare($emailQuery)) {
//                                         $emailStmt->bind_param('s', $student);
//                                         if ($emailStmt->execute()) {
//                                             $emailStmt->bind_result($studentEmail);
//                                             if ($emailStmt->fetch()) {
//                                                 // Use PHPMailer for email
//                                                 $mail = new PHPMailer(true);

//                                                 $mail->isSMTP();
//                                                 $mail->Host = 'smtp.gmail.com';
//                                                 $mail->SMTPAuth = true;
//                                                 $mail->Username = 'Jim Jim';
//                                                 $mail->Password = '';
//                                                 $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
//                                                 $mail->Port = 587;

//                                                 $mail->setFrom('jimj87313@gmail.com', 'Library');
//                                                 $mail->addAddress($studentEmail);

//                                                 $mail->isHTML(false);
//                                                 $mail->Subject = "Book Return Reminder";
//                                                 $mail->Body = "Dear Student,\n\nThis is a reminder to return the book with ID $book that you borrowed on $borrowD. The due date is today ($currentDate).\n\nThank you!";

//                                                 $mail->send();
//                                             }
//                                         }
//                                         $emailStmt->close();
//                                     }

//                                     $conn->commit();
//                                 } catch (Exception $e) {
//                                     $conn->rollback();
//                                     $response['isSuccess'] = false;
//                                     $response['msg'] = $e->getMessage();
//                                     return json_encode($response);
//                                 }
//                             }
//                         }

//                         $response['isSuccess'] = true;
//                         $response['msg'] = 'Data fetched successfully.';
//                     }
//                 }
//             }

//             $conn->close();
//         }

//         return json_encode($response);
//     }
// }

// $app = new Encounter();
// echo $app->getcovidEncounter();




session_start();
require 'dbconn.php';

date_default_timezone_set('Asia/Manila');

class Encounter {
    public function getcovidEncounter() {
        error_reporting(E_ERROR);

        $config = new Config();
        $response = array();
        $conn = $config->conn;

        if ($conn->connect_error) {
            return $conn->connect_error;
        } else {
            $query = 'SELECT bookID, borrowedDate, returnDate, studentID FROM borrowedbook';
            $data = array();
            
            if ($stmt = $conn->prepare($query)) {
                $result = array();
                $data = array();

                if ($stmt->execute()) {
                    $stmt->bind_result($book, $borrowD, $returnD, $student);
                    $stmt->store_result();

                    if ($stmt->num_rows > 0) {
                        while ($stmt->fetch()) {
                            // checheck kung ung current date ay same sa returndate
                            $currentDate = date('Y-m-d');
                            
                            if ($returnD === $currentDate) {
                                // tatanggalin pag true tas ililipat overduebook table
                                $conn->begin_transaction();

                                try {
                                    $overdueQuery = 'INSERT INTO overduebook (bookID, borrowedDate, returnDate, studentID) VALUES (?, ?, ?, ?)';
                                    if ($overdueStmt = $conn->prepare($overdueQuery)) {
                                        $overdueStmt->bind_param('ssss', $book, $borrowD, $returnD, $student);
                                        if (!$overdueStmt->execute()) {
                                            throw new Exception('Failed to insert into overdue table.');
                                        }
                                        $overdueStmt->close();
                                    } else {
                                        throw new Exception('Failed to prepare overdue insert statement.');
                                    }
                                    
                                    //dto update ng warning
                                   $updateWarningQuery = 'UPDATE student SET warning = warning + 1 WHERE studentID = ?';
                                   if ($stmtUpdateStock = $conn->prepare($updateWarningQuery)) { 
                                       $stmtUpdateStock->bind_param('s', $student); 
                                       if (!$stmtUpdateStock->execute()) {
                                           throw new Exception('Failed to update warning for student.');
                                       }
                                       $stmtUpdateStock->close();
                                   } else {
                                       throw new Exception('Failed to prepare warning update statement.');
                                   }

                                    $notificationMessagePhp = "You must return $book Book!";
                                    $statusLog = "WARNING";
                                    $notifColor = "#d0342c";
                                    
                                    $notificationQuery = 'INSERT INTO notification (notificationType, notificationMessage, notificationDate, bookID, studentID, notificationColor)
                                    VALUES (?,?, NOW(),?,?,?)';
                                    // $notificationQuery = 'INSERT INTO notification (notificationType, notificationMessage, notificationDate, bookID, studentID)
                                    // VALUES (?,?, NOW(),?,?)'; #00cc00

                                    if ($stmtNotification = $conn->prepare($notificationQuery)) {

                                        $stmtNotification->bind_param('sssss', $statusLog, $notificationMessagePhp, $book, $student, $notifColor);
                                    $stmtNotification->execute();
                                    $stmtNotification->close();
                                    } else {
                                    throw new Exception('Failed to prepare transactionlog insert statement.');
                                    }

                                    // tanggal kana boss
                                    $deleteQuery = 'DELETE FROM borrowedbook WHERE bookID = ? AND studentID = ?';
                                    if ($deleteStmt = $conn->prepare($deleteQuery)) {
                                        $deleteStmt->bind_param('ss', $book, $student);
                                        if (!$deleteStmt->execute()) {
                                            throw new Exception('Failed to delete from borrowedbook table.');
                                        }
                                        $deleteStmt->close();
                                    } else {
                                        throw new Exception('Failed to prepare borrowedbook delete statement.');
                                    }

                                   
                                    $conn->commit();
                                } catch (Exception $e) {
                                    $conn->rollback();
                                    $response['isSuccess'] = false;
                                    $response['value'] = 0;
                                    $response['msg'] = $e->getMessage();
                                    return json_encode($response);
                                }
                            } else {//mga data
                                $result['bookID'] = $book;
                                $result['borrowedID'] = $borrowD;
                                $result['returnID'] = $returnD;
                                $result['studentID'] = $student;
                                $data[] = $result;
                            }
                        }

                        $response['isSuccess'] = true;
                        $response['value'] = $data;
                        $response['msg'] = 'Data fetched successfully.';
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
echo $app->getcovidEncounter();





	// session_start();
	// require 'dbconn.php';

	// class Encounter {
	// 	public function getcovidEncounter(){
	// 		error_reporting(E_ERROR);

	// 		$config = new Config();
	
	// 		$response = array();

	// 		$conn = $config->conn;

	// 		if($conn->connect_error){
	// 			return  $conn->connect_error;

	// 		} else {
	// 			 $query = 'SELECT  bookID, borrowedDate, returnDate, studentID FROM borrowedbook' ;
	// 				// $query = 'SELECT name FROM userrecord';
	// 			$data = array();
	// 			if($stmt = $conn->prepare($query)){
					
	// 				$result = array();
	// 				$data = array();
	// 				if($stmt->execute()){
						
	// 					 $stmt->bind_result($book, $borrowD, $returnD, $student );
	// 							// $stmt->bind_result($name);
	// 					$stmt->store_result();
						
	// 					if($stmt->num_rows > 0){
	// 						while($stmt->fetch()){

	// 								//if($studentstatus == $studentstatusdynamic) {
                                       
	// 									 $result['bookID'] = $book;
	// 									 $result['borrowedID'] = $borrowD;
	// 								 $result['returnID'] = $returnD;
									
	// 								 $result['studentID'] = $student;
	// 								//what???????????? how????????/
									
	// 									 $data[] = $result;		
								

								
								
	// 						}
						
	// 						$response['isSuccess'] = true;
	// 						$response['value'] = $data;
	// 						$response['msg'] = 'data fetch successfully';
	// 					}
	// 				} else {
	// 					$response['isSuccess'] = false;
	// 					$response['value'] = 0;
	// 					$response['msg'] = $stmt->error;
	// 				}
	// 			} else {
	// 				$response['isSuccess'] = false;
	// 				$response['value'] = 0;
	// 				$response['msg'] = $conn->error;
	// 			}
	// 			$conn->close();
	// 		}

	// 		return json_encode($response);
	// 	}
	// }

	// $app = new Encounter();

		// echo $app->getcovidEncounter();


	

?>