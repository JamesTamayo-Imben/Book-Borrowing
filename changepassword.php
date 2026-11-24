<?php
session_start();
require 'dbconn.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $currentPassword = $_POST['currentPassword'] ?? '';
    $newPassword = $_POST['newPassword'] ?? '';

    if (!isset($_SESSION['studentID'])) {
        echo json_encode(['success' => false, 'message' => 'User not logged in.']);
        exit;
    }

    $studentID = $_SESSION['studentID'];

    // Get current password from database
    $config = new Config();  // Instantiate the Config class to access $conn
    $stmt = $config->conn->prepare('SELECT password FROM loginUsers WHERE studentID = ?');  // Use $config->conn
    $stmt->bind_param('s', $studentID);
    $stmt->execute();
    $stmt->bind_result($hashedPassword);
    $stmt->fetch();
    $stmt->close();

    if (!$hashedPassword || !password_verify($currentPassword, $hashedPassword)) {
        echo json_encode(['success' => false, 'message' => 'Incorrect current password.']);
        exit;
    }

    // Check if new password is at least 8 characters
    if (strlen($newPassword) < 8) {
        echo json_encode(['success' => false, 'message' => 'New password must be at least 8 characters long.']);
        // echo json_encode(['success' => true, 'message' => 'Password changed successfully!']);

        exit;
    }

    // Hash new password
    $newHashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

    // Update password in database
    $stmt = $config->conn->prepare('UPDATE loginUsers SET password = ? WHERE studentID = ?');  // Use $config->conn
    $stmt->bind_param('ss', $newHashedPassword, $studentID);

    if ($stmt->execute()) {
        // echo json_encode(['success' => true, 'message' => 'Password changed successfully.']);
                echo json_encode(['success' => true, 'message' => 'Password changed successfully!']);

    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to change password.']);
    }

    $stmt->close();
    $config->conn->close();  // Close the connection
}
?>