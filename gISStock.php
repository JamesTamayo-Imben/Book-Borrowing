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

// Query to fetch book records
$sql = 'SELECT totalStock, availableStock FROM books WHERE categoryID ="KLDIS001"'; // Corrected query
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    $total = 0;
    $available = 0;
    // Fetch all rows as an associative array
    while ($row = $result->fetch_assoc()) {
        $total += $row['totalStock'];  
        $available += $row['availableStock']; // Access the availableStock field
    }

    // Return both total and available stock values as JSON
    echo json_encode(["total" => $total, "available" => $available]);
} else {
    echo json_encode(["total" => 0, "available" => 0]); // Return 0 if no records found
}

// Close the connection
$conn->close();
?>
