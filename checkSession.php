<?php
// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);

session_start();
require 'dbconn.php';

$config = new Config();
$response = array();

$conn = $config->conn;

if (isset($_SESSION['username'])) {
    $sessionUsername = $_SESSION['username'];

    if ($conn->connect_error) {
        $response = array(
            'isSuccess' => false,
            'msg' => 'Database connection failed: ' . $conn->connect_error
        );
    } else {
        $stmt = $conn->prepare(
            "SELECT role, firstName, lastName, studentID, email FROM loginUsers WHERE username = ?"
        );
        if ($stmt) {
            $stmt->bind_param("s", $sessionUsername);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();
                $response = array(
                    'isSuccess' => true,
                    'role' => $row['role'],
                    'firstName' => $row['firstName'],
                    'lastName' => $row['lastName'],
                    'studentID' => $row['studentID'],
                    'email' => $row['email']
                );
            } else {
                $response = array(
                    'isSuccess' => false,
                    'msg' => 'User not found'
                );
            }

            $stmt->close();
        } else {
            $response = array(
                'isSuccess' => false,
                'msg' => 'Query failed'
            );
        }

        $conn->close();
    }
} else {
    $response = array(
        'isSuccess' => false,
        'msg' => 'Inactive session'
    );
}

echo json_encode($response);
