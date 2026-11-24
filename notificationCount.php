<?php

session_start();
header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['studentID'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Sign in as a student to view notifications.']);
    exit;
}

require_once __DIR__ . '/dbconn.php';

try {
    $statement = $config->conn->prepare(
        'SELECT COUNT(*) AS notificationCount FROM notification WHERE studentID = ?'
    );
    $statement->bind_param('s', $_SESSION['studentID']);
    $statement->execute();
    $result = $statement->get_result()->fetch_assoc();
    $statement->close();

    echo json_encode(['count' => (int) $result['notificationCount']]);
} catch (mysqli_sql_exception $exception) {
    error_log($exception->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Unable to load notification count.']);
} finally {
    $config->conn->close();
}
