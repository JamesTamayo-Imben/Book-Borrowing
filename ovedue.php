<?php
require 'dbconn.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['action']) && $_POST['action'] === 'processOverdue') {
    $config = new Config();
    $conn = $config->conn;

    if ($conn->connect_error) {
        echo json_encode(['success' => false, 'message' => 'Database connection failed.']);
        exit;
    }

    $todayDate = date('Y-m-d');

    // Start a transaction
    $conn->begin_transaction();

    try {
        // Insert overdue books into returnbook table
       $insertQuery = '
       INSERT INTO overduebook (borrowedID, bookID, borrowedDate, returnDate, studentID, adminID)
       SELECT borrowedID, bookID, borrowedDate, NOW(), studentID, ? 
       FROM borrowedbook 
       WHERE borrowedDate = ?';
   
        
        if ($stmtInsert = $conn->prepare($insertQuery)) {
            $adminID = 1; // Example admin ID, adjust as needed
            $stmtInsert->bind_param('ss', $adminID, $todayDate);

            if (!$stmtInsert->execute()) {
                throw new Exception('Failed to insert overdue records into returnbook.');
            }

            $stmtInsert->close();
        } else {
            throw new Exception('Failed to prepare insert statement for overdue records.');
        }

        // Delete overdue records from borrowedbook table
        $deleteQuery = 'DELETE FROM borrowedbook WHERE borrowedDate = ?';

        if ($stmtDelete = $conn->prepare($deleteQuery)) {
            $stmtDelete->bind_param('s', $todayDate);

            if (!$stmtDelete->execute()) {
                throw new Exception('Failed to delete overdue records from borrowedbook.');
            }

            $stmtDelete->close();
        } else {
            throw new Exception('Failed to prepare delete statement for overdue records.');
        }

        // Commit transaction
        $conn->commit();

        echo json_encode(['success' => true, 'message' => 'Overdue books processed successfully.']);
    } catch (Exception $e) {
        // Rollback on error
        $conn->rollback();
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    } finally {
        $conn->close();
    }
}
