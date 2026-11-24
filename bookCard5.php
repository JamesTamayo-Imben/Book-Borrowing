<?php


session_start();
	require 'dbconn.php';


			$config = new Config();
	
			$response = array();

			$conn = $config->conn;


if ($conn->connect_error) {
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

// Fetch books
$booksQuery = "SELECT bookID, title, author, image, description, publishedDate, availableStock FROM books WHERE categoryID = 'KLDMW005'";
$booksResult = $conn->query($booksQuery);

// Fetch admin ID (assumes a single admin for simplicity)
$adminQuery = "SELECT adminID FROM admin";
$adminResult = $conn->query($adminQuery);
$adminID = $adminResult->fetch_assoc()['adminID'] ?? 'defaultAdminID';

$books = [];
if ($booksResult->num_rows > 0) {
    while ($row = $booksResult->fetch_assoc()) {
        $row['adminID'] = $adminID; // Include adminID with each book
        $books[] = $row;
    }
}

echo json_encode(['value' => $books]);
$conn->close();
?>

