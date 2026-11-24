<?php
session_start();
require 'dbconn.php';

// Check if the user is logged in
if (!isset($_SESSION['studentID'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in.']);
    exit;
}

date_default_timezone_set('Asia/Manila');

class Encounter {
    private $conn;

    public function __construct() {
        $config = new Config();
        $this->conn = $config->conn;
    }


    public function countBooks() {
        $response = [];

        if ($this->conn->connect_error) {
            $response['success'] = false;
            $response['message'] = $this->conn->connect_error;
            return $response;
        }

        $borrowedQuery = 'SELECT COUNT(*) FROM borrowedbook';
        $overdueQuery = 'SELECT COUNT(*) FROM overduebook';

        $borrowedCount = 0;
        $overdueCount = 0;

        // Count borrowed books
        if ($stmt = $this->conn->prepare($borrowedQuery)) {
            if ($stmt->execute()) {
                $stmt->bind_result($borrowedCount);
                $stmt->fetch();
            }
            $stmt->close();
        }

        // Count overdue books
        if ($stmt = $this->conn->prepare($overdueQuery)) {
            if ($stmt->execute()) {
                $stmt->bind_result($overdueCount);
                $stmt->fetch();
            }
            $stmt->close();
        }

        $totalBorrow =  $borrowedCount + $overdueCount;
        $response['success'] = true;
        $response['totalBorrow'] = $totalBorrow;
        $response['message'] = 'Book counts fetched successfully.';

        return $response;
    }

    public function getStudentData() {
        $bookData = $this->countBooks();

        if (!$bookData['success']) {
            return json_encode([
                'success' => false,
                'message' => 'Failed to fetch data.',
                'bookMessage' => $bookData['message'] ?? ''
            ]);
        }

        return json_encode([
            'success' => true,
            'totalBorrow' => $bookData['totalBorrow'],
            'message' => 'Data fetched successfully.'
        ]);
    }
}

$app = new Encounter();
echo $app->getStudentData();
?>