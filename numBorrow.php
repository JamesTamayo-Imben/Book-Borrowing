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

    public function getWarningCount($studentID) {
        $response = [];

        if ($this->conn->connect_error) {
            $response['success'] = false;
            $response['message'] = $this->conn->connect_error;
            return $response;
        }

        $query = 'SELECT warning FROM student WHERE studentID = ?';
        if ($stmt = $this->conn->prepare($query)) {
            $stmt->bind_param('s', $studentID);

            if ($stmt->execute()) {
                $stmt->bind_result($warningCount);
                if ($stmt->fetch()) {
                    $response['success'] = true;
                    $response['warningCount'] = $warningCount;
                } else {
                    $response['success'] = false;
                    $response['message'] = 'No data found.';
                }
            } else {
                $response['success'] = false;
                $response['message'] = $stmt->error;
            }
            $stmt->close();
        } else {
            $response['success'] = false;
            $response['message'] = $this->conn->error;
        }

        return $response;
    }

    public function countBooks($studentID) {
        $response = [];

        if ($this->conn->connect_error) {
            $response['success'] = false;
            $response['message'] = $this->conn->connect_error;
            return $response;
        }

        $borrowedQuery = 'SELECT COUNT(*) FROM borrowedbook WHERE studentID = ?';
        $overdueQuery = 'SELECT COUNT(*) FROM overduebook WHERE studentID = ?';

        $borrowedCount = 0;
        $overdueCount = 0;

        // Count borrowed books
        if ($stmt = $this->conn->prepare($borrowedQuery)) {
            $stmt->bind_param('s', $studentID);
            if ($stmt->execute()) {
                $stmt->bind_result($borrowedCount);
                $stmt->fetch();
            }
            $stmt->close();
        }

        // Count overdue books
        if ($stmt = $this->conn->prepare($overdueQuery)) {
            $stmt->bind_param('s', $studentID);
            if ($stmt->execute()) {
                $stmt->bind_result($overdueCount);
                $stmt->fetch();
            }
            $stmt->close();
        }

        $response['success'] = true;
        $response['borrowedCount'] = $borrowedCount;
        $response['overdueCount'] = $overdueCount;
        $response['message'] = 'Book counts fetched successfully.';

        return $response;
    }

    public function getStudentData($studentID) {
        $warningData = $this->getWarningCount($studentID);
        $bookData = $this->countBooks($studentID);

        if (!$warningData['success'] || !$bookData['success']) {
            return json_encode([
                'success' => false,
                'message' => 'Failed to fetch data.',
                'warningMessage' => $warningData['message'] ?? '',
                'bookMessage' => $bookData['message'] ?? ''
            ]);
        }

        return json_encode([
            'success' => true,
            'warningCount' => $warningData['warningCount'],
            'borrowedCount' => $bookData['borrowedCount'],
            'overdueCount' => $bookData['overdueCount'],
            'message' => 'Data fetched successfully.'
        ]);
    }
}

$app = new Encounter();
echo $app->getStudentData($_SESSION['studentID']);
?>