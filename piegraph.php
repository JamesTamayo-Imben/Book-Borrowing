<?php
session_start();
require 'dbconn.php';
$config = new Config();
$conn = $config->conn;

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch total stock and available stock by category with category name
$query = "
    SELECT 
        c.categoryName AS categoryName, 
        SUM(b.totalStock) AS totalStock, 
        SUM(b.availableStock) AS availableStock 
    FROM books b
    INNER JOIN category c ON b.categoryID = c.categoryID
    GROUP BY c.categoryName
";
$result = $conn->query($query);

$data = [];
while ($row = $result->fetch_assoc()) {
    $categoryName = $row['categoryName'];
    $totalStock = $row['totalStock'];
    $availableStock = $row['availableStock'];
    $borrowed = $totalStock - $availableStock; // Calculate borrowed books
    $data[] = [
        'category' => $categoryName, // Use category name instead of ID
        'borrowed' => $borrowed
    ];
}

// Return data as JSON
header('Content-Type: application/json');
echo json_encode($data);

$conn->close();
?>