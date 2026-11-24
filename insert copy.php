<?php

session_start();
require 'dbconn.php';

$config = new Config();
$response = array();

$conn = $config->conn;

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if POST data is received
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve form data from the request
    $bookIDD = $_POST['bookIDD'] ?? '';
    $borrowedDT = $_POST['borrowedDT'] ?? '';
    $adminID = $_POST['adminID'] ?? '';
    $sid = $_POST['sid'] ?? '';
    $returnDate = $_POST['returnDate'] ?? '';

    if (empty($bookIDD) || empty($borrowedDT) || empty($adminID) || empty($sid) || empty($returnDate)) {
        echo json_encode(["isSuccess" => false, "msg" => "All fields are required!"]);
        exit;
    }

    // Check if studentID exists in the database
    $studentCheckStmt = $conn->prepare("SELECT COUNT(*) FROM student WHERE studentID = ?");
    $studentCheckStmt->bind_param("s", $sid); // "s" for string
    $studentCheckStmt->execute();
    $studentCheckStmt->bind_result($studentExists);
    $studentCheckStmt->fetch();
    $studentCheckStmt->close();

    if ($studentExists == 0) {
        echo json_encode(["isSuccess" => false, "msg" => "Student ID does not exist!"]);
        exit; // Stop further execution if student ID is not found
    }
  //warning
    // taga check ng warning boss
    $warningCheckStmt = $conn->prepare("SELECT warning FROM student WHERE studentID = ?");
    $warningCheckStmt->bind_param("s", $sid); 
    $warningCheckStmt->execute();
    $warningCheckStmt->bind_result($cantBorrowWarning);
    $warningCheckStmt->fetch();
    $warningCheckStmt->close();

if ($cantBorrowWarning == 3) {
    echo json_encode(["isSuccess" => false, "msg" => "Student cannot borrow books due to 3 warnings."]);
    exit; 
}

    // Check if the student has already borrowed the book
    $borrowedBookCheckStmt = $conn->prepare("SELECT COUNT(*) FROM borrowedbook WHERE bookID = ? AND studentID = ?");
    $borrowedBookCheckStmt->bind_param("ss", $bookIDD, $sid); // "ss" for string, string
    $borrowedBookCheckStmt->execute();
    $borrowedBookCheckStmt->bind_result($bookAlreadyBorrowed);
    $borrowedBookCheckStmt->fetch();
    $borrowedBookCheckStmt->close();

    if ($bookAlreadyBorrowed > 0) {
        echo json_encode(["isSuccess" => false, "msg" => "Student already borrowed this book!"]);
        exit; // Stop further execution if the book has already been borrowed by the student
    }

    // Check if there is enough stock of the book available
    
    $stockCheckStmt = $conn->prepare("SELECT availableStock FROM books WHERE bookID = ?");
    $stockCheckStmt->bind_param("s", $bookIDD); // "s" for string
    $stockCheckStmt->execute();
    $stockCheckStmt->bind_result($availableStock);
    $stockCheckStmt->fetch();
    $stockCheckStmt->close();

    if ($availableStock == 0) {
        echo json_encode(["isSuccess" => false, "msg" => "Sorry, this book is out of stock!"]);
        exit; // Stop further execution if no stock is available
    }

    // Decrease the available stock of the book
    $decrementStockStmt = $conn->prepare("UPDATE books SET availableStock = availableStock - 1 WHERE bookID = ?");
    $decrementStockStmt->bind_param("s", $bookIDD); // "s" for string
    if (!$decrementStockStmt->execute()) {
        echo json_encode(["isSuccess" => false, "msg" => "Error updating book stock: " . $decrementStockStmt->error]);
        exit;
    }
    $decrementStockStmt->close();

    if ($availableStock - 1 == 0) {
        $updateStatusStmt = $conn->prepare("UPDATE bookstatus SET status = 'unavailable' WHERE bookID = ?");
        $updateStatusStmt->bind_param("s", $bookIDD); 
        if (!$updateStatusStmt->execute()) {
            echo json_encode(["isSuccess" => false, "msg" => "Error updating book status: " . $updateStatusStmt->error]);
            exit;
        }
        $updateStatusStmt->close();
    }



    // for notification 
    $notificationMessagePhp = "You successfully borrow $bookIDD Book!";
        $notifColor = "#00b33c";
        $statusLog = "BORROW";

        $notificationQuery = 'INSERT INTO notification (notificationType, notificationMessage, notificationDate, bookID, studentID, notificationColor)
        VALUES (?,?, NOW(),?,?,?)';

        if ($stmtNotification = $conn->prepare($notificationQuery)) {

        $stmtNotification->bind_param('sssss', $statusLog, $notificationMessagePhp, $bookIDD, $sid, $notifColor);
        $stmtNotification->execute();
        $stmtNotification->close();

        } else {
        throw new Exception('Failed to prepare transactionlog insert statement.');
        }

    // Insert the borrow record into the borrowedbook table
    $stmt = $conn->prepare("INSERT INTO borrowedbook (bookID, borrowedDate, returnDate, studentID, adminID) VALUES (?, ?, ?, ?, ?)");
    if ($stmt === false) {
        echo json_encode(["isSuccess" => false, "msg" => "Error preparing the SQL statement: " . $conn->error]);
        exit;
    }

    $stmt->bind_param("sssss", $bookIDD, $borrowedDT, $returnDate, $sid, $adminID); // ssss = string, string, string, string, string

    // Execute the statement and check for success
    if ($stmt->execute()) {
        echo json_encode(["isSuccess" => true, "msg" => "Successfully Borrowed!"]);
    } else {
        echo json_encode(["isSuccess" => false, "msg" => "Error executing SQL: " . $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(["isSuccess" => false, "msg" => "Invalid request method!"]);
}

$conn->close();


