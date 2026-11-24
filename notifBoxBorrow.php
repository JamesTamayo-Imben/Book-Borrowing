<?php
// session_start();
// 	require 'dbconn.php';


// 			$config = new Config();
	
// 			$response = array();

// 			$conn = $config->conn;


// if ($conn->connect_error) {
//     echo json_encode(['error' => 'Database connection failed']);
//     exit;
// }

// // notificationID
// // notificationType
// // notificationMessage
// // notificationDate
// // studentID

// $notifQuery = "SELECT notificationID, notificationType, notificationMessage, notificationDate, notificationColor
// FROM notification 
// WHERE notificationType = 'BORROW'";
// $notifResult = $conn->query($notifQuery);


// $notifs = [];
// if ($notifResult->num_rows > 0) {
//     while ($row = $notifResult->fetch_assoc()) {
//         $notifs[] = $row;
//     }
// }

// echo json_encode(['value' => $notifs]);
// $conn->close();



session_start();
require 'dbconn.php';

$config = new Config();
$response = array();
$conn = $config->conn;

if ($conn->connect_error) {
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}
// include 'data.php';
if (!isset($_SESSION['studentID'])) {
    echo json_encode(['error' => 'Student ID not found in session']);
    exit;
}

$notifStudentID = $_SESSION['studentID'];

// Prepare and execute the notification query
$notifQuery = "SELECT notificationID, notificationType, notificationMessage, notificationDate, notificationColor FROM notification WHERE notificationType = 'BORROW' AND studentID = ?";
$notifQueryStmt = $conn->prepare($notifQuery);

if (!$notifQueryStmt) {
    echo json_encode(['error' => 'Failed to prepare statement: ' . $conn->error]);
    exit;
}

$notifQueryStmt->bind_param("s", $notifStudentID);

if (!$notifQueryStmt->execute()) {
    echo json_encode(['error' => 'Failed to execute statement: ' . $notifQueryStmt->error]);
    $notifQueryStmt->close();
    exit;
}

$result = $notifQueryStmt->get_result();
$notifs = [];

while ($row = $result->fetch_assoc()) {
    $notifs[] = $row;
}

$notifQueryStmt->close();
$conn->close();

echo json_encode(['value' => $notifs]);

?>

