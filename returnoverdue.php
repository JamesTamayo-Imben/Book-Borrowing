<?php

require 'dbconn.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['action']) && $_POST['action'] === 'returnBook') {
    $studentID = $_POST['studentID'];
    $bookID = $_POST['bookID'];
    $statusLog = "RETURN OVERDUE";

    $config = new Config();
    $conn = $config->conn;

    if ($conn->connect_error) {
        echo json_encode(['success' => false, 'message' => 'Database connection failed.']);
        exit;
    }

    // Start a transaction
    $conn->begin_transaction();

    try {
       


       $studentCheckStmt = $conn->prepare("SELECT COUNT(*) FROM student WHERE studentID = ?");
       $studentCheckStmt->bind_param("s", $studentID); // "s" for string
       $studentCheckStmt->execute();
       $studentCheckStmt->bind_result($studentExists);
       $studentCheckStmt->fetch();
       $studentCheckStmt->close();
   
       if ($studentExists == 0) {
           echo json_encode(["isSuccess" => false, "msg" => "Student ID does not exist!"]);
           exit; 
       }

       $bookCheckStmt = $conn->prepare("SELECT COUNT(*) FROM books WHERE bookID = ?");
       $bookCheckStmt->bind_param("s", $bookID); 
       $bookCheckStmt->execute();
       $bookCheckStmt->bind_result($bookExists);
       $bookCheckStmt->fetch();
       $bookCheckStmt->close();
   
       if ($bookExists == 0) {
           echo json_encode(["isSuccess" => false, "msg" => "Book ID does not exist!"]);
           exit; 
       }

$insertQuery = 'INSERT INTO returnbook (borrowID, bookID, returnDate, studentID, adminID)
SELECT borrowID, bookID, NOW(), studentID, adminID
FROM borrowedbook 
WHERE adminID = ? AND studentID = ? AND bookID = ?';

$adminQuery = "SELECT adminID FROM admin";
$adminResult = $conn->query($adminQuery);
$adminID = $adminResult->fetch_assoc()['adminID'] ?? 'defaultAdminID';


if ($stmtInsert = $conn->prepare($insertQuery)) {
// $adminID = 1; // Example admin ID, adjust as needed
$stmtInsert->bind_param('sss', $adminID, $studentID, $bookID);

if (!$stmtInsert->execute()) {
throw new Exception('Failed to insert into returnedBooks.');
}

$stmtInsert->close();
} else {
throw new Exception('Failed to prepare insert statement.');
}


// $insertLogQuery = '
//         INSERT INTO transactionlog (date, bookID, studentID, logType)
//         VALUES (NOW(), ?, ?, ?)';

//         if ($stmtLog = $conn->prepare($insertLogQuery)) {
//         $stmtLog->bind_param('sss', $bookID, $studentID, $statusLog);
//         $stmtLog->execute();
//         $stmtLog->close();

        $notificationMessagePhp = "You successfully return $bookID Book!";
        $notifColor = "#dfa507";

        $notificationQuery = 'INSERT INTO notification (notificationType, notificationMessage, notificationDate, bookID, studentID, notificationColor)
        VALUES (?,?, NOW(),?,?,?)';

        if ($stmtNotification = $conn->prepare($notificationQuery)) {

            $stmtNotification->bind_param('sssss', $statusLog, $notificationMessagePhp, $bookID, $studentID, $notifColor);
        $stmtNotification->execute();
        $stmtNotification->close();
        } else {
        throw new Exception('Failed to prepare transactionlog insert statement.');
        }

	// Increment the available stock of the book
	$updateStockQuery = 'UPDATE books SET availableStock = availableStock + 1 WHERE bookID = ?';
	if ($stmtUpdateStock = $conn->prepare($updateStockQuery)) {
		$stmtUpdateStock->bind_param('s', $bookID);

		if (!$stmtUpdateStock->execute()) {
			throw new Exception('Failed to update book stock.');
		}

		$stmtUpdateStock->close();
	} else {
		throw new Exception('Failed to prepare stock update statement.');
	}


        $deleteQuery = 'DELETE FROM overduebook WHERE studentID = ? AND bookID = ?';

        if ($stmtDelete = $conn->prepare($deleteQuery)) {
            $stmtDelete->bind_param('ss', $studentID, $bookID);

            if (!$stmtDelete->execute()) {
                throw new Exception('Failed to delete from borrowbook.');
            }

            $stmtDelete->close();
        } else {
            throw new Exception('Failed to prepare delete statement.');
        }

        // Commit the transaction
        $conn->commit();
//echo json_encode(["isSuccess" => false, "msg" => "All fields are required!"]);
        echo json_encode(["isSuccess" => true, "msg" => 'Book returned successfully!']);
    } catch (Exception $e) {
        // Rollback the transaction on error
        $conn->rollback();
        echo json_encode(["isSuccess" => false, "msg" => $e->getMessage()]);
    } finally {
        $conn->close();
    }
}


// require 'dbconn.php';

// if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['action']) && $_POST['action'] === 'returnBook') {
//     $studentID = $_POST['studentID'];
//     $bookID = $_POST['bookID'];

//     $config = new Config();
//     $conn = $config->conn;

//     if ($conn->connect_error) {
//         echo json_encode(['success' => false, 'message' => 'Database connection failed.']);
//         exit;
//     }

//     // Start a transaction
//     $conn->begin_transaction();

//     try {
//         // Insert the data into the archive table
//        // Insert the data into the archive table
// $insertQuery = 'INSERT INTO returnbook (borrowedID, bookID, returnDate, studentID, adminID)
// SELECT borrowedID, bookID, NOW(), studentID, ? 
// FROM overduebook 
// WHERE studentID = ? AND bookID = ?';

// if ($stmtInsert = $conn->prepare($insertQuery)) {
// $adminID = 1; // Example admin ID, adjust as needed
// $stmtInsert->bind_param('sss', $adminID, $studentID, $bookID);

// if (!$stmtInsert->execute()) {
// throw new Exception('Failed to insert into returnedBooks.');
// }

// $stmtInsert->close();
// } else {
// throw new Exception('Failed to prepare insert statement.');
// }


//         // Delete the data from the original table
//         $deleteQuery = 'DELETE FROM overduebook WHERE studentID = ? AND bookID = ?';

//         if ($stmtDelete = $conn->prepare($deleteQuery)) {
//             $stmtDelete->bind_param('ss', $studentID, $bookID);

//             if (!$stmtDelete->execute()) {
//                 throw new Exception('Failed to delete from borrowbook.');
//             }

//             $stmtDelete->close();
//         } else {
//             throw new Exception('Failed to prepare delete statement.');
//         }

//         // Commit the transaction
//         $conn->commit();

//         echo json_encode(['Book returned successfully and archived.']);
//     } catch (Exception $e) {
//         // Rollback the transaction on error
//         $conn->rollback();
//         echo json_encode(['success' => false, 'message' => $e->getMessage()]);
//     } finally {
//         $conn->close();
//     }
// }

// 'success' => true, 'message' => 
