<?php
session_start();
ini_set('display_errors', 1);
error_reporting(E_ALL);

require 'dbconn.php';

$config = new Config();
$conn = $config->conn;

if ($conn->connect_error) {
    die(json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]));
}

if (!isset($_SESSION['studentID'])) {
    die(json_encode(['error' => 'Student ID not found in session']));
}

$studentID = $_SESSION['studentID'];

$borrowQuery = $conn->prepare("SELECT bookID, borrowedDate, returnDate FROM borrowedbook WHERE studentID = ?");
if (!$borrowQuery) {
    die(json_encode(['error' => 'Failed to prepare statement: ' . $conn->error]));
}

$borrowQuery->bind_param("s", $studentID);

if (!$borrowQuery->execute()) {
    die(json_encode(['error' => 'Failed to execute statement: ' . $borrowQuery->error]));
}

$borrowQuery->bind_result($bookID, $borrowedDate, $returnDate);

$books = [];
while ($borrowQuery->fetch()) {
    $books[] = ['bookID' => $bookID, 'borrowedDate' => $borrowedDate, 'returnDate' => $returnDate];
}
$borrowQuery->close();

if (empty($books)) {
    die(json_encode(['value' => []]));
}

$booksDetails = [];
foreach ($books as $book) {
    $booksQuery = $conn->prepare("SELECT bookID, title, author, image FROM books WHERE bookID = ? AND categoryID = 'KLDMW005'");
    if (!$booksQuery) {
        die(json_encode(['error' => 'Failed to prepare statement: ' . $conn->error]));
    }

    $booksQuery->bind_param("s", $book['bookID']);
    if (!$booksQuery->execute()) {
        die(json_encode(['error' => 'Failed to execute statement: ' . $booksQuery->error]));
    }

    $result = $booksQuery->get_result();
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $row['borrowedDate'] = $book['borrowedDate'];
            $row['returnDate'] = $book['returnDate'];
            $booksDetails[] = $row;
        }
    }

    $booksQuery->close();
}

$conn->close();

echo json_encode(['value' => $booksDetails]);
?>

