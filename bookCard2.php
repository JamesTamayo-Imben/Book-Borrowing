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
$booksQuery = "SELECT bookID, title, author, image, description, publishedDate, availableStock FROM books WHERE categoryID = 'KLDPS002'";
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



// session_start();
// 	require 'dbconn.php';


// 			$config = new Config();
	
// 			$response = array();

// 			$conn = $config->conn;

// // Check the connection
// if ($conn->connect_error) {
//     echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
//     exit;
// }

// // Query to fetch book records
// $sql = "SELECT title, author, image FROM books WHERE categoryID = 'KLDPS002'"; // Replace with your table name
// $result = $conn->query($sql);

// if ($result && $result->num_rows > 0) {
//     $books = [];

//     // Fetch all rows as an associative array
//     while ($row = $result->fetch_assoc()) {
//         $books[] = $row;
//     }

//     // Return the data as JSON
//     echo json_encode(["value" => $books]);
// } else {
//     echo json_encode(["value" => []]); // Return an empty array if no records found
// }

// // Close the connection
// $conn->close();
?>

