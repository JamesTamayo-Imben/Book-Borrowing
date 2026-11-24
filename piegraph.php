<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['username'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Sign in to view collection statistics.']);
    exit;
}

require_once __DIR__ . '/dbconn.php';

try {
    $result = $config->conn->query(
        "SELECT CASE categoryID
                    WHEN 'KLDIS001' THEN 'Information systems'
                    WHEN 'KLDPS002' THEN 'Psychology'
                    WHEN 'KLDCE003' THEN 'Engineering'
                    WHEN 'KLDNS004' THEN 'Nursing'
                    WHEN 'KLDMW005' THEN 'Midwifery'
                    ELSE categoryID
                END AS category,
                GREATEST(COALESCE(SUM(totalStock), 0) -
                         COALESCE(SUM(availableStock), 0), 0) AS borrowed
         FROM books
         GROUP BY categoryID
         ORDER BY category"
    );

    echo json_encode($result->fetch_all(MYSQLI_ASSOC));
} catch (mysqli_sql_exception $exception) {
    error_log($exception->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Unable to load collection statistics.']);
} finally {
    $config->conn->close();
}
?>