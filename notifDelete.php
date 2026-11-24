<?php

session_start();
	require 'dbconn.php';
			$response = array();


if ($conn->connect_error) {
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}
header('Content-Type: application/json');
// require_once 'dbconn.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['id'])) {
        $notificationID = intval($_POST['id']); // Sanitize input

        // Initialize database connection
        $config = new Config();
        $conn = $config->conn;

        // Prepare and execute delete query
        $stmt = $conn->prepare('DELETE FROM notification WHERE notificationID = ?');
        if (!$stmt) {
            echo json_encode(['success' => false, 'message' => 'SQL preparation failed: ' . $conn->error]);
            exit;
        }

        $stmt->bind_param('i', $notificationID);

        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Execution failed: ' . $stmt->error]);
        }

        $stmt->close();
        $conn->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'ID not provided.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
