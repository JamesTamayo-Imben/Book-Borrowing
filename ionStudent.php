<?php

session_start();
require 'dbconn.php';

$config = new Config();
$response = array();

$conn = $config->conn;

// Check the connection
if ($conn->connect_error) {
    echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
    exit;
}

// Query to count total students
$totalSql = "SELECT COUNT(*) AS totalStudents FROM student";
$totalResult = $conn->query($totalSql);
$totalStudents = $totalResult && $totalResult->num_rows > 0 ? $totalResult->fetch_assoc()['totalStudents'] : 1; // Default to 1 to avoid division by zero

// Query to count IMACS students
$sql = "SELECT COUNT(*) AS studentCount FROM student WHERE institution = 'ION'";
$result = $conn->query($sql);
$studentCount = $result && $result->num_rows > 0 ? $result->fetch_assoc()['studentCount'] : 0;

// Return the data as JSON
echo json_encode([
    "studentCount" => $studentCount,
    "totalStudents" => $totalStudents
]);

// Close the connection
$conn->close();
?>
