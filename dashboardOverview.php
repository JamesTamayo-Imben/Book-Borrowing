<?php

session_start();
header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['username'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Sign in to view the dashboard.']);
    exit;
}

require_once __DIR__ . '/dbconn.php';

try {
    $profileStmt = $config->conn->prepare(
        'SELECT role, firstName, lastName FROM loginUsers WHERE username = ?'
    );
    $profileStmt->bind_param('s', $_SESSION['username']);
    $profileStmt->execute();
    $profile = $profileStmt->get_result()->fetch_assoc();
    $profileStmt->close();

    if (!$profile) {
        http_response_code(401);
        echo json_encode(['error' => 'Account not found.']);
        exit;
    }

    if ($profile['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(['error' => 'Administrator access is required.']);
        exit;
    }

    $stats = $config->conn->query(
        'SELECT
            (SELECT COUNT(*) FROM books) AS titleCount,
            COALESCE((SELECT SUM(totalStock) FROM books), 0) AS totalCopies,
            COALESCE((SELECT SUM(availableStock) FROM books), 0) AS availableCopies,
            (SELECT COUNT(*) FROM borrowedbook) AS activeLoans,
            (SELECT COUNT(*) FROM overduebook) AS overdueLoans,
            (SELECT COUNT(*) FROM student) AS studentCount'
    )->fetch_assoc();

    $categoryResult = $config->conn->query(
        "SELECT categoryID,
                CASE categoryID
                    WHEN 'KLDIS001' THEN 'Information systems'
                    WHEN 'KLDPS002' THEN 'Psychology'
                    WHEN 'KLDCE003' THEN 'Engineering'
                    WHEN 'KLDNS004' THEN 'Nursing'
                    WHEN 'KLDMW005' THEN 'Midwifery'
                    ELSE categoryID
                END AS categoryName,
                COALESCE(SUM(totalStock), 0) AS totalCopies,
                COALESCE(SUM(availableStock), 0) AS availableCopies
         FROM books
         GROUP BY categoryID
         ORDER BY categoryName"
    );
    $categories = [];
    while ($category = $categoryResult->fetch_assoc()) {
        $category['borrowedCopies'] = max(
            0,
            (int) $category['totalCopies'] - (int) $category['availableCopies']
        );
        $categories[] = $category;
    }

    $booksResult = $config->conn->query(
        'SELECT bookID, title, author, image, description, publishedDate,
                totalStock, availableStock
         FROM books
         ORDER BY bookID
         LIMIT 10'
    );

    echo json_encode([
        'profile' => [
            'username' => $_SESSION['username'],
            'name' => trim(($profile['firstName'] ?? '') . ' ' . ($profile['lastName'] ?? '')),
            'role' => $profile['role'],
        ],
        'stats' => $stats,
        'categories' => $categories,
        'books' => $booksResult->fetch_all(MYSQLI_ASSOC),
    ]);
} catch (mysqli_sql_exception $exception) {
    error_log($exception->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Unable to load dashboard data.']);
} finally {
    $config->conn->close();
}
