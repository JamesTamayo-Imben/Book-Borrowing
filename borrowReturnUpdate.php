<?php
session_start();
require 'dbconn.php';

header('Content-Type: application/json');

$response = [];
$config = new Config();
$conn = $config->conn;

if ($conn->connect_error) {
    $response['success'] = false;
    $response['error'] = 'Database connection failed: ' . $conn->connect_error;
    echo json_encode($response);
    exit;
}

if (!isset($_SESSION['studentID'])) {
    $response['success'] = false;
    $response['error'] = 'Student ID not found in session';
    echo json_encode($response);
    exit;
}

$studentID = $_SESSION['studentID'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $return_date = $_POST['returnDate'] ?? null;
    $bookIDphp = $_POST['id'] ?? null;

    if ($return_date && preg_match('/^\d{4}-\d{2}-\d{2}$/', $return_date)) { // Validate date format
        if (!$bookIDphp) {
            $response['success'] = false;
            $response['error'] = 'Book ID is required';
            echo json_encode($response);
            exit;
        }

        $sql = "UPDATE borrowedbook SET returnDate = ? WHERE studentID = ? AND bookID = ?";
        $stmt = $conn->prepare($sql);

        if ($stmt) {
            $stmt->bind_param("sss", $return_date, $studentID, $bookIDphp);

            if ($stmt->execute()) {
                $response['success'] = true;
                $response['message'] = 'Return date updated successfully';
            } else {
                $response['success'] = false;
                $response['error'] = 'Database error: ' . $stmt->error;
            }

            $stmt->close();
        } else {
            $response['success'] = false;
            $response['error'] = 'Failed to prepare the statement';
        }
    } else {
        $response['success'] = false;
        $response['error'] = 'Invalid or missing return date';
    }
} else {
    $response['success'] = false;
    $response['error'] = 'Invalid request method';
}

$conn->close();
echo json_encode($response);




